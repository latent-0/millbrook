import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo, SITE } from '../lib/seo'
import { getPriceRegion, type PriceRegion } from '../server/geo'
import { track } from '../lib/track'

/* ------------------------------------------------------------------ */
/*  Currency                                                           */
/* ------------------------------------------------------------------ */

// Every figure below is an explicit list price in each currency, set on
// purpose (not a conversion). The visitor's region is read on the server from
// the edge location header, so the right prices are in the first paint.
// India sees INR, Europe sees EUR, and everyone else sees USD.
//
// How the three price books relate, so they stay comparable:
//   India:  the anchor. Rupee list prices are set first, inside the band
//           agencies quote for small and mid-size companies.
//   US:     about double the India figure in real value (INR / 96 x 2),
//           rounded to a clean number.
//   Europe: about 92% of the US figure, in euros.
// Same scope and deliverables in every region.
type Region = PriceRegion
type Money = { usd: number; eur: number; inr: number }

const REGIONS: { key: Region; label: string; name: string }[] = [
  { key: 'US', label: 'USD', name: 'United States' },
  { key: 'EU', label: 'EUR', name: 'Europe' },
  { key: 'IN', label: 'INR', name: 'India' },
]

// Fallback used only when the edge did not send a country (local development):
// infer the region from the browser time zone.
function guessRegion(): Region | undefined {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (/Kolkata|Calcutta/i.test(tz)) return 'IN'
    if (/^Europe\//i.test(tz)) return 'EU'
    if (/^America\//i.test(tz)) return 'US'
  } catch {
    /* ignore */
  }
  return undefined
}

/** Short tag shown beside a price so the tax treatment is visible at a glance. */
function taxTag(region: Region): string {
  if (region === 'IN') return '+ GST'
  if (region === 'EU') return '+ VAT'
  return '+ tax'
}

/* ------------------------------------------------------------------ */
/*  Price book                                                         */
/* ------------------------------------------------------------------ */

type TierKey = 'foundation' | 'growth' | 'operating'

type ServiceTier = {
  key: TierKey
  name: string
  price: Money
  tagline: string
  forWho: string
  popular?: boolean
  hours: string
  /** Coverage of the four disciplines, 0 none, 1 measured or tracked, 2 run. */
  coverage: [number, number, number, number]
  included: string[]
  excluded: string[]
}

const DISCIPLINE_LABELS = ['AEO and GEO', 'Go-to-market', 'Revenue ops', 'Growth'] as const

const DIAGNOSTIC: {
  price: Money
  upper: Money
  scopes: { key: string; name: string; sub: string; price: Money }[]
} = {
  price: { usd: 950, eur: 875, inr: 45000 },
  upper: { usd: 2250, eur: 2050, inr: 110000 },
  scopes: [
    { key: 'focused', name: 'Focused', sub: 'Is the site sound, and do AI engines name you?', price: { usd: 950, eur: 875, inr: 45000 } },
    { key: 'standard', name: 'Standard', sub: 'More depth: more prompts and engines, a longer plan, your competitors and your wider digital presence.', price: { usd: 1500, eur: 1400, inr: 75000 } },
    { key: 'comprehensive', name: 'Comprehensive', sub: 'The full read: every engine, every channel, and a quarter of content.', price: { usd: 2250, eur: 2050, inr: 110000 } },
  ],
}

// What each Diagnostic includes. Every fact appears once: a cell is the value
// for that tier, and a dash means it is not part of the tier. Higher tiers
// include everything below them.
// Billing terms. The longer the prepayment, the bigger the discount on the
// monthly fee. One-off items are never discounted.
type BillingKey = 'monthly' | 'quarterly' | 'yearly'
const BILLING: { key: BillingKey; label: string; off: number; every: string }[] = [
  { key: 'monthly', label: 'Monthly', off: 0, every: 'month' },
  { key: 'quarterly', label: 'Quarterly', off: 0.1, every: 'quarter' },
  { key: 'yearly', label: 'Yearly', off: 0.25, every: 'year' },
]
// Founding Partner Programme: this rate applies to the first three months only,
// and only on a quarterly or yearly plan. It replaces the plan discount for
// those three months (the two do not stack).
const FOUNDING_OFF = 0.3

const DX_PLATFORMS: string[][] = [
  ['ChatGPT', 'Gemini'],
  ['ChatGPT', 'Gemini', 'Google AI', 'Claude'],
  ['ChatGPT', 'Gemini', 'Perplexity', 'Copilot', 'Grok', 'Google AI Overviews', 'Google AI Mode', 'Google Search'],
]
const DX_ROWS: { group: string; label: string; chip?: string; hint?: string; vals: (string | null)[] }[] = [
  { group: 'Site', label: 'Technical audits', chip: 'Technical audits: performance, SEO, structure', hint: 'Performance, technical SEO and site structure', vals: ['Included', 'Included', 'Included'] },
  { group: 'Site', label: 'Site copy audit', hint: 'Your site content, page by page', vals: [null, null, 'Included'] },
  { group: 'AI answers', label: 'Prompts tested', vals: ['50', '100', '200'] },
  { group: 'AI answers', label: 'AI platforms', vals: ['2', '4', '8'] },
  { group: 'AI answers', label: 'Service locations', vals: ['3', '3', '10'] },
  { group: 'AI answers', label: 'AI interest', vals: [null, null, 'Included'] },
  { group: 'Plan', label: 'Content plan', hint: 'Ideas and direction, not produced content', vals: ['30 days', '60 days', '90 days'] },
  { group: 'Presence', label: 'Competitor analysis', hint: 'How you compare with the rivals buyers weigh you against', vals: [null, 'Included', 'Included'] },
  { group: 'Presence', label: 'Digital presence audit', hint: 'Built around your business, industry, the profiles you need and where you stand online today', vals: [null, 'Included', 'Included'] },
  { group: 'Presence', label: 'Social media audit', hint: 'Accounts, post analytics and engagement', vals: [null, null, 'Included'] },
]

const SERVICE_TIERS: ServiceTier[] = [
  {
    key: 'foundation',
    name: 'Foundation',
    price: { usd: 550, eur: 500, inr: 25000 },
    tagline: 'Measure it properly, and keep the fixes moving.',
    forWho: 'A company with its own team to execute.',
    hours: 'About 15 hours a month',
    coverage: [1, 0, 0, 0],
    included: [
      'Monthly AEO measurement on Cailyx, five or more runs per prompt',
      'Fix Plan tracking, each fix tested on the live site',
      'Weekly report',
      'One strategy call a month',
    ],
    excluded: ['Content production', 'Social management', 'Website changes'],
  },
  {
    key: 'growth',
    name: 'Growth',
    price: { usd: 1100, eur: 1000, inr: 55000 },
    popular: true,
    tagline: 'Strategy and execution, run alongside your team.',
    forWho: 'A team that wants a go-to-market partner, not a report.',
    hours: 'About 45 hours a month',
    coverage: [2, 2, 1, 1],
    included: [
      'Everything in Foundation',
      'Positioning, ICP, messaging, funnel and channel plan',
      'Quarterly re-baseline of your AI visibility',
      '12 to 16 content pieces a month across two channels',
      'Website change specifications for your developers',
      'Weekly call',
    ],
    excluded: ['Embedded ownership of company KPIs'],
  },
  {
    key: 'operating',
    name: 'Operating Partner',
    price: { usd: 2600, eur: 2400, inr: 125000 },
    tagline: 'A named operator who owns the number.',
    forWho: 'A founder or fund that needs one accountable owner.',
    hours: 'About 90 hours a month',
    coverage: [2, 2, 2, 2],
    included: [
      'Everything in Growth',
      'A named operator accountable for agreed KPIs',
      'Off-site citation work: comparison tables, communities, listings',
      'Partnerships and sales enablement',
      'Short-form video, two pieces a month',
      'Monthly review with the founder or fund',
    ],
    excluded: ['Paid media spend (billed at cost, separately)'],
  },
]

/** Add-ons priced per unit. `monthly` ones recur, the rest are one-off. */
type AddonKey = 'social' | 'blog' | 'video' | 'engine'
const ADDONS: {
  key: AddonKey
  name: string
  unit: string
  price: Money
  upper?: Money
  monthly: boolean
  max: number
}[] = [
  { key: 'social', name: 'Social channel management', unit: 'per channel, per month', price: { usd: 150, eur: 140, inr: 7000 }, monthly: true, max: 4 },
  { key: 'blog', name: 'Blog engine, four posts', unit: 'per month', price: { usd: 250, eur: 230, inr: 12000 }, monthly: true, max: 3 },
  { key: 'video', name: 'Short-form video', unit: 'per piece, one-off', price: { usd: 320, eur: 290, inr: 15000 }, upper: { usd: 750, eur: 690, inr: 36000 }, monthly: false, max: 6 },
  { key: 'engine', name: 'Extra AI engine or region in measurement', unit: 'per month', price: { usd: 75, eur: 70, inr: 3500 }, monthly: true, max: 4 },
]

const PROJECTS: { name: string; body: string; price: Money }[] = [
  {
    name: 'Positioning and ICP workshop',
    body: 'A defined position, ideal customer and message hierarchy, agreed in one working session.',
    price: { usd: 750, eur: 700, inr: 37000 },
  },
  {
    name: 'Competitor analysis',
    body: 'Who you really compete with for the buyer, how they reach them, and what to take from it.',
    price: { usd: 550, eur: 500, inr: 26000 },
  },
  {
    name: 'Site structure review',
    body: 'Site map, page roles, links, components and technical set-up, with a ranked fix list.',
    price: { usd: 600, eur: 550, inr: 30000 },
  },
  {
    name: 'Funnel plan',
    body: 'Reach, capture and convert, with the assets, channels and measures for each stage.',
    price: { usd: 450, eur: 400, inr: 22000 },
  },
]

const NEXT_STEPS = [
  { n: '01', t: 'You tell us what you need', b: 'Pick a tier and any modules above, or just describe the problem. Your estimate comes with you.' },
  { n: '02', t: 'A senior operator replies', b: 'A short, honest read on where the biggest gains likely are, not a sales sequence.' },
  { n: '03', t: 'You get a proposal if it fits', b: 'A Statement of Work with the deliverables, the dates and the fees. Nothing starts without it.' },
  { n: '04', t: 'Work begins from a baseline', b: 'We measure on day one, so every change is checkable.' },
]

const faqFor = (money: (m: Money) => string) => [
  {
    q: 'Do I need everything on this page?',
    a: 'No. Most clients take one tier, and some take a single add-on or project. The tiers fix what is included, so you know the scope, and the add-ons let you add one thing without moving up a level.',
  },
  {
    q: 'How much does AEO cost?',
    a: `Monthly operating work starts at ${money(SERVICE_TIERS[0].price)}, and a one-time Diagnostic at ${money(DIAGNOSTIC.price)}. Each tier above lists exactly what it includes. Agency quotes vary widely, so compare the deliverables line by line, not the headline.`,
  },
  {
    q: 'AEO agency, fractional operator or an in-house hire?',
    a: 'An in-house hire gives you one person full time. A fractional operator gives you senior judgement for a set number of hours, without the salary and ramp-up. We run AEO, go-to-market and revenue operations under one owner, so you do not coordinate three vendors. If you already have a strong marketing lead, Foundation usually fits better than Operating Partner.',
  },
  {
    q: 'How long until we see results?',
    a: 'AI engines usually take 30 to 60 days to reflect changes, so the first measured movement typically shows in the second or third month. We set a baseline on day one and report rates across repeated runs, so the change is checkable and not a single lucky answer.',
  },
  {
    q: 'What do you need from us to start?',
    a: 'One point of contact, one person who approves work, accurate facts about your business and platform access through each tool’s own permissions. We research your market first and ask only for what we cannot find ourselves. We never ask for shared passwords.',
  },
  {
    q: 'Where do Cailyx and Motion fit in?',
    a: 'Cailyx and Motion are our own platform. Cailyx measures how AI engines describe you, audits your site and tracks every fix until it is verified. Motion is our social studio and is not open yet. Today our team runs Cailyx for you and reports the results. Direct client access to both will follow later.',
  },
  {
    q: 'Can you promise a ranking or a result?',
    a: 'No. AI answers vary by engine, region and day, so we report rates across repeated runs, never a single position.',
  },
  {
    q: 'Can I change plans or cancel?',
    a: 'Yes. After the first three months an operating tier can move up or down, or end, at the end of any month with 30 days written notice.',
  },
]

const offersFor = (name: string, m: Money, per?: string) => ({
  '@type': 'Offer',
  name,
  itemOffered: { '@type': 'Service', name },
  priceSpecification: [
    { '@type': 'UnitPriceSpecification', priceCurrency: 'USD', price: m.usd, ...(per ? { unitText: per } : {}), eligibleRegion: 'US' },
    { '@type': 'UnitPriceSpecification', priceCurrency: 'EUR', price: m.eur, ...(per ? { unitText: per } : {}), eligibleRegion: 'Europe' },
    { '@type': 'UnitPriceSpecification', priceCurrency: 'INR', price: m.inr, ...(per ? { unitText: per } : {}), eligibleRegion: 'IN' },
  ],
})

// Every price in all three currencies, so a crawler that is served one region
// can still read the whole price book from the page's structured data.
const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Rothenhall operating services',
    serviceType: 'AI visibility, go-to-market and revenue operations',
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: ['IN', 'GB', 'Worldwide'],
    url: `${SITE.url}/pricing`,
    description:
      'A fractional operating partner for AI-era growth: a paid Diagnostic, three monthly service tiers (Foundation, Growth and Operating Partner), priced add-ons and one-off projects.',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Rothenhall price book',
      itemListElement: [
        ...DIAGNOSTIC.scopes.map((s) => offersFor(`Diagnostic, ${s.name} (one-time)`, s.price)),
        ...SERVICE_TIERS.map((s) => offersFor(`${s.name} operating tier`, s.price, 'MON')),
        ...PROJECTS.map((x) => offersFor(x.name, x.price)),
        ...ADDONS.map((a) => offersFor(a.name, a.price, a.monthly ? 'MON' : undefined)),
      ],
    },
  },
]

