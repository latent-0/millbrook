/**
 * Server functions the public pages use to read blog data. These always run on
 * the server (SSR and client navigation both hit the server), so the KV store
 * and its secret token never touch the client bundle.
 */

import { createServerFn } from '@tanstack/react-start'
import { getBlogBySlug, listPublished, type BlogIndexEntry } from './store'
import { toApiRecord } from './types'

export type PublicBlogCard = BlogIndexEntry

/** Published, indexable posts for the /blogs index, newest first. */
export const getPublishedBlogs = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<PublicBlogCard>> => {
    return listPublished()
  },
)

export type PublicBlog = ReturnType<typeof toApiRecord> | null

/** One published post by slug for /blog/$slug. Null if missing or not live. */
export const getPublishedBlog = createServerFn({ method: 'GET' })
  .validator((slug: unknown) => String(slug ?? ''))
  .handler(async ({ data: slug }): Promise<PublicBlog> => {
    const record = await getBlogBySlug(slug)
    if (!record || record.status !== 'published') return null
    return toApiRecord(record)
  })
