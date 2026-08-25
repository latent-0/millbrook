import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'
import { joinCommunity, type CommunityInput } from '../server/inquiry'

export const Route = createFileRoute('/community')({
  head: () =>
    seo({
      path: '/community',
      title: 'The Founders Circle · An Invite-Only Network · Rothenhall Partners',
      description:
        'A private founders network from Rothenhall Partners. Founding members get GTM, AEO, and growth work from Rothenhall at no cost, early access to Cailyx, and an exclusive circle of founders. Request a free invite.',
      keywords:
        'founders network, founders community India, startup community, free GTM AEO for founders, Rothenhall Founders Circle',
    }),
  component: Community,
})

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
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
  { n: '01', title: 'The engine, on us', body: 'Our initial cohort of founders gets GTM, AEO, and growth work from Rothenhall, free.' },
  { n: '02', title: 'A private founders network', body: 'Exclusive access to a circle of founders. Warm intros, shared playbooks, candid rooms.' },
  { n: '03', title: 'Early access to Cailyx', body: 'First in line for our agentic AEO engine and the Cailyx MCP.' },
  { n: '04', title: 'Your name in the proof', body: 'Your before-and-after becomes the case studies this practice is known by.' },
]

function Community() {
  const reduce = useReducedMotion()
  return (
    <div className="bg-canvas text-ink">
      {/* Hero, a bento of interlocking tiles */}
      <section>
        <Container width="wide" className="pt-16 pb-16 sm:pt-20 sm:pb-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-12"
          >
            {/* Pitch tile */}
            <motion.div
              variants={rise}
              className="convex-light flex flex-col justify-between rounded-[2rem] rounded-br-[5rem] p-8 sm:p-12 md:col-span-7"
            >
              <div>
                <Eyebrow>By invitation</Eyebrow>
                <h1
                  className="mt-7 font-display"
                  style={{ fontSize: 'clamp(2.6rem, 5.2vw, 4.8rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.02 }}
                >
                  The Rothenhall{' '}
                  <span style={{ color: 'var(--color-cognac)' }}>Founders Circle.</span>
                </h1>
              </div>
              <p className="mt-8 max-w-md font-sans text-[1.1rem] leading-relaxed text-ink-60">
                A private network of founders across Europe, India, and the USA,
                with our full growth engine behind you. Our initial cohort of
                founders gets GTM and AEO from Rothenhall, free.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {['Europe', 'India', 'USA'].map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center rounded-full border border-line-strong px-3.5 py-1.5 font-sans text-ink-80"
                    style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Form tile */}
            <motion.div variants={rise} className="md:col-span-5">
              <InviteFlow />
            </motion.div>

            {/* Offer strip */}
            <motion.div
              variants={rise}
              className="convex-light rounded-[2rem] rounded-tl-[4rem] p-8 text-center sm:p-10 md:col-span-12"
            >
              <p
                className="mx-auto max-w-3xl font-display"
                style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.1rem)', lineHeight: 1.3 }}
              >
                For our initial cohort of founders, the entire Rothenhall engine,
                GTM, AEO, and growth, for{' '}
                <span style={{ color: 'var(--color-cognac)' }}>free</span>. In
                return, you become the proof this practice is known by.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>What members get</Eyebrow>
              <h2 className="text-display-md mt-6">More than an invite.</h2>
            </Reveal>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-14 grid gap-5 sm:grid-cols-2"
          >
            {BENEFITS.map((b) => (
              <motion.div
                key={b.n}
                variants={rise}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="convex-light rounded-[1.75rem] p-8 sm:p-10"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl font-display text-2xl text-cognac"
                  style={{ background: 'rgba(168,92,48,0.10)' }}
                >
                  {b.n}
                </span>
                <h3 className="mt-6 font-display text-ink" style={{ fontSize: '1.6rem' }}>
                  {b.title}
                </h3>
                <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                  {b.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Invite flow, one question at a time                              */
/* ---------------------------------------------------------------- */

const QUESTIONS: Array<{
  key: keyof CommunityInput
  q: string
  type: string
  optional?: boolean
}> = [
  { key: 'name', q: 'What should we call you?', type: 'text' },
  { key: 'email', q: 'Where do we send it?', type: 'email' },
  { key: 'company', q: 'Your company or project?', type: 'text', optional: true },
  { key: 'building', q: 'What are you building?', type: 'text', optional: true },
]

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const empty: CommunityInput = { name: '', email: '', company: '', building: '' }

function InviteFlow() {
  const [form, setForm] = useState<CommunityInput>(empty)
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step > 0) inputRef.current?.focus()
  }, [step])

  const current = QUESTIONS[step]
  const value = form[current?.key] ?? ''

  async function submit(data: CommunityInput) {
    setStatus('submitting')
    setError('')
    try {
      await joinCommunity({ data })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = value.trim()
    if (current.key === 'name' && v.length < 2) return setError('A name, please.')
    if (current.key === 'email' && !emailRe.test(v)) return setError('A valid email, please.')
    setError('')
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      submit({ ...form, [current.key]: v })
    }
  }

  const shell =
    'convex-light relative overflow-hidden rounded-[2rem] rounded-tr-[5rem] p-8 sm:p-10'
  // Soft cognac duotone wash so the form tile reads as the focal surface.
  const formBg: React.CSSProperties = {
    background:
      'linear-gradient(155deg, rgba(198,124,72,0.24), rgba(240,225,205,0.35) 45%, rgba(247,243,234,0.2) 100%), var(--color-paper)',
  }

  if (status === 'success') {
    return (
      <div className={`${shell} flex h-full min-h-[20rem] flex-col justify-center`} style={formBg}>
        <Watermark />
        <div className="relative">
          <p className="font-display text-ink" style={{ fontSize: '1.9rem' }}>
            You’re in the queue.
          </p>
          <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
            We read every request ourselves. If it is a fit, your invite to the
            Founder’s Circle lands in your inbox.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`${shell} flex h-full min-h-[20rem] flex-col`} style={formBg}>
      <Watermark />
      <div className="relative flex items-center justify-between">
        <p className="eyebrow">Request a free invite</p>
        <p className="font-sans text-[0.75rem] tracking-wide text-ink-45">
          {String(step + 1).padStart(2, '0')} / {String(QUESTIONS.length).padStart(2, '0')}
        </p>
      </div>

      <div className="relative mt-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <input
              ref={inputRef}
              type={current.type}
              value={value}
              onChange={(e) => setForm((f) => ({ ...f, [current.key]: e.target.value }))}
              placeholder={current.q}
              autoComplete={
                current.key === 'name' ? 'name' : current.key === 'email' ? 'email' : current.key === 'company' ? 'organization' : 'off'
              }
              autoFocus={step > 0}
              className="w-full border-0 border-b border-line bg-transparent pb-3 font-display text-[1.25rem] text-ink outline-none transition-colors placeholder:text-ink-45 focus:border-cognac sm:text-[2rem]"
            />
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-3 font-sans text-[0.85rem] text-cognac-deep">{error}</p>
        )}

        <div className="mt-7 flex items-center justify-between">
          <span className="font-sans text-[0.8rem] text-ink-45">
            {current.optional ? 'Optional · press enter to skip' : 'Press enter'}
          </span>
          <button
            type="submit"
            disabled={status === 'submitting'}
            aria-label={step < QUESTIONS.length - 1 ? 'Next' : 'Request my invite'}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas transition-colors hover:bg-cognac disabled:opacity-60"
          >
            {status === 'submitting' ? (
              <span className="text-[0.7rem]">···</span>
            ) : step < QUESTIONS.length - 1 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

function Watermark() {
  return (
    <img
      src="/brand/griffin.png"
      alt=""
      aria-hidden
      className="pointer-events-none absolute -right-10 -top-8 w-56 select-none"
      style={{ opacity: 0.05 }}
    />
  )
}
