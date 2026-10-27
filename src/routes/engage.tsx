import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Container, Eyebrow, Reveal } from '../components/site'
import {
  FOUNDING_OFF,
  ONE_OFF_DEPOSIT,
  SERVICES,
  SERVICE_BY_ID,
  TERMS,
  UMBRELLAS,
  cartSummary,
  formatMoney,
  isTerm,
  priceCart,
  type Cart,
  type Currency,
  type Service,
  type TermKey,
} from '../lib/catalog'
import { startCheckout } from '../lib/razorpay'
import { track } from '../lib/track'
import { getPriceRegion, type PriceRegion } from '../server/geo'
import { submitEngagementLead } from '../server/inquiry'
import { scanSite, type ScanResult } from '../server/siteScan'

/* ------------------------------------------------------------------ */
/*  The atelier: curate an engagement, review it, and begin.           */
/*  Reached from /pricing once a length is chosen.                     */
/* ------------------------------------------------------------------ */

export const Route = createFileRoute('/engage')({
  head: () => ({
    meta: [
      { title: 'Curate your engagement · The Atelier · Rothenhall Partners' },
      { name: 'description', content: 'Choose your services from the Rothenhall catalogue, or let us read your website and suggest them. See your price as you build.' },
      // A working tool, not a landing page: keep it out of search and the sitemap.
      { name: 'robots', content: 'noindex, follow' },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { term?: TermKey } => ({ term: isTerm(s.term) ? s.term : undefined }),
  loader: () => getPriceRegion(),
  component: Engage,
})

const STORE = 'rh_engage_v1'

type Form = { name: string; email: string; company: string; website: string }
const emptyForm: Form = { name: '', email: '', company: '', website: '' }

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

const TONE = { good: 'bg-[#22a45d]', watch: 'bg-[#d9780f]', bad: 'bg-[#dc2626]' } as const

/* ------------------------------ small parts ------------------------------ */

function Check({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-7 flex-none place-items-center rounded-full border transition-colors duration-200 ${
        on ? 'border-ink bg-ink text-canvas' : 'border-line-strong text-ink-60 group-hover:border-ink group-hover:text-ink'
      }`}
    >
      {on ? (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M11.5 3.5 5.5 10 2.5 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </span>
  )
}

function ServiceRow({
  s,
  qty,
  off,
  currency,
  onSet,
  note,
}: {
  s: Service
  qty: number
  off: number
  currency: Currency
  onSet: (qty: number) => void
  note?: string
}) {
  const on = qty > 0
  const list = currency === 'EUR' ? s.price.eur : s.price.usd
  const shown = s.unit === 'month' ? Math.round(list * (1 - off)) : list
  const max = s.per?.max ?? 1
  return (
    <li className={`group relative -mx-3 rounded-xl px-3 py-5 transition-colors duration-200 ${on ? 'bg-paper' : 'hover:bg-canvas-2/60'}`}>
      <span aria-hidden className={`absolute bottom-4 left-0 top-4 w-[3px] rounded-full bg-brass transition-opacity ${on ? 'opacity-100' : 'opacity-0'}`} />
      <div className="flex items-start gap-4">
        <button
          type="button"
          aria-pressed={on}
          aria-label={`${on ? 'Remove' : 'Add'} ${s.name}`}
          onClick={() => onSet(on ? 0 : 1)}
          className="mt-0.5 cursor-pointer"
        >
          <Check on={on} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <button type="button" onClick={() => onSet(on ? 0 : 1)} className="cursor-pointer text-left font-display text-ink" style={{ fontSize: '1.15rem', lineHeight: 1.25 }}>
              {s.name}
            </button>
            <span aria-hidden className="mb-1 hidden h-px flex-1 border-b border-dotted border-line-strong sm:block" />
            <span className="flex-none whitespace-nowrap font-display tabular-nums text-ink sm:text-right" style={{ fontSize: '1.15rem' }}>
              {s.unit === 'month' && off > 0 && <span className="mr-2 font-sans text-label text-ink-45 line-through">{formatMoney(list, currency)}</span>}
              {formatMoney(shown, currency)}
              <span className="ml-1 font-sans text-label text-ink-60">
                {s.unit === 'month' ? '/month' : 'once'}
                {s.per ? ` per ${s.per.label}` : ''}
              </span>
            </span>
          </div>
          <p className="mt-1.5 max-w-xl font-sans text-caption leading-relaxed text-ink-60">{s.blurb}</p>
          {note && (
            <p className="mt-2 flex items-start gap-2 font-sans text-caption leading-snug text-cognac-deep">
              <span aria-hidden className="mt-[0.4em] size-1.5 flex-none rounded-full bg-cognac" />
              {note}
            </p>
          )}
          {s.per && on && (
            <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-line-strong bg-canvas p-1 font-sans text-caption">
              <button type="button" aria-label={`Fewer ${s.per.label}s`} onClick={() => onSet(qty - 1)} className="grid size-7 cursor-pointer place-items-center rounded-full hover:bg-canvas-2">
                −
              </button>
              <span className="min-w-[4.5rem] text-center tabular-nums text-ink">
                {qty} {s.per.label}
                {qty > 1 ? 's' : ''}
              </span>
              <button type="button" aria-label={`More ${s.per.label}s`} disabled={qty >= max} onClick={() => onSet(qty + 1)} className="grid size-7 cursor-pointer place-items-center rounded-full hover:bg-canvas-2 disabled:cursor-not-allowed disabled:opacity-40">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

/* --------------------------------- page ---------------------------------- */

function Engage() {
  const geo = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate()

  const [region, setRegion] = useState<PriceRegion>(geo.region)
  useEffect(() => {
    if (geo.detected) return
    const g = guessRegion()
    if (g) setRegion(g)
  }, [geo.detected])
  const currency: Currency = region === 'EU' ? 'EUR' : 'USD'

  const term: TermKey = search.term ?? 'quarterly'
  const termInfo = TERMS.find((t) => t.key === term)!

  const [cart, setCart] = useState<Cart>({})
  const [founding, setFounding] = useState(false)
  const [mode, setMode] = useState<'browse' | 'site'>('browse')
  const [form, setForm] = useState<Form>(emptyForm)
  const [agree, setAgree] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // scan
  const [siteUrl, setSiteUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scan, setScan] = useState<ScanResult | null>(null)

  // checkout
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [paid, setPaid] = useState<{ id: string; amount: string } | null>(null)

  const resultsRef = useRef<HTMLDivElement | null>(null)

  // Restore a saved plan, so a visitor who leaves and returns finds it intact.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE)
      if (raw) {
        const v = JSON.parse(raw) as { cart?: Cart; founding?: boolean; form?: Form; siteUrl?: string }
        if (v.cart && typeof v.cart === 'object') {
          const clean: Cart = {}
          for (const [id, q] of Object.entries(v.cart)) if (SERVICE_BY_ID.has(id) && Number(q) > 0) clean[id] = Math.min(Number(q), SERVICE_BY_ID.get(id)!.per?.max ?? 1)
          setCart(clean)
        }
        if (v.founding) setFounding(true)
        if (v.form) setForm({ ...emptyForm, ...v.form })
        if (v.siteUrl) setSiteUrl(v.siteUrl)
      }
    } catch {
      /* storage blocked: the plan still works for this visit */
    }
    setHydrated(true)
  }, [])
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORE, JSON.stringify({ cart, founding, form, siteUrl }))
    } catch {
      /* ignore */
    }
  }, [cart, founding, form, siteUrl, hydrated])

  const priced = useMemo(() => priceCart(cart, term, currency, founding), [cart, term, currency, founding])
  const foundingPossible = priced.monthlyList > 0
  const fmt = (n: number) => formatMoney(n, currency)

  const setQty = useCallback((id: string, qty: number) => {
    const s = SERVICE_BY_ID.get(id)
    if (!s) return
    const q = Math.max(0, Math.min(s.per?.max ?? 1, qty))
    setCart((c) => {
      const next = { ...c }
      if (q) next[id] = q
      else delete next[id]
      return next
    })
    if (q) track('service_add', { id })
  }, [])

  const addAll = (ids: string[]) => {
    setCart((c) => {
      const next = { ...c }
      for (const id of ids) if (!next[id]) next[id] = 1
      return next
    })
    track('service_add', { id: 'recommended_all', count: ids.length })
  }

  const chooseTerm = (t: TermKey) => {
    track('term_choose', { term: t, where: 'atelier' })
    navigate({ to: '/engage', search: { term: t }, replace: true })
  }

  async function runScan(e: React.FormEvent) {
    e.preventDefault()
    setScanning(true)
    setScan(null)
    try {
      const r = await scanSite({ data: { url: siteUrl } })
      setScan(r)
      track('site_scan', { ok: r.ok })
      if (r.ok && !form.website) setForm((f) => ({ ...f, website: siteUrl }))
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } catch (err) {
      setScan({ ok: false, message: err instanceof Error ? err.message : 'We could not read that site.' })
    } finally {
      setScanning(false)
    }
  }

  const recIds = scan && scan.ok ? scan.recommended.map((r) => r.id) : []

  const goConfirm = () => {
    if (priced.isEmpty) return
    setShowConfirm(true)
    track('plan_review', { term, monthly: Math.round(priced.monthly), due: Math.round(priced.dueToday) })
    setTimeout(() => document.getElementById('confirm')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  const callHref = {
    plan: 'other',
    note: priced.isEmpty ? `Interested in a ${termInfo.label.toLowerCase()} engagement.` : cartSummary(priced, termInfo.label),
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.name.trim().length < 2) return setError('Please enter your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Please enter a valid email address.')
    if (!agree) return setError('Please confirm the terms of the engagement to continue.')
    setPaying(true)
    // The plan reaches us now, so one that is not paid for still becomes a conversation.
    submitEngagementLead({
      data: { ...form, intent: 'review', term: termInfo.label, summary: cartSummary(priced, termInfo.label), total: `${fmt(priced.dueToday)} due today, ${fmt(priced.termTotal)} over the term` },
    }).catch(() => {})
    track('checkout_start', { term, due: Math.round(priced.dueToday) })
    await startCheckout({
      term,
      items: priced.lines.map((l) => ({ id: l.id, qty: l.qty })),
      founding: foundingPossible && founding,
      customer: form,
      country: currency === 'EUR' ? 'DE' : 'US',
      description: `${termInfo.label} engagement`,
      onSuccess: ({ paymentId, amount, currency: cur }) => {
        track('checkout_paid', { term })
        setPaid({ id: paymentId, amount: formatMoney(amount / 100, cur === 'EUR' ? 'EUR' : 'USD') })
        try {
          localStorage.removeItem(STORE)
        } catch {
          /* ignore */
        }
        setPaying(false)
        setTimeout(() => document.getElementById('confirm')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
      },
      onError: (m) => {
        setError(/not configured|authentication/i.test(m) ? 'Online payment is not available right now. Schedule a call and we will send you a secure payment link.' : m)
        setPaying(false)
      },
      onDismiss: () => setPaying(false),
    })
  }

  const inputCls = 'w-full rounded-lg border border-line-strong bg-canvas px-4 py-3 font-sans text-body text-ink placeholder:text-ink-45 transition-colors focus:border-cognac focus:bg-paper'
  const labelCls = 'block font-sans text-label tracking-wide text-ink-60'

  const steps = [
    { n: '1', t: 'Length', done: true, active: false },
    { n: '2', t: 'Services', done: !priced.isEmpty, active: priced.isEmpty },
    { n: '3', t: 'Confirm', done: !!paid, active: showConfirm && !paid },
    { n: '4', t: 'Begin', done: !!paid, active: false },
  ]

  /* -------------------------------- render -------------------------------- */

  return (
    <>
      {/* Header: the atelier */}
      <section className="relative overflow-hidden bg-night text-canvas">
        <img src="/brand/griffin.png" alt="" aria-hidden className="pointer-events-none absolute -right-20 -top-16 hidden w-[28rem] select-none md:block" style={{ filter: 'brightness(0) invert(1)', opacity: 0.05 }} />
        <Container className="relative pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Reveal>
            <Eyebrow className="eyebrow-light">The atelier</Eyebrow>
            <h1 className="mt-6 max-w-3xl font-display" style={{ fontSize: 'clamp(2.3rem, 5.2vw, 4.2rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.04 }}>
              Curate your <span style={{ color: 'var(--color-cognac-soft)' }}>engagement.</span>
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-body-lg leading-relaxed text-canvas/70">
              Choose the services that fit, or let us read your website and suggest them. Your price takes shape as you build, and nothing is charged until you confirm.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <div role="radiogroup" aria-label="Engagement length" className="flex w-full rounded-full border border-night-line bg-night-2 p-1 sm:inline-flex sm:w-auto">
                {TERMS.map((t) => {
                  const on = t.key === term
                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => chooseTerm(t.key)}
                      className={`flex-1 cursor-pointer whitespace-nowrap rounded-full px-2 py-2 text-center font-sans text-caption transition-colors sm:flex-none sm:px-4 ${on ? 'bg-canvas font-medium text-night' : 'text-canvas/65 hover:text-canvas'}`}
                    >
                      <span className="sm:hidden">{t.months} mo</span>
                      <span className="hidden sm:inline">{t.months} months</span>
                      <span className={`ml-1.5 text-label sm:ml-2 ${on ? 'text-cognac-deep' : 'text-canvas/40'}`}>−{Math.round(t.off * 100)}%</span>
                    </button>
                  )
                })}
              </div>
              <ol className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-label">
                {steps.map((s) => (
                  <li key={s.n} className={`flex items-center gap-2 ${s.active ? 'text-canvas' : s.done ? 'text-brass-soft' : 'text-canvas/40'}`}>
                    <span className={`grid size-5 place-items-center rounded-full border text-[0.65rem] ${s.active ? 'border-cognac-soft bg-cognac/20' : s.done ? 'border-brass-soft/60' : 'border-canvas/25'}`}>{s.done ? '✓' : s.n}</span>
                    {s.t}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Curate */}
      <section className="bg-canvas">
        <Container width="wide" className="py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-8">
              {/* How to choose */}
              <div role="tablist" aria-label="How to choose" className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ['browse', 'Browse the catalogue', 'I know what I need.'],
                    ['site', 'Read my website', 'Suggest what fits.'],
                  ] as const
                ).map(([k, t, b]) => {
                  const on = mode === k
                  return (
                    <button
                      key={k}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setMode(k)}
                      className={`cursor-pointer rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${on ? 'border-ink bg-ink text-canvas shadow-[0_24px_50px_-30px_rgba(26,23,18,0.6)]' : 'border-line bg-paper text-ink hover:border-ink/50'}`}
                    >
                      <span className="block font-display" style={{ fontSize: '1.2rem' }}>{t}</span>
                      <span className={`mt-0.5 block font-sans text-caption ${on ? 'text-canvas/65' : 'text-ink-60'}`}>{b}</span>
                    </button>
                  )
                })}
              </div>

              {/* Read my website */}
              {mode === 'site' && (
                <div className="mt-8">
                  <form onSubmit={runScan} className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
                    <Eyebrow>Your website</Eyebrow>
                    <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
                      Enter your address. We read your public homepage, robots file and sitemap, then suggest services with the reason for each. We only look at what anyone can see.
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <label htmlFor="site-url" className="sr-only">Website address</label>
                      <input
                        id="site-url"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        placeholder="yourcompany.com"
                        inputMode="url"
                        autoComplete="url"
                        className={`${inputCls} sm:flex-1`}
                      />
                      <button type="submit" disabled={scanning || !siteUrl.trim()} className="btn btn-primary justify-center disabled:opacity-60">
                        {scanning ? 'Reading your site…' : 'Read my site'}
                      </button>
                    </div>
                  </form>

                  <div ref={resultsRef} className="scroll-mt-28">
                    {scan && !scan.ok && (
                      <p role="alert" className="mt-5 rounded-xl border border-line bg-canvas-2 px-5 py-4 font-sans text-body text-ink-80">
                        {scan.message}{' '}
                        <button type="button" onClick={() => setMode('browse')} className="link-line cursor-pointer text-ink">
                          Browse the catalogue
                        </button>
                      </p>
                    )}
                    {scan && scan.ok && (
                      <div className="mt-8">
                        <Eyebrow>What we read on {scan.host}</Eyebrow>
                        <p className="mt-3 font-sans text-body text-ink-60">It looks like {scan.profile}. Here is what is publicly visible on the homepage.</p>
                        <ul className="mt-5 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                          {scan.signals.map((s) => (
                            <li key={s.label} className="flex items-start gap-3 bg-canvas px-4 py-3">
                              <span aria-hidden className={`mt-[0.45em] size-2 flex-none rounded-full ${TONE[s.tone]}`} />
                              <span className="min-w-0 font-sans text-caption leading-snug">
                                <span className="block text-ink-60">{s.label}</span>
                                <span className="block font-medium text-ink">{s.value}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 font-sans text-label leading-relaxed text-ink-45">One page cannot show everything. This is a starting read, and the baseline we run once you begin is far deeper.</p>

                        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
                          <div>
                            <Eyebrow>Recommended for you</Eyebrow>
                            <h2 className="mt-3 font-display text-ink" style={{ fontSize: '1.7rem', lineHeight: 1.1 }}>Where we would begin.</h2>
                          </div>
                          <button type="button" onClick={() => addAll(recIds)} className="btn btn-primary">
                            Add all {recIds.length}
                          </button>
                        </div>
                        <ul className="mt-4">
                          {scan.recommended.map((r) => {
                            const s = SERVICE_BY_ID.get(r.id)!
                            return <ServiceRow key={r.id} s={s} qty={cart[r.id] ?? 0} off={termInfo.off} currency={currency} onSet={(q) => setQty(r.id, q)} note={r.why} />
                          })}
                        </ul>
                        <p className="mt-6 font-sans text-body text-ink-60">
                          Want something else?{' '}
                          <button type="button" onClick={() => setMode('browse')} className="link-line cursor-pointer text-ink">Browse the full catalogue</button>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* The catalogue */}
              {mode === 'browse' && (
                <div className="mt-10">
                  <nav aria-label="Disciplines" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
                    {UMBRELLAS.map((u, i) => (
                      <a key={u.id} href={`#u-${u.id}`} className="flex-none whitespace-nowrap rounded-full border border-line bg-paper px-3.5 py-1.5 font-sans text-label text-ink-80 transition-colors hover:border-ink hover:bg-ink hover:text-canvas">
                        {String(i + 1).padStart(2, '0')} {u.name.split(' and ')[0].split(',')[0]}
                      </a>
                    ))}
                  </nav>
                  <div className="mt-6 space-y-14">
                    {UMBRELLAS.map((u, i) => {
                      const list = SERVICES.filter((s) => s.umbrella === u.id)
                      const chosen = list.filter((s) => cart[s.id]).length
                      return (
                        <section key={u.id} id={`u-${u.id}`} className="scroll-mt-28">
                          <div className="flex items-baseline gap-4 border-b border-ink pb-4">
                            <span className="font-display text-cognac" style={{ fontSize: '1.6rem', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                            <div className="min-w-0 flex-1">
                              <h2 className="font-display text-ink" style={{ fontSize: 'clamp(1.4rem,2.4vw,1.8rem)', lineHeight: 1.12 }}>{u.name}</h2>
                              <p className="mt-1 font-sans text-caption text-ink-60">{u.tagline}</p>
                            </div>
                            {chosen > 0 && <span className="flex-none rounded-full bg-ink px-2.5 py-0.5 font-sans text-label text-canvas">{chosen} added</span>}
                          </div>
                          <ul className="divide-y divide-line">
                            {list.map((s) => (
                              <ServiceRow key={s.id} s={s} qty={cart[s.id] ?? 0} off={termInfo.off} currency={currency} onSet={(q) => setQty(s.id, q)} />
                            ))}
                          </ul>
                        </section>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Your engagement */}
            <aside id="cart" className="scroll-mt-24 lg:col-span-4">
              <div className="rounded-3xl bg-night p-7 text-canvas shadow-[0_40px_80px_-40px_rgba(26,23,18,0.6)] lg:sticky lg:top-24">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="eyebrow eyebrow-light">Your engagement</p>
                  <p className="font-sans text-label text-canvas/55">{termInfo.label}, {termInfo.months} months</p>
                </div>

                {priced.isEmpty ? (
                  <p className="mt-6 font-sans text-body leading-relaxed text-canvas/60">Nothing here yet. Add a service from the catalogue, or let us read your website and suggest where to begin.</p>
                ) : (
                  <>
                    <ul className="mt-6 space-y-3">
                      {priced.lines.map((l) => (
                        <li key={l.id} className="flex items-start justify-between gap-3 font-sans text-caption">
                          <span className="min-w-0">
                            <span className="block text-canvas">{l.name}{l.qty > 1 ? ` × ${l.qty}` : ''}</span>
                            <button type="button" onClick={() => setQty(l.id, 0)} className="mt-0.5 cursor-pointer text-label text-canvas/45 hover:text-canvas">Remove</button>
                          </span>
                          <span className="flex-none whitespace-nowrap tabular-nums text-canvas/85">
                            {fmt(l.unit === 'month' ? Math.round(l.total * (1 - priced.off)) : l.total)}
                            <span className="text-canvas/45">{l.unit === 'month' ? '/mo' : ''}</span>
                          </span>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-6 space-y-2.5 border-t border-night-line pt-5 font-sans text-caption">
                      {priced.monthlyList > 0 && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-canvas/65">Monthly fee</dt>
                          <dd className="tabular-nums text-canvas">{fmt(priced.monthly)}</dd>
                        </div>
                      )}
                      {priced.oneOff > 0 && (
                        <div className="flex justify-between gap-3">
                          <dt className="text-canvas/65">One-off projects</dt>
                          <dd className="tabular-nums text-canvas">{fmt(priced.oneOff)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between gap-3 border-t border-night-line pt-3">
                        <dt className="text-canvas">Over {priced.months} months</dt>
                        <dd className="tabular-nums text-canvas">{fmt(priced.termTotal)}</dd>
                      </div>
                      {priced.saving > 0 && (
                        <div className="flex justify-between gap-3 text-brass-soft">
                          <dt>You save</dt>
                          <dd className="tabular-nums">{fmt(priced.saving)}</dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-6 rounded-2xl border border-night-line bg-night-2 p-5">
                      <p className="font-sans text-label uppercase tracking-[0.14em] text-canvas/55">Due today</p>
                      <p className="mt-1 font-display tabular-nums" style={{ fontSize: '2.4rem', lineHeight: 1, color: 'var(--color-cognac-soft)' }}>{fmt(priced.dueToday)}</p>
                      <p className="mt-2 font-sans text-label leading-snug text-canvas/50">
                        {priced.monthlyList > 0 ? 'The first month' : ''}
                        {priced.monthlyList > 0 && priced.oneOff > 0 ? ' plus ' : ''}
                        {priced.oneOff > 0 ? `${Math.round(ONE_OFF_DEPOSIT * 100)}% to begin your projects` : ''}. Excludes any VAT, GST or sales tax.
                      </p>
                    </div>
                  </>
                )}

                <button type="button" disabled={priced.isEmpty} onClick={goConfirm} className="btn btn-light mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40">
                  {priced.isEmpty ? 'Add a service to continue' : 'Review and confirm →'}
                </button>
                <Link to="/contact" search={callHref} onClick={() => track('call_request', { where: 'cart' })} className="mt-3 block text-center font-sans text-caption text-canvas/70 hover:text-canvas">
                  Prefer to talk first? <span className="link-line text-canvas">Schedule a call</span>
                </Link>

                <ul className="mt-7 space-y-2 border-t border-night-line pt-5 font-sans text-label leading-snug text-canvas/50">
                  <li>Nothing is charged until you confirm.</li>
                  <li>A senior operator replies within one working day.</li>
                  <li>No promised rankings, only the work and the evidence.</li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Confirm */}
      {paid || (showConfirm && !priced.isEmpty) ? (
        <section id="confirm" className="scroll-mt-20 border-t border-line bg-canvas-2">
          <Container className="py-16 sm:py-20">
            {paid ? (
              <Reveal>
                <div className="mx-auto max-w-2xl text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-canvas">✓</span>
                  <h2 className="mt-6 font-display text-ink" style={{ fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.08 }}>Welcome to Rothenhall.</h2>
                  <p className="mt-4 font-sans text-body-lg leading-relaxed text-ink-60">
                    Your payment of {paid.amount} is confirmed. A senior operator will contact you within one working day to schedule your kickoff and set your baseline.
                  </p>
                  <p className="mt-3 font-sans text-label text-ink-45">Payment reference {paid.id}</p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link to="/contact" search={{ plan: 'other', note: `Kickoff for my paid engagement (ref ${paid.id}).` }} className="btn btn-primary">Schedule your kickoff call</Link>
                    <Link to="/" className="btn btn-ghost">Back to the site</Link>
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-7">
                  <Eyebrow>Step three</Eyebrow>
                  <h2 className="text-display-md mt-5">Confirm and begin.</h2>
                  <p className="mt-4 max-w-xl font-sans text-body leading-relaxed text-ink-60">Tell us who we are working with. You pay the first month today, and a senior operator takes it from there.</p>
                  <form onSubmit={pay} noValidate className="mt-8 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="f-name" className={labelCls}>Your name</label>
                        <input id="f-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" className={inputCls} />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="f-email" className={labelCls}>Work email</label>
                        <input id="f-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" className={inputCls} />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="f-company" className={labelCls}>Company</label>
                        <input id="f-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} autoComplete="organization" className={inputCls} />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="f-web" className={labelCls}>Website</label>
                        <input id="f-web" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} inputMode="url" autoComplete="url" placeholder="yourcompany.com" className={inputCls} />
                      </div>
                    </div>

                    {foundingPossible && (
                      <label className={`flex cursor-pointer items-start gap-3 rounded-xl border px-5 py-4 transition-colors ${founding ? 'border-cognac bg-paper' : 'border-line bg-canvas hover:border-line-strong'}`}>
                        <input type="checkbox" checked={founding} onChange={(e) => setFounding(e.target.checked)} className="mt-1 size-4 flex-none cursor-pointer accent-[#a85c30]" />
                        <span className="font-sans text-caption leading-relaxed text-ink-80">
                          <span className="font-semibold">Founding Partner Programme.</span> {Math.round(FOUNDING_OFF * 100)}% off monthly fees for the first three months, in return for a documented case study. Places are limited.
                        </span>
                      </label>
                    )}

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-canvas px-5 py-4">
                      <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 size-4 flex-none cursor-pointer accent-[#a85c30]" />
                      <span className="font-sans text-caption leading-relaxed text-ink-80">
                        I understand the monthly fee is fixed for my {termInfo.months}-month engagement, with 30 days written notice after it, and that project work is paid half to begin and half on delivery.
                      </span>
                    </label>

                    {error && (
                      <p role="alert" className="rounded-lg border border-alert/30 bg-alert/5 px-4 py-3 font-sans text-caption text-alert">
                        {error}{' '}
                        <Link to="/contact" search={callHref} className="link-line">Schedule a call</Link>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button type="submit" disabled={paying} className="btn btn-primary disabled:opacity-60">
                        {paying ? 'Opening secure payment…' : `Pay ${fmt(priced.dueToday)} and begin`}
                      </button>
                      <Link to="/contact" search={callHref} onClick={() => track('call_request', { where: 'confirm' })} className="link-line font-sans text-body text-ink-80">Schedule a call instead</Link>
                    </div>
                    <p className="font-sans text-label leading-relaxed text-ink-45">Secure payment by Razorpay. Prices in {currency} and exclude VAT, GST or sales tax where it applies.</p>
                  </form>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-3xl border border-line bg-paper p-7">
                    <p className="eyebrow">Your engagement</p>
                    <h3 className="mt-3 font-display text-ink" style={{ fontSize: '1.5rem' }}>{termInfo.label}, {termInfo.months} months</h3>
                    <ul className="mt-5 divide-y divide-line">
                      {priced.lines.map((l) => (
                        <li key={l.id} className="flex justify-between gap-4 py-3 font-sans text-caption">
                          <span className="text-ink-80">{l.name}{l.qty > 1 ? ` × ${l.qty}` : ''}</span>
                          <span className="flex-none tabular-nums text-ink">{fmt(l.unit === 'month' ? Math.round(l.total * (1 - priced.off)) : l.total)}{l.unit === 'month' ? '/mo' : ''}</span>
                        </li>
                      ))}
                    </ul>
                    <dl className="mt-5 space-y-2 border-t border-line pt-5 font-sans text-caption">
                      <div className="flex justify-between"><dt className="text-ink-60">Over {priced.months} months</dt><dd className="tabular-nums text-ink">{fmt(priced.termTotal)}</dd></div>
                      {priced.saving > 0 && <div className="flex justify-between text-cognac-deep"><dt>You save</dt><dd className="tabular-nums">{fmt(priced.saving)}</dd></div>}
                      <div className="flex items-baseline justify-between border-t border-line pt-3">
                        <dt className="font-semibold text-ink">Due today</dt>
                        <dd className="font-display tabular-nums text-ink" style={{ fontSize: '1.6rem' }}>{fmt(priced.dueToday)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </section>
      ) : null}

      {/* Mobile bar: keeps the total and the next step in reach while browsing */}
      {!priced.isEmpty && !paid && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-night-line bg-night/95 px-5 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-sans text-label text-canvas/55">Due today</p>
              <p className="font-display tabular-nums text-canvas" style={{ fontSize: '1.4rem', lineHeight: 1.1 }}>{fmt(priced.dueToday)}</p>
            </div>
            <button type="button" onClick={goConfirm} className="btn btn-light !px-5 !py-2.5 text-label">Review and confirm →</button>
          </div>
        </div>
      )}
    </>
  )
}
