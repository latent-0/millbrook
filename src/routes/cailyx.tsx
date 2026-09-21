import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo, SITE } from '../lib/seo'
import { joinWaitlist, type WaitlistInput, SOURCE_OPTIONS } from '../server/inquiry'

const CAPABILITIES = [
  {
    n: '01',
    title: 'Make sure the AI can reach you',
    body: 'Cailyx fetches your site the way crawlers do, probes robots.txt and the CDN with real AI user-agents, and flags the silent blocks and JavaScript-render walls that turn an assistant away before it reads a word.',
  },
  {
    n: '02',
    title: 'Give models a name they can resolve',
    body: 'It audits your structured data, checks your entity across the web, and disambiguates you from a same-named company, so an assistant knows it is reading you and not your rival.',
  },
  {
    n: '03',
    title: 'Measure how you show up, as a rate',
    body: 'Against a query set you own, Cailyx runs each prompt across the answer engines five or more times and reports your mention rate, citation rate, and share of voice. A distribution, not one lucky answer.',
  },
  {
    n: '04',
    title: 'Show the shortlist you are missing',
    body: 'It names the competitors the models recommend in your category and where they beat you, so you know exactly which answers and which lists to win.',
  },
  {
    n: '05',
    title: 'Build the fix, not just the finding',
    body: 'Agentic workflows draft the answer-shaped content, the internal and third-party links, and the structured entities that raise citation share. A Rothenhall operator reviews and ships it, so the work gets done.',
  },
  {
    n: '06',
    title: 'Simulate the buyer before the buyer does',
    body: 'Cailyx runs synthetic personas through realistic journeys, and a panel of review agents stress-tests the plan, so you find the gaps in the answer before a customer does.',
  },
  {
    n: '07',
    title: 'Track the score over time and alert you',
    body: 'Your AI Visibility Score, its five dimensions, and your share of voice sit on a monitored trend. When it moves, up or down, Cailyx tells you.',
  },
]

const PIPELINE = [
  { n: '1', title: 'Intake', body: 'You set the category, the competitors, and the buyer questions that matter.' },
  { n: '2', title: 'Measure', body: 'Cailyx samples every engine, repeatedly, and records how you are described, cited, and ranked.' },
  { n: '3', title: 'Diagnose', body: 'The evidence rolls into an AI Visibility Score and the reproducible reasons behind it.' },
  { n: '4', title: 'Build', body: 'Agents and your operator produce the fixes: schema, content, citations, links.' },
  { n: '5', title: 'Watch', body: 'Cailyx monitors the shift, so growth stays provable and nothing quietly regresses.' },
]

const STANDARDS = [
  ['Prompts run in the markets you serve', 'AI answers vary by location, not a global default.'],
  ['A named, versioned query set that you own', 'Not a preset list chosen for you.'],
  ['Distributions and share of voice, never a claimed rank', 'There is no “first” in a synthesized answer.'],
  ['Every score traces to the runs and checks', 'Evidence-linked, reproducible, auditable.'],
  ['Probabilistic honesty', 'Cailyx reports likelihood, not promises.'],
]

const GUARDRAILS = [
  {
    q: 'Can you get us to rank first in ChatGPT?',
    a: 'There is no “first” in a synthesized answer. We move the rate at which you are named and cited, and we show you the evidence.',
  },
  {
    q: 'Do you just hand us a report?',
    a: 'No. The agents and your operator build the fixes, and you keep a workspace to see them and act.',
  },
  {
    q: 'Is this a login we sign up for ourselves?',
    a: 'Not anonymous. Rothenhall sets up your workspace on onboarding and runs the deeper work behind the scenes.',
  },
  {
    q: 'A Cailyx MCP for our own AI stack?',
    a: 'On the roadmap. Join the list below to be first when it opens.',
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Cailyx',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  image: `${SITE.url}/og-image.jpg`,
  description:
    'AI-native, agentic engine for answer engine optimization (AEO) and SEO, built by Rothenhall Partners. Measures how AI answer engines describe and cite a company, builds the entities, content, and citations that move that view, and tracks the result as a rate. In use across every Rothenhall engagement; client access is granted on onboarding, and a Cailyx MCP is on the roadmap.',
  featureList: CAPABILITIES.map((c) => c.title),
  creator: { '@id': `${SITE.url}/#organization` },
  publisher: { '@id': `${SITE.url}/#organization` },
  url: `${SITE.url}/cailyx`,
}

export const Route = createFileRoute('/cailyx')({
  head: () => ({
    ...seo({
      path: '/cailyx',
      title: 'Cailyx · AI Visibility & AEO/SEO Engine · Rothenhall Partners',
      description:
        'Cailyx, Rothenhall’s agentic AEO and SEO engine, measures how AI sees you and builds the fixes that move your AI Visibility Score. Rates, not ranks.',
    }),
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(schema) }],
  }),
  component: Cailyx,
})

