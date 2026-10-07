import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

/* ------------------------------------------------------------------ */
/*  Cailyx product screens, rebuilt in code.                           */
/*  Mirrors the real client portal: same Graphite surfaces, same       */
/*  navigation, same tile structure, same status colours and labels.   */
/*  The sample company is fictional and every figure is illustrative.  */
/* ------------------------------------------------------------------ */

export const G = {
  ink: '#313337',
  soft: '#5b5e62',
  muted: '#6e7175',
  line: '#ebebec',
  lineStrong: '#d7d6d8',
  surface: '#fefefe',
  strong: '#f7f7f8',
  good: '#22a45d',
  watch: '#d9780f',
  bad: '#dc2626',
  goodSoft: 'rgba(34,164,93,.12)',
  watchSoft: 'rgba(217,120,15,.12)',
  badSoft: 'rgba(220,38,38,.1)',
}

export const LiveCtx = createContext(true)

export function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    setR(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  return r
}

export function useInView<T extends HTMLElement>(margin = '0px 0px -10% 0px') {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, seen] as const
}

export function Count({ to, suffix = '', dur = 1100 }: { to: number; suffix?: string; dur?: number }) {
  const live = useContext(LiveCtx)
  const reduced = useReducedMotion()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!live) return
    if (reduced) {
      setV(to)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [live, reduced, to, dur])
  return (
    <>
      {v.toLocaleString()}
      {suffix}
    </>
  )
}

/* ---------------------------- primitives --------------------------- */

const INK_TILE = 'radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,.08), transparent 55%), linear-gradient(160deg, #3a3c41 0%, #26282b 100%)'

