import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo, SITE } from '../lib/seo'
import { startCheckout } from '../lib/razorpay'

export const Route = createFileRoute('/pricing')({
  head: () =>
    seo({
      path: '/pricing',
      title: 'Cailyx Pricing · AI Visibility Tracking That Also Fixes It · Rothenhall Partners',
      description:
        'Cailyx pricing starts at $69/month. Track your AI visibility across ChatGPT, Claude, Perplexity, and Google, and let agentic workflows build the entities and citations that move it. Founding pricing available.',
      keywords:
        'Cailyx pricing, AI visibility tool pricing, AEO software pricing, answer engine optimization platform, Profound alternative, AI search tracking cost',
    }),
  component: Pricing,
})

type Tier = {
  name: string
  monthly?: number
  annual?: number
  custom?: boolean
  tagline: string
  cta: string
  popular?: boolean
  features: string[]
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    monthly: 89,
    annual: 69,
    tagline: 'For a founder tracking one brand.',
    cta: 'Start with Starter',
    features: [
      '1 brand, 1 project',
      '100 tracked prompts',
      'ChatGPT and Google AI Overviews',
      '1 seat',
      'Weekly refresh',
      'Citation share, mentions and sentiment',
      'Email alerts on major changes',
    ],
  },
  {
    name: 'Growth',
    monthly: 249,
    annual: 199,
    popular: true,
    tagline: 'For a team that owns AI visibility.',
    cta: 'Start with Growth',
    features: [
      '3 brands or projects',
      '300 tracked prompts',
      'All 5 engines: ChatGPT, Claude, Perplexity, Google AI, Gemini',
      '5 seats',
      'Daily refresh',
      'Competitor share of voice',
      'Entity and schema monitoring',
      'Agentic fixes: Cailyx builds the entities and citations',
      'Slack and email alerts, weekly report',
    ],
  },
  {
    name: 'Scale',
    monthly: 599,
    annual: 499,
    tagline: 'For agencies and multi-brand portfolios.',
    cta: 'Start with Scale',
    features: [
      '10 brands or projects',
      '1,000 tracked prompts',
      'All engines, plus multi-geography',
      '15 seats',
      'API access and the Cailyx MCP',
      'Priority agentic runs',
      'Quarterly re-baseline',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    custom: true,
    tagline: 'For portfolios and regulated teams.',
    cta: 'Talk to us',
    features: [
      'Unlimited brands, prompts and seats',
      'SSO and SAML, security review, DPA',
      'Custom query sets built by an operator',
      'Done-with-you remediation',
      'Dedicated success and an SLA',
    ],
  },
]

const COMPARE: { label: string; vals: string[] }[] = [
  { label: 'Brands / projects', vals: ['1', '3', '10', 'Unlimited'] },
  { label: 'Tracked prompts', vals: ['100', '300', '1,000', 'Unlimited'] },
  { label: 'AI engines', vals: ['2', 'All 5', 'All 5', 'All 5'] },
  { label: 'Seats', vals: ['1', '5', '15', 'Unlimited'] },
  { label: 'Refresh', vals: ['Weekly', 'Daily', 'Daily', 'Real time'] },
  { label: 'Competitor share of voice', vals: ['—', 'Yes', 'Yes', 'Yes'] },
  { label: 'Entity & schema monitoring', vals: ['—', 'Yes', 'Yes', 'Yes'] },
  { label: 'Agentic fixes (builds, not just tracks)', vals: ['—', 'Yes', 'Priority', 'Done-with-you'] },
  { label: 'Multi-geography', vals: ['—', '—', 'Yes', 'Yes'] },
  { label: 'API access + Cailyx MCP', vals: ['—', '—', 'Yes', 'Yes'] },
  { label: 'Support', vals: ['Email', 'Email + Slack', 'Priority', 'Dedicated + SLA'] },
]

