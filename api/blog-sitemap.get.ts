import { defineEventHandler, setResponseHeader } from 'h3'
import { listPublished } from '../src/server/blog/store'
import { SITE_URL } from '../src/server/blog/service'

// GET /blog-sitemap.xml  — public sitemap of published, indexable posts.
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=600, s-maxage=600')

  const posts = await listPublished()
  const urls = posts
    .map((p) => {
      const loc = `${SITE_URL}/blog/${p.slug}`
      const lastmod = (p.updatedAt || p.publishedAt || p.createdAt || '').slice(0, 10)
      return `  <url>\n    <loc>${loc}</loc>${
        lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
      }\n    <changefreq>weekly</changefreq>\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
