import { defineEventHandler, readBody } from 'h3'
import { run } from '../../../src/server/blog/http'
import { createBlog } from '../../../src/server/blog/service'

// POST /api/v1/blog/upload  — create a blog (draft or immediate publish)
export default defineEventHandler((event) =>
  run(event, async () => createBlog(await readBody(event)), 201),
)
