import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { run } from '../../../../src/server/blog/http'
import { transitionStatus } from '../../../../src/server/blog/service'

// POST /api/v1/blog/:id/status  — draft -> in_review -> approved -> scheduled -> published
export default defineEventHandler((event) =>
  run(event, async () =>
    transitionStatus(getRouterParam(event, 'id') || '', await readBody(event)),
  ),
)
