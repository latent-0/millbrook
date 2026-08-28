/**
 * Markdown -> HTML for stored blog content, plus the JSON-LD <script> blocks
 * the contract says the server injects into the rendered html. Authors are
 * Bearer-authenticated (trusted), so marked output is used as-is.
 */

import { marked } from 'marked'
import { normalizeJsonLd, type JsonLd } from './types'

marked.setOptions({ gfm: true, breaks: false })

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string
}

/**
 * Article html plus one <script type="application/ld+json"> per top-level
 * JSON-LD node. This is what the API returns as `html` (contract §5).
 */
export function renderHtml(markdown: string, jsonLd: JsonLd): string {
  const article = markdownToHtml(markdown)
  const { nodes } = normalizeJsonLd(jsonLd)
  const scripts = nodes
    .map(
      (n) =>
        `<script type="application/ld+json">${JSON.stringify(n).replace(
          /</g,
          '\\u003c',
        )}</script>`,
    )
    .join('\n')
  return scripts ? `${article}\n${scripts}` : article
}
