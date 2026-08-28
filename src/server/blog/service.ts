/**
 * Blog business logic shared by every REST endpoint. Pure of h3/Nitro so it
 * can be unit-reasoned and reused: each function takes plain input and the
 * store, and throws ApiError for anything the caller should turn into an HTTP
 * status.
 */

import {
  deleteBlog,
  getBlogById,
  getBlogBySlug,
  listBlogs,
  putBlog,
  repointSlug,
  slugIsFree,
  type ListFilter,
} from './store'
import { renderHtml } from './render'
import {
  newId,
  normalizeJsonLd,
  readingMinutes,
  slugify,
  toApiRecord,
  type BlogStatus,
  type StoredBlog,
} from './types'
import {
  createBlogSchema,
  patchBlogSchema,
  patchAuthorSchema,
  statusTransitionSchema,
  toIssues,
} from './schema'
import type { z } from 'zod'

export const SITE_URL = (process.env.SITE_URL || 'https://www.rothenhall.com').replace(
  /\/+$/,
  '',
)

export class ApiError extends Error {
  status: number
  body: Record<string, unknown>
  constructor(status: number, body: Record<string, unknown>) {
    super(typeof body.message === 'string' ? body.message : 'Error')
    this.status = status
    this.body = body
  }
}

function validationError(err: z.ZodError): ApiError {
  return new ApiError(400, { error: 'ValidationError', issues: toIssues(err) })
}

const nowIso = () => new Date().toISOString()

/* ---------------------------------------------------------------- */
/*  Create (POST /blog/upload)                                       */
/* ---------------------------------------------------------------- */

export async function createBlog(raw: unknown) {
  const parsed = createBlogSchema.safeParse(raw)
  if (!parsed.success) throw validationError(parsed.error)
  const input = parsed.data

  const slug = input.slug ? input.slug : slugify(input.title)
  if (!(await slugIsFree(slug))) {
    throw new ApiError(409, {
      error: 'Conflict',
      message: `Slug "${slug}" already exists`,
    })
  }

  const created = nowIso()
  const { types } = normalizeJsonLd(input.jsonLd)
  const status = input.status ?? 'draft'
  const publishedAt =
    status === 'published' ? (input.publishedAt?.toISOString() ?? created) : null

  const record: StoredBlog = {
    id: newId(),
    slug,
    title: input.title,
    seoTitle: input.seoTitle,
    metaDescription: input.metaDescription,
    canonicalUrl: input.canonicalUrl ?? `${SITE_URL}/blog/${slug}`,
    excerpt: input.excerpt,
    markdown: input.markdown,
    html: renderHtml(input.markdown, input.jsonLd),
    coverImage: input.coverImage,
    ogImage: input.ogImage,
    jsonLd: input.jsonLd,
    jsonLdTypes: types,
    author: input.author,
    category: input.category,
    tags: input.tags ?? [],
    keywords: input.keywords ?? [],
    faq: input.faq ?? [],
    metaTags: input.metaTags ?? [],
    status,
    noIndex: input.noIndex ?? false,
    readingMinutes: readingMinutes(input.markdown),
    publishedAt,
    scheduledAt: null,
    createdAt: created,
    updatedAt: created,
  }

  await putBlog(record)
  return {
    ...toApiRecord(record),
    nextActions: [
      `PATCH /api/v1/blog/${record.id}`,
      `POST /api/v1/blog/${record.id}/status {"status":"in_review"}`,
    ],
  }
}

/* ---------------------------------------------------------------- */
/*  Read                                                             */
/* ---------------------------------------------------------------- */

async function resolve(idOrSlug: string, bySlug = false): Promise<StoredBlog> {
  const record = bySlug
    ? await getBlogBySlug(idOrSlug)
    : (await getBlogById(idOrSlug)) ?? (await getBlogBySlug(idOrSlug))
  if (!record) {
    throw new ApiError(404, { error: 'NotFound', message: 'Blog not found' })
  }
  return record
}

export async function getBlog(id: string, slug?: string) {
  const record = slug ? await resolve(slug, true) : await resolve(id)
  return toApiRecord(record)
}

export async function list(filter: ListFilter) {
  const { items, total } = await listBlogs(filter)
  return { items, total, limit: filter.limit ?? 20, offset: filter.offset ?? 0 }
}

/* ---------------------------------------------------------------- */
/*  Update (PATCH partial / PUT replace)                            */
/* ---------------------------------------------------------------- */

