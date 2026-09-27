/**
 * Cron endpoint: publish any blog post whose `scheduled` time has passed.
 *
 * Nothing else in the blog CMS does this — `status: "scheduled"` only ever
 * records a `scheduledAt` timestamp (see docs/blog-api.md §3); moving a post
 * to `published` still requires an explicit call. This route is that call,
 * triggered on a schedule by Vercel Cron (see the `crons` entry in
 * vercel.json) instead of by hand.
 *
 * Auth: Vercel signs cron-triggered requests with
 * `Authorization: Bearer ${CRON_SECRET}` when the CRON_SECRET env var is set
 * on the project (https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs).
 * If CRON_SECRET isn't set, the check is skipped — the route still requires
 * knowing its own (unlisted) path, but set CRON_SECRET in production so a
 * stray request can't trigger early publishes.
 */
import { defineEventHandler, getHeader, setResponseStatus } from 'h3'
import { listBlogs, getBlogById } from '../../src/server/blog/store'
import { transitionStatus } from '../../src/server/blog/service'

export default defineEventHandler(async (event) => {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const header = getHeader(event, 'authorization') || ''
    const token = header.replace(/^Bearer\s+/i, '').trim()
    if (token !== secret) {
      setResponseStatus(event, 401)
      return { error: 'Unauthorized' }
    }
  }

  const { items } = await listBlogs({ status: 'scheduled', limit: 500 })
  const now = Date.now()

  const published: Array<string> = []
  const notYetDue: Array<string> = []
  const errors: Array<{ slug: string; message: string }> = []

  for (const entry of items) {
    try {
      const record = await getBlogById(entry.id)
      if (!record?.scheduledAt) continue
      if (new Date(record.scheduledAt).getTime() > now) {
        notYetDue.push(entry.slug)
        continue
      }
      await transitionStatus(record.id, { status: 'published' })
      published.push(entry.slug)
    } catch (err) {
      errors.push({
        slug: entry.slug,
        message: err instanceof Error ? err.message : 'Unexpected error',
      })
    }
  }

  if (errors.length > 0) console.error('[cron/publish-scheduled] errors', errors)

  return { checked: items.length, published, notYetDue, errors }
})
