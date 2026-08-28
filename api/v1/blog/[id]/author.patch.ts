import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { run } from '../../../../src/server/blog/http'
import { patchAuthor } from '../../../../src/server/blog/service'

// PATCH /api/v1/blog/:id/author  — author rotation only
export default defineEventHandler((event) =>
  run(event, async () =>
    patchAuthor(getRouterParam(event, 'id') || '', await readBody(event)),
  ),
)
