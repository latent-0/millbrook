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
        {/* griffin watermark in the background */}
        <img
          src="/brand/griffin.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-16 w-[34rem] max-w-[92vw] -translate-x-1/2 select-none"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.05 }}
        />
        {/* grainy, glass-like texture */}
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-overlay" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0) 26%)' }}
        />

        <Container width="wide" className="relative pt-28 pb-24 sm:pt-32 sm:pb-28">
          <div className="grid items-center gap-14 md:grid-cols-12">
            {/* Left, the pitch */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="md:col-span-6"
            >
              <motion.div variants={rise}>
                <Eyebrow className="eyebrow-light">By invitation</Eyebrow>
              </motion.div>
              <motion.h1
                variants={rise}
                className="mt-8 font-display"
                style={{ fontSize: 'clamp(2.6rem, 5.5vw, 5rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.02 }}
              >
                The Rothenhall{' '}
                <span style={{ color: 'var(--color-cognac-soft)' }}>Founders Circle.</span>
              </motion.h1>
              <motion.p
                variants={rise}
                className="mt-7 max-w-md font-sans text-[1.1rem] leading-relaxed text-canvas/65"
              >
                A private network of founders, with our full growth engine behind
                you. Founding members get GTM and AEO from Rothenhall, at no cost.
              </motion.p>
            </motion.div>

            {/* Right, the informal questionnaire */}
            <motion.div
              initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', damping: 24, stiffness: 120, delay: 0.35 }}
              className="md:col-span-5 md:col-start-8"
            >
              <ApplyForm />
            </motion.div>
          </div>
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
            className="grid gap-5 sm:grid-cols-2"
          >
            {BENEFITS.map((b) => (
              <motion.div
                key={b.n}
                variants={rise}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="socket-shadow"
              >
                <div
                  className="socket h-full rounded-[28px] p-8 pt-14 sm:p-10 sm:pt-14"
                  style={{
                    background:
                      'linear-gradient(158deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 42%), var(--color-night-2)',
                  }}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl font-display text-2xl text-cognac-soft"
                    style={{ background: 'rgba(168,92,48,0.14)' }}
                  >
                    {b.n}
                  </span>
                  <h2 className="mt-6 font-display text-canvas" style={{ fontSize: '1.6rem' }}>
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
      <div className="socket-shadow">
        <div
          className="socket rounded-[28px] p-8 pt-14 text-center"
          style={{ background: 'linear-gradient(158deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 42%), var(--color-night-2)' }}
        >
          <p className="font-display text-2xl text-canvas">You’re in the queue.</p>
          <p className="mt-3 font-sans text-[1rem] leading-relaxed text-canvas/60">
            We read every request ourselves. If it is a fit, your invite to the
            Founder’s Circle lands in your inbox.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="socket-shadow">
      <form
        onSubmit={onSubmit}
        noValidate
        className="socket rounded-[28px] p-7 pt-14 text-left sm:p-9 sm:pt-14"
        style={{ background: 'linear-gradient(158deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 42%), var(--color-night-2)' }}
      >
        <p className="eyebrow eyebrow-light">Request a free invite</p>
        <p className="mt-2 font-display text-canvas" style={{ fontSize: '1.5rem' }}>
          Let’s get you in.
        </p>

        <div className="mt-7 space-y-6">
          <QField n="01" label="What should we call you?">
            <input type="text" required value={form.name} onChange={set('name')} className={inputCls} placeholder="Your name" autoComplete="name" />
          </QField>
          <QField n="02" label="Where do we send the invite?">
            <input type="email" required value={form.email} onChange={set('email')} className={inputCls} placeholder="you@company.com" autoComplete="email" />
          </QField>
          <QField n="03" label="What are you building?" hint="(a line is plenty)">
            <textarea rows={2} value={form.building} onChange={set('building')} className={`${inputCls} resize-none`} placeholder="We help teams get cited by AI..." />
          </QField>
        </div>

        {status === 'error' && (
          <p className="mt-4 font-sans text-[0.9rem] text-[#e0a08a]">{error}</p>
        )}
        <button type="submit" disabled={status === 'submitting'} className="btn btn-light mt-7 w-full disabled:opacity-60">
          {status === 'submitting' ? 'Sending…' : 'Request my invite'}
        </button>
        <p className="mt-4 text-center font-sans text-[0.78rem] text-canvas/40">
          No spam. We reply to founders, not forms.
        </p>
      </form>
    </div>
  )
}

function QField({
  n,
  label,
  hint,
  children,
}: {
  n: string
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-baseline gap-2">
        <span className="font-display text-cognac-soft" style={{ fontSize: '0.9rem' }}>
          {n}
        </span>
        <span className="font-sans text-[0.95rem] text-canvas/80">
          {label}
          {hint ? <span className="text-canvas/40"> {hint}</span> : null}
        </span>
      </label>
      <div className="mt-2">{children}</div>
    </div>
  )
}