const schemaWithFaq = () => [
  ...schema,
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqFor((m) => `$${m.usd.toLocaleString('en-US')}`).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
]

export const Route = createFileRoute('/pricing')({
  head: () => ({
    ...seo({
      path: '/pricing',
      title: 'Pricing · Diagnostic and Operating Tiers · Rothenhall Partners',
      description:
        'How Rothenhall works with you: a paid Diagnostic, three monthly operating tiers with fixed deliverables, priced add-ons and one-off projects. Clear scope, clear terms.',
    }),
    scripts: schemaWithFaq().map((s) => ({
      type: 'application/ld+json',
      children: JSON.stringify(s),
    })),
  }),
  loader: () => getPriceRegion(),
  // The page differs by visitor, so it must never be served from a shared cache.
  headers: () => ({
    'Cache-Control': 'private, max-age=0, must-revalidate',
    Vary: 'Cookie, x-vercel-ip-country',
  }),
  component: Pricing,
})

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function Check({ light = false }: { light?: boolean }) {
  return (
    <span aria-hidden="true" className={`mt-1 flex-none ${light ? 'text-cognac-soft' : 'text-cognac'}`}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M11.5 3.5 5.5 10 2.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function SectionHead({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body?: string
}) {
  return (
    <div className="max-w-3xl">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-display-md mt-6">{title}</h2>
        {body && <p className="text-lead mt-5 text-ink-60">{body}</p>}
      </Reveal>
    </div>
  )
}

/** Four small meters showing how much of each discipline a tier covers. */
function Coverage({ values, light }: { values: ServiceTier['coverage']; light: boolean }) {
  return (
    <div
      className="mt-6"
      role="img"
      aria-label={`Coverage: ${DISCIPLINE_LABELS.map((d, i) => `${d} ${['none', 'measured', 'run'][values[i]]}`).join(', ')}`}
    >
      <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>Coverage</p>
      <ul className="mt-3 space-y-2">
        {DISCIPLINE_LABELS.map((d, i) => (
          <li key={d} className="flex items-center gap-3">
            <span className="flex gap-1">
              {[1, 2].map((n) => (
                <span
                  key={n}
                  className={`h-1.5 w-7 rounded-full ${
                    values[i] >= n
                      ? light
                        ? 'bg-cognac-soft'
                        : 'bg-cognac'
                      : light
                        ? 'bg-canvas/15'
                        : 'bg-line-strong'
                  }`}
                />
              ))}
            </span>
            <span className={`font-sans text-label ${light ? 'text-canvas/70' : 'text-ink-60'}`}>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function Pricing() {
  const geo = Route.useLoaderData()
  // Server-detected region first, so the right prices are in the first paint.
  const [region, setRegion] = useState<Region>(geo.region)
  const [tier, setTier] = useState<TierKey | 'none'>('growth')
  const [qty, setQty] = useState<Record<AddonKey, number>>({
    social: 0,
    blog: 0,
    video: 0,
    engine: 0,
  })
  const [founding, setFounding] = useState(false)
  const [billing, setBilling] = useState<BillingKey>('monthly')
  const [scope, setScope] = useState(0)

  // With no edge country (local development), fall back to the time zone.
  useEffect(() => {
    if (geo.detected) return
    const g = guessRegion()
    if (g) setRegion(g)
  }, [geo.detected])

  const pick = (m: Money) => (region === 'IN' ? m.inr : region === 'EU' ? m.eur : m.usd)
  const fmt = (n: number) =>
    region === 'IN'
      ? '₹' + Math.round(n).toLocaleString('en-IN')
      : region === 'EU'
        ? '€' + Math.round(n).toLocaleString('en-IE')
        : '$' + Math.round(n).toLocaleString('en-US')
  const regionName = REGIONS.find((r) => r.key === region)!.name
  const money = (m: Money) => fmt(pick(m))
  const faq = faqFor(money)

  const selected = SERVICE_TIERS.find((t) => t.key === tier)

  const totals = useMemo(() => {
    let monthly = selected ? pick(selected.price) : 0
    let oneOff = 0
    for (const a of ADDONS) {
      const line = qty[a.key] * pick(a.price)
      if (a.monthly) monthly += line
      else oneOff += line
    }
    return { monthly, oneOff }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, qty, region])

  const hasAnything = !!selected || Object.values(qty).some((n) => n > 0)

  const step = (k: AddonKey, delta: number, max: number) =>
    setQty((q) => ({ ...q, [k]: Math.max(0, Math.min(max, q[k] + delta)) }))

  const diagnostic = DIAGNOSTIC.scopes[scope]

  // The Founding rate needs a three-month or longer plan, so it never applies on monthly billing.
  const bill = BILLING.find((b) => b.key === billing)!
  const foundingOn = founding && billing !== 'monthly'
  const planMonthly = totals.monthly * (1 - bill.off) // the ongoing monthly fee on this billing term
  const firstRate = foundingOn ? totals.monthly * (1 - FOUNDING_OFF) : planMonthly // monthly fee for months 1 to 3
  const firstQuarter = firstRate * 3 + totals.oneOff
  // What each invoice comes to: a quarter or a year at a time (the first one reflects the Founding rate).
  const invoice = billing === 'quarterly' ? firstRate * 3 : billing === 'yearly' ? firstRate * 3 + planMonthly * 9 : planMonthly

  const estimateNote = [
    selected ? `${selected.name} tier` : 'No tier',
    ...ADDONS.filter((a) => qty[a.key] > 0).map((a) => `${a.name} x ${qty[a.key]}`),
    hasAnything ? `estimate ${fmt(planMonthly)} a month` : '',
    `${bill.label} billing`,
    foundingOn ? 'Founding Partner Programme' : '',
  ]
    .filter(Boolean)
    .join(', ')
    .slice(0, 280)

  // Three steps, not seven rows: the tiers are one step, since the card below explains each.
  const ladder: { n: string; name: string; note: string; href: string }[] = [
    { n: '1', name: 'AI Visibility Score', note: 'A free read of your public footprint.', href: '#start' },
    { n: '2', name: 'Diagnostic', note: 'One-time written audits and a plan to act on.', href: '#start' },
    { n: '3', name: 'Operating tiers', note: 'Foundation, Growth or Operating Partner. We run more of the work as you climb.', href: '#operate' },
  ]

  return (
    <>
      {/* Hero: editorial headline beside a staircase of the whole offer */}
      <section className="border-b border-line">
        <Container className="pt-24 pb-16 sm:pt-32 sm:pb-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <Eyebrow>Pricing</Eyebrow>
                <h1 className="text-display-lg mt-8 max-w-2xl">
                  Choose how much of the work{' '}
                  <span style={{ color: 'var(--color-cognac)' }}>we run.</span>
                </h1>
                <p className="text-lead mt-8 max-w-xl text-ink-60">
                  Rothenhall is the operator. Begin by finding out where you
                  stand, then climb only as far as you need. Every step says
                  exactly what is in it, and what is not.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/contact"
                    search={{ plan: 'diagnostic' }}
                    onClick={() => track('cta_free_score', { where: 'pricing_hero' })}
                    className="btn btn-primary"
                  >
                    Get your free AI Visibility Score
                  </Link>
                  <a href="#build" className="link-line font-sans text-body text-ink-80">
                    Build your engagement →
                  </a>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <span className="font-sans text-caption text-ink-45">
                    {geo.detected ? `Showing prices for ${regionName}, based on your location.` : `Showing ${regionName} prices.`}
                  </span>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={80}>
                <div className="rounded-2xl border border-line bg-canvas p-6 shadow-[0_30px_60px_-45px_rgba(26,23,18,0.4)] sm:p-8">
                  <p className="eyebrow">Where to start</p>
                  <ol className="relative mt-6">
                    <span aria-hidden="true" className="absolute bottom-6 left-[0.9rem] top-6 w-px bg-line-strong" />
                    {ladder.map((s) => (
                      <li key={s.n}>
                        <a href={s.href} className="group relative -mx-2 flex gap-4 rounded-lg px-2 py-3.5 transition-colors hover:bg-canvas-2">
                          <span
                            aria-hidden="true"
                            className="relative z-10 grid h-7 w-7 flex-none place-items-center rounded-full border border-line-strong bg-canvas font-display text-caption text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-canvas"
                          >
                            {s.n}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-ink" style={{ fontSize: '1.25rem' }}>
                              {s.name}
                            </span>
                            <span className="mt-0.5 block font-sans text-label leading-snug text-ink-60">{s.note}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* 01 Start: value first, then the price */}
      <section id="start" className="scroll-mt-24">
        <Container className="py-20 sm:py-24">
          <SectionHead
            eyebrow="Start here"
            title="Find out where you stand."
            body="Every engagement begins with a baseline, so every change after it is measured against something real."
          />
          <Reveal delay={60}>
            <div className="mt-12 overflow-hidden rounded-3xl bg-night text-canvas shadow-[0_40px_80px_-40px_rgba(26,23,18,0.55)]">
              <div className="grid lg:grid-cols-12">
                <div className="p-7 sm:p-9 lg:col-span-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="eyebrow eyebrow-light">One-time · Diagnostic</p>
                    <p className="font-sans text-label text-canvas/50">Each depth includes the one before it.</p>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Diagnostic depth">
                    {DIAGNOSTIC.scopes.map((t, i) => {
                      const on = scope === i
                      return (
                        <button
                          key={t.key}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => {
                            setScope(i)
                            track('diagnostic_select', { scope: t.key })
                          }}
                          className={`cursor-pointer rounded-xl border px-3 py-3 text-left transition-colors ${
                            on ? 'border-cognac-soft bg-canvas/[0.07]' : 'border-night-line hover:border-canvas/30'
                          }`}
                        >
                          <span className={`block font-display ${on ? 'text-canvas' : 'text-canvas/60'}`} style={{ fontSize: '1.05rem' }}>
                            {t.name}
                          </span>
                          <span className={`mt-0.5 block font-sans text-label tabular-nums ${on ? 'text-cognac-soft' : 'text-canvas/40'}`}>
                            {money(t.price)}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-night-line bg-night-line sm:grid-cols-4">
                    {['Prompts tested', 'AI platforms', 'Service locations', 'Content plan'].map((label) => {
                      const v = DX_ROWS.find((r) => r.label === label)!.vals[scope]
                      return (
                        <div key={label} className="bg-night px-4 py-3.5">
                          <dd className="font-display tabular-nums text-canvas" style={{ fontSize: '1.7rem', lineHeight: 1 }}>
                            {v}
                          </dd>
                          <dt className="mt-1.5 font-sans text-label text-canvas/55">{label}</dt>
                        </div>
                      )
                    })}
                  </dl>
                  <p className="mt-3 font-sans text-label leading-relaxed text-canvas/50">
                    <span className="text-canvas/70">Platforms:</span> {DX_PLATFORMS[scope].join(', ')}. The content plan is ideas and direction, not produced content.
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {DX_ROWS.filter((r) => r.vals[scope] === 'Included').map((r) => {
                      const added = scope > 0 && r.vals[scope - 1] !== 'Included'
                      return (
                        <li
                          key={r.label}
                          title={r.hint}
                          className={`rounded-full border px-3 py-1 font-sans text-caption ${
                            added ? 'border-cognac-soft/60 bg-cognac/15 text-canvas' : 'border-canvas/20 bg-canvas/[0.04] text-canvas/80'
                          }`}
                        >
                          {added && <span aria-hidden="true" className="mr-1 text-cognac-soft">+</span>}
                          {r.chip ?? r.label}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="flex flex-col justify-between gap-6 border-t border-night-line bg-night-2 p-7 sm:p-9 lg:col-span-4 lg:border-l lg:border-t-0">
                  <div>
                    <p className="font-sans text-label uppercase tracking-[0.14em] text-canvas/55">{DIAGNOSTIC.scopes[scope].name} Diagnostic</p>
                    <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
                      <span className="font-display tabular-nums text-canvas" style={{ fontSize: '2.8rem', lineHeight: 1 }}>
                        {money(diagnostic.price)}
                      </span>
                      <span className="font-sans text-caption text-canvas/55">one-time {taxTag(region)}</span>
                    </p>
                    <p className="mt-3 font-sans text-caption leading-snug text-canvas/65">{DIAGNOSTIC.scopes[scope].sub}</p>
                    <p className="mt-4 font-sans text-caption leading-snug text-brass-soft">
                      Credited in full if you sign an operating tier within 30 days.
                    </p>
                  </div>
                  <div>
                    <Link
                      to="/contact"
                      search={{ plan: 'diagnostic' }}
                      onClick={() => track('diagnostic_click', { scope: diagnostic.key })}
                      className="btn btn-light w-full justify-center"
                    >
                      Book a Diagnostic
                    </Link>
                    <p className="mt-3 text-center font-sans text-label text-canvas/50">
                      Not ready?{' '}
                      <Link to="/contact" className="link-line text-canvas/80">
                        Start with the free score
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 02 Operate */}
      <section id="operate" className="scroll-mt-24 border-t border-line bg-canvas-2">
        <Container className="py-20 sm:py-24">
          <SectionHead
            eyebrow="Operating tiers"
            title="Three levels of ownership."
            body="Monthly, with fixed deliverables. The bars on each card show how much of each discipline we run: one bar is measured and tracked, two bars are run by us."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {SERVICE_TIERS.map((t, i) => {
              const hl = t.popular
              return (
                <Reveal key={t.key} delay={i * 70} className="h-full">
                  <div
                    className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                      hl
                        ? 'border-transparent bg-night text-canvas shadow-[0_40px_80px_-40px_rgba(26,23,18,0.55)]'
                        : 'border-line bg-canvas'
                    }`}
                  >
                    {hl && (
                      <span className="absolute -top-3 left-8 rounded-full bg-cognac px-3 py-1 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-canvas">
                        Recommended
                      </span>
                    )}
                    <h3 className={`font-display ${hl ? 'text-canvas' : 'text-ink'}`} style={{ fontSize: '1.6rem' }}>
                      {t.name}
                    </h3>
                    <p className={`mt-2 min-h-[2.6rem] font-sans text-caption leading-snug ${hl ? 'text-canvas/70' : 'text-ink-60'}`}>
                      {t.tagline}
                    </p>
                    <p className="mt-6 flex items-baseline gap-1">
                      <span
                        className={`font-display tabular-nums ${hl ? 'text-canvas' : 'text-ink'}`}
                        style={{ fontSize: '2.9rem', lineHeight: 1 }}
                      >
                        {money(t.price)}
                      </span>
                      <span className={`font-sans text-caption ${hl ? 'text-canvas/60' : 'text-ink-45'}`}>/month</span>
                      <span className={`ml-1 font-sans text-caption font-medium ${hl ? 'text-canvas/80' : 'text-ink-60'}`}>{taxTag(region)}</span>
                    </p>
                    <p className={`mt-2 font-sans text-label ${hl ? 'text-canvas/55' : 'text-ink-45'}`}>
                      {t.hours}.
                    </p>
                    <p className={`mt-5 font-sans text-caption leading-relaxed ${hl ? 'text-canvas/80' : 'text-ink-80'}`}>
                      <span className="font-semibold">Best for: </span>
                      {t.forWho}
                    </p>
                    <Link
                      to="/contact"
                      search={{ plan: t.key }}
                      className={`btn mt-6 w-full justify-center ${hl ? 'btn-light' : 'btn-primary'}`}
                    >
                      Request a proposal
                    </Link>

                    <Coverage values={t.coverage} light={!!hl} />

                    <p className={`mt-7 eyebrow ${hl ? 'eyebrow-light' : ''}`}>Included</p>
                    <ul className="mt-4 space-y-3">
                      {t.included.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <Check light={hl} />
                          <span className={`font-sans text-caption leading-snug ${hl ? 'text-canvas/85' : 'text-ink-80'}`}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <p className={`mt-7 eyebrow ${hl ? 'eyebrow-light' : ''}`}>Not included</p>
                    <ul className="mt-4 space-y-2">
                      {t.excluded.map((f) => (
                        <li key={f} className={`font-sans text-caption leading-snug ${hl ? 'text-canvas/55' : 'text-ink-45'}`}>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )
            })}
          </div>

        </Container>
      </section>

      {/* 03 Build your engagement */}
      <section id="build" className="scroll-mt-24 border-t border-line">
        <Container className="py-20 sm:py-24">
          <SectionHead
            eyebrow="Build your engagement"
            title="Take only what you need."
            body="Choose a tier, then add single modules. The estimate updates as you go."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            {/* Controls */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="eyebrow">1. Choose a tier</p>
                  <p className="font-sans text-label text-ink-45">
                    Click any card to select it. Click again to clear.
                  </p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Operating tier">
                  {(
                    [
                      { key: 'none' as const, name: 'No tier', sub: 'Add-ons only', line: 'Take one module without a monthly tier.' },
                      ...SERVICE_TIERS.map((t) => ({ key: t.key, name: t.name, sub: `${money(t.price)}/month`, line: '' })),
                    ] as { key: TierKey | 'none'; name: string; sub: string; line: string }[]
                  ).map((o) => {
                    const on = tier === o.key
                    return (
                      <button
                        key={o.key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => {
                          const next = on && o.key !== 'none' ? 'none' : o.key
                          setTier(next)
                          track('tier_select', { tier: next })
                        }}
                        className={`group relative cursor-pointer rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
                          on
                            ? 'border-ink bg-ink text-canvas shadow-[0_24px_50px_-30px_rgba(26,23,18,0.6)]'
                            : 'border-line bg-canvas text-ink hover:-translate-y-0.5 hover:border-ink/60 hover:shadow-[0_20px_40px_-30px_rgba(26,23,18,0.45)]'
                        }`}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="block font-display" style={{ fontSize: '1.2rem' }}>
                            {o.name}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`mt-1 grid h-5 w-5 flex-none place-items-center rounded-full border transition-colors ${
                              on ? 'border-cognac-soft bg-cognac-soft text-night' : 'border-line-strong group-hover:border-ink'
                            }`}
                          >
                            {on && (
                              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                                <path d="M11.5 3.5 5.5 10 2.5 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                        </span>
                        <span className={`mt-1 block font-sans text-label ${on ? 'text-canvas/70' : 'text-ink-45'}`}>{o.sub}</span>
                        <span className={`mt-3 block font-sans text-[0.68rem] font-medium uppercase tracking-[0.16em] ${on ? 'text-cognac-soft' : 'text-brass-deep'}`}>
                          {on ? 'Selected' : 'Select'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="mt-10 flex flex-wrap items-baseline justify-between gap-3">
                  <p className="eyebrow">2. Add modules, if you want them</p>
                  {(tier !== 'none' || Object.values(qty).some((n) => n > 0) || founding || billing !== 'monthly') && (
                    <button
                      type="button"
                      onClick={() => {
                        setTier('none')
                        setQty({ social: 0, blog: 0, video: 0, engine: 0 })
                        setFounding(false)
                        setBilling('monthly')
                      }}
                      className="link-line cursor-pointer font-sans text-label text-ink-60"
                    >
                      Reset everything
                    </button>
                  )}
                </div>
                <ul className="mt-4 space-y-3">
                  {ADDONS.map((a) => {
                    const n = qty[a.key]
                    const on = n > 0
                    return (
                      <li
                        key={a.key}
                        className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-colors ${
                          on ? 'border-cognac bg-paper' : 'border-line bg-canvas hover:border-line-strong'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-display text-ink" style={{ fontSize: '1.1rem' }}>
                            {a.name}
                          </p>
                          <p className="mt-0.5 font-sans text-label text-ink-45">
                            {a.upper ? `${money(a.price)} to ${money(a.upper)}` : money(a.price)} {a.unit}
                          </p>
                        </div>
                        {!on ? (
                          <button
                            type="button"
                            onClick={() => {
                              step(a.key, 1, a.max)
                              track('addon_add', { addon: a.key })
                            }}
                            aria-label={`Add: ${a.name}`}
                            className="inline-flex flex-none cursor-pointer items-center gap-2 rounded-full border border-ink px-4 py-2 font-sans text-caption font-medium text-ink transition-colors hover:bg-ink hover:text-canvas"
                          >
                            <span aria-hidden="true" className="text-base leading-none">+</span> Add
                          </button>
                        ) : (
                          <div className="flex flex-none items-center gap-3" role="group" aria-label={`${a.name} quantity`}>
                            <button
                              type="button"
                              onClick={() => step(a.key, -1, a.max)}
                              aria-label={n === 1 ? `Remove: ${a.name}` : `Remove one: ${a.name}`}
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:bg-canvas-2"
                            >
                              <span aria-hidden="true">{n === 1 ? '×' : '−'}</span>
                            </button>
                            <span className="w-6 text-center font-display tabular-nums text-ink" style={{ fontSize: '1.15rem' }}>
                              {n}
                            </span>
                            <button
                              type="button"
                              onClick={() => step(a.key, 1, a.max)}
                              disabled={n === a.max}
                              aria-label={`Add one more: ${a.name}`}
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:bg-canvas-2 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <span aria-hidden="true">+</span>
                            </button>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </Reveal>

              <Reveal delay={100}>
                <p className="eyebrow mt-10">3. Choose how you pay</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Billing term">
                  {BILLING.map((b) => {
                    const on = billing === b.key
                    return (
                      <button
                        key={b.key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setBilling(b.key)}
                        className={`cursor-pointer rounded-xl border px-4 py-3.5 text-left transition-colors ${
                          on ? 'border-ink bg-paper' : 'border-line bg-canvas hover:border-line-strong'
                        }`}
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-display text-ink" style={{ fontSize: '1.1rem' }}>{b.label}</span>
                          {b.off > 0 && (
                            <span className="shrink-0 whitespace-nowrap rounded-full bg-cognac/15 px-2 py-0.5 font-sans text-label font-semibold text-cognac-deep">
                              Save {Math.round(b.off * 100)}%
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block font-sans text-label text-ink-60">
                          {b.key === 'monthly' ? 'Billed each month' : `Billed every ${b.every === 'year' ? 'year' : 'three months'}, in advance`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Reveal>

              <Reveal delay={120}>
                <label
                  className={`mt-6 flex cursor-pointer items-start gap-3 rounded-xl border px-5 py-4 transition-colors ${
                    foundingOn ? 'border-cognac bg-paper' : 'border-line bg-canvas hover:border-line-strong'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={foundingOn}
                    onChange={(e) => {
                      setFounding(e.target.checked)
                      // The programme needs a three-month or longer plan, so move off monthly billing.
                      if (e.target.checked && billing === 'monthly') setBilling('quarterly')
                    }}
                    className="mt-1 h-4 w-4 flex-none cursor-pointer accent-[#a85c30]"
                  />
                  <span className="font-sans text-caption leading-relaxed text-ink-80">
                    <span className="font-semibold">Founding Partner Programme.</span>{' '}
                    30% off monthly fees for the first three months.
                  </span>
                </label>
              </Reveal>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <Reveal delay={100}>
                <div className="rounded-2xl bg-night p-8 text-canvas shadow-[0_40px_80px_-40px_rgba(26,23,18,0.55)] lg:sticky lg:top-28">
                  <p className="eyebrow eyebrow-light">Your estimate</p>
                  <dl className="mt-6 space-y-3 font-sans text-caption">
                    {selected && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-canvas/70">{selected.name}</dt>
                        <dd className="tabular-nums text-canvas">{money(selected.price)}</dd>
                      </div>
                    )}
                    {ADDONS.filter((a) => qty[a.key] > 0).map((a) => (
                      <div key={a.key} className="flex justify-between gap-4">
                        <dt className="text-canvas/70">
                          {a.name} × {qty[a.key]}
                          {!a.monthly && ' (one-off)'}
                        </dt>
                        <dd className="tabular-nums text-canvas">{fmt(qty[a.key] * pick(a.price))}</dd>
                      </div>
                    ))}
                  </dl>
                  {!hasAnything && (
                    <p className="mt-6 font-sans text-caption text-canvas/55">Choose a tier or an add-on to see an estimate.</p>
                  )}

                  {hasAnything && (
                    <>
                      <div className="mt-6 border-t border-night-line pt-6">
                        <p className="font-sans text-label uppercase tracking-[0.14em] text-canvas/55">
                          {foundingOn ? 'Then, each month' : 'Monthly'}
                        </p>
                        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
                          <span className="font-display tabular-nums text-canvas" style={{ fontSize: '2.8rem', lineHeight: 1 }}>
                            {fmt(planMonthly)}
                          </span>
                          <span className="font-sans text-caption text-canvas/55">/month</span>
                          {bill.off > 0 && (
                            <span className="font-sans text-caption tabular-nums text-canvas/45 line-through">{fmt(totals.monthly)}</span>
                          )}
                        </p>
                        {totals.oneOff > 0 && (
                          <p className="mt-2 font-sans text-caption text-canvas/65">
                            plus {fmt(totals.oneOff)} one-off, at the lower end of the video range
                          </p>
                        )}
                      </div>
                      <div className="mt-6 border-t border-night-line pt-6">
                        <p className="font-sans text-label uppercase tracking-[0.14em] text-canvas/55">First three months</p>
                        <p className="mt-2 font-display tabular-nums" style={{ fontSize: '1.6rem', color: 'var(--color-cognac-soft)' }}>
                          {fmt(firstQuarter)}
                        </p>
                        {foundingOn && (
                          <p className="mt-1 font-sans text-caption text-canvas/55">
                            Founding rate: {fmt(firstRate)}/month. One-off items are not discounted.
                          </p>
                        )}
                      </div>
                      {billing !== 'monthly' && (
                        <div className="mt-6 border-t border-night-line pt-6">
                          <p className="font-sans text-label uppercase tracking-[0.14em] text-canvas/55">
                            {billing === 'yearly' ? 'Billed yearly' : 'Billed quarterly'}
                          </p>
                          <p className="mt-2 font-display tabular-nums text-canvas" style={{ fontSize: '1.3rem' }}>
                            {fmt(invoice)}
                            <span className="ml-2 font-sans text-caption text-canvas/55">first invoice</span>
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <Link
                    to="/contact"
                    search={{ plan: selected ? selected.key : 'other', note: estimateNote }}
                    onClick={() => track('estimate_request', { tier: selected ? selected.key : 'none', monthly: Math.round(totals.monthly), region })}
                    className="btn btn-light mt-8 w-full justify-center"
                  >
                    Request this proposal
                  </Link>
                  <p className="mt-4 font-sans text-label leading-relaxed text-canvas/45">
                    An estimate, not a quote.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* One-off projects */}
      <section id="extend" className="scroll-mt-24 border-t border-line bg-canvas-2">
        <Container className="py-20 sm:py-24">
          <SectionHead
            eyebrow="One-off projects"
            title="A single document, at a fixed price."
            body="For a team that needs one piece of thinking and will run it themselves."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 50} className="bg-canvas">
                <div className="flex h-full flex-col p-8">
                  <div className="flex items-baseline justify-between gap-6">
                    <h3 className="font-display text-ink" style={{ fontSize: '1.35rem' }}>
                      {p.name}
                    </h3>
                    <p className="font-display tabular-nums text-ink" style={{ fontSize: '1.35rem' }}>
                      {money(p.price)}
                    </p>
                  </div>
                  <p className="mt-3 max-w-md font-sans text-caption leading-relaxed text-ink-60">{p.body}</p>
                  <Link
                    to="/contact"
                    search={{ plan: 'other' }}
                    className="link-line mt-6 inline-block self-start font-sans text-caption text-ink-80"
                  >
                    Ask about this →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Founding Partner Programme */}
      <section className="bg-night text-canvas">
        <Container className="py-20 sm:py-24">
          <div className="grid items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <Reveal>
                <Eyebrow className="eyebrow-light">Founding Partner Programme</Eyebrow>
                <h2 className="text-display-md mt-6 text-canvas">30% off for three months, in return for proof.</h2>
                <p className="mt-6 max-w-2xl font-sans text-body leading-relaxed text-canvas/65">
                  We take a small number of early clients at 30% off list for the
                  first three months, on a quarterly or yearly plan, in place of that plan’s own discount. In return we document the work as a
                  before-and-after case study, with a testimonial from you. The
                  baseline is captured on day one, so the result is checkable.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-4">
              <Reveal delay={100}>
                <div className="flex flex-col gap-4 md:items-end">
                  <Link to="/contact" search={{ plan: 'growth' }} className="btn btn-light">
                    Ask about the programme
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* What happens after you ask */}
      <section className="border-t border-line">
        <Container className="py-20 sm:py-24">
          <SectionHead
            eyebrow="What happens next"
            title="From your first message to day one."
            body="No sales sequence and no surprises. Here is exactly what follows when you get in touch."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {NEXT_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 60} className="bg-canvas">
                <div className="h-full p-7">
                  <span className="font-display text-3xl text-cognac">{s.n}</span>
                  <p className="mt-4 font-display text-ink" style={{ fontSize: '1.2rem' }}>
                    {s.t}
                  </p>
                  <p className="mt-2 font-sans text-caption leading-relaxed text-ink-60">{s.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line">
        <Container width="narrow" className="py-20 sm:py-24">
          <Reveal>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="text-display-md mt-6">Before you choose.</h2>
          </Reveal>
          <div className="mt-12 divide-y divide-line border-y border-line">
            {faq.map((f, i) => (
              <Reveal key={f.q} delay={i * 40}>
                <div className="py-7">
                  <h3 className="font-display text-ink" style={{ fontSize: '1.2rem' }}>
                    {f.q}
                  </h3>
                  <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-night text-canvas">
        <Container width="narrow" className="py-24 text-center sm:py-32">
          <Reveal>
            <Eyebrow className="eyebrow-light inline-flex justify-center">Not sure which fits?</Eyebrow>
            <h2
              className="mt-8 font-display text-canvas"
              style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.08, fontWeight: 300 }}
            >
              Start with the Diagnostic. The rest follows from the evidence.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-body leading-relaxed text-canvas/70">
              Tell us about your company. A senior operator replies with a short,
              honest read, and a proposal only if it is a genuine fit.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/contact" search={{ plan: 'diagnostic' }} className="btn btn-light">
                Book a Diagnostic
              </Link>
              <Link to="/services" className="btn btn-ghost-light">
                See how we work
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
