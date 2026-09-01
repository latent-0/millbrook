/**
 * Post-build fix for the blog API's dynamic routes on Vercel.
 *
 * The blog API handlers are hand-wired as explicit Nitro handlers in
 * vite.config.ts. Nitro's Vercel preset emits each one as its own serverless
 * function under .vercel/output/functions/. For the DYNAMIC routes
 * (/api/v1/blog/:id and its /status and /author sub-routes) it creates
 * bracketed function directories — `[id].func`, `[id]/status.func`,
 * `[id]/author.func` — each a symlink to the single `__server` function.
 *
 * Vercel does not serve those bracketed/symlinked dynamic function directories:
 * requests to /api/v1/blog/<id> (GET/PATCH/PUT/DELETE) and the sub-routes come
 * back as a platform-level NOT_FOUND, even though the STATIC handlers
 * (/api/v1/blogs, /api/v1/blog/upload) work. That is why the read-one, update,
 * and delete endpoints appear "not working" in production.
 *
 * Every generated blog function is only a symlink to `__server`, whose built-in
 * router already matches every blog route and method. And the generated config
 * always ends with a "/(.*)" -> "/__server" catch-all that Vercel routes
 * reliably (it's how the whole SSR site is served). So the fix is simply to drop
 * the per-route config entries whose `dest` points at a bracketed dynamic
 * function and let that catch-all serve them instead. The static blog routes are
 * left untouched.
 *
 * This runs after `vite build` (see package.json). It is a no-op for any build
 * that didn't produce a Vercel config (e.g. a different Nitro preset).
 */
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const configPath = fileURLToPath(
  new URL('../.vercel/output/config.json', import.meta.url),
)

if (!existsSync(configPath)) {
  process.exit(0)
}

const config = JSON.parse(readFileSync(configPath, 'utf8'))
const routes = Array.isArray(config.routes) ? config.routes : []

// A dynamic-route entry is one whose rewrite target is a bracketed function
// path (e.g. "/api/v1/blog/[id]" or "/api/v1/blog/[id]/status").
const isBracketedDest = (r) =>
  r && typeof r.dest === 'string' && r.dest.includes('[')

const removed = routes.filter(isBracketedDest)
config.routes = routes.filter((r) => !isBracketedDest(r))

writeFileSync(configPath, JSON.stringify(config, null, 2))

// Drop the now-unreferenced bracketed function directories so Vercel doesn't
// ship dead symlinked functions.
const blogFnDir = fileURLToPath(
  new URL('../.vercel/output/functions/api/v1/blog/', import.meta.url),
)
for (const entry of ['[id].func', '[id]']) {
  const full = blogFnDir + entry
  if (existsSync(full)) rmSync(full, { recursive: true, force: true })
}

console.log(
  `[patch-vercel-output] routed ${removed.length} dynamic blog route(s) ` +
    'through the __server catch-all: ' +
    removed.map((r) => r.src).join(', '),
)
