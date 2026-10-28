import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { PRESETS, SERVICES, SERVICE_BY_ID, TERMS, UMBRELLAS, formatMoney, priceCart, type Currency, type UmbrellaId } from '../lib/catalog'
import { seo, SITE } from '../lib/seo'
import { getPriceRegion, type PriceRegion } from '../server/geo'
import { track } from '../lib/track'

/* ------------------------------------------------------------------ */
/*  Pricing. Rothenhall does not publish a fixed price list: the work   */
/*  changes with the company. This page shows where services start,     */
/*  how the three engagement lengths differ, and how a price is set     */
/*  (after a conversation). The atelier, /engage, is where a brief is   */
/*  shaped.                                                             */
/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: 'Why do you not publish fixed prices?',
    a: 'Because the work is not the same for every company. A site of forty pages in one market is a different job from four hundred pages in six markets. We show where each service starts, then agree the real figure with you on a short call, so you only pay for what you need.',
  },
  {
    q: 'How is the final price decided?',
    a: 'By scope: how many markets, pages, channels and competitors are involved, how much is already in place, and how quickly you want results. A senior operator confirms these with you, then sends a proposal with the services, the deliverables and one clear monthly figure.',
  },
  {
    q: 'How do the three engagements differ?',
    a: 'Only in length, and in how much you save on monthly fees. The work, the team and the standard are identical, so you are choosing how long you want to commit, not a different level of service.',
  },
  {
    q: 'When do I pay?',
    a: 'Not until you have agreed a proposal. After that, the first month is paid to begin and the remaining months are invoiced monthly in advance. Project work is paid half to begin and half on delivery.',
  },
  {
    q: 'What if I am not sure what I need?',
    a: 'Enter your website in the atelier. We read its public pages and suggest services with the reason for each, and you can change any of them. If you would rather talk first, schedule a call and a senior operator will walk you through it.',
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
    a: 'Figures are in US dollars, or euros in Europe, and follow your location. They exclude VAT, GST or sales tax where the law requires us to add it.',
  },
]

const STEPS = [
  { n: '1', t: 'Share what you need', b: 'Choose services, or enter your website and let us suggest them.' },
  { n: '2', t: 'We talk it through', b: 'A short call with a senior operator to confirm scope and priorities.' },
  { n: '3', t: 'You receive a proposal', b: 'Services, deliverables and one clear monthly figure, within one working day of the call.' },
  { n: '4', t: 'We begin from a baseline', b: 'You pay only once you have agreed. Then we measure, fix and report.' },
]

const MOVES = ['How many markets and languages', 'How many pages, products or locations', 'How many rivals and channels matter', 'What is already built, and what is broken', 'How fast you want to see movement']

const INCLUDED = [
  { t: 'A baseline on day one', b: 'Every change is measured against where you started, so results are checkable.' },
  { t: 'Measured on Cailyx', b: 'Five or more runs per prompt, reported as rates, never a single lucky answer.' },
  { t: 'A Fix Plan that proves itself', b: 'Each fix has a test, and counts as done only when it passes on the live site.' },
  { t: 'A weekly report', b: 'What moved, what we shipped and what is next, in plain words.' },
  { t: 'A named senior operator', b: 'One accountable person who knows your business and replies within a working day.' },
]

