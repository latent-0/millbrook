/**
 * Post-build fix for the blog API's dynamic routes on Vercel.
 *
 * The blog API handlers are hand-wired as explicit Nitro handlers in
 * vite.config.ts. Nitro's Vercel preset emits each as its own serverless
 * function and a route in .vercel/output/config.json. For the DYNAMIC routes
 * (/api/v1/blog/:id and its /status and /author sub-routes) it emits, e.g.:
 *
 *   { "src": "/api/v1/blog/(?<id>[^/]+)", "dest": "/api/v1/blog/[id]" }
 *
 * plus a bracketed function directory `[id].func` (a symlink to the single
 * __server function, whose built-in router already matches every blog route
 * and method).
 *
 * On Vercel these dynamic routes return a platform-level NOT_FOUND — GET/PATCH/
 * PUT/DELETE on /api/v1/blog/<id>, and the /status and /author sub-routes, never
 * reach the function — while the STATIC handlers (/api/v1/blogs,
 * /api/v1/blog/upload) work. Two facts explain it:
 *
 *   1. Vercel reserves the /api/* namespace for real functions and does NOT
 *      fall unmatched /api/* paths through to the "/(.*)" -> "/__server"
 *      catch-all (verified against the live site: /api/anything -> NOT_FOUND,
 *      while a non-/api unknown path reaches the SSR server).
 *   2. A route whose `dest` REWRITES the path (the dynamic ones) is not
 *      re-matched against the filesystem/functions unless it carries
 *      `"check": true`. The static routes work because they match the function
 *      directly in the `{ "handle": "filesystem" }` phase with no rewrite; the
 *      dynamic ones rewrite to `/api/v1/blog/[id]` and, without `check`, that
 *      rewritten path is never resolved to the `[id]` function — so the /api
 *      path 404s.
 *
 * The fix: add `"check": true` to the rewriting dynamic-blog routes so Vercel
 * re-enters filesystem matching on the rewritten dest and invokes the bracketed
 * function. Functions and routes are otherwise left as Nitro emitted them.
 *
 * Runs after `vite build` (see package.json). No-op for any build that didn't
 * produce a Vercel config (e.g. a different Nitro preset).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const configPath = fileURLToPath(
  new URL('../.vercel/output/config.json', import.meta.url),
)

if (!existsSync(configPath)) {
  process.exit(0)
}

const config = JSON.parse(readFileSync(configPath, 'utf8'))
const routes = Array.isArray(config.routes) ? config.routes : []

// A rewriting dynamic-route entry points at a bracketed function path
// (e.g. "/api/v1/blog/[id]" or "/api/v1/blog/[id]/status").
const isBracketedDest = (r) =>
  r && typeof r.dest === 'string' && r.dest.includes('[')

let patched = 0
for (const r of routes) {
  if (isBracketedDest(r) && r.check !== true) {
    r.check = true
    patched++
  }
}

writeFileSync(configPath, JSON.stringify(config, null, 2))

console.log(
  `[patch-vercel-output] added "check": true to ${patched} dynamic blog route(s) ` +
    'so Vercel resolves the rewrite to the function',
)
