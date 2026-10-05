import { Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from './site'

/* ------------------------------------------------------------------ */
/*  Rothenhall's free tools: one source of truth for the hub page, the  */
/*  Cailyx page block and the home strip.                               */
/* ------------------------------------------------------------------ */

export type Placement = 'hub' | 'cailyx' | 'home' | 'shortlink'

/** Outbound link with a source tag, so each placement's traffic is countable. */
export function toolUrl(base: string, placement: Placement) {
  const q = new URLSearchParams({
    utm_source: 'rothenhall.com',
    utm_medium: 'site',
    utm_campaign: 'free-tools',
    utm_content: placement,
  })
  return `${base}/?${q.toString()}`
}

export const TOOLS = [
  {
    key: 'openkit',
    name: 'Openkit',
    tagline: 'Sales Call Trainer',
    host: 'openkit.rothenhall.com',
    base: 'https://openkit.rothenhall.com',
    pitch:
      'Paste your website, get realistic buyer scenarios built from your real offering, then take a live voice call. Either you sell and an AI buyer pushes back, or the AI cold-calls you.',
    points: [
      'Scores your opening, discovery, objection handling and close',
      'A PDF of your scores and better lines, sent to your inbox',
      'Understands Hindi, English and both in one sentence',
    ],
    tags: ['Free', 'Voice', 'No account'],
    cta: 'Start a practice call',
  },
  {
    key: 'things',
    name: 'Things',
    tagline: 'Plush characters with a job',
    host: 'things.rothenhall.com',
    base: 'https://things.rothenhall.com',
    pitch:
      'Build a 3D plush character, change its fur, face and outfit, then boop it. Then give it a job: a mascot on your site that answers visitors’ questions and makes your pages easy for AI to read.',
    points: [
      'Design in the browser, no design skills needed',
      'Drop it onto any website as a chat assistant',
      'Open source (MIT), free to self-host, no telemetry',
    ],
    tags: ['Free', 'Open source', 'No account'],
    cta: 'Open the studio',
  },
] as const

/* ---- Previews: drawn in SVG/CSS so they load instantly and never break. ---- */

function OpenkitPreview() {
  const scores = [
    { k: 'Opening', v: 8 },
    { k: 'Discovery', v: 7 },
    { k: 'Objections', v: 6 },
    { k: 'Close', v: 8 },
  ]
  const bars = [10, 22, 14, 30, 18, 36, 24, 14, 28, 38, 20, 12, 26, 34, 16, 24, 10, 18]
  return (
    <div className="rounded-xl border border-night-line bg-night-2 p-5 text-canvas shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]" aria-hidden>
      <div className="flex items-center justify-between font-sans text-label text-canvas/60">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-cognac-soft opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-cognac-soft" />
          </span>
          Live call
        </span>
        <span>02:14</span>
      </div>
      <div className="mt-4 flex h-12 items-center gap-[3px]">
        {bars.map((h, i) => (
          <span key={i} className="w-[5px] rounded-full bg-brass-soft/80" style={{ height: `${h + 6}px` }} />
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-night px-3 py-2 font-sans text-caption leading-snug text-canvas/80">
        “We already have a vendor for this. Why would we switch?”
      </p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {scores.map((s) => (
          <div key={s.k} className="rounded-lg border border-night-line px-2 py-2 text-center">
            <div className="font-display text-xl text-canvas">{s.v}<span className="text-canvas/40">/10</span></div>
            <div className="mt-0.5 font-sans text-[0.7rem] text-canvas/55">{s.k}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ThingsPreview() {
  return (
    <div className="group relative flex h-full min-h-[17rem] items-center justify-center overflow-hidden rounded-xl border border-line bg-paper" aria-hidden>
      <div className="absolute inset-0 opacity-[0.55]" style={{ background: 'radial-gradient(60% 60% at 50% 40%, #efe9dc 0%, transparent 70%)' }} />
      <svg viewBox="0 0 200 190" className="relative w-52 transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:scale-105">
        <ellipse cx="100" cy="176" rx="58" ry="8" fill="#1a1712" opacity="0.12" />
        <path d="M40 112c0-44 26-74 60-74s60 30 60 74c0 34-24 56-60 56s-60-22-60-56z" fill="#e9b8c4" />
        <path d="M44 100c8-34 30-52 56-52s48 18 56 52c-18-14-36-20-56-20s-38 6-56 20z" fill="#7aa6d6" />
        <circle cx="100" cy="42" r="9" fill="#7aa6d6" />
        <ellipse cx="76" cy="116" rx="7" ry="9" fill="#1a1712" />
        <ellipse cx="124" cy="116" rx="7" ry="9" fill="#1a1712" />
        <circle cx="78" cy="112" r="2.4" fill="#fff" />
        <circle cx="126" cy="112" r="2.4" fill="#fff" />
        <ellipse cx="62" cy="134" rx="9" ry="5.5" fill="#d98aa0" opacity="0.7" />
        <ellipse cx="138" cy="134" rx="9" ry="5.5" fill="#d98aa0" opacity="0.7" />
        <path d="M92 134q8 8 16 0" stroke="#1a1712" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <span className="absolute bottom-3 right-3 rounded-full border border-line-strong bg-canvas px-3 py-1 font-sans text-label text-ink-60">
        boop it
      </span>
    </div>
  )
}

/* ---- A full card: used on the hub page. ---- */

export function ToolCard({ tool, placement, index = 0 }: { tool: (typeof TOOLS)[number]; placement: Placement; index?: number }) {
  const dark = tool.key === 'openkit'
  return (
    <Reveal delay={index * 80}>
      <article className="grid gap-8 overflow-hidden rounded-2xl border border-line bg-canvas p-6 sm:p-8 md:grid-cols-12 md:gap-10">
        <div className={`md:col-span-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
          {dark ? <OpenkitPreview /> : <ThingsPreview />}
        </div>
        <div className={`flex flex-col md:col-span-6 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
          <div className="flex flex-wrap gap-2">
            {tool.tags.map((t) => (
              <span key={t} className="rounded-full border border-line-strong px-3 py-1 font-sans text-label text-ink-60">
                {t}
              </span>
            ))}
          </div>
          <h3 className="mt-5 font-display text-ink" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            {tool.name}
            <span className="block text-ink-60" style={{ fontSize: '0.62em', fontWeight: 400, letterSpacing: 0 }}>
              {tool.tagline}
            </span>
          </h3>
          <p className="mt-4 font-sans text-body leading-relaxed text-ink-60">{tool.pitch}</p>
          <ul className="mt-5 space-y-2 font-sans text-caption text-ink-80">
            {tool.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-brass" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={toolUrl(tool.base, placement)} className="btn btn-primary" rel="noopener">
              {tool.cta}
            </a>
            <span className="font-sans text-label text-ink-45">{tool.host}</span>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

/* ---- A compact block: the Cailyx page and the home page. ---- */

export function FreeToolsBlock({ placement, tone = 'light' }: { placement: Exclude<Placement, 'hub' | 'shortlink'>; tone?: 'light' | 'sand' }) {
  return (
    <section className={`border-t border-line ${tone === 'sand' ? 'bg-canvas-2' : 'bg-canvas'}`} aria-labelledby={`free-tools-${placement}`}>
      <Container className="py-20 sm:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>Also from Rothenhall · Free tools</Eyebrow>
              <h2 id={`free-tools-${placement}`} className="text-display-md mt-5">
                Two things we built for founders. Use them free, no account.
              </h2>
            </div>
            <Link to="/tools" className="link-line font-sans text-caption text-ink">
              See all free tools
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.key} delay={i * 80}>
              <a
                href={toolUrl(tool.base, placement)}
                rel="noopener"
                className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-6 transition-colors duration-200 hover:border-brass sm:p-7"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-ink" style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.01em' }}>
                    {tool.name} <span className="text-ink-60" style={{ fontWeight: 400 }}>· {tool.tagline}</span>
                  </h3>
                  <span aria-hidden className="shrink-0 text-brass transition-transform duration-200 motion-safe:group-hover:translate-x-1">→</span>
                </div>
                <p className="mt-3 font-sans text-caption leading-relaxed text-ink-60">{tool.pitch}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {tool.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line-strong px-3 py-0.5 font-sans text-label text-ink-60">
                      {t}
                    </span>
                  ))}
                  <span className="ml-auto font-sans text-label text-ink-45">{tool.host}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