const offer = (name: string, usd: number, eur: number, monthly: boolean) => ({
  '@type': 'Offer',
  name,
  itemOffered: { '@type': 'Service', name },
  priceSpecification: [
    { '@type': 'PriceSpecification', priceCurrency: 'USD', minPrice: usd, ...(monthly ? { unitText: 'MON' } : {}), eligibleRegion: 'US' },
    { '@type': 'PriceSpecification', priceCurrency: 'EUR', minPrice: eur, ...(monthly ? { unitText: 'MON' } : {}), eligibleRegion: 'Europe' },
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
      title: 'Pricing · Engagements Shaped Around You · Rothenhall Partners',
      description:
        'Rothenhall prices after a conversation, because every company is different. Choose a three, six or twelve month engagement, see where each service starts, and receive a proposal within a working day.',
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

/* ------------------------------- visuals ------------------------------- */

/** The three engagement lengths drawn on one twelve-month axis, with the baseline and the quarterly re-baselines. */
function Timeline() {
  const X0 = 36
  const W = 470
  const mx = (m: number) => X0 + (W / 12) * m
  const rows = [
    { y: 92, m: 3, label: 'Quarterly', color: '#b79a6b' },
    { y: 152, m: 6, label: 'Half-yearly', color: '#c67c48' },
    { y: 212, m: 12, label: 'Annual', color: '#f7f3ea' },
  ]
  return (
    <svg viewBox="0 0 540 290" className="w-full" role="img" aria-label="The three engagement lengths on a twelve-month timeline, each with a baseline at the start and a re-baseline every quarter">
      <text x={X0} y="26" fill="rgba(247,243,234,.55)" fontSize="11" letterSpacing="1.5" fontFamily="var(--font-sans)">MONTH</text>
      {[0, 3, 6, 9, 12].map((m) => (
        <g key={m}>
          <line x1={mx(m)} x2={mx(m)} y1="40" y2="246" stroke="rgba(247,243,234,.14)" strokeDasharray="2 5" />
          <text x={mx(m)} y="30" textAnchor="middle" fill="rgba(247,243,234,.7)" fontSize="12" fontFamily="var(--font-sans)">{m}</text>
        </g>
      ))}
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x={X0} y={r.y - 16} fill="rgba(247,243,234,.85)" fontSize="13" fontFamily="var(--font-display)">{r.label}</text>
          <rect x={X0} y={r.y - 6} width={mx(r.m) - X0} height="12" rx="6" fill={r.color} className="tl-bar" style={{ animationDelay: `${i * 160}ms` }} />
          {Array.from({ length: r.m / 3 }).map((_, k) => (
            <g key={k} className="tl-pop" style={{ animationDelay: `${600 + i * 160 + k * 120}ms` }}>
              <circle cx={mx((k + 1) * 3)} cy={r.y} r="8" fill="#14120d" stroke={r.color} strokeWidth="2" />
              <path d={`M${mx((k + 1) * 3) - 3.2} ${r.y} l2.2 2.4 l4.4 -4.8`} fill="none" stroke={r.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
          <circle cx={X0} cy={r.y} r="6" fill="#fbf9f3" />
        </g>
      ))}
      <g fontFamily="var(--font-sans)" fontSize="11" fill="rgba(247,243,234,.6)">
        <circle cx={X0} cy="268" r="5" fill="#fbf9f3" />
        <text x={X0 + 12} y="272">Baseline on day one</text>
        <circle cx={X0 + 170} cy="268" r="7" fill="#14120d" stroke="#b79a6b" strokeWidth="2" />
        <text x={X0 + 184} y="272">Re-baseline every quarter</text>
      </g>
    </svg>
  )
}

function Ring({ pct }: { pct: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden className="flex-none">
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--color-line)" strokeWidth="6" />
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--color-cognac)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct * 3)} transform="rotate(-90 34 34)" />
      <text x="34" y="39" textAnchor="middle" fontSize="15" fontFamily="var(--font-display)" fill="var(--color-ink)">{Math.round(pct * 100)}%</text>
    </svg>
  )
}

