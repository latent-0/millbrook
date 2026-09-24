/**
 * Markdown -> HTML for stored blog content, plus the JSON-LD <script> blocks
 * the contract says the server injects into the rendered html. Authors are
 * Bearer-authenticated (trusted), so marked output is used as-is.
 */

import { marked } from 'marked'
import { normalizeJsonLd, type JsonLd } from './types'

marked.setOptions({ gfm: true, breaks: false })

export function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown, { async: false }) as string
  // The article page renders its own <h1> from the post's `title` field, so a
  // leading H1 in the markdown (the natural way to start an article) would
  // otherwise duplicate the title on the page. Drop only a *leading* h1 —
  // one that opens the document — never one appearing later in the body.
  const withoutLeadingH1 = html.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/is, '')
  // Wrap tables so they can scroll horizontally on narrow screens without
  // pushing the page body sideways.
  return withoutLeadingH1
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, '</table></div>')
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
