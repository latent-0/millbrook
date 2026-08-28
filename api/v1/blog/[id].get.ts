import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import { run } from '../../../src/server/blog/http'
import { getBlog } from '../../../src/server/blog/service'

// GET /api/v1/blog/:id   (or ?slug=)
export default defineEventHandler((event) =>
  run(event, async () => {
    const id = getRouterParam(event, 'id') || ''
    const slug = getQuery(event).slug as string | undefined
    return getBlog(id, slug)
  }),
)
