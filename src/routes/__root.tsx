import { useEffect, useRef } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { Header, Footer } from '../components/site'
import { NotFound } from '../components/NotFound'

const SITE = {
  name: 'Rothenhall Partners',
  url: 'https://www.rothenhall.com',
  description:
    'Rothenhall Partners is a fractional operating partner for AI-era growth. We make your company the one AI assistants recommend, and run the go-to-market and revenue operations behind it, on our own platform.',
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: ['Rothenhall'],
  description: SITE.description,
  disambiguatingDescription:
    'Rothenhall Partners is a fractional operating partner practice based in Bengaluru, India, with an office in Edinburgh, founded by Kunal Achintya Reddy. It runs AI visibility (AEO and GEO), go-to-market and revenue operations for companies worldwide, and builds Cailyx and Motion, the platform behind that work. It is distinct from any similarly named financial, capital, or investment firm, and from the historical place of the same name.',
  url: SITE.url,
  logo: `${SITE.url}/brand/wordmark.png`,
  image: `${SITE.url}/og-image.jpg`,
  sameAs: ['https://www.linkedin.com/company/rothenhall/'],
  email: 'office@rothenhall.com',
  telephone: '+91-9398386765',
  slogan: 'Be the company the AI recommends.',
  founder: { '@id': `${SITE.url}/#founder` },
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: '2nd Floor, HAL 2nd Stage, Vimanapura S.O.',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560017',
      addressCountry: 'IN',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Office 657, 18 Young St, Unit LGE',
      addressLocality: 'Edinburgh',
      addressRegion: 'Scotland',
      postalCode: 'EH2 4JB',
      addressCountry: 'GB',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9398386765',
    email: 'office@rothenhall.com',
    contactType: 'sales',
    areaServed: ['IN', 'GB', 'Worldwide'],
    availableLanguage: ['en', 'hi'],
  },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Place', name: 'Worldwide' },
  ],
  knowsAbout: [
    'Answer Engine Optimization',
    'Generative Engine Optimization',
    'AI search visibility',
    'ChatGPT, Perplexity, Google AI Overviews, Google AI Mode and Gemini citations',
    'Go-to-Market Strategy',
    'Revenue Operations',
    'Growth Marketing',
    'Growth Operations',
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

const founderSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE.url}/#founder`,
  name: 'Kunal Achintya Reddy',
  givenName: 'Kunal',
  jobTitle: 'Chief Executive Officer and Founder',
  url: `${SITE.url}/about#founder`,
  image: `${SITE.url}/brand/founder.jpeg`,
  email: 'kunal@rothenhall.com',
  worksFor: { '@id': `${SITE.url}/#organization` },
  sameAs: [
    'https://www.linkedin.com/in/kunalachintyareddy/',
    'https://scholar.google.com/citations?user=8ajuQHEAAAAJ&hl=en',
  ],
  knowsAbout: [
    'Answer Engine Optimization',
    'Generative Engine Optimization',
    'AI search visibility',
    'Go-to-Market Strategy',
    'Revenue Operations',
  ],
}

const cailyxSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${SITE.url}/#cailyx`,
  name: 'Cailyx',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: `${SITE.url}/cailyx`,
  description:
    'Cailyx is an AI-visibility platform that tracks how AI assistants like ChatGPT, Perplexity, Google AI Overviews, Google AI Mode and Gemini see your company, diagnoses why you are missing, and runs the agentic work to fix it.',
  publisher: { '@id': `${SITE.url}/#organization` },
  offers: {
    '@type': 'Offer',
    category: 'SaaS',
    availability: 'https://schema.org/PreOrder',
  },
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Rothenhall · Fractional Operating Partner for AI-Era Growth' },
      { name: 'description', content: SITE.description },
      { name: 'theme-color', content: '#f7f3ea' },
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
        href: 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300..600;1,300..600&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Runs before first paint. The reveal animations hide their content
            only under html.js, so no-JS crawlers and prerender snapshots
            never see a blank band. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <HeadContent />
        {/* Google Analytics (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Q683L79VWT"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-Q683L79VWT');`,
          }}
        />
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "yjros0h93e");`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(cailyxSchema) }}
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children ?? <Outlet />}</main>
          <Footer />
        </div>
        <SpaPageViewTracker />
        <Scripts />
      </body>
    </html>
  )
}

function SpaPageViewTracker() {
  const location = useRouterState({ select: (s) => s.location })
  const isFirstRender = useRef(true)

  useEffect(() => {
    // gtag's initial config already fired the first page_view, so skip mount.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const pagePath = `${location.pathname}${location.searchStr ?? ''}`
    ;(window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.(
      'event',
      'page_view',
      {
        page_path: pagePath,
        page_location: window.location.origin + pagePath,
        page_title: document.title,
      },
    )
  }, [location])

  return null
}
