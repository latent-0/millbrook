/**
 * h3/Nitro glue: Bearer auth + a run() wrapper that turns ApiError (and any
 * unexpected throw) into the contract's JSON error responses. Imported by the
 * server/routes/api/v1 handlers.
 */

import { getHeader, setResponseHeader, setResponseStatus, type H3Event } from 'h3'
import { ApiError } from './service'

/**
 * Throws ApiError(401) unless the request carries the right Bearer token.
 * The token is BLOG_API_TOKEN; if that env is unset the API is closed (500),
 * so we never accidentally run wide open.
 */
export function requireAuth(event: H3Event) {
  const expected = process.env.BLOG_API_TOKEN
  if (!expected) {
    throw new ApiError(500, {
      error: 'ServerMisconfigured',
      message: 'BLOG_API_TOKEN is not set on the server',
    })
  }
  const header = getHeader(event, 'authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  if (!token || token !== expected) {
    throw new ApiError(401, {
      error: 'Unauthorized',
      message: 'Missing or invalid Bearer token',
    })
  }
}

/**
 * Runs an authed handler, mapping thrown ApiError to its status/body and any
 * other error to a 500. Returns the JSON body h3 will serialize.
 */
export async function run(
  event: H3Event,
  fn: () => Promise<unknown>,
  okStatus = 200,
) {
  setResponseHeader(event, 'content-type', 'application/json; charset=utf-8')
  try {
    requireAuth(event)
    const body = await fn()
    setResponseStatus(event, okStatus)
    return body
  } catch (err) {
    if (err instanceof ApiError) {
      setResponseStatus(event, err.status)
      return err.body
    }
    console.error('[blog api] unhandled error', err)
    setResponseStatus(event, 500)
    return {
      error: 'InternalError',
      message: err instanceof Error ? err.message : 'Unexpected error',
    }
  }
}
