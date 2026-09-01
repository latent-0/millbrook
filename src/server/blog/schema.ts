/**
 * Request validation for the blog API, mirroring the field rules in
 * docs/blog-api.md §7.
 * Zod gives us the exact issue shape ({ path, message }) the contract returns
 * on 400.
 */

import { z } from 'zod'
import { BLOG_STATUSES } from './types'

const imageAsset = z.object({
  url: z.string().url().max(1000),
  alt: z.string().min(5).max(250),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  caption: z.string().max(300).optional(),
})

const authorSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().max(100).optional(),
  // Link the byline. When set, "By {name}" on the article becomes a link,
  // e.g. https://www.rothenhall.com/about#founder or a LinkedIn profile.
  url: z.string().url().optional(),
  externalId: z.string().max(100).optional(),
  avatarUrl: z.string().url().optional(),
})

// Dynamic JSON-LD: single object, array, or @graph. Each node needs @type;
// @context may be shared at the top level.
const jsonLdNode = z
  .record(z.any())
  .refine((v) => typeof v['@type'] === 'string' || Array.isArray(v['@type']), {
    message: '@type required',
  })

export const jsonLdSchema = z
  .union([
    z.object({ '@context': z.string(), '@graph': z.array(z.record(z.any())) }).passthrough(),
    z.array(jsonLdNode),
    jsonLdNode,
  ])
  .refine(
    (v) => {
      const s = JSON.stringify(v)
      return s.includes('@context') && s.includes('@type')
    },
    { message: 'jsonLd must contain @context and @type' },
  )

export const createBlogSchema = z
  .object({
    title: z.string().min(10).max(300),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase, hyphen-separated')
      .max(75)
      .optional(),
    markdown: z.string().min(200).max(60_000),
    excerpt: z.string().min(40).max(600),
    coverImage: imageAsset,
    ogImage: imageAsset,
    metaDescription: z.string().min(50).max(400),
    seoTitle: z.string().min(10).max(200).optional(),
    canonicalUrl: z.string().url().optional(),
    metaTags: z.array(z.object({ name: z.string(), content: z.string() })).max(12).optional(),
    jsonLd: jsonLdSchema,
    author: authorSchema.optional(),
    category: z.string().max(50).optional(),
    tags: z.array(z.string().max(30)).max(10).optional(),
    keywords: z.array(z.string().max(50)).max(10).optional(),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).max(8).optional(),
    // Any valid status is accepted on write. This also lets a fetched record
    // (which may be `archived`/`changes_requested`) round-trip back through
    // PATCH/PUT without a spurious enum error.
    status: z.enum(BLOG_STATUSES).default('draft'),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    noIndex: z.boolean().default(false),
  })
  .strict()

export const patchBlogSchema = createBlogSchema.partial().strict()

/**
 * Fields the API emits in responses but never accepts as input (server-owned
 * mirrors and derived values). We strip them from PATCH/PUT bodies so the
 * natural "GET a post, change a field, send it back" flow doesn't 400 on keys
 * the client only received because we returned them. Along with these, any
 * key whose value is `null` is dropped: the API returns `null` for unset
 * optional fields (e.g. `author`, `category`, `publishedAt`), and a null means
 * "not set" — there is nothing to write, so it is a no-op rather than a type
 * error. Genuine unknown keys (typos in editable fields) are still rejected by
 * `.strict()`.
 */
const READ_ONLY_KEYS = [
  'id',
  'html',
  'coverImageUrl',
  'ogImageUrl',
  'jsonLdValid',
  'jsonLdTypes',
  'readingMinutes',
  'scheduledAt',
  'createdAt',
  'publishedUrl',
  'nextActions',
] as const

export function stripReadOnly(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw
  const out: Record<string, unknown> = { ...(raw as Record<string, unknown>) }
  for (const key of READ_ONLY_KEYS) delete out[key]
  for (const key of Object.keys(out)) {
    if (out[key] === null) delete out[key]
  }
  return out
}

export const patchAuthorSchema = z.object({ author: authorSchema }).strict()

export const statusTransitionSchema = z
  .object({
    status: z.enum(BLOG_STATUSES),
    publishAt: z.coerce.date().optional(),
  })
  .strict()

export type CreateBlogInput = z.infer<typeof createBlogSchema>
export type PatchBlogInput = z.infer<typeof patchBlogSchema>

/** Flatten a ZodError into the contract's { path, message } issue list. */
export function toIssues(err: z.ZodError) {
  return err.issues.map((i) => ({
    path: i.path.join('.'),
    message: i.message,
  }))
}