const FAQ = [
  {
    q: 'How is Cailyx different from an AI-visibility tracker?',
    a: 'Most tools stop at a dashboard: they tell you your score and leave the work to you. Cailyx is agentic. It maps how the models see you, then builds the entities, structured content, and citations that actually move the number. You are paying for the fix, not just the finding.',
  },
  {
    q: 'What counts as a tracked prompt?',
    a: 'One buyer question we run on a schedule across your enabled engines, at five or more runs each so the result is a rate, not a single screenshot. You choose the prompts, and you own the set.',
  },
  {
    q: 'Which engines do you cover?',
    a: 'ChatGPT and Google AI Overviews on Starter. Growth and above add Claude, Perplexity, Google AI Mode, and Gemini. Enterprise can add surfaces on request.',
  },
  {
    q: 'Is there a free way to start?',
    a: 'Yes. Get a free AI Visibility Score first: we run the diagnostic on your public footprint and return the score plus the specific reasons behind it, no card required.',
  },
  {
    q: 'Can I change plans or cancel?',
    a: 'Change tiers any time, up or down, from inside the app. Annual plans are billed yearly; monthly plans cancel at the end of the month. No lock-in beyond the term you choose.',
  },
  {
    q: 'Do you also do it for us?',
    a: 'Yes. Enterprise includes done-with-you remediation run by a Rothenhall operator, and any plan can add a fixed-fee sprint. Cailyx is the engine; the operator is optional.',
  },
]

function priceOf(t: Tier, annual: boolean) {
  if (t.custom) return null
  return annual ? t.annual! : t.monthly!
}

