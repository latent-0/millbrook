import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Container, Eyebrow } from '../components/site'
import { seo } from '../lib/seo'
import { joinCommunity, type CommunityInput } from '../server/inquiry'

export const Route = createFileRoute('/community')({
  head: () =>
    seo({
      path: '/community',
      title: 'The Founders Circle · An Invite-Only Network · Rothenhall Partners',
      description:
        'A private founders network from Rothenhall Partners. Founding members get GTM, AEO, and growth work from Rothenhall at no cost, early access to Cailyx, and an exclusive circle of founders. By invitation.',
      keywords:
        'founders network, founders community India, startup community, free GTM AEO for founders, Rothenhall Founders Circle',
    }),
  component: Community,
})

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 24, stiffness: 120 },
  },
}

const BENEFITS = [
  {
    n: '01',
    title: 'The engine, on us',
    body: 'Founding members get GTM, AEO, and growth work from Rothenhall at no cost.',
  },
  {
    n: '02',
    title: 'A private founders network',
    body: 'Exclusive access to a circle of founders. Warm intros, shared playbooks, candid rooms.',
  },
  {
    n: '03',
    title: 'Early access to Cailyx',
    body: 'First in line for our agentic AEO engine and the Cailyx MCP.',
  },
  {
    n: '04',
    title: 'Your name in the proof',
    body: 'Your before-and-after becomes the case studies this practice is known by.',
  },
]

function Community() {
  const reduce = useReducedMotion()
  return (
    <div className="bg-night text-canvas">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* ambient glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 50% at 50% 8%, rgba(168,92,48,0.28), rgba(20,18,13,0) 62%)',
          }}
          animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />
        {/* griffin crest watermark */}
        <img
          src="/brand/griffin.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-24 hidden w-[26rem] -translate-x-1/2 select-none sm:block"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.05 }}
        />

        <Container className="relative pt-28 pb-24 text-center sm:pt-36 sm:pb-32">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={rise}>
              <Eyebrow className="eyebrow-light justify-center inline-flex">
                By invitation
              </Eyebrow>
            </motion.div>
            <motion.h1
              variants={rise}
              className="mx-auto mt-8 max-w-4xl font-display"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.02 }}
            >
              The Rothenhall{' '}
              <span style={{ color: 'var(--color-cognac-soft)' }}>Founders Circle.</span>
            </motion.h1>
            <motion.p
              variants={rise}
              className="mx-auto mt-8 max-w-xl font-sans text-[1.15rem] leading-relaxed text-canvas/65"
            >
              A private network of founders, with our full growth engine behind
              you.
            </motion.p>
            <motion.div variants={rise} className="mt-10">
              <a href="#apply" className="btn btn-light">
                Apply to join
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Founding-cohort offer */}
      <section className="border-t border-night-line">
        <Container width="narrow" className="py-20 text-center sm:py-28">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl font-display"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', lineHeight: 1.25 }}
          >
            For a small founding cohort, the entire Rothenhall engine, GTM, AEO,
            and growth, at{' '}
            <span style={{ color: 'var(--color-cognac-soft)' }}>no cost</span>. In
            return, you become the proof this practice is known by.
          </motion.p>
        </Container>
      </section>

      {/* Benefits */}
      <section className="border-t border-night-line">
        <Container className="py-20 sm:py-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line sm:grid-cols-2"
          >
            {BENEFITS.map((b) => (
              <motion.div key={b.n} variants={rise} className="bg-night">
                <div className="h-full p-8 sm:p-10">
                  <span className="font-display text-4xl text-cognac-soft">{b.n}</span>
                  <h2 className="mt-5 font-display text-canvas" style={{ fontSize: '1.6rem' }}>
                    {b.title}
                  </h2>
                  <p className="mt-3 font-sans text-[1rem] leading-relaxed text-canvas/60">
                    {b.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Apply */}
      <section id="apply" className="border-t border-night-line">
        <Container width="narrow" className="py-20 sm:py-28">
          <div className="mx-auto max-w-xl text-center">
            <Eyebrow className="eyebrow-light justify-center inline-flex">
              Apply
            </Eyebrow>
            <h2 className="mt-6 font-display text-canvas" style={{ fontSize: 'clamp(1.8rem,3.4vw,2.6rem)', lineHeight: 1.1 }}>
              We take on only a handful.
            </h2>
            <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-canvas/60">
              Tell us what you are building.
            </p>
            <div className="mt-10">
              <ApplyForm />
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

const empty: CommunityInput = { name: '', email: '', company: '', building: '' }
const inputCls =
  'w-full rounded-lg border border-night-line bg-night-2 px-4 py-3 font-sans text-[1rem] text-canvas placeholder:text-canvas/40 outline-none transition-colors focus:border-cognac-soft'

function ApplyForm() {
  const [form, setForm] = useState<CommunityInput>(empty)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const set =
    (key: keyof CommunityInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await joinCommunity({ data: form })
      setStatus('success')
      setForm(empty)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-night-line bg-night-2 p-8 text-center">
        <p className="font-display text-2xl text-canvas">Application received.</p>
        <p className="mt-3 font-sans text-[1rem] leading-relaxed text-canvas/60">
          If it is a fit, you will hear from us. We reply to founders, not forms.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="text" required value={form.name} onChange={set('name')} className={inputCls} placeholder="Name" autoComplete="name" />
        <input type="text" value={form.company} onChange={set('company')} className={inputCls} placeholder="Company (optional)" autoComplete="organization" />
      </div>
      <input type="email" required value={form.email} onChange={set('email')} className={inputCls} placeholder="Work email" autoComplete="email" />
      <textarea rows={3} value={form.building} onChange={set('building')} className={`${inputCls} resize-none`} placeholder="What are you building? (optional)" />
      {status === 'error' && (
        <p className="font-sans text-[0.9rem] text-[#e0a08a]">{error}</p>
      )}
      <button type="submit" disabled={status === 'submitting'} className="btn btn-light w-full disabled:opacity-60">
        {status === 'submitting' ? 'Sending…' : 'Apply to the Founders Circle'}
      </button>
    </form>
  )
}