export function Tile({ children, ink, className = '', style }: { children: ReactNode; ink?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`relative rounded-[14px] p-4 ${className}`}
      style={{
        background: ink ? INK_TILE : G.surface,
        color: ink ? '#f4f4f5' : G.ink,
        boxShadow: ink ? '0 0 0 1px rgba(0,0,0,.2), 0 10px 30px rgba(33,35,38,.18)' : `0 0 0 1px ${G.line}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      style={{
        fontSize: 10,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        fontWeight: 525,
        color: dark ? 'rgba(244,244,245,.66)' : G.soft,
      }}
    >
      {children}
    </p>
  )
}

/** Rothenhall's annotation layer: a numbered dot that ties a part of the screen to the legend beside it. */
export function Pin({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="absolute grid place-items-center rounded-full"
      style={{ right: 10, top: 10, width: 18, height: 18, background: '#a85c30', color: '#fff', fontSize: 10, fontWeight: 700, boxShadow: '0 0 0 3px rgba(254,254,254,.9)', zIndex: 2 }}
    >
      {n}
    </span>
  )
}

type Tone = 'good' | 'watch' | 'bad' | 'neutral'
const TONE: Record<Tone, string> = { good: G.good, watch: G.watch, bad: G.bad, neutral: G.ink }
const TONE_BG: Record<Tone, string> = { good: G.goodSoft, watch: G.watchSoft, bad: G.badSoft, neutral: G.strong }

export function Ring({
  value,
  size = 84,
  stroke = 7,
  tone = 'good',
  dark,
  label,
  suffix = '%',
  fontSize,
}: {
  value: number
  size?: number
  stroke?: number
  tone?: Tone
  dark?: boolean
  label?: string
  suffix?: string
  fontSize?: number
}) {
  const live = useContext(LiveCtx)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,.12)' : G.line} strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={TONE[tone]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={live ? c * (1 - value / 100) : c}
            style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(.23,1,.32,1) .15s' }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center" style={{ fontSize: fontSize ?? size * 0.28, fontWeight: 625, letterSpacing: '-.03em', color: dark ? '#fff' : tone === 'neutral' ? G.ink : TONE[tone] }}>
          <span>
            <Count to={value} suffix={suffix} />
          </span>
        </span>
      </div>
      {label ? <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,.7)' : G.soft }}>{label}</span> : null}
    </div>
  )
}

export function Meter({ value, max = 100, color = G.ink, delay = 0, onInk }: { value: number; max?: number; color?: string; delay?: number; onInk?: boolean }) {
  const live = useContext(LiveCtx)
  return (
    <div style={{ height: 6, borderRadius: 99, background: onInk ? 'rgba(255,255,255,.12)' : G.line, overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: live ? `${Math.max(2, (value / max) * 100)}%` : '0%',
          background: color,
          borderRadius: 99,
          transition: `width 1.1s cubic-bezier(.23,1,.32,1) ${delay}ms`,
        }}
      />
    </div>
  )
}

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className="inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full"
      style={{ padding: '2px 8px', fontSize: 10.5, fontWeight: 525, color: tone === 'neutral' ? G.soft : TONE[tone], background: TONE_BG[tone] }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 99, background: TONE[tone] }} />
      {children}
    </span>
  )
}

export function Spark({ pts, tone = 'good', height = 56 }: { pts: number[]; tone?: Tone; height?: number }) {
  const live = useContext(LiveCtx)
  const w = 220
  const h = height
  const min = Math.min(...pts) - 4
  const max = Math.max(...pts) + 2
  const xy = pts.map((p, i) => [(i / (pts.length - 1)) * w, h - ((p - min) / (max - min)) * h] as const)
  const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const col = TONE[tone]
  return (
    <svg viewBox={`0 0 ${w} ${h + 6}`} preserveAspectRatio="none" className="w-full" style={{ overflow: 'visible', height: h + 6 }}>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={col} opacity={live ? 0.1 : 0} style={{ transition: 'opacity 1s ease .6s' }} />
      <path d={d} fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={live ? 0 : 1} style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.23,1,.32,1) .2s' }} />
    </svg>
  )
}

function Mark({ children }: { children: ReactNode }) {
  return <mark style={{ background: 'linear-gradient(transparent 58%, rgba(49,51,55,.14) 58%)', color: G.ink, fontWeight: 625 }}>{children}</mark>
}

/* The real brand lockup: the Cailyx mark with the wordmark in Cormorant, uppercase. */
export function CailyxLockup({ size = 22, dark }: { size?: number; dark?: boolean }) {
  return (
    <span className="inline-flex items-center" style={{ gap: size * 0.4 }}>
      <img src="/brand/cailyx-mark.svg" alt="" width={size} height={size} style={{ width: size, height: size }} />
      <span
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 700,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          fontSize: size * 0.95,
          lineHeight: 1,
          color: dark ? '#fbf9f3' : G.ink,
        }}
      >
        Cailyx
      </span>
    </span>
  )
}

/* ------------------------------ chrome ----------------------------- */

const NAV: { section: string; items: string[] }[] = [
  { section: 'Workspace', items: ['Dashboard', 'Fix Plan', 'Reports'] },
  { section: 'Performance', items: ['Overview', 'Technical health', 'Google search', 'AI visibility', 'Social channels'] },
  { section: 'Compare', items: ['Competitors', 'Backlinks', 'Keywords'] },
]

function Sidebar({ active }: { active: string }) {
  return (
    <aside className="hidden shrink-0 flex-col @3xl:flex" style={{ width: 178, borderRight: `1px solid ${G.line}`, background: G.strong, padding: '14px 10px' }}>
      <div className="px-2 pb-4">
        <CailyxLockup size={20} />
      </div>
      <div className="mb-3 rounded-lg px-2 py-1.5" style={{ background: G.surface, boxShadow: `0 0 0 1px ${G.line}`, fontSize: 11 }}>
        <span style={{ color: G.muted }}>Project</span>
        <p style={{ color: G.ink, fontWeight: 625 }}>Northwind Analytics</p>
      </div>
      {NAV.map((s) => (
        <div key={s.section} className="mb-2.5">
          <p className="px-2 pb-1" style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: G.muted, fontWeight: 525 }}>
            {s.section}
          </p>
          {s.items.map((i) => {
            const on = i === active
            return (
              <div key={i} className="flex items-center gap-2 rounded-md px-2 py-1" style={{ fontSize: 11.5, color: on ? G.ink : G.soft, fontWeight: on ? 625 : 425, background: on ? 'rgba(49,51,55,.08)' : 'transparent' }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: on ? G.ink : G.lineStrong }} />
                {i}
                {i === 'Fix Plan' && (
                  <span className="ml-auto rounded-full px-1.5" style={{ background: G.ink, color: '#fff', fontSize: 9.5 }}>
                    2
                  </span>
                )}
              </div>
            )
          })}
        </div>
      ))}
      <div className="mt-auto px-2 pt-3" style={{ fontSize: 8.5, letterSpacing: '.14em', textTransform: 'uppercase', color: G.muted }}>
        Delivered by
        <img src="/brand/rothenhall-wordmark.png" alt="" className="mt-1 block w-28" style={{ opacity: 0.85 }} />
      </div>
    </aside>
  )
}

function PageHead({ eyebrow, title, meta, summary }: { eyebrow: string; title: string; meta: ReactNode; summary?: ReactNode }) {
  return (
    <header className="mb-3.5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h4 className="mt-1" style={{ fontSize: 24, fontWeight: 625, color: G.ink, letterSpacing: '-.02em', lineHeight: 1.15 }}>
        {title}
      </h4>
      <p className="mt-1 flex flex-wrap items-center gap-x-2" style={{ fontSize: 11, color: G.muted }}>
        {meta}
      </p>
      {summary && (
        <p className="mt-2" style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(49,51,55,.85)', maxWidth: 560 }}>
          {summary}
        </p>
      )}
    </header>
  )
}

const Dot = () => <span style={{ width: 3, height: 3, borderRadius: 99, background: 'rgba(110,113,117,.6)' }} />

function TileHead({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2" style={{ color: G.soft }}>
      <span style={{ width: 6, height: 6, borderRadius: 2, background: G.lineStrong }} />
      <Eyebrow>{label}</Eyebrow>
    </div>
  )
}

/* ------------------------------ screens ---------------------------- */

const ENGINES: [string, number][] = [
  ['Perplexity', 52],
  ['ChatGPT', 46],
  ['Gemini', 38],
  ['Google AI Overviews', 31],
  ['Google AI Mode', 29],
  ['Copilot', 22],
]

function DashboardScreen() {
  const attention: [string, string, Tone][] = [
    ['Fix Plan', '2 fixes need your decision before work can go ahead', 'watch'],
    ['Technical', 'CDN and firewall: allow GPTBot and PerplexityBot through Cloudflare', 'bad'],
    ['AI answers', 'AI recommends Lumen BI for “alternatives to Lumen BI”', 'bad'],
  ]
  const working = ['Recommended first in 14 AI answers', 'Winning 9 buyer questions', 'Technical score up 15 points since the first audit', 'Ahead of 2 tracked rivals on homepage SEO']
  return (
    <>
      <PageHead
        eyebrow="Project overview"
        title="Northwind Analytics"
        meta={
          <>
            <span>northwind.example</span>
            <Dot />
            <span>Updated 2 days ago</span>
          </>
        }
        summary={
          <>
            AI engines name Northwind Analytics in <Mark>38%</Mark> of the answers we tested. 3 things need attention, and 4 things are working.
          </>
        }
      />
      <div className="grid gap-3 @2xl:grid-cols-4">
        <Tile ink className="@2xl:col-span-2 @2xl:row-span-2 !p-5">
          <Pin n={1} />
          <TileHead label="AI visibility" />
          <div className="mt-4 flex flex-col items-start gap-5 @md:flex-row @md:items-center">
            <Ring value={38} size={132} stroke={11} tone="watch" dark fontSize={36} />
            <div className="min-w-0">
              <p style={{ fontSize: 17, fontWeight: 625, lineHeight: 1.3, color: '#fff' }}>Named in 38% of AI answers</p>
              <p className="mt-1.5" style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', lineHeight: 1.5 }}>
                Across 1,240 answers from 6 engines. Cited as a source in 21%.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5" style={{ fontSize: 11 }}>
                <span className="rounded-full px-2.5 py-1" style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)' }}>
                  <span style={{ color: '#86d4a8' }}>▲</span> 9 questions won
                </span>
                <span className="rounded-full px-2.5 py-1" style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)' }}>
                  <span style={{ color: '#f2a19a' }}>▼</span> 14 lost to rivals
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-2.5 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
            {ENGINES.slice(0, 4).map(([n, v], i) => (
              <div key={n} className="grid items-center gap-3" style={{ gridTemplateColumns: '108px 1fr 36px', fontSize: 11.5 }}>
                <span className="truncate" style={{ color: 'rgba(255,255,255,.7)' }}>{n}</span>
                <Meter value={v} max={60} color="#f4f4f5" onInk delay={i * 80} />
                <span className="text-right tabular-nums" style={{ color: '#fff', fontWeight: 525 }}>{v}%</span>
              </div>
            ))}
          </div>
        </Tile>

        <Tile>
          <Pin n={2} />
          <TileHead label="Technical health" />
          <div className="mt-3 flex items-center gap-3">
            <Ring value={86} size={66} stroke={7} tone="good" suffix="" fontSize={19} />
            <div>
              <Pill tone="good">Healthy</Pill>
              <p className="mt-1" style={{ fontSize: 11, color: G.muted }}>3 checks failing</p>
            </div>
          </div>
          <div className="mt-2 flex items-end justify-between gap-2">
            <Pill tone="good">▲ 15 since first audit</Pill>
            <div style={{ width: 84 }}>
              <Spark pts={[71, 72, 72, 75, 79, 80, 83, 86]} height={24} />
            </div>
          </div>
        </Tile>

        <Tile>
          <Pin n={3} />
          <TileHead label="Fix Plan" />
          <div className="mt-3 flex items-center gap-3">
            <Ring value={56} size={60} stroke={6} tone="good" suffix="" fontSize={17} />
            <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.4 }}>
              <b style={{ color: G.ink }}>9</b> verified of 16
            </p>
          </div>
          <div className="mt-2.5">
            <Pill tone="watch">2 decisions waiting on you</Pill>
          </div>
        </Tile>

        <Tile>
          <TileHead label="Social channels" />
          <p className="mt-2.5" style={{ fontSize: 12, color: G.muted }}>
            <span style={{ fontSize: 22, fontWeight: 625, color: G.ink, letterSpacing: '-.03em' }}>3</span> of 4 channels active
          </p>
          <ul className="mt-2 space-y-1.5" style={{ fontSize: 11.5 }}>
            {(
              [
                ['LinkedIn', 'Weekly', 'good'],
                ['X', 'Now and then', 'watch'],
                ['Instagram', 'Gone quiet', 'bad'],
              ] as [string, string, Tone][]
            ).map(([p, w, t]) => (
              <li key={p} className="flex items-center justify-between gap-2">
                <span>{p}</span>
                <Pill tone={t}>{w}</Pill>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile>
          <TileHead label="Versus rivals" />
          <div className="mt-3 space-y-2.5" style={{ fontSize: 11.5 }}>
            {(
              [
                ['You', 78, true],
                ['Lumen BI', 84, false],
                ['Quanta', 71, false],
              ] as [string, number, boolean][]
            ).map(([n, v, you], i) => (
              <div key={n}>
                <div className="flex justify-between">
                  <span style={{ fontWeight: you ? 625 : 425 }}>{n}</span>
                  <span className="tabular-nums" style={{ fontWeight: 525 }}>{v}</span>
                </div>
                <div className="mt-1">
                  <Meter value={v} color={you ? G.ink : G.lineStrong} delay={i * 90} />
                </div>
              </div>
            ))}
          </div>
        </Tile>

        <Tile className="@2xl:col-span-2">
          <Pin n={4} />
          <TileHead label="Needs attention" />
          <ul className="mt-3 space-y-2" style={{ fontSize: 11.5, lineHeight: 1.45 }}>
            {attention.map(([s, t, tone]) => (
              <li key={s} className="flex gap-2.5">
                <span className="mt-1.5 shrink-0" style={{ width: 6, height: 6, borderRadius: 99, background: TONE[tone] }} />
                <span>
                  <b style={{ fontWeight: 625 }}>{s}</b> <span style={{ color: G.soft }}>{t}</span>
                </span>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile className="@2xl:col-span-2">
          <TileHead label="What’s working" />
          <ul className="mt-3 space-y-2" style={{ fontSize: 11.5, lineHeight: 1.45 }}>
            {working.map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-0.5 shrink-0" style={{ color: G.good, fontSize: 11 }}>✓</span>
                <span style={{ color: G.soft }}>{t}</span>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </>
  )
}

const STANCE: [string, number, string][] = [
  ['Recommended first', 14, G.good],
  ['Recommended as an alternative', 41, '#7cc9a0'],
  ['Mentioned', 66, '#8b8d90'],
  ['Mentioned negatively', 6, G.bad],
  ['Not named', 85, G.lineStrong],
]

function VisibilityScreen() {
  const live = useContext(LiveCtx)
  const total = STANCE.reduce((n, s) => n + s[1], 0)
  return (
    <>
      <PageHead
        eyebrow="Performance"
        title="AI visibility"
        meta={
          <>
            <span>Northwind Analytics</span>
            <Dot />
            <span>Measured 28 Sep</span>
            <Dot />
            <span>1,240 answers from 6 engines</span>
          </>
        }
        summary={
          <>
            AI engines name Northwind Analytics in <Mark>38%</Mark> of the answers we tested, and recommend you first 14 times. Perplexity knows you best.
          </>
        }
      />
      <div className="grid gap-3 @2xl:grid-cols-4">
        <Tile ink className="@2xl:col-span-2">
          <Pin n={1} />
          <TileHead label="How often AI names you" />
          <div className="mt-3 grid grid-cols-2 gap-4">
            <Ring dark value={38} tone="watch" label="Mentioned" size={96} stroke={9} />
            <Ring dark value={21} tone="watch" label="Cited as a source" size={96} stroke={9} />
          </div>
          <p className="mt-3 border-t pt-2.5" style={{ borderColor: 'rgba(255,255,255,.1)', fontSize: 11, color: 'rgba(255,255,255,.6)', lineHeight: 1.45 }}>
            Rates, not positions: AI answers change from run to run, so we measure how often you appear across many answers.
          </p>
        </Tile>
        <Tile>
          <TileHead label="Recommended first" />
          <p className="mt-2" style={{ fontSize: 34, fontWeight: 625, color: G.good, lineHeight: 1, letterSpacing: '-.03em' }}>
            <Count to={14} />
          </p>
          <p className="mt-1" style={{ fontSize: 11, color: G.muted }}>of 212 judged answers put you first</p>
          <div className="mt-3">
            <Meter value={14} max={212} color={G.good} />
          </div>
        </Tile>
        <Tile>
          <TileHead label="Unprompted" />
          <p className="mt-2" style={{ fontSize: 34, fontWeight: 625, color: G.watch, lineHeight: 1, letterSpacing: '-.03em' }}>
            <Count to={27} suffix="%" />
          </p>
          <p className="mt-1" style={{ fontSize: 11, color: G.muted }}>when the question never says your name</p>
          <div className="mt-3">
            <Meter value={27} color={G.watch} delay={120} />
          </div>
        </Tile>

        <Tile className="@2xl:col-span-2">
          <Pin n={2} />
          <TileHead label="By engine" />
          <div className="mt-3 space-y-2">
            {ENGINES.map(([n, v], i) => (
              <div key={n} className="grid items-center gap-2" style={{ gridTemplateColumns: '116px 1fr 34px', fontSize: 11 }}>
                <span style={{ color: G.soft }}>{n}</span>
                <Meter value={v} max={60} color={i === 0 ? G.good : G.ink} delay={i * 80} />
                <span className="text-right tabular-nums" style={{ fontWeight: 525 }}>{v}%</span>
              </div>
            ))}
          </div>
        </Tile>
        <Tile className="@2xl:col-span-2">
          <Pin n={3} />
          <TileHead label="How the answers describe you" />
          <div className="mt-3 flex overflow-hidden rounded-md" style={{ height: 14 }}>
            {STANCE.map(([n, v, c], i) => (
              <div key={n} title={n} style={{ width: live ? `${(v / total) * 100}%` : '0%', background: c, transition: `width 1.1s cubic-bezier(.23,1,.32,1) ${i * 90}ms` }} />
            ))}
          </div>
          <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 @md:grid-cols-2" style={{ fontSize: 11 }}>
            {STANCE.map(([n, v, c]) => (
              <li key={n} className="flex items-center gap-2" style={{ color: G.soft }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                {n}
                <span className="ml-auto tabular-nums" style={{ color: G.ink, fontWeight: 525 }}>{v}</span>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </>
  )
}

const RIVALS: [string, number, number][] = [
  ['Lumen BI', 31, 12],
  ['Quanta', 24, 18],
  ['Metrikal', 19, 22],
  ['Stackwise', 11, 9],
  ['Ledgerly', 7, 14],
]

function CompetitorsScreen() {
  const max = 34
  return (
    <>
      <PageHead eyebrow="Compare" title="Competitors" meta={<span>Head to head across 1,240 AI answers</span>} summary="The shortlist AI builds in your category, and how often each name lands ahead of yours." />
      <div className="grid gap-3 @2xl:grid-cols-5">
        <Tile className="@2xl:col-span-3">
          <Pin n={1} />
          <div className="flex items-center justify-between">
            <TileHead label="Ahead of you vs behind you" />
          </div>
          <div className="mt-1 flex gap-4" style={{ fontSize: 10.5, color: G.soft }}>
            <span className="flex items-center gap-1.5"><i style={{ width: 8, height: 8, borderRadius: 2, background: G.bad }} /> they lead</span>
            <span className="flex items-center gap-1.5"><i style={{ width: 8, height: 8, borderRadius: 2, background: G.good }} /> you lead</span>
          </div>
          <div className="mt-3 space-y-2.5">
            {RIVALS.map(([n, ahead, behind], i) => (
              <div key={n} className="grid items-center gap-2" style={{ gridTemplateColumns: '74px 1fr 1px 1fr', fontSize: 11 }}>
                <span style={{ fontWeight: 625 }}>{n}</span>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="tabular-nums" style={{ color: G.soft }}>{ahead}</span>
                  <div style={{ width: '70%', transform: 'scaleX(-1)' }}>
                    <Meter value={ahead} max={max} color={G.bad} delay={i * 90} />
                  </div>
                </div>
                <span style={{ background: G.lineStrong, alignSelf: 'stretch' }} />
                <div className="flex items-center gap-1.5">
                  <div style={{ width: '70%' }}>
                    <Meter value={behind} max={max} color={G.good} delay={i * 90 + 60} />
                  </div>
                  <span className="tabular-nums" style={{ color: G.soft }}>{behind}</span>
                </div>
              </div>
            ))}
          </div>
        </Tile>
        <Tile className="@2xl:col-span-2">
          <Pin n={2} />
          <TileHead label="AI recommends instead" />
          <ul className="mt-3 space-y-2.5" style={{ fontSize: 11.5 }}>
            {[
              ['alternatives to Lumen BI', 'Quanta, Metrikal'],
              ['top FP&A software for mid market', 'Lumen BI, Stackwise'],
              ['how to track net revenue retention', 'Lumen BI'],
            ].map(([q, w]) => (
              <li key={q} className="rounded-lg p-2.5" style={{ background: G.strong, boxShadow: `0 0 0 1px ${G.line}` }}>
                <p style={{ color: G.muted, fontSize: 10.5 }}>Buyer asks</p>
                <p style={{ fontWeight: 625 }}>{q}</p>
                <p className="mt-1" style={{ color: G.soft }}>
                  Named instead: <span style={{ color: G.bad, fontWeight: 625 }}>{w}</span>
                </p>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </>
  )
}

const CHECKS: [string, string, Tone][] = [
  ['robots.txt', 'Search and assistant crawlers allowed', 'good'],
  ['CDN and firewall', 'GPTBot and PerplexityBot refused', 'bad'],
  ['Sitemap', '982 URLs, updated 3 days ago', 'good'],
  ['JavaScript rendering', '34% of content hidden without JS', 'watch'],
  ['Core Web Vitals', 'Loading, stability, responsiveness pass', 'good'],
  ['Structured data', 'Organization is missing sameAs', 'watch'],
  ['Agent readiness', 'llms.txt present, canonical clean', 'good'],
  ['Page inventory', '41 pages with thin or duplicate titles', 'watch'],
]

function TechnicalScreen() {
  return (
    <>
      <PageHead eyebrow="Performance" title="Technical health" meta={<span>8 checks · runs weekly</span>} summary="Can an AI crawler reach, render and understand your site? Every check links to the exact fix." />
      <div className="grid gap-3 @2xl:grid-cols-5">
        <Tile className="@2xl:col-span-2">
          <Pin n={1} />
          <TileHead label="Technical score" />
          <div className="mt-3 flex items-center gap-4">
            <Ring value={86} size={92} stroke={9} tone="good" suffix="" fontSize={27} />
            <div className="space-y-1.5">
              <Pill tone="good">Healthy</Pill>
              <p style={{ fontSize: 11, color: G.muted }}>3 checks need attention</p>
              <Pill tone="good">▲ 15 since first audit</Pill>
            </div>
          </div>
          <div className="mt-3">
            <Spark pts={[71, 72, 72, 75, 79, 80, 83, 86]} />
          </div>
        </Tile>
        <Tile className="@2xl:col-span-3 !p-0">
          <Pin n={2} />
          <ul>
            {CHECKS.map(([n, d, t], i) => (
              <li key={n} className="flex items-center gap-3 px-3.5 py-2.5" style={{ borderTop: i ? `1px solid ${G.line}` : 'none', fontSize: 11.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: TONE[t], flexShrink: 0 }} />
                <span style={{ fontWeight: 625, minWidth: 112 }}>{n}</span>
                <span className="truncate" style={{ color: G.soft }}>{d}</span>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </>
  )
}

function FixScreen() {
  const live = useContext(LiveCtx)
  const [verified, setVerified] = useState(false)
  useEffect(() => {
    if (!live) return
    const t = setTimeout(() => setVerified(true), 2600)
    return () => clearTimeout(t)
  }, [live])
  const rows: [string, string, 'High' | 'Medium', string, string][] = [
    ['Add Organization schema with sameAs links', 'Whole site', 'Medium', 'a few hours', 'Your developer'],
    ['Write an answer page for “best revenue analytics tool for SaaS”', 'Buyer question in AI answers', 'High', 'bigger job', 'Your content team'],
    ['Claim the review listing AI cites for your category', 'Off-site', 'Medium', 'a few hours', 'Your team'],
    ['Server-render the pricing table', '/pricing', 'Medium', 'a few hours', 'Your developer'],
  ]
  return (
    <>
      <PageHead eyebrow="Workspace" title="Fix Plan" meta={<span>Every problem from your audits, as a clear fix</span>} />
      <div className="mb-3 flex gap-1" style={{ fontSize: 11.5 }}>
        {[['To do', 5, true], ['In progress', 2, false], ['Verified', 9, false], ['Not needed', 1, false]].map(([l, n, on]) => (
          <span key={l as string} className="rounded-full px-3 py-1" style={{ background: on ? G.ink : 'transparent', color: on ? '#fff' : G.soft, fontWeight: 525 }}>
            {l} <span style={{ opacity: 0.7 }}>{n}</span>
          </span>
        ))}
      </div>
      <Tile className="overflow-hidden !p-0">
        <div className="relative p-3.5" style={{ background: verified ? 'rgba(34,164,93,.05)' : G.surface, transition: 'background .6s ease' }}>
          <Pin n={1} />
          <div className="flex flex-wrap items-center gap-2 pr-6">
            <Pill tone="bad">High impact</Pill>
            <Pill tone="neutral">quick fix</Pill>
            <span style={{ fontSize: 10.5, color: G.muted }}>Whole site · Your developer</span>
          </div>
          <p className="mt-1.5" style={{ fontSize: 15, fontWeight: 625, color: G.ink, letterSpacing: '-.01em' }}>Let AI crawlers through the CDN</p>
          <div className="mt-1.5">
            {verified ? <Pill tone="good">Verified on your live site</Pill> : <Pill tone="watch">Applied, waiting for the check</Pill>}
          </div>
          <div className="mt-2.5 grid gap-3 @xl:grid-cols-2" style={{ fontSize: 11 }}>
            <div className="rounded-lg p-2.5" style={{ background: G.surface, boxShadow: `0 0 0 1px ${G.line}` }}>
              <Eyebrow>Evidence</Eyebrow>
              <p className="mt-1.5" style={{ color: G.soft }}>CDN / firewall: <b style={{ color: G.ink }}>Cloudflare</b></p>
              <p style={{ color: G.soft }}>
                Bots refused: <b style={{ color: verified ? G.good : G.bad, transition: 'color .6s' }}>{verified ? 'none' : 'GPTBot, PerplexityBot'}</b>
              </p>
            </div>
            <div className="relative rounded-lg p-2.5" style={{ background: G.ink, color: '#d9dadc', fontFamily: '"Geist Mono", ui-monospace, monospace', fontSize: 10.5, lineHeight: 1.65 }}>
              <Pin n={2} />
              <span style={{ color: '#8b8d90' }}># generated by Cailyx</span>
              <br />User-agent: GPTBot<br />Allow: /<br />User-agent: PerplexityBot<br />Allow: /
            </div>
          </div>
        </div>
        {rows.map(([t, where, sev, eff, own]) => (
          <div key={t} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3.5 py-2.5" style={{ borderTop: `1px solid ${G.line}`, fontSize: 11.5 }}>
            <Pill tone={sev === 'High' ? 'bad' : 'watch'}>{sev} impact</Pill>
            <span className="min-w-0 flex-1" style={{ color: G.ink, fontWeight: 625, flexBasis: 220 }}>{t}</span>
            <span style={{ color: G.muted, fontSize: 10.5 }}>{where} · {eff} · {own}</span>
          </div>
        ))}
      </Tile>
    </>
  )
}

/* ------------------------------ frame ------------------------------ */

export type ScreenKey = 'dashboard' | 'visibility' | 'competitors' | 'technical' | 'fixes'

const SCREENS: Record<ScreenKey, { nav: string; url: string; node: () => ReactNode }> = {
  dashboard: { nav: 'Dashboard', url: 'app.cailyx.com/client/projects/northwind', node: () => <DashboardScreen /> },
  visibility: { nav: 'AI visibility', url: 'app.cailyx.com/client/projects/northwind/performance/visibility/ai', node: () => <VisibilityScreen /> },
  competitors: { nav: 'Competitors', url: 'app.cailyx.com/client/projects/northwind/competitors', node: () => <CompetitorsScreen /> },
  technical: { nav: 'Technical health', url: 'app.cailyx.com/client/projects/northwind/performance/technical', node: () => <TechnicalScreen /> },
  fixes: { nav: 'Fix Plan', url: 'app.cailyx.com/client/projects/northwind/plan', node: () => <FixScreen /> },
}

export function ProductFrame({ screen, label }: { screen: ScreenKey; label: string }) {
  const [ref, seen] = useInView<HTMLDivElement>('0px 0px -5% 0px')
  const s = SCREENS[screen]
  return (
    <div ref={ref} className="@container">
      <figure className="cx-app m-0" role="img" aria-label={label}>
        <div className="overflow-hidden rounded-2xl" style={{ background: G.surface, border: '1px solid rgba(255,255,255,.14)', boxShadow: '0 40px 90px -30px rgba(0,0,0,.55), 0 0 0 1px rgba(20,18,13,.4)' }} aria-hidden>
          <div className="flex items-center gap-3 px-3.5 py-2.5" style={{ background: '#f1f1f2', borderBottom: `1px solid ${G.line}` }}>
            <span className="flex gap-1.5">
              {['#ee6a5f', '#f5bd4f', '#62c655'].map((c) => (
                <i key={c} style={{ width: 9, height: 9, borderRadius: 99, background: c, opacity: 0.85 }} />
              ))}
            </span>
            <span className="min-w-0 flex-1 truncate rounded-md px-3 py-1 text-center" style={{ background: '#fff', border: `1px solid ${G.line}`, fontSize: 10.5, color: G.muted }}>
              {s.url}
            </span>
            <span style={{ width: 40 }} className="hidden sm:block" />
          </div>
          <div className="flex" style={{ minHeight: 420, textAlign: 'left' }}>
            <Sidebar active={s.nav} />
            <LiveCtx.Provider value={seen}>
              <div key={screen} className="min-w-0 flex-1 p-4 @3xl:p-5" style={{ background: G.surface }}>
                {s.node()}
              </div>
            </LiveCtx.Provider>
          </div>
        </div>
      </figure>
    </div>
  )
}

/* ------------------------- hero composition ------------------------ */

export function HeroProduct() {
  return (
    <div className="relative mx-auto mt-16 max-w-[68rem] sm:mt-20">
      <div className="cx-tilt relative">
        <div className="cx-fade">
          <ProductFrame screen="dashboard" label="Cailyx project dashboard for a sample company, showing AI visibility, technical health, the Fix Plan, rivals and what needs attention." />
        </div>
      </div>
      <p className="relative mt-3 text-center font-sans text-label text-canvas/40 sm:-mt-6">
        The Cailyx client workspace, shown with a fictional sample company. Figures are illustrative.
      </p>
    </div>
  )
}

/* ---------------------------- guided tour -------------------------- */

const TOUR: { key: ScreenKey; kicker: string; title: string; body: string; notes: string[] }[] = [
  {
    key: 'dashboard',
    kicker: 'See',
    title: 'One dashboard for the whole picture',
    body: 'The answer comes first: how often AI names you, how healthy your site is, which fixes are moving, and what needs you today.',
    notes: ['How often AI engines name you, with the rate behind it', 'Technical health out of 100, with the trend', 'Fix Plan progress, and decisions waiting on you', 'A short list of what needs attention now'],
  },
  {
    key: 'visibility',
    kicker: 'Measure',
    title: 'How AI engines describe you',
    body: 'Mention and citation rates across ChatGPT, Perplexity, Gemini and Google’s AI surfaces, always as a rate over many answers, never a single lucky one.',
    notes: ['Mentioned vs cited as a source', 'The same measurement, engine by engine', 'Whether answers recommend you, merely mention you, or leave you out'],
  },
  {
    key: 'competitors',
    kicker: 'Compare',
    title: 'The shortlist you are missing',
    body: 'Which competitors the models recommend instead of you, on which buyer questions, and how often each one lands ahead.',
    notes: ['Times each rival is named ahead of you, and behind you', 'The exact buyer questions you lose, and who wins them'],
  },
  {
    key: 'technical',
    kicker: 'Diagnose',
    title: 'Technical health, read like a crawler',
    body: 'Eight checks cover robots, CDN blocks, sitemap, JavaScript rendering, Core Web Vitals, schema and agent readiness, rolled into one trended score.',
    notes: ['A composite score out of 100, with the trend over time', 'Each check in plain words: green passes, amber needs work, red blocks AI'],
  },
  {
    key: 'fixes',
    kicker: 'Fix',
    title: 'A Fix Plan that proves itself',
    body: 'Each finding becomes a fix with evidence, generated code where it can be generated, an owner, and a live check that moves it to Verified once it lands.',
    notes: ['Impact, effort and owner for every fix', 'Ready-to-paste code, generated from your own site'],
  },
]

export function ProductTour() {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hover, setHover] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!auto || hover || reduced) return
    const t = setTimeout(() => setI((n) => (n + 1) % TOUR.length), 9000)
    return () => clearTimeout(t)
  }, [i, auto, hover, reduced])

  const cur = TOUR[i]
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <ul role="tablist" aria-label="Cailyx product screens" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
            {TOUR.map((t, n) => {
              const on = n === i
              return (
                <li key={t.key} className="shrink-0 lg:shrink">
                  <button
                    role="tab"
                    aria-selected={on}
                    id={`tour-tab-${t.key}`}
                    aria-controls="tour-panel"
                    onClick={() => {
                      setAuto(false)
                      setI(n)
                    }}
                    className="group relative w-full rounded-xl px-4 py-3 text-left transition-colors lg:rounded-none lg:rounded-r-xl lg:border-l-2 lg:py-4"
                    style={{ borderColor: on ? 'var(--color-cognac)' : 'var(--color-line)', background: on ? 'var(--color-paper)' : 'transparent' }}
                  >
                    <span className="eyebrow block" style={{ color: on ? 'var(--color-cognac)' : undefined }}>
                      {String(n + 1).padStart(2, '0')} · {t.kicker}
                    </span>
                    <span className="mt-1 block font-display text-ink" style={{ fontSize: '1.15rem', lineHeight: 1.15 }}>
                      {t.title}
                    </span>
                    <span className="hidden overflow-hidden font-sans text-caption leading-relaxed text-ink-60 lg:block" style={{ maxHeight: on ? 120 : 0, opacity: on ? 1 : 0, marginTop: on ? 8 : 0, transition: 'all .35s ease' }}>
                      {t.body}
                    </span>
                    {on && auto && !hover && !reduced && <span aria-hidden className="cx-progress absolute bottom-0 left-0 h-[2px] w-full origin-left" key={`${i}-p`} style={{ animationDuration: '9s' }} />}
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 font-sans text-caption leading-relaxed text-ink-60 lg:hidden">{cur.body}</p>
        </div>
        <div className="lg:col-span-8" role="tabpanel" id="tour-panel" aria-labelledby={`tour-tab-${cur.key}`}>
          <div className="rounded-[1.6rem] p-3 sm:p-5" style={{ background: '#1d1c1a', boxShadow: 'inset 0 0 0 1px var(--color-night-line)' }}>
            <ProductFrame screen={cur.key} label={`${cur.title}. ${cur.body}`} />
          </div>
          <ol className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {cur.notes.map((n, k) => (
              <li key={n} className="flex items-start gap-3 font-sans text-caption leading-snug text-ink-80">
                <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-cognac text-[0.68rem] font-semibold text-white">{k + 1}</span>
                {n}
              </li>
            ))}
          </ol>
          <p className="mt-5 font-sans text-label text-ink-45">The real Cailyx workspace, shown with a fictional sample company. Figures are illustrative.</p>
        </div>
      </div>
    </div>
  )
}
