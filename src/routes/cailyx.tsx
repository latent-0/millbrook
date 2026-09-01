import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo, SITE } from '../lib/seo'
import { joinWaitlist, type WaitlistInput } from '../server/inquiry'

export const Route = createFileRoute('/cailyx')({
  head: () =>
    seo({
      path: '/cailyx',
      title: 'Cailyx · The Agentic AEO & SEO Engine · Rothenhall Partners',
      description:
        'Cailyx is an AI-native, agentic engine for answer-engine optimization (AEO) and SEO. It maps how AI sees you, builds the entities and citations that move visibility, and tracks citation share. Join the waitlist for the Cailyx MCP.',
      keywords:
        'Cailyx, agentic AEO, agentic SEO, AI-native SEO tool, answer engine optimization software, AEO MCP, AI visibility platform',
    }),
  component: Cailyx,
})

const CAPABILITIES = [
  {
    n: '01',
    title: 'Sees what AI sees',
    body: 'Cailyx continuously maps how ChatGPT, Perplexity, and Google AI Overviews describe, cite, and rank you across the queries that matter.',
  },
  {
    n: '02',
    title: 'Builds, not just audits',
    body: 'Agentic workflows that produce the entities, structured content, and citations answer engines actually reward. The agents do the work, not just the reporting.',
  },
  {
    n: '03',
    title: 'Measures citation share',
    body: 'Tracks whether you are named, cited, and recommended, engine by engine, so visibility is a number you can move.',
  },
  {
    n: '04',
    title: 'Compounds over time',
    body: 'Every run feeds a proprietary library of citation data and playbooks that makes the next run, and the next company, sharper.',
  },
]

function Cailyx() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cailyx',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'AI-native agentic engine for answer engine optimization (AEO) and SEO, built by Rothenhall Partners. In private development; MCP access on the roadmap.',
    creator: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    url: `${SITE.url}/cailyx`,
  }

  return (
    <>
      {/* Product hero */}
      <section className="bg-night text-canvas">
        <Container className="pt-24 pb-20 sm:pt-32 sm:pb-28">
          <Reveal>
            <Eyebrow className="eyebrow-light">Our product</Eyebrow>
            <h1
              className="mt-8 font-display"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              Cailyx
              <span style={{ color: 'var(--color-cognac-soft)' }}>.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-lead mt-8 max-w-2xl text-canvas/70">
              The AI-native, agentic engine for answer-engine and search
              visibility. Cailyx runs the AEO and SEO work as autonomous agents:
              mapping how AI sees you, building the entities and citations that
              move the needle, and tracking your citation share across engines.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#waitlist" className="btn btn-light">
                Request early access
              </a>
              <a href="/pricing" className="btn btn-ghost-light">
                See pricing
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="border-t border-line">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>What Cailyx does</Eyebrow>
              <h2 className="text-display-lg mt-6">
                The engine behind the work, made agentic.
              </h2>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.n} delay={i * 70} className="bg-canvas">
                <div className="h-full p-8 sm:p-10">
                  <span className="font-display text-4xl text-cognac">{c.n}</span>
                  <h3 className="mt-5 font-display" style={{ fontSize: '1.6rem' }}>
                    {c.title}
                  </h3>
                  <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                    {c.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Status / roadmap */}
      <section className="border-t border-line bg-canvas-2">
        <Container width="narrow" className="py-24 sm:py-32 text-center">
          <Reveal>
            <Eyebrow className="justify-center inline-flex">Where Cailyx is today</Eyebrow>
            <p className="mt-8 font-display text-ink" style={{ fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', lineHeight: 1.25 }}>
              Cailyx powers Rothenhall engagements today. It is not yet offered as
              a standalone B2B tool. A Cailyx MCP, so it can plug into your own AI
              workflows, is on the roadmap.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="border-t border-line">
        <Container width="narrow" className="py-24 sm:py-32">
          <div className="mx-auto max-w-xl text-center">
            <Reveal>
              <Eyebrow className="justify-center inline-flex">Waitlist</Eyebrow>
              <h2 className="text-display-md mt-6">Be first to the Cailyx MCP.</h2>
              <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                Join the waitlist and we will reach out when early access opens.
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  )
}

const empty: WaitlistInput = { name: '', email: '', company: '' }
const inputCls =
  'w-full rounded-lg border border-line bg-canvas px-4 py-3 font-sans text-[1rem] text-ink placeholder:text-ink-45 outline-none transition-colors focus:border-brass focus:bg-paper'

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
        <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
          We will email you when Cailyx early access opens.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          required
          value={form.name}
          onChange={set('name')}
          className={inputCls}
          placeholder="Name"
          autoComplete="name"
        />
        <input
          type="text"
          value={form.company}
          onChange={set('company')}
          className={inputCls}
          placeholder="Company (optional)"
          autoComplete="organization"
        />
      </div>
      <input
        type="email"
        required
        value={form.email}
        onChange={set('email')}
        className={inputCls}
        placeholder="Work email"
        autoComplete="email"
      />
      {status === 'error' && (
        <p className="font-sans text-[0.9rem] text-[#8a3a2f]">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {status === 'submitting' ? 'Joining…' : 'Request early access'}
      </button>
      <p className="text-center font-sans text-[0.78rem] text-ink-45">
        We will only email you about Cailyx early access.
      </p>
    </form>
  )
}