function Cailyx() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-canvas">
        <img
          src="/brand/griffin.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 hidden w-[34rem] select-none md:block"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.05 }}
        />
        <Container className="relative pt-24 pb-20 sm:pt-32 sm:pb-28">
          <Reveal>
            <Eyebrow className="eyebrow-light">Cailyx · Our engine</Eyebrow>
            <h1
              className="mt-8 max-w-4xl font-display"
              style={{ fontSize: 'clamp(2.6rem, 6.4vw, 5.4rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.02 }}
            >
              Know how AI recommends you.{' '}
              <span style={{ color: 'var(--color-cognac-soft)' }}>Then change it.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-lead mt-8 max-w-2xl text-canvas/70">
              Cailyx is the engine Rothenhall runs every engagement on. It measures
              how AI answer engines see your brand across the queries buyers actually
              ask, builds the entities, content, and citations that move that view,
              and reports the result as a rate you can track, never a rank.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="btn btn-light">
                Request access
              </Link>
              <Link to="/pricing" className="btn btn-ghost-light">
                See pricing
              </Link>
            </div>
            <p className="mt-4 font-sans text-caption text-canvas/45">
              Access is set up by Rothenhall with your workspace, on onboarding. No
              card on this page.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Problem */}
      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <Eyebrow>The problem</Eyebrow>
                <h2 className="text-display-md mt-6">
                  Buyers shortlist inside an AI answer now. Most companies cannot see theirs.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <Reveal delay={80}>
                <p className="text-lead text-ink-80">
                  A buyer asks an AI who to consider, and the answer names a handful
                  of companies. That list forms before anyone opens your site.
                </p>
                <p className="mt-6 font-sans text-body leading-relaxed text-ink-60">
                  You cannot manage what you cannot see, and AI visibility is almost
                  impossible to see. Teams fall back on a single screenshot of one
                  chat, a gut feel, or a dashboard that reports a score and stops
                  there. Nobody shows you how often you are actually named, which
                  competitors the model prefers, or what to build to change it.
                </p>
                <p className="mt-6 font-display text-ink" style={{ fontSize: '1.3rem' }}>
                  There is a measured way.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Capabilities</Eyebrow>
              <h2 className="text-display-lg mt-6">One engine for the whole AI-visibility loop.</h2>
            </Reveal>
          </div>
          <div className="mt-16 divide-y divide-line border-y border-line">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.n} delay={i * 40}>
                <div className="grid gap-3 py-8 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                  <span className="font-display text-2xl text-cognac sm:col-span-1">{c.n}</span>
                  <h3 className="font-display text-ink sm:col-span-4" style={{ fontSize: '1.35rem', lineHeight: 1.15 }}>
                    {c.title}
                  </h3>
                  <p className="font-sans text-body leading-relaxed text-ink-60 sm:col-span-7">
                    {c.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pipeline */}
      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>How it runs</Eyebrow>
              <h2 className="text-display-md mt-6">From invisible to measured to moved, in five steps.</h2>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-5">
            {PIPELINE.map((s, i) => (
              <Reveal key={s.n} delay={i * 60} className="bg-canvas">
                <div className="h-full p-6 sm:p-7">
                  <span className="font-display text-brass" style={{ fontSize: '2rem', lineHeight: 1 }}>{s.n}</span>
                  <h3 className="mt-4 font-display text-ink" style={{ fontSize: '1.2rem' }}>{s.title}</h3>
                  <p className="mt-2 font-sans text-caption leading-relaxed text-ink-60">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Measurement standard */}
      <section className="border-t border-line bg-night text-canvas">
        <Container width="narrow" className="py-24 sm:py-32">
          <Reveal>
            <Eyebrow className="eyebrow-light justify-center inline-flex">Why the number holds up</Eyebrow>
            <h2 className="mt-6 text-center font-display text-canvas" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.6rem)', lineHeight: 1.12 }}>
              Measured like research, not like a screenshot.
            </h2>
          </Reveal>
          <ul className="mt-14 space-y-px overflow-hidden rounded-2xl border border-night-line">
            {STANDARDS.map(([t, b], i) => (
              <Reveal key={t} delay={i * 50}>
                <li className="flex flex-col gap-1 bg-night-2 p-6 sm:flex-row sm:items-baseline sm:gap-6 sm:p-7">
                  <span className="font-sans text-body font-medium text-canvas sm:w-1/2">{t}</span>
                  <span className="font-sans text-body leading-relaxed text-canvas/55 sm:w-1/2">{b}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={120}>
            <p className="mt-10 text-center font-sans text-body leading-relaxed text-canvas/70">
              A visibility tool you cannot reproduce is a mood. Cailyx ships the method
              to reproduce every claim.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Guardrails / objections */}
      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <Eyebrow>What we will not tell you</Eyebrow>
                <h2 className="text-display-md mt-6">No one can guarantee an AI answer. We do not pretend to.</h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <div className="divide-y divide-line border-y border-line">
                {GUARDRAILS.map((g, i) => (
                  <Reveal key={g.q} delay={i * 40}>
                    <div className="py-7">
                      <h3 className="font-display text-ink" style={{ fontSize: '1.25rem' }}>{g.q}</h3>
                      <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">{g.a}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Proof */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Proof, not claims</Eyebrow>
              <h2 className="text-display-md mt-6">Engagements run on the engine, baselines captured at kickoff.</h2>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <Reveal delay={0}>
              <div className="convex-light flex h-full flex-col rounded-2xl p-8">
                <p className="font-display text-brass-deep" style={{ fontSize: '3rem', lineHeight: 1 }}>55 → 62</p>
                <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
                  DayOne Technologies, +7 points on the AI Visibility Score in the first
                  remediation phase, with 3 new qualified leads.
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="convex-light flex h-full flex-col rounded-2xl p-8">
                <p className="font-display text-brass-deep" style={{ fontSize: '3rem', lineHeight: 1 }}>43<span className="text-body-lg text-ink-45"> / 100</span></p>
                <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
                  Napkin, a baseline the owner could not have seen alone, after the
                  engine surfaced a silent CDN block on AI crawlers.
                </p>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="convex-light flex h-full flex-col rounded-2xl p-8">
                <p className="font-display text-brass-deep" style={{ fontSize: '3rem', lineHeight: 1 }}>90k</p>
                <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
                  AI answers across 15+ industries in Rothenhall’s field study, the
                  ground under the rubric and the method.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-sans text-body">
              <Link to="/research" className="link-line">Read the research →</Link>
              <Link to="/ai-visibility-score" className="link-line">The AI Visibility Score →</Link>
              <Link to="/case-studies" className="link-line">All case studies →</Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="border-t border-line bg-night text-canvas">
        <Container width="narrow" className="py-24 sm:py-32 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-canvas" style={{ fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.08, fontWeight: 300 }}>
              Your buyers are asking AI who to trust. See exactly what it says about you.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-body leading-relaxed text-canvas/70">
              Request access and Rothenhall sets up your Cailyx workspace with your
              first measured score.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-light">Request access</Link>
              <Link to="/pricing" className="btn btn-ghost-light">See pricing</Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* MCP waitlist */}
      <section id="waitlist" className="border-t border-line bg-canvas-2">
        <Container width="narrow" className="py-24 sm:py-32">
          <div className="mx-auto max-w-xl text-center">
            <Reveal>
              <Eyebrow className="justify-center inline-flex">Cailyx MCP</Eyebrow>
              <h2 className="text-display-md mt-6">Be first to the Cailyx MCP.</h2>
              <p className="mt-5 font-sans text-body leading-relaxed text-ink-60">
                A Cailyx MCP, so it can plug into your own AI workflows, is on the
                roadmap. Join the list and we will reach out when early access opens.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-10">
                <WaitlistForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}

const empty: WaitlistInput = { name: '', email: '', company: '', source: '' }
const labelCls = 'block font-sans text-label tracking-wide text-ink-60'
const inputCls =
  'w-full rounded-lg border border-line bg-canvas px-4 py-3 font-sans text-body text-ink placeholder:text-ink-45 transition-colors focus:border-cognac focus:bg-paper'

function WaitlistForm() {
  const [form, setForm] = useState<WaitlistInput>(empty)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const set =
    (key: keyof WaitlistInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await joinWaitlist({ data: form })
      setStatus('success')
      setForm(empty)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-line bg-paper p-8 text-center">
        <p className="font-display text-2xl text-ink">You’re on the list.</p>
        <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
          We will email you when Cailyx early access opens.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="w-name" className={labelCls}>Name</label>
          <input
            id="w-name"
            type="text"
            required
            value={form.name}
            onChange={set('name')}
            className={inputCls}
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="w-company" className={labelCls}>
            Company <span className="text-ink-45">(optional)</span>
          </label>
          <input
            id="w-company"
            type="text"
            value={form.company}
            onChange={set('company')}
            className={inputCls}
            placeholder="Acme Inc."
            autoComplete="organization"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="w-email" className={labelCls}>Work email</label>
        <input
          id="w-email"
          type="email"
          required
          value={form.email}
          onChange={set('email')}
          className={inputCls}
          placeholder="you@acme.com"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="w-source" className={labelCls}>How did you hear about us?</label>
        <div className="relative">
          <select
            id="w-source"
            value={form.source}
            onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
            className={`${inputCls} appearance-none pr-10`}
          >
            <option value="">Select one</option>
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <svg
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-45"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {status === 'error' && (
        <p role="alert" className="font-sans text-caption text-alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn btn-primary mt-2 w-full disabled:opacity-60"
      >
        {status === 'submitting' ? 'Joining…' : 'Join the MCP waitlist'}
      </button>
      <p className="text-center font-sans text-label text-ink-45">
        We will only email you about Cailyx early access.
      </p>
    </form>
  )
}