async function applyChanges(
  record: StoredBlog,
  input: Partial<z.infer<typeof createBlogSchema>>,
): Promise<StoredBlog> {
  const next: StoredBlog = { ...record }

  // Slug is immutable once published (contract §3.1).
  if (input.slug && input.slug !== record.slug) {
    if (record.status === 'published') {
      throw new ApiError(409, {
        error: 'Conflict',
        message: 'Slug is immutable after publish',
      })
    }
    if (!(await slugIsFree(input.slug, record.id))) {
      throw new ApiError(409, {
        error: 'Conflict',
        message: `Slug "${input.slug}" already exists`,
      })
    }
    await repointSlug(record.slug, input.slug, record.id)
    next.slug = input.slug
    if (!input.canonicalUrl && record.canonicalUrl === `${SITE_URL}/blog/${record.slug}`) {
      next.canonicalUrl = `${SITE_URL}/blog/${input.slug}`
    }
  }

  const assign = <K extends keyof StoredBlog>(k: K, v: StoredBlog[K] | undefined) => {
    if (v !== undefined) next[k] = v
  }

  assign('title', input.title)
  assign('seoTitle', input.seoTitle)
  assign('metaDescription', input.metaDescription)
  assign('excerpt', input.excerpt)
  assign('coverImage', input.coverImage)
  assign('ogImage', input.ogImage)
  assign('author', input.author)
  assign('category', input.category)
  assign('canonicalUrl', input.canonicalUrl)
  if (input.tags) next.tags = input.tags
  if (input.keywords) next.keywords = input.keywords
  if (input.faq) next.faq = input.faq
  if (input.metaTags) next.metaTags = input.metaTags
  if (input.noIndex !== undefined) next.noIndex = input.noIndex

  if (input.markdown !== undefined) {
    next.markdown = input.markdown
    next.readingMinutes = readingMinutes(input.markdown)
  }
  if (input.jsonLd !== undefined) {
    const { types } = normalizeJsonLd(input.jsonLd)
    next.jsonLd = input.jsonLd
    next.jsonLdTypes = types
  }
  // Re-render html if content or schema changed.
  if (input.markdown !== undefined || input.jsonLd !== undefined) {
    next.html = renderHtml(next.markdown, next.jsonLd)
  }
  if (input.status) next.status = input.status
  if (input.publishedAt) next.publishedAt = input.publishedAt.toISOString()

  next.updatedAt = nowIso()
  return next
}

export async function patchBlog(id: string, raw: unknown) {
  const parsed = patchBlogSchema.safeParse(raw)
  if (!parsed.success) throw validationError(parsed.error)
  const record = await resolve(id)
  const next = await applyChanges(record, parsed.data)
  await putBlog(next)
  return toApiRecord(next)
}

export async function replaceBlog(id: string, raw: unknown) {
  const parsed = createBlogSchema.safeParse(raw)
  if (!parsed.success) throw validationError(parsed.error)
  const record = await resolve(id)
  // Full replace keeps identity + createdAt, replaces everything else.
  const next = await applyChanges(
    { ...record, tags: [], keywords: [], faq: [], metaTags: [] },
    parsed.data,
  )
  await putBlog(next)
  return toApiRecord(next)
}

export async function patchAuthor(id: string, raw: unknown) {
  const parsed = patchAuthorSchema.safeParse(raw)
  if (!parsed.success) throw validationError(parsed.error)
  const record = await resolve(id)
  const next: StoredBlog = {
    ...record,
    author: parsed.data.author,
    updatedAt: nowIso(),
  }
  await putBlog(next)
  return { id: next.id, author: next.author }
}

/* ---------------------------------------------------------------- */
/*  Delete / archive                                                */
/* ---------------------------------------------------------------- */

export async function removeBlog(id: string, hard: boolean) {
  const record = await getBlogById(id)
  if (!record) throw new ApiError(404, { error: 'NotFound', message: 'Blog not found' })
  if (hard && record.status !== 'draft') {
    throw new ApiError(409, {
      error: 'Conflict',
      message: 'Hard delete is allowed on drafts only',
    })
  }
  const res = await deleteBlog(id, hard)
  if (hard) return { deleted: true }
  return { id, status: res.record?.status ?? 'archived' }
}

/* ---------------------------------------------------------------- */
/*  Status workflow (POST /blog/:id/status)                         */
/* ---------------------------------------------------------------- */

const ALLOWED: Record<BlogStatus, Array<BlogStatus>> = {
  draft: ['in_review'],
  in_review: ['approved', 'changes_requested', 'draft'],
  approved: ['scheduled', 'published', 'in_review'],
  scheduled: ['in_review', 'published'],
  published: ['archived'],
  changes_requested: ['draft'],
  archived: [],
}

export async function transitionStatus(id: string, raw: unknown) {
  const parsed = statusTransitionSchema.safeParse(raw)
  if (!parsed.success) throw validationError(parsed.error)
  const { status: target, publishAt } = parsed.data

  const record = await resolve(id)
  const from = record.status

  if (!ALLOWED[from].includes(target)) {
    throw new ApiError(409, {
      error: 'Conflict',
      message: `Illegal workflow transition ${from} → ${target}`,
    })
  }

  const next: StoredBlog = { ...record, status: target, updatedAt: nowIso() }

  if (target === 'scheduled') {
    if (!publishAt || publishAt.getTime() <= Date.now()) {
      throw new ApiError(400, {
        error: 'ValidationError',
        issues: [{ path: 'publishAt', message: 'publishAt must be a future date' }],
      })
    }
    next.scheduledAt = publishAt.toISOString()
    next.publishedAt = null
  }

  if (target === 'published') {
    next.publishedAt = (publishAt ?? new Date()).toISOString()
    next.scheduledAt = null
    return afterPublish(next)
  }

  if (target === 'archived') {
    await putBlog(next)
    return { id: next.id, status: next.status }
  }

  await putBlog(next)
  if (target === 'scheduled') {
    return { id: next.id, status: next.status, scheduledAt: next.scheduledAt }
  }
  return { id: next.id, status: next.status }
}

async function afterPublish(next: StoredBlog) {
  await putBlog(next)
  return {
    id: next.id,
    status: next.status,
    publishedAt: next.publishedAt,
    publishedUrl: `${SITE_URL}/blog/${next.slug}`,
  }
}
