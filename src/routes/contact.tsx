import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { submitInquiry, type InquiryInput, SOURCE_OPTIONS } from '../server/inquiry'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      path: '/contact',
      title: 'Contact · Start a Conversation · Rothenhall Partners',
      description:
        'Talk to Rothenhall Partners about AI answer-engine visibility (AEO/GEO), go-to-market, and revenue operations for your company or portfolio, in India or worldwide. Email office@rothenhall.com.',
    }),
  component: Contact,
})

const TYPES = [
  { value: 'startup', label: 'Early-stage startup: a fixed-fee sprint' },
  { value: 'portfolio', label: 'Portfolio company: an operating retainer' },
  { value: 'fund', label: 'Fund: a portfolio-wide retainer' },
  { value: 'other', label: 'Something else' },
]

const EXPECT = [
  'A reply from a senior operator, not a sales sequence.',
  'A short, honest read on where the biggest gains likely are.',
  'A clear proposal only if it’s a genuine fit.',
]

type Status = 'idle' | 'submitting' | 'success' | 'error'

/* The server throws user-facing messages naming the field that failed. Map
   them back to the input so the error can sit on the offending field. */
const ERROR_KEYS: Array<[RegExp, keyof InquiryInput]> = [
  [/\bname\b/i, 'name'],
  [/email/i, 'email'],
  [/tell us|message/i, 'message'],
]
function fieldForError(msg: string): keyof InquiryInput | null {
  for (const [re, key] of ERROR_KEYS) if (re.test(msg)) return key
  return null
}

const empty: InquiryInput = {
  name: '',
  email: '',
  company: '',
  type: 'startup',
  message: '',
  source: '',
}

