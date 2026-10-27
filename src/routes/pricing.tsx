import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { SERVICES, TERMS, UMBRELLAS, formatMoney, type Currency } from '../lib/catalog'
import { seo, SITE } from '../lib/seo'
import { getPriceRegion, type PriceRegion } from '../server/geo'
import { track } from '../lib/track'

/* ------------------------------------------------------------------ */
/*  Pricing: choose how long we work together. Everything else —       */
/*  the services and their prices — is curated in the atelier, /engage. */
/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: 'How do the three engagements differ?',
    a: 'Only in length, and in how much you save on monthly fees. The work, the team and the standard are identical, so you are choosing how much time you want to commit, not a different level of service.',
  },
  {
    q: 'What do I pay today?',
    a: 'The first month of your monthly services, plus half of any one-off project. The remaining months are invoiced monthly in advance, and each project balance is due on delivery. You see the exact amount before you pay.',
  },
  {
    q: 'What if I am not sure what I need?',
    a: 'Enter your website in the atelier. We read its public pages and suggest services with the reason for each, and you can add or remove any of them. If you would rather talk first, schedule a call and a senior operator will walk you through it.',
  },
  {
    q: 'Can I change services during the term?',
    a: 'Yes. Ask us to add, swap or pause a service and we agree it in writing. Services added later keep the discount for your engagement length.',
  },
  {
    q: 'Can you promise a ranking or a result?',
    a: 'No. AI answers and search results vary by engine, region and day, so we report rates across repeated runs, never a single position. What we promise is the work, the evidence and the baseline.',
  },
  {
    q: 'What happens when the term ends?',
    a: 'We review the results together. You can renew, change the mix of services, or stop, on 30 days written notice after the minimum term.',
  },
  {
    q: 'Which currency, and what about tax?',
    a: 'Prices are in US dollars, or euros in Europe, and follow your location. They exclude VAT, GST or sales tax where the law requires us to add it.',
  },
]

const STEPS = [
  { n: '1', t: 'Choose your length', b: 'Three, six or twelve months.' },
  { n: '2', t: 'Curate your services', b: 'Pick from the catalogue, or let us read your site.' },
  { n: '3', t: 'Confirm and begin', b: 'Review it, pay the first month, and we start.' },
]

const ASSURANCES = [
  ['One fixed monthly fee', 'for the whole term, then 30 days written notice.'],
  ['Projects, paid in two halves', 'half to begin, half on delivery.'],
  ['No promised rankings', 'only the work, the evidence and a baseline.'],
]

