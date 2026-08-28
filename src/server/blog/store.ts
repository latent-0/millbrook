/**
 * Blog persistence.
 *
 * Works on Vercel serverless out of the box: if a Redis REST store is wired
 * (Vercel KV or Upstash, via KV_REST_API_URL + KV_REST_API_TOKEN, or the
 * UPSTASH_REDIS_REST_URL / _TOKEN pair), every read and write goes there. With
 * no store configured it falls back to an in-memory map so local `vite dev`
 * works, but that memory does NOT persist across serverless invocations, so
 * production must set the env vars (see docs/blog-api.md).
 *
 * Layout:
 *   blog:item:{id}    JSON of the full record
 *   blog:slug:{slug}  the id that owns that slug (uniqueness + slug lookup)
 *   blog:index        JSON array of lightweight entries for fast listing
 */

import type { StoredBlog } from './types'

/* ---------------------------------------------------------------- */
/*  Redis REST client (Vercel KV / Upstash), or in-memory fallback  */
/* ---------------------------------------------------------------- */

const REST_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const REST_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''

export const usingRemoteStore = Boolean(REST_URL && REST_TOKEN)

async function redis(command: Array<string>): Promise<unknown> {
  const res = await fetch(REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`KV command failed (${res.status}): ${text}`)
  }
  const data = (await res.json()) as { result?: unknown; error?: string }
  if (data.error) throw new Error(`KV error: ${data.error}`)
  return data.result ?? null
}

// Local fallback (no KV configured): a single JSON file under .data/, so the
// separate dev runtimes (Vite SSR + Nitro) share one store. Never used when a
// remote KV is wired. fs is imported dynamically so it never reaches the client
// bundle.
async function fileCtx() {
  const fs = await import('node:fs')
  const path = await import('node:path')
  const dir = path.join(process.cwd(), '.data')
  return { fs, fp: path.join(dir, 'blog-kv.json'), dir }
}
async function readAll(): Promise<Record<string, string>> {
  try {
    const { fs, fp } = await fileCtx()
    return JSON.parse(fs.readFileSync(fp, 'utf8')) as Record<string, string>
  } catch {
    return {}
  }
}
async function writeAll(data: Record<string, string>): Promise<void> {
  const { fs, fp, dir } = await fileCtx()
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(fp, JSON.stringify(data), 'utf8')
}

async function kvGet(key: string): Promise<string | null> {
  if (usingRemoteStore) return (await redis(['GET', key])) as string | null
  return (await readAll())[key] ?? null
}
async function kvSet(key: string, value: string): Promise<void> {
  if (usingRemoteStore) return void (await redis(['SET', key, value]))
  const data = await readAll()
  data[key] = value
  await writeAll(data)
}
async function kvDel(key: string): Promise<void> {
  if (usingRemoteStore) return void (await redis(['DEL', key]))
  const data = await readAll()
  delete data[key]
  await writeAll(data)
}

/* ---------------------------------------------------------------- */
/*  Index entry (what /blogs and listing endpoints read)            */
/* ---------------------------------------------------------------- */

export type BlogIndexEntry = {
  id: string
  slug: string
  status: StoredBlog['status']
  title: string
  excerpt: string
  category?: string
  tags: Array<string>
  authorName?: string
  coverImageUrl: string
  readingMinutes: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  noIndex: boolean
}

function toIndexEntry(b: StoredBlog): BlogIndexEntry {
  return {
    id: b.id,
    slug: b.slug,
    status: b.status,
    title: b.title,
    excerpt: b.excerpt,
    category: b.category,
    tags: b.tags ?? [],
    authorName: b.author?.name,
    coverImageUrl: b.coverImage.url,
    readingMinutes: b.readingMinutes,
    publishedAt: b.publishedAt ?? null,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    noIndex: b.noIndex,
  }
}

const ITEM = (id: string) => `blog:item:${id}`
const SLUG = (slug: string) => `blog:slug:${slug}`
const INDEX = 'blog:index'

