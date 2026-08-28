import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { run } from '../../../src/server/blog/http'
import { patchBlog } from '../../../src/server/blog/service'

// PATCH /api/v1/blog/:id  — partial update
export default defineEventHandler((event) =>
  run(event, async () =>
    patchBlog(getRouterParam(event, 'id') || '', await readBody(event)),
  ),
)
