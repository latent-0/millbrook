/**
 * Shared blog types + small pure helpers used by the API handlers, the store,
 * and the public pages. Kept dependency-light so both the Nitro server routes
 * and the TanStack route loaders can import it.
 */

export const BLOG_STATUSES = [
  'draft',
  'in_review',
  'approved',
  'scheduled',
  'published',
  'archived',
  'changes_requested',
] as const

export type BlogStatus = (typeof BLOG_STATUSES)[number]

export type ImageAsset = {
  url: string
  alt: string
  width?: number
  height?: number
  caption?: string
}

export type BlogAuthor = {
  name: string
  title?: string
  /** Optional link for the byline (founder section, LinkedIn, etc.). */
  url?: string
  externalId?: string
  avatarUrl?: string
}

export type FaqItem = { question: string; answer: string }

export type MetaTag = { name: string; content: string }

/** JSON-LD is stored exactly as sent (single node, array, or @graph). */
export type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>

/** The full persisted record. */
export type StoredBlog = {
  id: string
  slug: string
  title: string
  seoTitle?: string
  metaDescription: string
  canonicalUrl: string
  excerpt: string
  markdown: string
  html: string
  coverImage: ImageAsset
  ogImage: ImageAsset
  jsonLd: JsonLd
  jsonLdTypes: Array<string>
  author?: BlogAuthor
  category?: string
  tags: Array<string>
  keywords: Array<string>
  faq: Array<FaqItem>
  metaTags: Array<MetaTag>
  status: BlogStatus
  noIndex: boolean
  readingMinutes: number
  publishedAt: string | null
  scheduledAt: string | null
  createdAt: string
  updatedAt: string
}

/* ---------------------------------------------------------------- */
/*  Helpers                                                          */
/* ---------------------------------------------------------------- */

export function slugify(input: string): string {
  const stripMarks = new RegExp('[\\u0300-\\u036f]', 'g')
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(stripMarks, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 75)
    .replace(/-+$/g, '')
}

export function newId(): string {
  // Short, url-safe, collision-resistant enough for a marketing blog.
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : Math.random().toString(36).slice(2, 18)
  return `blog_${rand}`
}

/** ~220 words per minute, min 1. */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

/**
 * Normalize any accepted JSON-LD shape into a flat list of top-level nodes and
 * collect their @type values (for the jsonLdTypes response field + rendering
 * one <script> block per node).
 */
export function normalizeJsonLd(input: JsonLd): {
  nodes: Array<Record<string, unknown>>
  types: Array<string>
} {
  const nodes: Array<Record<string, unknown>> = []

  const collectType = (node: Record<string, unknown>) => {
    const t = node['@type']
    if (typeof t === 'string') return [t]
    if (Array.isArray(t)) return t.filter((x): x is string => typeof x === 'string')
    return []
  }

  if (Array.isArray(input)) {
    input.forEach((n) => nodes.push(n))
  } else if (input && typeof input === 'object' && Array.isArray((input as any)['@graph'])) {
    const graph = (input as any)['@graph'] as Array<Record<string, unknown>>
    const ctx = (input as any)['@context']
    graph.forEach((n) => nodes.push(ctx && !n['@context'] ? { '@context': ctx, ...n } : n))
  } else {
    nodes.push(input as Record<string, unknown>)
  }

  const types = Array.from(new Set(nodes.flatMap(collectType)))
  return { nodes, types }
}

/**
 * The public API record (what GET/POST responses expose). Same as StoredBlog
 * but with the convenience mirror fields the contract's examples show.
 */
export function toApiRecord(b: StoredBlog) {
  return {
    id: b.id,
    slug: b.slug,
    status: b.status,
    title: b.title,
    seoTitle: b.seoTitle ?? b.title,
    metaDescription: b.metaDescription,
    canonicalUrl: b.canonicalUrl,
    excerpt: b.excerpt,
    html: b.html,
    coverImage: b.coverImage,
    ogImage: b.ogImage,
    coverImageUrl: b.coverImage.url,
    ogImageUrl: b.ogImage.url,
    author: b.author ?? null,
    category: b.category ?? null,
    tags: b.tags,
    keywords: b.keywords,
    faq: b.faq,
    jsonLd: b.jsonLd,
    jsonLdValid: true,
    jsonLdTypes: b.jsonLdTypes,
    noIndex: b.noIndex,
    readingMinutes: b.readingMinutes,
    publishedAt: b.publishedAt,
    scheduledAt: b.scheduledAt,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }
}
