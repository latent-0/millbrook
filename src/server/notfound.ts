/**
 * Agent-friendly 404 helpers, used by the global request middleware in
 * src/start.ts.
 *
 * Why a request middleware (not a route loader): TanStack Start serialises
 * loader return values/throws with Seroval and rejects non-HTML `Accept`
 * headers before loaders run — so a route loader cannot cleanly emit a raw
 * `text/markdown` response. A request middleware runs first and may return any
 * Response, so it's the correct layer.
 *
 * Behaviour:
 *  - Browsers and generic clients (an Accept header containing text/html or a
 *    wildcard) are untouched; they get the normal server-rendered 404 page
 *    (HTTP 404, already correct).
 *  - A client that explicitly asks for `Accept: text/markdown` against a path
 *    that isn't a real page gets a real HTTP 404 with a short markdown body
 *    pointing at llms.txt and the sitemaps — never a 200 app shell.
 */

const SITE = 'https://www.rothenhall.com'

// Content-negotiated 404s vary by Accept (markdown vs HTML) and by
// Accept-Encoding (compression). Both variants must advertise this so a CDN
// never serves a cached HTML page to a client asking for markdown, or vice versa.
export const ACCEPT_VARY = 'Accept, Accept-Encoding'

// Static marketing pages (kept in sync with scripts/generate-sitemap.mjs).
const KNOWN_PAGES = new Set([
  '/',
  '/about',
  '/aeo-vs-seo',
  '/ai-visibility-score',
  '/blogs',
  '/cailyx',
  '/careers',
  '/case-studies',
  '/community',
  '/contact',
  '/faq',
  '/founders',
  '/how-to-show-up-in-chatgpt',
  '/napkin-rothenhall',
  '/pricing',
  '/research',
  '/scouts',
  '/terms',
])

// Dynamic or asset prefixes that we never claim to 404 from the middleware.
const KNOWN_PREFIXES = [
  '/blog/', // individual posts (existence is data-driven)
  '/api/', // REST endpoints
  '/reports/',
  '/internal/',
  '/brand/',
  '/images/',
  '/assets/',
]

const KNOWN_FILES = new Set([
  '/llms.txt',
  '/robots.txt',
  '/sitemap.xml',
  '/blog-sitemap.xml',
])

export function wantsMarkdown(accept: string): boolean {
  return accept.toLowerCase().includes('text/markdown')
}

/** Conservative: treat a path as real if we're not sure it's missing. */
export function isKnownPath(pathname: string): boolean {
  const clean = (pathname.replace(/\/+$/, '') || '/') as string
  if (KNOWN_PAGES.has(clean) || KNOWN_PAGES.has(clean + '/')) return true
  if (KNOWN_FILES.has(pathname)) return true
  if (KNOWN_PREFIXES.some((p) => pathname.startsWith(p))) return true
  // Anything that looks like a file (has an extension) — leave to the server.
  if (/\.[a-z0-9]{1,8}$/i.test(pathname)) return true
  return false
}

export function markdownNotFound(pathname: string): string {
  return [
    '# 404 — Not Found',
    '',
    `\`${pathname}\` does not exist on Rothenhall Partners.`,
    '',
    'This site is server-rendered; unknown paths return HTTP 404 (never a 200',
    'app shell). Start here instead:',
    '',
    `- Home: ${SITE}/`,
    `- LLM-readable index: ${SITE}/llms.txt`,
    `- Sitemap (pages): ${SITE}/sitemap.xml`,
    `- Sitemap (articles): ${SITE}/blog-sitemap.xml`,
    `- Journal: ${SITE}/blogs`,
    `- About: ${SITE}/about`,
    '',
  ].join('\n')
}

/**
 * Return a 404 markdown Response when the caller explicitly wants markdown for
 * a path we know doesn't exist; otherwise null so normal routing continues.
 */
export function maybeMarkdownNotFound(
  request: Request,
  pathname: string,
): Response | null {
  const accept = request.headers.get('accept') || ''
  if (!wantsMarkdown(accept)) return null
  if (isKnownPath(pathname)) return null
  return new Response(markdownNotFound(pathname), {
    status: 404,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
      vary: ACCEPT_VARY,
    },
  })
}