async function readIndex(): Promise<Array<BlogIndexEntry>> {
  const raw = await kvGet(INDEX)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Array<BlogIndexEntry>
  } catch {
    return []
  }
}

async function writeIndex(entries: Array<BlogIndexEntry>): Promise<void> {
  await kvSet(INDEX, JSON.stringify(entries))
}

/* ---------------------------------------------------------------- */
/*  Public store API                                                */
/* ---------------------------------------------------------------- */

export async function getBlogById(id: string): Promise<StoredBlog | null> {
  const raw = await kvGet(ITEM(id))
  return raw ? (JSON.parse(raw) as StoredBlog) : null
}

export async function getIdBySlug(slug: string): Promise<string | null> {
  return kvGet(SLUG(slug))
}

export async function getBlogBySlug(slug: string): Promise<StoredBlog | null> {
  const id = await getIdBySlug(slug)
  return id ? getBlogById(id) : null
}

/**
 * Reserve a slug for an id. Returns false if another blog already owns it.
 */
export async function slugIsFree(slug: string, forId?: string): Promise<boolean> {
  const owner = await getIdBySlug(slug)
  return !owner || owner === forId
}

export async function putBlog(record: StoredBlog): Promise<StoredBlog> {
  await kvSet(ITEM(record.id), JSON.stringify(record))
  await kvSet(SLUG(record.slug), record.id)

  const index = await readIndex()
  const next = index.filter((e) => e.id !== record.id)
  next.push(toIndexEntry(record))
  await writeIndex(next)
  return record
}

/**
 * Move a blog to a new slug, freeing the old slug key.
 */
export async function repointSlug(
  oldSlug: string,
  newSlug: string,
  id: string,
): Promise<void> {
  if (oldSlug && oldSlug !== newSlug) await kvDel(SLUG(oldSlug))
  await kvSet(SLUG(newSlug), id)
}

export type ListFilter = {
  status?: StoredBlog['status']
  category?: string
  tag?: string
  q?: string
  limit?: number
  offset?: number
}

export async function listBlogs(
  filter: ListFilter = {},
): Promise<{ items: Array<BlogIndexEntry>; total: number }> {
  const { status, category, tag, q, limit = 20, offset = 0 } = filter
  let entries = await readIndex()

  if (status) entries = entries.filter((e) => e.status === status)
  if (category) entries = entries.filter((e) => e.category === category)
  if (tag) entries = entries.filter((e) => e.tags.includes(tag))
  if (q) {
    const needle = q.toLowerCase()
    entries = entries.filter(
      (e) =>
        e.title.toLowerCase().includes(needle) ||
        e.excerpt.toLowerCase().includes(needle),
    )
  }

  // Newest first: published date, then created date.
  entries.sort((a, b) => {
    const ad = a.publishedAt ?? a.createdAt
    const bd = b.publishedAt ?? b.createdAt
    return bd.localeCompare(ad)
  })

  const total = entries.length
  return { items: entries.slice(offset, offset + limit), total }
}

/**
 * Published, indexable posts for the public /blogs page and sitemap.
 */
export async function listPublished(): Promise<Array<BlogIndexEntry>> {
  const { items } = await listBlogs({ status: 'published', limit: 500 })
  return items.filter((e) => !e.noIndex)
}

export async function deleteBlog(
  id: string,
  hard: boolean,
): Promise<{ deleted: boolean; record?: StoredBlog }> {
  const record = await getBlogById(id)
  if (!record) return { deleted: false }

  if (hard) {
    await kvDel(ITEM(id))
    await kvDel(SLUG(record.slug))
    const index = (await readIndex()).filter((e) => e.id !== id)
    await writeIndex(index)
    return { deleted: true }
  }

  // Soft delete: archive.
  const archived: StoredBlog = {
    ...record,
    status: 'archived',
    updatedAt: new Date().toISOString(),
  }
  await putBlog(archived)
  return { deleted: false, record: archived }
}
