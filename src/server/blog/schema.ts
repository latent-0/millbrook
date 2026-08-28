/**
 * Request validation for the blog API, mirroring BLOG_API_CONTRACT.md §6.
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
    status: z
      .enum(['draft', 'in_review', 'approved', 'scheduled', 'published'])
      .default('draft'),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    noIndex: z.boolean().default(false),
  })
  .strict()

export const patchBlogSchema = createBlogSchema.partial().strict()

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
