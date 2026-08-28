import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import { run } from '../../../src/server/blog/http'
import { removeBlog } from '../../../src/server/blog/service'

// DELETE /api/v1/blog/:id?hard=true|false  — hard-delete draft, else soft-archive
export default defineEventHandler((event) =>
  run(event, async () => {
    const hard = String(getQuery(event).hard) === 'true'
    return removeBlog(getRouterParam(event, 'id') || '', hard)
  }),
)
