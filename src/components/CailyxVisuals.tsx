import { useContext, type CSSProperties, type ReactNode } from 'react'
import { Count, Eyebrow, G, LiveCtx, Meter, Pill, Ring, Spark, useInView } from './CailyxShowcase'

/* ------------------------------------------------------------------ */
/*  Small product visuals for the capability rows, proof cards and the */
/*  engine strip. Same Graphite look and Cailyx type as the screens.   */
/*  All data is illustrative.                                          */
/* ------------------------------------------------------------------ */

const MONO = '"Geist Mono", ui-monospace, monospace'

function stagger(live: boolean, i: number, step = 90): CSSProperties {
  return {
    opacity: live ? 1 : 0,
    transform: live ? 'none' : 'translateY(6px)',
    transition: `opacity .5s ease ${i * step}ms, transform .5s ease ${i * step}ms`,
  }
}

function Card({ title, tag, children }: { title: string; tag?: string; children: ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>('0px 0px -8% 0px')
  return (
    <div ref={ref} className="cx-app @container" aria-hidden>
      <LiveCtx.Provider value={seen}>
        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: G.surface, border: `1px solid ${G.line}`, boxShadow: '0 24px 50px -28px rgba(49,51,55,.35)' }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: G.strong, borderBottom: `1px solid ${G.line}` }}>
            <Eyebrow>{title}</Eyebrow>
            {tag && <span className="ml-auto" style={{ fontSize: 10.5, color: G.muted }}>{tag}</span>}
          </div>
          <div className="p-4" style={{ textAlign: 'left', color: G.ink }}>
            {children}
          </div>
        </div>
      </LiveCtx.Provider>
    </div>
  )
}

