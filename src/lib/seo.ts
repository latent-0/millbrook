export const SITE = {
  name: 'Rothenhall Partners',
  url: 'https://www.rothenhall.com',
  email: 'office@rothenhall.com',
  ogImage: '/og-image.jpg',
}

type SeoInput = {
  title: string
  description: string
  /** route path, e.g. "/approach". Use "/" for home. */
  path?: string
  /** absolute or site-relative image path */
  image?: string
  keywords?: string
}

/**
 * Builds the meta + links for a route's head(). Sets title, description,
 * canonical, Open Graph, and Twitter tags. TanStack dedupes by name/property,
 * so per-route values override the defaults set in __root.
 */
export function seo({ title, description, path = '/', image, keywords }: SeoInput) {
  const url = SITE.url + (path === '/' ? '' : path)
  const img = (image ?? SITE.ogImage).startsWith('http')
    ? (image ?? SITE.ogImage)
    : SITE.url + (image ?? SITE.ogImage)

  const meta = [
    { title },
    { name: 'description', content: description },
    {
      name: 'robots',
      content:
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    keywords ? { name: 'keywords', content: keywords } : undefined,
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: img },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'en_IN' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: img },
  ].filter(Boolean) as unknown as Array<Record<string, string>>

  const links = [{ rel: 'canonical', href: url }]

  return { meta, links }
}
