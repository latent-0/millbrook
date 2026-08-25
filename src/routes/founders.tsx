import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { claimDiagnostic, type DiagnosticInput } from '../server/inquiry'

const HEADER = '4.75rem'

export const Route = createFileRoute('/founders')({
  // Invite-only: keep it out of search and AI indexes, and off the navbar.
  head: () => {
    const title = 'Claim your free AEO + GTM diagnostic · Rothenhall Partners'
    const description =
      'A free AEO + GTM diagnostic for the Founders Circle: where you stand in AI answers, and where go-to-market leaks.'
    const image = 'https://www.rothenhall.com/founders-og.png'
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { name: 'robots', content: 'noindex, nofollow' },
        // Page-specific share card that mirrors the page itself.
        { property: 'og:title', content: 'Claim your free AEO + GTM diagnostic' },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Claim your free AEO + GTM diagnostic' },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
    }
  },
  component: Founders,
})

/* ------------------------------------------------------------------ */
/*  Line-art monogram motif, drawn in on mount                        */
/* ------------------------------------------------------------------ */

const ART_PATHS = [
  // parallel left stems
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

function LineArt() {
  const reduce = useReducedMotion()
  const base = {
    fill: 'none',
    stroke: 'var(--color-cognac)',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 480"
      className="pointer-events-none absolute right-0 top-1/2 hidden h-[118%] -translate-y-1/2 select-none md:block"
      style={{ opacity: 0.5 }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* base lines, faint, drawn in once */}
      {ART_PATHS.map((d, i) => (
        <motion.path
          key={`b${i}`}
          d={d}
          {...base}
          style={{ opacity: 0.32 }}
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.3 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {/* a light travels along each line, constantly */}
      {!reduce &&
        ART_PATHS.map((d, i) => (
          <motion.path
            key={`t${i}`}
            d={d}
            {...base}
            stroke="var(--color-cognac-deep)"
            strokeWidth={1.9}
            pathLength={1}
            style={{ strokeDasharray: '0.16 1' }}
            initial={{ strokeDashoffset: 1, opacity: 0 }}
            animate={{ strokeDashoffset: [1, 0], opacity: [0, 0.9, 0.9, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 1.6 + i * 0.7,
            }}
          />
        ))}
    </svg>
  )
}

function Founders() {
  const reduce = useReducedMotion()
  return (
    <div className="relative overflow-hidden bg-canvas">
      {/* slightly darker warm panel under the left (line-art) side */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 hidden w-1/2 md:block"
        style={{
          background:
            'linear-gradient(120deg, rgba(198,124,72,0.10), rgba(198,124,72,0) 70%), var(--color-canvas-2)',
        }}
      />
      {/* drifting cognac light, refracted through the glass card */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-[42rem] w-[42rem] rounded-full"
        style={{
          right: '2%',
          top: '-6%',
          background: 'radial-gradient(circle, rgba(198,124,72,0.20), rgba(247,243,234,0) 66%)',
          filter: 'blur(20px)',
        }}
        animate={reduce ? undefined : { x: [0, -46, 0], y: [0, 34, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-[34rem] w-[34rem] rounded-full"
        style={{
          right: '12%',
          bottom: '-12%',
          background: 'radial-gradient(circle, rgba(168,92,48,0.16), rgba(247,243,234,0) 68%)',
          filter: 'blur(24px)',
        }}
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -28, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />
      <Container>
        <div
          className="grid items-stretch md:grid-cols-2"
          style={{ minHeight: `calc(100svh - ${HEADER})` }}
        >
          {/* LEFT: line art + two or three huge words */}
          <div className="relative flex flex-col justify-center py-16 md:pr-12">
            <LineArt />
            <div className="relative">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-sans uppercase text-ink-45"
                style={{ letterSpacing: '0.24em', fontSize: '0.68rem' }}
              >
                Founders Circle · AEO + GTM · By invitation
              </motion.p>

              <h1
                className="mt-8 font-display text-ink"
                style={{
                  fontSize: 'clamp(3.2rem, 9vw, 8rem)',
                  fontWeight: 300,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.92,
                }}
              >
                {['Your', 'free', 'diagnostic.'].map((w, i) => (
                  <motion.span
                    key={w}
                    className="block"
                    style={i === 1 ? { color: 'var(--color-cognac)' } : undefined}
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      type: 'spring',
                      damping: 26,
                      stiffness: 90,
                      mass: 1.05,
                      delay: 0.15 + i * 0.12,
                    }}
                  >
                    {w}
                  </motion.span>
                ))}
              </h1>
            </div>
          </div>

          {/* RIGHT: the glare card */}
          <div className="flex items-center py-10 md:border-l md:border-line md:py-16 md:pl-12 lg:pl-16">
            <motion.div
              initial={{ opacity: 0, y: 26, filter: 'blur(7px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <ClaimForm />
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  )
}

/* small local Container so the file stays self-contained */
function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-12">
      {children}
    </div>
  )
}

const empty: DiagnosticInput = {
  phone: '',
  email: '',
  company: '',
  website: '',
  description: '',
  acceptTerms: false,
  newsletter: false,
}

const labelCls = 'block font-sans text-[0.8rem] tracking-wide text-ink-60'
const inputCls =
  'w-full rounded-xl border border-white/60 bg-white/45 px-4 py-3.5 font-sans text-[0.98rem] text-ink placeholder:text-ink-45 outline-none backdrop-blur-sm transition-colors duration-300 focus:border-cognac focus:bg-white/65'

// Liquid glass: translucent, blurred, with a light top edge and specular sheen.
const cardBg: React.CSSProperties = {
  background:
    'linear-gradient(150deg, rgba(255,255,255,0.5), rgba(240,225,205,0.26) 55%, rgba(198,124,72,0.12) 100%)',
  backdropFilter: 'blur(22px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
  border: '1px solid rgba(255,255,255,0.5)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 2px rgba(120,60,25,0.06), 0 34px 80px -46px rgba(120,60,25,0.45)',
}

function ClaimForm() {
  const [form, setForm] = useState<DiagnosticInput>(empty)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const set =
    (key: keyof DiagnosticInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const toggle =
    (key: 'acceptTerms' | 'newsletter') =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.checked }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.acceptTerms) {
      setStatus('error')
      setError('Please accept the terms to continue.')
      return
    }
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
      <div
        className="flex min-h-[24rem] flex-col justify-center rounded-[1.75rem] border border-line p-8 sm:p-10"
        style={cardBg}
      >
        <p className="font-display text-ink" style={{ fontSize: '2rem', lineHeight: 1.1 }}>
          Your diagnostic is claimed.
        </p>
        <p className="mt-4 max-w-sm font-sans text-[1rem] leading-relaxed text-ink-60">
          We read every request ourselves. We will reach out on the number you
          shared to book it in.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="group relative overflow-hidden rounded-[1.75rem] p-7 transition-shadow duration-500 hover:shadow-[0_40px_90px_-46px_rgba(120,60,25,0.5)] sm:p-9"
      style={cardBg}
    >
      {/* glass specular highlight, top-left */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(70% 45% at 26% 0%, rgba(255,255,255,0.55), rgba(255,255,255,0) 62%)' }}
      />
      {/* hover glare sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 -skew-x-12 -translate-x-[130%] transition-transform duration-[900ms] ease-out group-hover:translate-x-[260%]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="eyebrow" style={{ letterSpacing: '0.18em' }}>
            Claim your diagnostic
          </p>
          <span className="h-2 w-2 rounded-full bg-cognac" aria-hidden />
        </div>

        <div className="mt-8 space-y-5">
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

          <Field id="f-email" label="Work email">
            <input
              id="f-email"
              type="email"
              inputMode="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={set('email')}
              className={inputCls}
              placeholder="you@acme.com"
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
                About your company <span className="text-ink-45">(optional)</span>
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

        {/* consent + opt-in */}
        <div className="mt-6 space-y-3.5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={toggle('acceptTerms')}
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ accentColor: 'var(--color-cognac)' }}
            />
            <span className="font-sans text-[0.82rem] leading-relaxed text-ink-60">
              I accept the terms and allow Rothenhall to crawl my website’s public
              pages to prepare the diagnostic.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.newsletter}
              onChange={toggle('newsletter')}
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ accentColor: 'var(--color-cognac)' }}
            />
            <span className="font-sans text-[0.82rem] leading-relaxed text-ink-60">
              Also send me occasional GTM + AI news. Unsubscribe anytime.
            </span>
          </label>

          <details className="group/terms">
            <summary className="cursor-pointer list-none font-sans text-[0.74rem] text-ink-45 underline underline-offset-2">
              What am I agreeing to?
            </summary>
            <p className="mt-2 font-sans text-[0.74rem] leading-relaxed text-ink-45">
              By claiming, you allow Rothenhall Partners to fetch and read your
              website’s public pages to assess your AI visibility and prepare the
              diagnostic. We store the details you enter to contact you about it, and
              nothing more. Newsletter is optional and separate. You can ask us to
              delete your data, or unsubscribe, at any time.
            </p>
          </details>
        </div>

        {status === 'error' && (
          <p className="mt-4 font-sans text-[0.9rem] text-cognac-deep">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn btn-primary group/btn relative mt-7 w-full overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
        >
          <span className="relative z-10">
            {status === 'submitting' ? 'Sending…' : 'Claim free AEO + GTM Diagnostic'}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 -skew-x-12 -translate-x-[130%] transition-transform duration-700 ease-out group-hover/btn:translate-x-[260%]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)' }}
          />
        </button>

        <p className="mt-4 text-center font-sans text-[0.78rem] text-ink-45">
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