function Pricing() {
  const [annual, setAnnual] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function pay(t: Tier) {
    if (t.custom || t.annual == null || t.monthly == null) return
    // Charged in INR against the Razorpay test account. Set real amounts and
    // currency for production.
    const price = annual ? t.annual * 12 : t.monthly
    setNotice(null)
    setBusy(t.name)
    void startCheckout({
      amount: price * 100, // paise
      currency: 'INR',
      receipt: `cailyx_${t.name.toLowerCase()}_${annual ? 'yr' : 'mo'}`,
      notes: { plan: t.name, billing: annual ? 'annual' : 'monthly' },
      name: 'Cailyx by Rothenhall',
      description: `Cailyx ${t.name}, ${annual ? 'annual' : 'monthly'}`,
      onSuccess: () => {
        setBusy(null)
        setNotice({
          type: 'success',
          text: `Payment received for Cailyx ${t.name}. This is Razorpay test mode.`,
        })
      },
      onError: (message) => {
        setBusy(null)
        setNotice({ type: 'error', text: message })
      },
      onDismiss: () => setBusy(null),
    })
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cailyx',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'AI-native, agentic engine for answer-engine optimization (AEO) and SEO by Rothenhall Partners. Tracks AI visibility across ChatGPT, Claude, Perplexity and Google, and builds the entities and citations that move it.',
    creator: { '@id': `${SITE.url}/#organization` },
    url: `${SITE.url}/pricing`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '69',
      highPrice: '499',
      offerCount: '4',
    },
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="pt-20 pb-14 sm:pt-28 sm:pb-16">
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Reveal>
                <Eyebrow>Cailyx pricing</Eyebrow>
                <h1 className="text-display-lg mt-8 max-w-3xl">
                  A tracker tells you the score.{' '}
                  <span style={{ color: 'var(--color-cognac)' }}>
                    Cailyx moves it.
                  </span>
                </h1>
              </Reveal>
            </div>
            <div className="md:col-span-4">
              <Reveal delay={100}>
                <p className="font-sans text-[1.05rem] leading-relaxed text-ink-60">
                  Track your AI visibility across every major answer engine, then
                  let agentic workflows build what the models reward. Founding
                  pricing, from $69 a month.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Billing toggle */}
          <Reveal delay={160}>
            <div className="mt-12 flex items-center gap-4">
              <div
                className="inline-flex items-center rounded-full border border-line-strong bg-paper p-1"
                role="group"
                aria-label="Billing period"
              >
                <button
                  type="button"
                  onClick={() => setAnnual(true)}
                  aria-pressed={annual}
                  className={`rounded-full px-4 py-2 font-sans text-[0.85rem] font-medium transition-colors ${
                    annual ? 'bg-ink text-canvas' : 'text-ink-60 hover:text-ink'
                  }`}
                >
                  Annual
                </button>
                <button
                  type="button"
                  onClick={() => setAnnual(false)}
                  aria-pressed={!annual}
                  className={`rounded-full px-4 py-2 font-sans text-[0.85rem] font-medium transition-colors ${
                    !annual ? 'bg-ink text-canvas' : 'text-ink-60 hover:text-ink'
                  }`}
                >
                  Monthly
                </button>
              </div>
              <span className="font-sans text-[0.82rem] text-cognac-deep">
                Save ~20% with annual billing
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Tiers */}
      <section>
        <Container className="py-16 sm:py-20">
          <div className="grid gap-6 lg:grid-cols-4">
            {TIERS.map((t, i) => {
              const price = priceOf(t, annual)
              const highlight = t.popular
              return (
                <Reveal key={t.name} delay={i * 70}>
                  <div
                    className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                      highlight
                        ? 'border-transparent bg-night text-canvas shadow-[0_40px_80px_-40px_rgba(26,23,18,0.55)]'
                        : 'border-line bg-canvas'
                    }`}
                  >
                    {highlight && (
                      <span className="absolute -top-3 left-7 rounded-full bg-cognac px-3 py-1 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-canvas">
                        Most popular
                      </span>
                    )}
                    <h2
                      className={`font-display ${highlight ? 'text-canvas' : 'text-ink'}`}
                      style={{ fontSize: '1.5rem' }}
                    >
                      {t.name}
                    </h2>
                    <p
                      className={`mt-2 font-sans text-[0.9rem] leading-snug ${
                        highlight ? 'text-canvas/70' : 'text-ink-60'
                      }`}
                    >
                      {t.tagline}
                    </p>

                    <div className="mt-6 min-h-[4.5rem]">
                      {price === null ? (
                        <p
                          className={`font-display ${highlight ? 'text-canvas' : 'text-ink'}`}
                          style={{ fontSize: '2.4rem', lineHeight: 1 }}
                        >
                          Custom
                        </p>
                      ) : (
                        <>
                          <p className="flex items-baseline gap-1">
                            <span
                              className={`font-display tabular-nums ${
                                highlight ? 'text-canvas' : 'text-ink'
                              }`}
                              style={{ fontSize: '2.9rem', lineHeight: 1 }}
                            >
                              ${price}
                            </span>
                            <span
                              className={`font-sans text-[0.9rem] ${
                                highlight ? 'text-canvas/60' : 'text-ink-45'
                              }`}
                            >
                              /mo
                            </span>
                          </p>
                          <p
                            className={`mt-2 font-sans text-[0.78rem] ${
                              highlight ? 'text-canvas/55' : 'text-ink-45'
                            }`}
                          >
                            {annual
                              ? `billed annually ($${price * 12}/yr)`
                              : 'billed monthly'}
                          </p>
                        </>
                      )}
                    </div>

                    {t.custom ? (
                      <Link
                        to="/contact"
                        className="btn mt-2 w-full justify-center btn-ghost"
                      >
                        {t.cta}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => pay(t)}
                        disabled={busy === t.name}
                        className={`btn mt-2 w-full justify-center disabled:opacity-60 ${
                          highlight ? 'btn-light' : 'btn-primary'
                        }`}
                      >
                        {busy === t.name ? 'Starting…' : t.cta}
                      </button>
                    )}

                    <ul className="mt-7 space-y-3">
                      {t.features.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`mt-1 flex-none ${highlight ? 'text-cognac-soft' : 'text-cognac'}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path
                                d="M11.5 3.5 5.5 10 2.5 7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            className={`font-sans text-[0.88rem] leading-snug ${
                              highlight ? 'text-canvas/85' : 'text-ink-80'
                            }`}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal>
            <p className="mt-8 text-center font-sans text-[0.85rem] text-ink-45">
              Founding pricing, locked for early customers. Cancel any time. Prices in USD.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Free on-ramp */}
      <section className="border-t border-line bg-canvas-2">
        <Container width="narrow" className="py-16 text-center">
          <Reveal>
            <p className="font-display text-ink" style={{ fontSize: 'clamp(1.4rem,2.6vw,2rem)', lineHeight: 1.25 }}>
              Not sure where you stand yet?
            </p>
            <p className="mx-auto mt-4 max-w-lg font-sans text-[1.02rem] leading-relaxed text-ink-60">
              Start with a free AI Visibility Score. We run the diagnostic on your
              public footprint and hand you the number and the reasons behind it, no
              card required.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link to="/ai-visibility-score" className="btn btn-ghost">
                See the framework
              </Link>
              <Link to="/contact" className="btn btn-primary">
                Get your free score
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="border-t border-line">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Compare plans</Eyebrow>
              <h2 className="text-display-md mt-6">Every plan, side by side.</h2>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <div className="mt-12 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full border-collapse text-left" style={{ minWidth: '46rem' }}>
                <thead>
                  <tr className="bg-canvas-2">
                    <th className="p-5 font-sans text-[0.72rem] uppercase tracking-[0.14em] text-ink-45">
                      Feature
                    </th>
                    {TIERS.map((t) => (
                      <th
                        key={t.name}
                        className="p-5 font-display text-ink"
                        style={{ fontSize: '1.05rem' }}
                      >
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line">
                    <td className="p-5 font-sans text-[0.9rem] text-ink-60">Price</td>
                    {TIERS.map((t) => {
                      const p = priceOf(t, annual)
                      return (
                        <td key={t.name} className="p-5 font-display text-ink" style={{ fontSize: '1.05rem' }}>
                          {p === null ? 'Custom' : `$${p}/mo`}
                        </td>
                      )
                    })}
                  </tr>
                  {COMPARE.map((row) => (
                    <tr key={row.label} className="border-t border-line">
                      <td className="p-5 font-sans text-[0.9rem] text-ink-60">{row.label}</td>
                      {row.vals.map((v, i) => (
                        <td
                          key={i}
                          className={`p-5 font-sans text-[0.92rem] ${
                            v === '—' ? 'text-ink-45' : 'text-ink-80'
                          }`}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-canvas-2">
        <Container width="narrow" className="py-24 sm:py-32">
          <Reveal>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="text-display-md mt-6">Before you pick a plan.</h2>
          </Reveal>
          <div className="mt-12 divide-y divide-line border-y border-line">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 40}>
                <div className="py-7">
                  <h3 className="font-display text-ink" style={{ fontSize: '1.2rem' }}>
                    {f.q}
                  </h3>
                  <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                    {f.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-night text-canvas">
        <Container width="narrow" className="py-24 sm:py-32 text-center">
          <Reveal>
            <Eyebrow className="eyebrow-light justify-center inline-flex">
              Founding cohort
            </Eyebrow>
            <h2 className="mt-8 font-display text-canvas" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.08, fontWeight: 300 }}>
              Lock founding pricing before the seats fill.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/70">
              Early customers keep their rate for the life of the account and shape
              what we build next. Start with the free score, or talk to us about the
              plan that fits.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-light">
                Get started
              </Link>
              <a href="/cailyx#waitlist" className="btn btn-ghost-light">
                Join the Cailyx waitlist
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {notice && (
        <button
          type="button"
          onClick={() => setNotice(null)}
          role="status"
          className="fixed inset-x-4 bottom-6 z-50 mx-auto block w-fit max-w-[92vw] rounded-full border px-5 py-3 text-center font-sans text-[0.9rem] shadow-[0_20px_50px_-20px_rgba(26,23,18,0.5)]"
          style={
            notice.type === 'success'
              ? { background: 'var(--color-night)', color: '#f7f3ea', borderColor: 'transparent' }
              : {
                  background: 'var(--color-paper)',
                  color: 'var(--color-cognac-deep)',
                  borderColor: 'var(--color-line-strong)',
                }
          }
        >
          {notice.text}
        </button>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  )
}
