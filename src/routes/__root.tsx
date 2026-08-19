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
    'Rothenhall Partners is a fractional operating partner practice for venture- and PE-backed companies, owning AI answer-engine visibility (AEO/GEO), go-to-market, and revenue operations as one accountable engine.',
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  areaServed: 'Global',
  knowsAbout: [
    'Answer Engine Optimization',
    'Generative Engine Optimization',
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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Rothenhall Partners · The Operating Partner for AI-Era Growth' },
      { name: 'description', content: SITE.description },
      { name: 'theme-color', content: '#f7f3ea' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: 'Rothenhall Partners · The Operating Partner for AI-Era Growth' },
      { property: 'og:description', content: SITE.description },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Rothenhall Partners' },
      { name: 'twitter:description', content: SITE.description },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
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
