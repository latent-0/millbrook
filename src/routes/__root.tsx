import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
  Link,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { Header, Footer, Container } from '../components/site'

const SITE = {
  name: 'Rothenhall Partners',
  url: 'https://rothenhall.com',
  description:
    'Rothenhall Partners is India-first fractional operating partner practice for venture- and PE-backed companies worldwide, owning AI answer-engine visibility (AEO/GEO), go-to-market, and revenue operations as one accountable engine.',
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: 'Rothenhall',
  description: SITE.description,
  url: SITE.url,
  logo: `${SITE.url}/brand/wordmark.png`,
  image: `${SITE.url}/og-image.jpg`,
  email: 'office@rothenhall.com',
  telephone: '+91-9398386765',
  slogan: 'Be the company the AI recommends.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2nd Floor, HAL 2nd Stage, Vimanapura S.O.',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560017',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9398386765',
    email: 'office@rothenhall.com',
    contactType: 'sales',
    areaServed: ['IN', 'Worldwide'],
    availableLanguage: ['en', 'hi'],
  },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Place', name: 'Worldwide' },
  ],
  knowsAbout: [
    'Answer Engine Optimization',
    'Generative Engine Optimization',
    'AI search visibility',
    'ChatGPT, Perplexity and Google AI Overviews citations',
    'Go-to-Market Strategy',
    'Revenue Operations',
    'Growth Marketing',
    'Private Equity Portfolio Operations',
  ],
  serviceType: [
    'Answer Engine Optimization (AEO)',
    'Generative Engine Optimization (GEO)',
    'Go-to-Market Operations',
    'Revenue Operations (RevOps)',
    'Growth Operating',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: 'en',
  publisher: { '@id': `${SITE.url}/#organization` },
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Rothenhall Partners · The Operating Partner for AI-Era Growth' },
      { name: 'description', content: SITE.description },
      { name: 'theme-color', content: '#14120d' },
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'author', content: SITE.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: 'Rothenhall Partners · The Operating Partner for AI-Era Growth' },
      { property: 'og:description', content: SITE.description },
      { property: 'og:url', content: SITE.url },
      { property: 'og:image', content: `${SITE.url}/og-image.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: 'en_IN' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Rothenhall Partners' },
      { name: 'twitter:description', content: SITE.description },
      { name: 'twitter:image', content: `${SITE.url}/og-image.jpg` },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon-griffin.png', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Jost:wght@300..600&family=Inter:wght@400;450;500;600&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <Container className="py-32 text-center sm:py-44">
      <p className="eyebrow justify-center inline-flex">Error 404</p>
      <h1 className="text-display-lg mt-8">This page has moved on.</h1>
      <p className="mx-auto mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-ink-60">
        The page you were looking for is not here. Everything worth finding is a
        click away.
      </p>
      <div className="mt-9 flex justify-center">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </Container>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children ?? <Outlet />}</main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  )
}