/* 01 · reach */
function Reach() {
  const live = useContext(LiveCtx)
  const rows: [string, number, string, boolean][] = [
    ['GPTBot', 403, 'refused at the CDN', false],
    ['PerplexityBot', 403, 'refused at the CDN', false],
    ['ClaudeBot', 200, 'reads the page', true],
    ['Googlebot', 200, 'reads the page', true],
    ['Google-Extended', 200, 'reads the page', true],
  ]
  return (
    <div style={{ fontFamily: MONO, fontSize: 11.5 }}>
      <p style={{ color: G.muted }}>$ probe northwind.example --edge --robots</p>
      <div className="mt-2.5 space-y-1.5">
        {rows.map(([ua, code, note, ok], i) => (
          <div key={ua} className="flex items-center gap-3" style={stagger(live, i, 140)}>
            <span style={{ width: 118, color: G.ink }}>{ua}</span>
            <span
              className="rounded px-1.5"
              style={{ color: '#fff', background: ok ? G.good : G.bad, fontWeight: 600 }}
            >
              {code}
            </span>
            <span style={{ color: ok ? G.soft : G.bad }}>{note}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 border-t pt-2.5" style={{ borderColor: G.line, color: G.bad, fontFamily: 'Montserrat, sans-serif', fontSize: 11.5 }}>
        2 of 5 assistants are turned away before they read a word.
      </p>
    </div>
  )
}

/* 02 · entity */
function Entity() {
  const live = useContext(LiveCtx)
  return (
    <div className="grid gap-3 @md:grid-cols-5" style={{ fontSize: 11.5 }}>
      <pre
        className="m-0 overflow-x-auto rounded-lg p-3 @md:col-span-3"
        style={{ background: G.ink, color: '#d9dadc', fontFamily: MONO, fontSize: 10.5, lineHeight: 1.65 }}
      >
        {`{\n  "@type": "Organization",\n  "name": "Northwind Analytics",\n  "url": "https://northwind.example",\n  "sameAs": [\n    "linkedin.com/company/northwind",\n    "crunchbase.com/organization/northwind"\n  ]\n}`}
      </pre>
      <div className="space-y-2 @md:col-span-2">
        <div className="rounded-lg p-2.5" style={{ border: `1px solid ${G.good}`, background: 'rgba(31,138,99,.06)', ...stagger(live, 1, 250) }}>
          <p style={{ fontWeight: 600 }}>Northwind Analytics</p>
          <p style={{ color: G.good, fontSize: 10.5 }}>✓ Resolved as you</p>
        </div>
        <div className="rounded-lg p-2.5" style={{ border: `1px dashed ${G.lineStrong}`, ...stagger(live, 2, 250) }}>
          <p style={{ fontWeight: 600, color: G.soft }}>Northwind Traders</p>
          <p style={{ color: G.muted, fontSize: 10.5 }}>Same name, different company</p>
        </div>
      </div>
    </div>
  )
}

/* 03 · rate */
function Rate() {
  const live = useContext(LiveCtx)
  const rows: [string, number][] = [
    ['ChatGPT', 3],
    ['Perplexity', 4],
    ['Gemini', 2],
    ['AI Overviews', 1],
  ]
  return (
    <div style={{ fontSize: 11.5 }}>
      <p style={{ color: G.soft }}>
        “best revenue analytics tool for SaaS” <span style={{ color: G.muted }}>· 5 runs per engine</span>
      </p>
      <div className="mt-3 space-y-2">
        {rows.map(([e, n], r) => (
          <div key={e} className="flex items-center gap-3">
            <span style={{ width: 92, color: G.soft }}>{e}</span>
            <span className="flex gap-1.5">
              {[0, 1, 2, 3, 4].map((d) => (
                <i
                  key={d}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 99,
                    background: d < n ? G.good : 'transparent',
                    border: `1.5px solid ${d < n ? G.good : G.lineStrong}`,
                    transform: live ? 'scale(1)' : 'scale(.3)',
                    opacity: live ? 1 : 0,
                    transition: `all .4s cubic-bezier(.23,1,.32,1) ${(r * 5 + d) * 60}ms`,
                  }}
                />
              ))}
            </span>
            <span className="ml-auto tabular-nums" style={{ fontWeight: 600 }}>
              {n}/5
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3.5 grid grid-cols-3 gap-2 border-t pt-3" style={{ borderColor: G.line }}>
        {[
          ['Mention rate', 50, '%'],
          ['Citation rate', 25, '%'],
          ['Share of voice', 17, '%'],
        ].map(([l, v, sfx]) => (
          <div key={l as string}>
            <p style={{ color: G.muted, fontSize: 10.5 }}>{l}</p>
            <p className="font-display" style={{ fontSize: 22, lineHeight: 1.1 }}>
              <Count to={v as number} suffix={sfx as string} />
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* 04 · shortlist */
function Shortlist() {
  const rows: [string, number, boolean][] = [
    ['Lumen BI', 61, false],
    ['Quanta', 44, false],
    ['Metrikal', 37, false],
    ['Northwind Analytics', 29, true],
    ['Stackwise', 22, false],
  ]
  return (
    <div style={{ fontSize: 11.5 }}>
      <p style={{ color: G.soft }}>
        Named in answers to “best revenue analytics tool for SaaS”
      </p>
      <div className="mt-3 space-y-2.5">
        {rows.map(([n, v, me], i) => (
          <div key={n} className="grid items-center gap-3" style={{ gridTemplateColumns: '128px 1fr 34px' }}>
            <span style={{ color: G.ink, fontWeight: me ? 625 : 425 }}>{n}</span>
            <Meter value={v} max={70} color={me ? G.ink : G.lineStrong} delay={i * 90} />
            <span className="text-right tabular-nums" style={{ fontWeight: 600 }}>
              {v}%
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 border-t pt-2.5" style={{ borderColor: G.line, color: G.soft }}>
        You are 4th on the list the buyer reads. Three names stand between you and the first call.
      </p>
    </div>
  )
}

/* 05 · build */
function Build() {
  const live = useContext(LiveCtx)
  const lines: [string, string][] = [
    ['  "@type": "Organization",', ' '],
    ['  "name": "Northwind Analytics",', ' '],
    ['+ "sameAs": [', '+'],
    ['+   "https://www.linkedin.com/company/northwind",', '+'],
    ['+   "https://www.crunchbase.com/organization/northwind"', '+'],
    ['+ ],', '+'],
  ]
  const steps = ['Drafted by agent', 'Operator review', 'Shipped', 'Verified']
  return (
    <div>
      <div className="flex items-center gap-2" style={{ fontSize: 11 }}>
        <Pill tone="neutral">Fix 12</Pill>
        <span style={{ fontWeight: 600 }}>Add Organization sameAs links</span>
      </div>
      <div className="mt-2.5 overflow-hidden rounded-lg" style={{ background: G.ink, fontFamily: MONO, fontSize: 10.5, lineHeight: 1.75 }}>
        {lines.map(([t, k], i) => (
          <div
            key={i}
            className="px-3"
            style={{
              color: k === '+' ? '#9be3c3' : '#a9abae',
              background: k === '+' ? 'rgba(31,138,99,.22)' : 'transparent',
              whiteSpace: 'pre',
              ...stagger(live, i, 110),
            }}
          >
            {t}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center" style={{ fontSize: 10.5 }}>
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1.5" style={stagger(live, i + 4, 160)}>
            <span
              className="grid shrink-0 place-items-center rounded-full"
              style={{ width: 15, height: 15, background: G.good, color: '#fff', fontSize: 8.5 }}
            >
              ✓
            </span>
            <span style={{ color: G.soft }}>{s}</span>
            {i < steps.length - 1 && <span className="mx-1 h-px flex-1" style={{ background: G.lineStrong }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

/* 06 · simulate */
function Simulate() {
  const live = useContext(LiveCtx)
  const steps: [string, string, boolean][] = [
    ['Asks AI', '“FP&A software for a 200 person company”', true],
    ['Reads the shortlist', 'Three names. Yours is not one.', false],
    ['Opens your site', 'Pricing table needs JavaScript to appear', false],
    ['Decides', 'Moves on to the first name listed', false],
  ]
  return (
    <div style={{ fontSize: 11.5 }}>
      <div className="flex items-center gap-2.5">
        <span className="grid place-items-center rounded-full" style={{ width: 28, height: 28, background: G.ink, color: '#fff', fontSize: 11, fontWeight: 600 }}>
          P
        </span>
        <div>
          <p style={{ fontWeight: 600 }}>Priya, VP Finance</p>
          <p style={{ color: G.muted, fontSize: 10.5 }}>Synthetic persona · evaluating FP&A tools</p>
        </div>
      </div>
      <ol className="mt-3 space-y-1.5">
        {steps.map(([a, b, ok], i) => (
          <li
            key={a}
            className="flex items-start gap-3 rounded-lg px-3 py-2"
            style={{
              background: ok ? G.strong : 'rgba(192,70,58,.06)',
              border: `1px solid ${ok ? G.line : 'rgba(192,70,58,.25)'}`,
              ...stagger(live, i, 220),
            }}
          >
            <span className="tabular-nums" style={{ color: G.muted, width: 12 }}>
              {i + 1}
            </span>
            <span style={{ fontWeight: 600, width: 112 }}>{a}</span>
            <span style={{ color: ok ? G.soft : G.bad }}>{b}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* 07 · track */
function Track() {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p style={{ color: G.muted, fontSize: 10.5 }}>AI Visibility Score</p>
          <p className="font-display" style={{ fontSize: 34, lineHeight: 1 }}>
            <Count to={62} />
            <span style={{ fontSize: 13, color: G.good, marginLeft: 8 }}>+7 since baseline</span>
          </p>
        </div>
        <Pill tone="watch">Alert: Gemini mention rate −6 pts</Pill>
      </div>
      <div className="mt-3">
        <Spark pts={[55, 55, 57, 58, 60, 59, 62, 62]} tone="watch" />
      </div>
      <div className="mt-1 flex justify-between" style={{ fontSize: 10, color: G.muted }}>
        <span>Baseline</span>
        <span>Week 4</span>
        <span>Week 8</span>
      </div>
    </div>
  )
}

const VISUALS: Record<string, { title: string; tag: string; node: ReactNode }> = {
  '01': { title: 'Crawler probe', tag: 'robots.txt + edge', node: <Reach /> },
  '02': { title: 'Entity check', tag: 'structured data', node: <Entity /> },
  '03': { title: 'Measurement', tag: 'distribution, not one answer', node: <Rate /> },
  '04': { title: 'Category shortlist', tag: 'who the models name', node: <Shortlist /> },
  '05': { title: 'Fix, built and proven', tag: 'agent + operator', node: <Build /> },
  '06': { title: 'Buyer simulation', tag: 'synthetic journey', node: <Simulate /> },
  '07': { title: 'Monitored trend', tag: 'alerts on movement', node: <Track /> },
}

export function CapabilityVisual({ n }: { n: string }) {
  const v = VISUALS[n]
  if (!v) return null
  return (
    <Card title={v.title} tag={v.tag}>
      {v.node}
    </Card>
  )
}

/* ------------------------------ proof ------------------------------ */

export function ProofVisual({ kind }: { kind: 'delta' | 'ring' | 'field' }) {
  const [ref, seen] = useInView<HTMLDivElement>('0px 0px -8% 0px')
  return (
    <div ref={ref} className="cx-app mb-6" aria-hidden>
      <LiveCtx.Provider value={seen}>
        {kind === 'delta' && (
          <div className="space-y-2.5" style={{ fontSize: 11 }}>
            <div className="grid items-center gap-3" style={{ gridTemplateColumns: '58px 1fr 24px' }}>
              <span style={{ color: G.muted }}>Baseline</span>
              <Meter value={55} color={G.lineStrong} />
              <b className="tabular-nums">55</b>
            </div>
            <div className="grid items-center gap-3" style={{ gridTemplateColumns: '58px 1fr 24px' }}>
              <span style={{ color: G.muted }}>Phase 1</span>
              <Meter value={62} color={G.ink} delay={200} />
              <b className="tabular-nums">62</b>
            </div>
          </div>
        )}
        {kind === 'ring' && (
          <div className="flex items-center gap-4">
            <Ring value={43} size={72} label="" suffix="" tone="bad" />
            <div style={{ fontSize: 11, color: G.soft, lineHeight: 1.5 }}>
              <p style={{ color: G.bad, fontWeight: 600 }}>CDN refusing AI crawlers</p>
              <p>Invisible without a technical audit</p>
            </div>
          </div>
        )}
        {kind === 'field' && <DotField />}
      </LiveCtx.Provider>
    </div>
  )
}

function DotField() {
  const live = useContext(LiveCtx)
  const cols = 30
  const rows = 6
  return (
    <div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 3 }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const hot = (i * 37) % 11 === 0
          return (
            <i
              key={i}
              style={{
                aspectRatio: '1',
                borderRadius: 99,
                background: hot ? G.ink : G.lineStrong,
                opacity: live ? (hot ? 1 : 0.7) : 0,
                transition: `opacity .5s ease ${(i % cols) * 25 + Math.floor(i / cols) * 40}ms`,
              }}
            />
          )
        })}
      </div>
      <p className="mt-2" style={{ fontSize: 10.5, color: G.muted }}>
        Each dot is a block of answers. 15+ industries.
      </p>
    </div>
  )
}

/* ------------------------- engines strip --------------------------- */

const ENGINES = ['ChatGPT', 'Perplexity', 'Google AI Overviews', 'Google AI Mode', 'Gemini']
const NEXT_ENGINES = ['Google Search', 'Copilot']

export function EngineStrip() {
  return (
    <div className="mt-12 border-t pt-8" style={{ borderColor: 'var(--color-night-line)' }}>
      <p className="eyebrow eyebrow-light text-center">Measured across the engines buyers ask</p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-9 gap-y-3">
        {ENGINES.map((e) => (
          <li key={e} className="font-display text-canvas/70" style={{ fontSize: '1.05rem', letterSpacing: '-0.005em' }}>
            {e}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center font-sans text-label text-canvas/45">
        Next: {NEXT_ENGINES.join(' and ')}
      </p>
    </div>
  )
}
