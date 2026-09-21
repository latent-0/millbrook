import { createMiddleware, createStart } from '@tanstack/react-start'
import { ACCEPT_VARY, isKnownPath, maybeMarkdownNotFound } from './server/notfound'

/**
 * Global request middleware.
 *
 * Agent-friendly 404s:
 *  - A client that explicitly requests `Accept: text/markdown` for a path that
 *    doesn't exist gets a real HTTP 404 with a short markdown body (llms.txt +
 *    sitemap pointers).
 *  - Every other request falls through to normal routing (browsers keep the
 *    styled HTML 404 page).
 *
 * Because the same URL can now return either HTML or markdown depending on the
 * Accept header, BOTH variants must advertise `Vary: Accept, Accept-Encoding`
 * so a CDN keys its cache on the negotiated representation and never serves the
 * wrong cached variant. The markdown response sets it directly; here we also
 * stamp it onto the HTML 404 the SSR renders for unknown paths.
 */
const agentNotFound = createMiddleware().server(
  async ({ request, pathname, next }) => {
    const markdown = maybeMarkdownNotFound(request, pathname)
    if (markdown) return markdown

    const result = await next()

    // HTML counterpart of a negotiable (non-existent) path → ensure it varies.
    if (!isKnownPath(pathname)) {
      const response = (result as { response?: Response }).response
      if (response) {
        try {
          const existing = response.headers.get('vary')
          const needsAccept = !/\baccept\b/i.test(existing || '')
          if (needsAccept) {
            response.headers.set(
              'vary',
              existing ? `${existing}, ${ACCEPT_VARY}` : ACCEPT_VARY,
            )
          }
        } catch {
          /* response headers immutable — best-effort only */
        }
      }
    }

    return result
  },
)

export const startInstance = createStart(() => ({
  requestMiddleware: [agentNotFound],
}))