const ICON: Record<UmbrellaId, ReactNode> = {
  brand: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.3 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />,
  seo: (<><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></>),
  aeo: (<><path d="M4 5h16v10H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>),
  geo: (<><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" /></>),
  content: (<><path d="M6 3h9l4 4v14H6z" /><path d="M9 11h7M9 14h7M9 17h5" /></>),
  paid: (<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>),
  social: (<><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 11l7.6-4M8.2 13l7.6 4" /></>),
  leadgen: (<><path d="M3 5h18l-7 8v6l-4-2v-4z" /></>),
  crm: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9l9 6 9-6" /></>),
  web: (<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>),
  pr: (<><path d="M4 14V9l12-5v15L4 14z" /><path d="M7 14l1 5h3l-1-4" /></>),
  analytics: (<><path d="M4 19V5M4 19h16" /><path d="M8 15l3-4 3 2 5-6" /></>),
  growth: (<><path d="M4 18l6-6 4 4 6-8" /><path d="M15 8h5v5" /></>),
}

function Plus() {
  return (
    <span aria-hidden className="relative grid size-7 flex-none place-items-center rounded-full border border-line-strong transition-colors group-open:border-ink group-open:bg-ink group-open:text-canvas">
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-open:rotate-45">
        <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  )
}

/* --------------------------------- page --------------------------------- */

function Pricing() {
  const geo = Route.useLoaderData()
  const [region, setRegion] = useState<PriceRegion>(geo.region)
  useEffect(() => {
    if (geo.detected) return
    const g = guessRegion()
    if (g) setRegion(g)
  }, [geo.detected])
  const currency: Currency = region === 'EU' ? 'EUR' : 'USD'
  const fmt = (n: number) => formatMoney(n, currency)

  const lowest = (list: typeof SERVICES) => Math.min(...list.map((s) => (currency === 'EUR' ? s.price.eur : s.price.usd)))
  const presetPrice = (ids: string[], term: (typeof TERMS)[number]['key']) => {
    const cart: Record<string, number> = {}
    for (const id of ids) cart[id] = 1
    return priceCart(cart, term, currency)
  }
  const termPreset: Record<string, string> = { quarterly: 'visibility-sprint', 'half-yearly': 'content-engine', annual: 'growth-system' }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(#f7f3ea 1px, transparent 1px), linear-gradient(90deg, #f7f3ea 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        <Container className="relative pt-24 pb-20 sm:pt-32 sm:pb-24">
          <div className="grid items-center gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <Eyebrow className="eyebrow-light">Pricing</Eyebrow>
                <h1 className="mt-8 font-display" style={{ fontSize: 'clamp(2.5rem, 5.6vw, 4.6rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.02 }}>
                  Priced after we talk. <span style={{ color: 'var(--color-cognac-soft)' }}>Shaped around you.</span>
                </h1>
                <p className="mt-7 max-w-xl font-sans text-body-lg leading-relaxed text-canvas/70">
                  Every company needs a different mix of work, so we do not print a fixed price list. Choose how long we work together, see where each service starts, and a senior operator agrees the real figure with you.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a href="#engagements" className="btn btn-light">Choose your length</a>
                  <Link to="/contact" search={{ plan: 'other' }} onClick={() => track('call_request', { where: 'pricing_hero' })} className="btn btn-ghost-light">Talk to an operator</Link>
                </div>
                <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2 font-sans text-label text-canvas/55">
                  {['A proposal within one working day', 'No promised rankings', 'US dollars or euros'].map((t) => (
                    <li key={t} className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-brass-soft" />{t}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal delay={120}>
                <div className="rounded-3xl border border-night-line bg-night-2 p-6 shadow-[0_50px_100px_-50px_rgba(0,0,0,0.8)] sm:p-8">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="eyebrow eyebrow-light">Three lengths, one standard</p>
                    <p className="font-sans text-label text-canvas/45">Same team and services</p>
                  </div>
                  <div className="mt-4"><Timeline /></div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* How pricing works */}
      <section className="border-b border-line">
        <Container className="py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <Eyebrow>How pricing works</Eyebrow>
                <h2 className="text-display-md mt-6">A conversation first. A figure second.</h2>
                <p className="mt-5 font-sans text-body leading-relaxed text-ink-60">
                  The figures on this page are starting points: where each service begins for a straightforward company. Your price moves with the things below, which is why we confirm them with you before quoting.
                </p>
                <ul className="mt-6 space-y-3">
                  {MOVES.map((m) => (
                    <li key={m} className="flex items-start gap-3 font-sans text-caption text-ink-80">
                      <span aria-hidden className="mt-[0.5em] size-1.5 flex-none rounded-full bg-cognac" />
                      {m}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <ol className="relative">
                <span aria-hidden className="absolute bottom-6 left-[1.1rem] top-6 w-px bg-line-strong" />
                {STEPS.map((s, i) => (
                  <Reveal key={s.n} delay={i * 70}>
                    <li className="relative flex gap-5 py-5">
                      <span className="relative z-10 grid size-9 flex-none place-items-center rounded-full border border-ink bg-canvas font-display text-ink">{s.n}</span>
                      <span>
                        <span className="block font-display text-ink" style={{ fontSize: '1.3rem' }}>{s.t}</span>
                        <span className="mt-1 block font-sans text-body leading-relaxed text-ink-60">{s.b}</span>
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* The three engagements */}
      <section id="engagements" className="scroll-mt-24">
        <Container className="py-20 sm:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Step one</Eyebrow>
              <h2 className="text-display-md mt-6">Three lengths. Choose one.</h2>
              <p className="text-lead mt-5 text-ink-60">The longer you commit, the more you save on every monthly fee, and the more measured cycles you see. Nothing else changes.</p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TERMS.map((t, i) => {
              const preset = PRESETS.find((p) => p.id === termPreset[t.key])!
              const p = presetPrice(preset.ids, t.key)
              return (
                <Reveal key={t.key} delay={i * 80} className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brass hover:shadow-[0_34px_70px_-44px_rgba(26,23,18,0.5)]">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-brass/70" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="eyebrow">{t.tag}</p>
                        <p className="mt-5 flex items-baseline gap-2">
                          <span className="font-display tabular-nums text-ink" style={{ fontSize: '4.2rem', lineHeight: 0.9, letterSpacing: '-0.03em' }}>{t.months}</span>
                          <span className="font-display text-ink-60" style={{ fontSize: '1.3rem' }}>months</span>
                        </p>
                      </div>
                      <Ring pct={t.off} />
                    </div>
                    <h3 className="mt-6 font-display text-ink" style={{ fontSize: '1.6rem' }}>{t.label} engagement</h3>
                    <p className="mt-2 font-sans text-body leading-relaxed text-ink-60">{t.line}</p>
                    <ul className="mt-6 space-y-2.5 border-t border-line pt-5 font-sans text-caption text-ink-80">
                      <li className="flex gap-3"><span aria-hidden className="mt-[0.5em] size-1.5 flex-none rounded-full bg-brass" />{Math.round(t.off * 100)}% off every monthly fee</li>
                      <li className="flex gap-3"><span aria-hidden className="mt-[0.5em] size-1.5 flex-none rounded-full bg-brass" />{t.months / 3} quarterly re-baseline{t.months > 3 ? 's' : ''} of your AI visibility</li>
                      <li className="flex gap-3"><span aria-hidden className="mt-[0.5em] size-1.5 flex-none rounded-full bg-brass" />Every service in the catalogue, nothing held back</li>
                    </ul>
                    <div className="mt-6 rounded-xl bg-canvas-2 px-4 py-3">
                      <p className="font-sans text-label text-ink-60">Engagements like “{preset.name}” start from</p>
                      <p className="mt-1 font-display tabular-nums text-ink" style={{ fontSize: '1.6rem', lineHeight: 1.1 }}>
                        {fmt(p.monthly)}
                        <span className="ml-1.5 font-sans text-caption text-ink-60">a month</span>
                      </p>
                    </div>
                    <div className="mt-auto pt-7">
                      <Link to="/engage" search={{ term: t.key }} onClick={() => track('term_choose', { term: t.key })} className="btn btn-primary w-full justify-center">
                        Shape a {t.label.toLowerCase()} engagement →
                      </Link>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={100}>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-paper">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <caption className="sr-only">The three engagement lengths compared</caption>
                <thead>
                  <tr className="bg-canvas-2">
                    <th scope="col" className="p-4 font-sans text-label uppercase tracking-[0.14em] text-ink-45">Compared</th>
                    {TERMS.map((t) => (
                      <th key={t.key} scope="col" className="p-4 font-display text-ink" style={{ fontSize: '1.05rem', fontWeight: 400 }}>{t.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-sans text-caption text-ink-80">
                  {[
                    ['Commitment', (t: (typeof TERMS)[number]) => `${t.months} months`],
                    ['Saving on monthly fees', (t: (typeof TERMS)[number]) => `${Math.round(t.off * 100)}%`],
                    ['Quarterly re-baselines', (t: (typeof TERMS)[number]) => String(t.months / 3)],
                    ['Services available', () => 'All of them'],
                    ['Team and standard', () => 'Identical'],
                    ['After the term', () => '30 days written notice'],
                  ].map(([label, f]) => (
                    <tr key={label as string} className="border-t border-line">
                      <th scope="row" className="p-4 text-left font-normal text-ink-60">{label as string}</th>
                      {TERMS.map((t) => (
                        <td key={t.key} className="p-4">{(f as (t: (typeof TERMS)[number]) => string)(t)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 font-sans text-label leading-relaxed text-ink-45">
              {geo.detected ? `Figures in ${currency}, based on your location.` : `Figures in ${currency}.`} They are starting points, not quotes, and exclude VAT, GST or sales tax where it applies.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Common starting points */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-20 sm:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Common starting points</Eyebrow>
              <h2 className="text-display-md mt-6">Where companies often begin.</h2>
              <p className="text-lead mt-5 text-ink-60">Examples, not packages. Start from one, add or remove anything, and we shape it with you on the call.</p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PRESETS.map((pr, i) => {
              const p = presetPrice(pr.ids, pr.term)
              const t = TERMS.find((x) => x.key === pr.term)!
              return (
                <Reveal key={pr.id} delay={(i % 2) * 80} className="h-full">
                  <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-7 transition-shadow duration-300 hover:shadow-[0_30px_60px_-44px_rgba(26,23,18,0.45)]">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-ink" style={{ fontSize: '1.5rem', lineHeight: 1.15 }}>{pr.name}</h3>
                      <span className="flex-none rounded-full border border-line-strong px-3 py-1 font-sans text-label text-ink-60">{t.months} months</span>
                    </div>
                    <p className="mt-2 font-sans text-caption leading-relaxed text-ink-60">{pr.who}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {pr.ids.map((id) => (
                        <li key={id} className="rounded-full bg-canvas-2 px-3 py-1 font-sans text-label text-ink-80">{SERVICE_BY_ID.get(id)!.name}</li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
                      <div>
                        <p className="font-sans text-label text-ink-45">Starts from</p>
                        <p className="font-display tabular-nums text-ink" style={{ fontSize: '1.7rem', lineHeight: 1.1 }}>
                          {fmt(p.monthly)}<span className="ml-1.5 font-sans text-caption text-ink-60">a month</span>
                          {p.oneOff > 0 && <span className="ml-2 font-sans text-caption text-ink-60">plus {fmt(p.oneOff)} of projects</span>}
                        </p>
                      </div>
                      <Link to="/engage" search={{ term: pr.term, start: pr.id }} onClick={() => track('term_choose', { term: pr.term, preset: pr.id })} className="link-line font-sans text-body text-ink">
                        Start from this →
                      </Link>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Included in every engagement */}
      <section className="border-t border-night-line bg-night text-canvas">
        <Container className="py-20 sm:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow className="eyebrow-light">In every engagement</Eyebrow>
              <h2 className="text-display-md mt-6 text-canvas">What you always get.</h2>
              <p className="text-lead mt-5 text-canvas/65">Whatever services you choose, these come with the work.</p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line sm:grid-cols-2 lg:grid-cols-5">
            {INCLUDED.map((x, i) => (
              <Reveal key={x.t} delay={i * 60} className="bg-night">
                <div className="flex h-full flex-col p-6">
                  <span className="font-display text-brass-soft" style={{ fontSize: '1.1rem' }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 font-display text-canvas" style={{ fontSize: '1.15rem', lineHeight: 1.2 }}>{x.t}</h3>
                  <p className="mt-2 font-sans text-caption leading-relaxed text-canvas/55">{x.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The catalogue */}
      <section className="border-t border-line">
        <Container className="py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <Reveal>
                <Eyebrow>Step two</Eyebrow>
                <h2 className="text-display-md mt-6">Then curate what you need.</h2>
                <p className="text-lead mt-5 text-ink-60">
                  {UMBRELLAS.length} disciplines and {SERVICES.length} services. Each shows where it starts.
                </p>
              </Reveal>
            </div>
            <Reveal delay={80}>
              <Link to="/engage" search={{ term: 'quarterly' }} className="btn btn-ghost">Open the atelier →</Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UMBRELLAS.map((u, i) => {
              const list = SERVICES.filter((s) => s.umbrella === u.id)
              return (
                <Reveal key={u.id} delay={(i % 3) * 60} className="h-full">
                  <div className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/50">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-ink text-canvas transition-colors group-hover:bg-cognac">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICON[u.id]}</svg>
                      </span>
                      <span className="font-display text-ink-45" style={{ fontSize: '1rem' }}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="mt-5 font-display text-ink" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>{u.name}</h3>
                    <p className="mt-2 font-sans text-caption leading-relaxed text-ink-60">{u.tagline}</p>
                    <ul className="mt-4 space-y-1.5 font-sans text-label text-ink-80">
                      {list.slice(0, 3).map((s) => (
                        <li key={s.id} className="flex gap-2"><span aria-hidden className="mt-[0.55em] size-1 flex-none rounded-full bg-brass" />{s.name}</li>
                      ))}
                      {list.length > 3 && <li className="text-ink-45">and {list.length - 3} more</li>}
                    </ul>
                    <p className="mt-auto pt-5 font-sans text-label text-ink-60">Starts from <span className="font-semibold text-ink">{fmt(lowest(list))}</span></p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Founding Partner */}
      <section className="border-t border-night-line bg-night text-canvas">
        <Container className="py-16 sm:py-20">
          <div className="grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <Reveal>
                <Eyebrow className="eyebrow-light">Founding Partner Programme</Eyebrow>
                <h2 className="mt-5 font-display text-canvas" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.5rem)', lineHeight: 1.08 }}>30% off for three months, in return for proof.</h2>
                <p className="mt-4 max-w-2xl font-sans text-body leading-relaxed text-canvas/65">
                  A small number of early clients receive 30% off their monthly fees for the first three months, in place of the engagement-length discount for that period. In return we document the work as a before-and-after case study, with a testimonial from you.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Reveal delay={100}>
                <Link to="/contact" search={{ plan: 'other', note: 'I would like to ask about the Founding Partner Programme.' }} className="btn btn-light">Ask about the programme</Link>
              </Reveal>
            </div>
          </div>
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
                <p className="mt-5 font-sans text-body leading-relaxed text-ink-60">
                  Something not here? <Link to="/contact" className="link-line text-ink">Ask a senior operator</Link>.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <div className="divide-y divide-line border-y border-line">
                {FAQ.map((f, i) => (
                  <Reveal key={f.q} delay={i * 25}>
                    <details className="group py-6">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                        <span className="font-display text-ink" style={{ fontSize: '1.25rem', lineHeight: 1.25 }}>{f.q}</span>
                        <Plus />
                      </summary>
                      <p className="mt-4 max-w-2xl font-sans text-body leading-relaxed text-ink-60">{f.a}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
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
              Choose a length, enter your address in the atelier, and we suggest the services that fit, with a reason for each. A senior operator then confirms the price with you.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href="#engagements" className="btn btn-light">Choose your length</a>
              <Link to="/contact" search={{ plan: 'other' }} className="btn btn-ghost-light">Schedule a call</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
