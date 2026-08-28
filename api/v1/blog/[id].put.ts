import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { run } from '../../../src/server/blog/http'
import { replaceBlog } from '../../../src/server/blog/service'

// PUT /api/v1/blog/:id  — full replace
export default defineEventHandler((event) =>
  run(event, async () =>
    replaceBlog(getRouterParam(event, 'id') || '', await readBody(event)),
  ),
)
