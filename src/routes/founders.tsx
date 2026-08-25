import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Container, Eyebrow } from '../components/site'
import { claimDiagnostic, type DiagnosticInput } from '../server/inquiry'

const HEADER = '4.75rem'

export const Route = createFileRoute('/founders')({
  // Invite-only: keep it out of search and AI indexes, and off the navbar.
  head: () => ({
    meta: [
      { title: 'Claim your free AEO + GTM diagnostic · Rothenhall Partners' },
      {
        name: 'description',
        content:
          'A free AEO and GTM diagnostic for the Rothenhall Founders Circle: where you stand in AI answers, and where the go-to-market is leaking. By invitation.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: Founders,
})

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 24, stiffness: 120 },
  },
}

const GETS = [
  {
    t: 'Where AI places you',
    b: 'Whether ChatGPT, Perplexity, and Google AI Overviews name you in your category, and who they name instead.',
  },
  {
    t: 'Where the funnel leaks',
    b: 'A quick GTM read: the gaps between being found, being measured, and being sold.',
  },
  {
    t: 'The first moves',
    b: 'A short, specific list of what to fix first, whether or not we ever work together.',
  },
]

/* ------------------------------------------------------------------ */
/*  Line-art monogram motif, drawn in on mount                        */
/* ------------------------------------------------------------------ */

function LineArt() {
  const reduce = useReducedMotion()
  const stroke = {
    fill: 'none',
    stroke: 'var(--color-brass-soft)',
    strokeWidth: 1.3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  }
  const paths = [
    // parallel left stem (the "l" strokes)
    'M96 60 V 452',
    // large arch behind, an open tunnel
    'M52 300 V 190 A 104 104 0 0 1 260 190 V 300',
    // R stem
    'M150 88 V 452',
    // R bowl
    'M150 88 H 214 A 78 78 0 0 1 214 244 H 150',
    // R leg
    'M150 244 L 268 452',
    // inner echo of the bowl
    'M150 120 H 200 A 50 50 0 0 1 200 212 H 150',
  ]
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 480"
      className="pointer-events-none absolute left-[36%] top-1/2 hidden h-[122%] -translate-x-1/2 -translate-y-1/2 select-none lg:block"
      style={{ opacity: 0.3 }}
      preserveAspectRatio="xMidYMid meet"
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          {...stroke}
          initial={reduce ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.7, delay: 0.25 + i * 0.16, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  )
}

function Founders() {
  const reduce = useReducedMotion()
  return (
    <div className="relative overflow-hidden bg-night text-canvas">
      {/* ambient cognac glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(48% 42% at 82% 14%, rgba(168,92,48,0.24), rgba(20,18,13,0) 60%)',
        }}
        animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />
      <LineArt />

      <Container className="relative">
        <div
          className="grid items-stretch gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-16"
          style={{ minHeight: `calc(100svh - ${HEADER})` }}
        >
          {/* Pitch */}
          <div className="flex flex-col justify-center md:col-span-5">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={rise}>
                <Eyebrow className="eyebrow-light">
                  Founders Circle · By invitation
                </Eyebrow>
              </motion.div>
              <motion.h1
                variants={rise}
                className="mt-7 font-display"
                style={{
                  fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.03,
                }}
              >
                Claim your free{' '}
                <span style={{ color: 'var(--color-cognac-soft)' }}>
                  AEO + GTM diagnostic
                </span>
                .
              </motion.h1>
              <motion.p
                variants={rise}
                className="mt-7 max-w-md font-sans text-[1.08rem] leading-relaxed text-canvas/65"
              >
                For founders in the circle, a senior read on where you stand in AI
                answers and where your go-to-market is leaking revenue. No cost, no
                obligation.
              </motion.p>

              <motion.ul variants={rise} className="mt-9 space-y-5">
                {GETS.map((g) => (
                  <li key={g.t} className="flex gap-4">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cognac-soft" />
                    <div>
                      <p className="font-display text-canvas" style={{ fontSize: '1.15rem' }}>
                        {g.t}
                      </p>
                      <p className="mt-1 font-sans text-[0.96rem] leading-relaxed text-canvas/55">
                        {g.b}
                      </p>
                    </div>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>

          {/* Form fills the hero */}
          <div className="md:col-span-6 md:col-start-7">
            <motion.div
              initial={{ opacity: 0, y: 26, filter: 'blur(7px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <ClaimForm />
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  )
}

const empty: DiagnosticInput = { phone: '', company: '', website: '', description: '' }

const labelCls = 'block font-sans text-[0.82rem] tracking-wide text-canvas/60'
const inputCls =
  'w-full rounded-xl border border-night-line bg-night/40 px-4 py-3.5 font-sans text-[0.98rem] text-canvas placeholder:text-canvas/35 outline-none transition-colors duration-300 focus:border-cognac-soft'

/* A single diagonal light sweep, reused for the card and the button. */
function Glare({ scope = '', strength = 0.1 }: { scope?: string; strength?: number }) {
  const hover = scope ? `group-hover/${scope}:translate-x-[130%]` : 'group-hover:translate-x-[130%]'
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 -skew-x-12 -translate-x-[130%] transition-transform duration-[900ms] ease-out ${hover}`}
      style={{
        background: `linear-gradient(90deg, transparent, rgba(247,243,234,${strength}), transparent)`,
      }}
    />
  )
}

function ClaimForm() {
  const [form, setForm] = useState<DiagnosticInput>(empty)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const set =
    (key: keyof DiagnosticInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await claimDiagnostic({ data: form })
      setStatus('success')
      setForm(empty)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex h-full min-h-[26rem] flex-col justify-center rounded-2xl border border-night-line bg-night-2/70 p-8 sm:p-10">
        <p className="font-display text-canvas" style={{ fontSize: '2rem', lineHeight: 1.1 }}>
          Your diagnostic is claimed.
        </p>
        <p className="mt-4 max-w-sm font-sans text-[1rem] leading-relaxed text-canvas/60">
          We read every request ourselves. We will reach out on the number you
          shared to book it in. Keep an eye on your phone.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="group relative flex h-full min-h-[30rem] flex-col overflow-hidden rounded-2xl border border-night-line bg-night-2/70 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-cognac-soft/40 sm:p-9"
    >
      <Glare strength={0.08} />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <p className="eyebrow eyebrow-light">Claim your diagnostic</p>
          <span className="h-2 w-2 rounded-full bg-cognac-soft" aria-hidden />
        </div>

        <div className="mt-auto space-y-5 pt-8">
          <Field id="f-phone" label="Phone number">
            <input
              id="f-phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              value={form.phone}
              onChange={set('phone')}
              className={inputCls}
              placeholder="+91 98765 43210"
            />
          </Field>

          <Field id="f-company" label="Company name">
            <input
              id="f-company"
              type="text"
              required
              autoComplete="organization"
              value={form.company}
              onChange={set('company')}
              className={inputCls}
              placeholder="Acme Inc."
            />
          </Field>

          <Field id="f-website" label="Website URL">
            <input
              id="f-website"
              type="url"
              inputMode="url"
              required
              autoComplete="url"
              value={form.website}
              onChange={set('website')}
              className={inputCls}
              placeholder="acme.com"
            />
          </Field>

          <Field
            id="f-description"
            label={
              <>
                About your company <span className="text-canvas/35">(optional)</span>
              </>
            }
          >
            <textarea
              id="f-description"
              rows={2}
              value={form.description}
              onChange={set('description')}
              className={`${inputCls} resize-none`}
              placeholder="A sentence on what you do."
            />
          </Field>
        </div>

        {status === 'error' && (
          <p className="mt-4 font-sans text-[0.9rem] text-[#e0a08a]">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn btn-light group/btn relative mt-7 w-full overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
        >
          <span className="relative z-10">
            {status === 'submitting' ? 'Sending…' : 'Claim free AEO + GTM Diagnostic'}
          </span>
          {/* brighter glare for the light button */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 -skew-x-12 -translate-x-[130%] transition-transform duration-700 ease-out group-hover/btn:translate-x-[130%]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
          />
        </button>

        <p className="mt-4 text-center font-sans text-[0.8rem] text-canvas/40">
          Invite-only. We reply to founders, not forms.
        </p>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
    </div>
  )
}