const offer = (name: string, usd: number, eur: number, monthly: boolean) => ({
  '@type': 'Offer',
  name,
  itemOffered: { '@type': 'Service', name },
  priceSpecification: [
    { '@type': 'UnitPriceSpecification', priceCurrency: 'USD', price: usd, ...(monthly ? { unitText: 'MON' } : {}), eligibleRegion: 'US' },
    { '@type': 'UnitPriceSpecification', priceCurrency: 'EUR', price: eur, ...(monthly ? { unitText: 'MON' } : {}), eligibleRegion: 'Europe' },
  ],
})

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'OfferCatalog',
      name: 'Rothenhall Partners services',
      url: `${SITE.url}/pricing`,
      itemListElement: UMBRELLAS.map((u) => ({
        '@type': 'OfferCatalog',
        name: u.name,
        itemListElement: SERVICES.filter((s) => s.umbrella === u.id).map((s) => offer(s.name, s.price.usd, s.price.eur, s.unit === 'month')),
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

export const Route = createFileRoute('/pricing')({
  head: () => ({
    ...seo({
      path: '/pricing',
      title: 'Pricing · Choose Your Engagement · Rothenhall Partners',
      description:
        'Choose a three, six or twelve month engagement, then curate exactly the services you need, from SEO and AEO to brand, content, paid media and growth strategy. Prices in US dollars or euros.',
    }),
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(schema) }],
  }),
  loader: () => getPriceRegion(),
  component: Pricing,
})

function guessRegion(): PriceRegion | undefined {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (/^Europe\//i.test(tz)) return 'EU'
    if (tz) return 'US'
  } catch {
    /* ignore */
  }
  return undefined
}

function Pricing() {
  const geo = Route.useLoaderData()
  // Server-detected region first, so the right currency is in the first paint.
  const [region, setRegion] = useState<PriceRegion>(geo.region)
  useEffect(() => {
    if (geo.detected) return
    const g = guessRegion()
    if (g) setRegion(g)
  }, [geo.detected])
  const currency: Currency = region === 'EU' ? 'EUR' : 'USD'

  const fromPrice = (id: string) => {
    const list = SERVICES.filter((s) => s.umbrella === id)
    const lowest = Math.min(...list.map((s) => (currency === 'EUR' ? s.price.eur : s.price.usd)))
    return formatMoney(lowest, currency)
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="pt-24 pb-16 sm:pt-32 sm:pb-20">
          <Reveal>
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="text-display-lg mt-8 max-w-3xl">
              Choose how long we <span style={{ color: 'var(--color-cognac)' }}>work together.</span>
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-ink-60">
              Three engagement lengths, and nothing else to decode. Pick one, then curate exactly the services you
              need in our atelier, or let us read your website and suggest them.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.n} className="flex items-start gap-4 bg-paper p-6">
                  <span className="font-display text-cognac" style={{ fontSize: '2rem', lineHeight: 1 }}>
                    {s.n}
                  </span>
                  <span>
                    <span className="block font-display text-ink" style={{ fontSize: '1.2rem' }}>
                      {s.t}
                    </span>
                    <span className="mt-1 block font-sans text-caption text-ink-60">{s.b}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      {/* Step 1: the three engagements */}
      <section id="engagements" className="scroll-mt-24">
        <Container className="py-20 sm:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Step one</Eyebrow>
              <h2 className="text-display-md mt-6">Three lengths. Choose one.</h2>
              <p className="text-lead mt-5 text-ink-60">
                The longer you commit, the more you save on every monthly fee. Nothing else changes.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TERMS.map((t, i) => (
              <Reveal key={t.key} delay={i * 80} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brass hover:shadow-[0_34px_70px_-44px_rgba(26,23,18,0.5)]">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-brass/70" />
                  <p className="eyebrow">{t.tag}</p>
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-display tabular-nums text-ink" style={{ fontSize: '4.2rem', lineHeight: 0.9, letterSpacing: '-0.03em' }}>
                      {t.months}
                    </span>
                    <span className="font-display text-ink-60" style={{ fontSize: '1.3rem' }}>
                      months
                    </span>
                  </p>
                  <h3 className="mt-6 font-display text-ink" style={{ fontSize: '1.6rem' }}>
                    {t.label} engagement
                  </h3>
                  <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">{t.line}</p>
                  <p className="mt-6 inline-flex w-fit items-center rounded-full border border-cognac/40 bg-cognac/10 px-3.5 py-1.5 font-sans text-caption font-semibold text-cognac-deep">
                    {Math.round(t.off * 100)}% off every monthly fee
                  </p>
                  <div className="mt-auto pt-8">
                    <Link
                      to="/engage"
                      search={{ term: t.key }}
                      onClick={() => track('term_choose', { term: t.key })}
                      className="btn btn-primary w-full justify-center"
                    >
                      Begin {t.label.toLowerCase()} →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <ul className="mt-10 grid gap-4 border-t border-line pt-8 sm:grid-cols-3">
              {ASSURANCES.map(([h, b]) => (
                <li key={h} className="font-sans text-caption leading-relaxed text-ink-60">
                  <span className="font-semibold text-ink">{h}</span> {b}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-sans text-label text-ink-45">
              {geo.detected ? `Prices in ${currency}, based on your location.` : `Prices in ${currency}.`} They exclude VAT, GST or sales tax where it applies.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Step 2 preview: what the atelier holds */}
      <section className="border-t border-night-line bg-night text-canvas">
        <Container className="py-20 sm:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow className="eyebrow-light">Step two</Eyebrow>
              <h2 className="text-display-md mt-6 text-canvas">Then curate what you need.</h2>
              <p className="text-lead mt-5 text-canvas/65">
                A catalogue of {UMBRELLAS.length} disciplines and {SERVICES.length} curated services, each with its own
                price. Add the ones you want and watch your engagement take shape.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line sm:grid-cols-2 lg:grid-cols-3">
            {UMBRELLAS.map((u, i) => (
              <Reveal key={u.id} delay={(i % 3) * 60} className="bg-night">
                <div className="flex h-full flex-col p-6">
                  <p className="font-display text-brass-soft" style={{ fontSize: '1.1rem' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 font-display text-canvas" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>
                    {u.name}
                  </h3>
                  <p className="mt-2 font-sans text-caption leading-relaxed text-canvas/55">{u.tagline}</p>
                  <p className="mt-auto pt-5 font-sans text-label text-canvas/45">
                    {SERVICES.filter((s) => s.umbrella === u.id).length} services, from {fromPrice(u.id)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={100}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#engagements" className="btn btn-light">
                Choose your length
              </a>
              <Link to="/contact" className="link-line font-sans text-body text-canvas/80">
                Prefer to talk first? Schedule a call →
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Questions */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow>Questions</Eyebrow>
                <h2 className="text-display-md mt-6">Before you choose.</h2>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <dl className="divide-y divide-line border-y border-line">
                {FAQ.map((f, i) => (
                  <Reveal key={f.q} delay={i * 30}>
                    <div className="py-7">
                      <dt className="font-display text-ink" style={{ fontSize: '1.25rem' }}>
                        {f.q}
                      </dt>
                      <dd className="mt-3 font-sans text-body leading-relaxed text-ink-60">{f.a}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* Close */}
      <section className="border-t border-night-line bg-night text-canvas">
        <Container width="narrow" className="py-20 text-center sm:py-24">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-canvas" style={{ fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.08, fontWeight: 300 }}>
              Not sure where to begin? Start with your website.
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-sans text-body leading-relaxed text-canvas/65">
              Choose a length, enter your address in the atelier, and we suggest the services that fit, with a reason for each.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href="#engagements" className="btn btn-light">
                Choose your length
              </a>
              <Link to="/contact" className="btn btn-ghost-light">
                Schedule a call
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
