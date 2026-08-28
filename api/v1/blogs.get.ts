import { defineEventHandler, getQuery } from 'h3'
import { run } from '../../src/server/blog/http'
import { list } from '../../src/server/blog/service'
import type { BlogStatus } from '../../src/server/blog/types'

// GET /api/v1/blogs?status=&category=&tag=&q=&limit=&offset=
export default defineEventHandler((event) =>
  run(event, async () => {
    const q = getQuery(event)
    const num = (v: unknown, d: number) => {
      const n = Number(v)
      return Number.isFinite(n) && n >= 0 ? n : d
    }
    return list({
      status: (q.status as BlogStatus) || undefined,
      category: (q.category as string) || undefined,
      tag: (q.tag as string) || undefined,
      q: (q.q as string) || undefined,
      limit: q.limit !== undefined ? num(q.limit, 20) : 20,
      offset: q.offset !== undefined ? num(q.offset, 0) : 0,
    })
  }),
)