function Contact() {
  const [form, setForm] = useState<InquiryInput>(empty)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const errorField = status === 'error' ? fieldForError(error) : null
  const cls = (k: keyof InquiryInput, extra = '') =>
    `${inputCls}${errorField === k ? ' border-alert' : ''}${extra ? ` ${extra}` : ''}`
  const invalid = (k: keyof InquiryInput) => (errorField === k ? true : undefined)
  const describedBy = (k: keyof InquiryInput) =>
    errorField === k ? `${k}-error` : undefined

  const set =
    (key: keyof InquiryInput) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await submitInquiry({ data: form })
      setStatus('success')
      setForm(empty)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <section>
      <Container className="pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="grid gap-16 md:grid-cols-12">
          {/* Left (invitation) */}
          <div className="md:col-span-5">
            <Reveal>
              <Eyebrow>Contact</Eyebrow>
              <h1 className="text-display-lg mt-8">Start a conversation.</h1>
              <p className="text-lead mt-6 text-ink-60">
                Tell us where you are and what you’re trying to move. If Rothenhall
                is the right fit, you’ll know quickly, and so will we.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-12">
                <p className="eyebrow">
                  What to expect
                </p>
                <ul className="mt-5 space-y-4">
                  {EXPECT.map((t) => (
                    <li
                      key={t}
                      className="flex gap-3 font-sans text-body leading-relaxed text-ink-80"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-12 grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-2">
                <div>
                  <p className="eyebrow">
                    Prefer email
                  </p>
                  <a
                    href="mailto:office@rothenhall.com"
                    className="link-line mt-3 inline-block font-display text-xl text-ink"
                  >
                    office@rothenhall.com
                  </a>
                  <a
                    href="tel:+919398386765"
                    className="link-line mt-2 block font-sans text-body text-ink-80"
                  >
                    +91 93983 86765
                  </a>
                </div>
                <div>
                  <p className="eyebrow">
                    Offices
                  </p>
                  <address className="mt-3 font-sans text-body not-italic leading-relaxed text-ink-60">
                    2nd Floor, HAL 2nd Stage
                    <br />
                    Vimanapura S.O., Bengaluru 560017
                    <br />
                    Karnataka, India
                  </address>
                  <address className="mt-4 font-sans text-body not-italic leading-relaxed text-ink-60">
                    Office 657, 18 Young St, Unit LGE
                    <br />
                    Edinburgh EH2 4JB
                    <br />
                    Scotland, United Kingdom
                  </address>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right (form) */}
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={80}>
              <div className="rounded-2xl border border-line bg-paper p-6 sm:p-9 shadow-[0_30px_60px_-45px_rgba(26,23,18,0.4)]">
                {status === 'success' ? (
                  <SuccessState onReset={() => setStatus('idle')} />
                ) : (
                  <form onSubmit={onSubmit} className="space-y-6" noValidate>
                    <Field
                      label="Name"
                      htmlFor="name"
                      error={errorField === 'name' ? error : undefined}
                    >
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        aria-invalid={invalid('name')}
                        aria-describedby={describedBy('name')}
                        value={form.name}
                        onChange={set('name')}
                        className={cls('name')}
                        placeholder="Your name"
                      />
                    </Field>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field
                        label="Email"
                        htmlFor="email"
                        error={errorField === 'email' ? error : undefined}
                      >
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          aria-invalid={invalid('email')}
                          aria-describedby={describedBy('email')}
                          value={form.email}
                          onChange={set('email')}
                          className={cls('email')}
                          placeholder="you@company.com"
                        />
                      </Field>
                      <Field label="Company" htmlFor="company" optional>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          autoComplete="organization"
                          value={form.company}
                          onChange={set('company')}
                          className={inputCls}
                          placeholder="Company or fund"
                        />
                      </Field>
                    </div>

                    <Field label="What brings you here" htmlFor="type">
                      <div className="relative">
                        <select
                          id="type"
                          name="type"
                          value={form.type}
                          onChange={set('type')}
                          className={`${inputCls} appearance-none pr-10`}
                        >
                          {TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>

                    <Field
                      label="What are you trying to move"
                      htmlFor="message"
                      error={errorField === 'message' ? error : undefined}
                    >
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        aria-invalid={invalid('message')}
                        aria-describedby={describedBy('message')}
                        value={form.message}
                        onChange={set('message')}
                        className={cls('message', 'resize-none')}
                        placeholder="A sentence or two on where you are and what a win looks like."
                      />
                    </Field>

                    <Field label="How did you hear about us?" htmlFor="source" optional>
                      <div className="relative">
                        <select
                          id="source"
                          name="source"
                          value={form.source}
                          onChange={set('source')}
                          className={`${inputCls} appearance-none pr-10`}
                        >
                          <option value="">Select one</option>
                          {SOURCE_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>

                    {status === 'error' && !errorField && (
                      <p role="alert" className="font-sans text-caption text-alert">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn btn-primary w-full disabled:opacity-60"
                    >
                      {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
                    </button>

                    <p className="text-center font-sans text-label leading-relaxed text-ink-45">
                      Your note goes straight to a senior operator. We never share
                      your details.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

const inputCls =
  'w-full rounded-lg border border-line bg-canvas px-4 py-3 font-sans text-body text-ink placeholder:text-ink-45 transition-colors focus:border-cognac focus:bg-paper'

function ChevronDown() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-45"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  children,
}: {
  label: string
  htmlFor: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-baseline justify-between font-sans text-caption font-medium tracking-wide text-ink-80"
      >
        <span>{label}</span>
        {optional && (
          <span className="font-normal text-ink-45">optional</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-2 font-sans text-caption text-alert">
          {error}
        </p>
      )}
    </div>
  )
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brass text-brass-deep">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="mt-6 font-display" style={{ fontSize: '1.9rem' }}>
        Thank you. It’s in.
      </h2>
      <p className="mx-auto mt-3 max-w-sm font-sans text-body leading-relaxed text-ink-60">
        Your note has reached us. Expect a reply from a senior operator, not an
        autoresponder.
      </p>
      <button onClick={onReset} className="link-line mt-6 font-sans text-caption">
        Send another →
      </button>
    </div>
  )
}
