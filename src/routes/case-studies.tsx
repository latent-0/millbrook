import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/case-studies')({
  head: () =>
    seo({
      path: '/case-studies',
      title: 'Case Studies · Proof of AI-Era Growth · Rothenhall Partners',
      description:
        'How Rothenhall documents before-and-after proof across AI answer-engine visibility, go-to-market, and revenue operations. Credibility earned in results, not claims.',
      keywords:
        'AEO case study, AI visibility results, RevOps outcomes, go-to-market proof, fractional operating partner',
    }),
  component: CaseStudies,
})

const ANATOMY = [
  {
    n: '01',
    title: 'Baseline',
    body: 'Where you start: AI citation share, pipeline, conversion, and the state of the RevOps data, captured before a single change is made.',
  },
  {
    n: '02',
    title: 'Intervention',
    body: 'Exactly what we did, in what order, and why: the visibility work, the GTM shifts, the RevOps fixes, and the growth experiments that shipped.',
  },
  {
    n: '03',
    title: 'Outcome',
    body: 'The after, measured against the baseline, not against a story. What moved, by how much, over what window.',
  },
  {
    n: '04',
    title: 'Attribution',
    body: 'The line from work to revenue, including AI-driven discovery, traced through the CRM so the result is defensible to a founder or a fund.',
  },
]

const METRICS = [
  { v: 'AI citation share', d: 'Presence across ChatGPT, Perplexity, and AI Overviews for the queries that matter.' },
  { v: 'Qualified pipeline', d: 'Sourced and influenced pipeline, attributable to the engine we build.' },
  { v: 'Conversion rate', d: 'Movement through a funnel that is finally measured end to end.' },
  { v: 'Reporting integrity', d: 'A single source of truth a fund can read and trust.' },
]

const CASE_STUDIES = [
  {
    slug: 'napkin',
    client: 'Napkin',
    tag: 'Creative AI studio, Dublin',
    type: 'Diagnostic',
    metric: '43 / 100',
    metricLabel: 'AI Visibility Score',
    result: 'A silent CDN rule was turning away Perplexity, Claude and ChatGPT.',
    body: 'A strong studio, invisible to AI search. The diagnostic found the crawlers blocked at the network edge, an entity collision with a US tool of the same name, and no presence on the lists assistants cite. Three fixable problems, one they could not have known without us.',
    report: '/reports/napkin',
  },
  {
    slug: 'betterwaves',
    client: 'BetterWaves',
    tag: 'AI wellbeing app',
    type: 'Diagnostic',
    metric: '14 / 100',
    metricLabel: 'AI Visibility Score',
    result: 'A real app with almost no web footprint to be found by.',
    body: 'A new app the assistants could not surface: no marketing site, a colliding name, and absent from every best-app guide. The diagnostic mapped the exact first moves to go from invisible to found.',
    report: '/reports/betterwaves',
  },
  {
    slug: 'day1tech',
    client: 'DayOne Technologies',
    tag: 'Technology operating partner',
    type: 'Diagnostic and remediation',
    metric: '55 → 62',
    metricLabel: 'AI Visibility Score, +12%',
    result: '+12% AI visibility and 3 new qualified leads from phase one.',
    body: 'A capable firm whose content sat behind JavaScript the AI crawler cannot run, and whose name was ambiguous. We declared the entity, fixed the structured data, and earned list placements. Phase one lifted AI visibility and sourced three new leads. The audit flags rendering as the next unlock.',
    report: '/reports/day1tech',
  },
]

function CaseStudies() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-line">
        <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
          <Reveal>
            <Eyebrow>Case studies</Eyebrow>
            <h1 className="text-display-lg mt-8 max-w-4xl">
              Proof, not claims.
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-ink-60">
              Credibility with funds and founders is earned through demonstrated
              results, not paid advertising, and not adjectives. Our marketing
              is the work itself: every engagement documented as a rigorous
              before-and-after.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Anatomy of a case study */}
      <section>
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>The anatomy of a case study</Eyebrow>
              <h2 className="text-display-md mt-6">
                What every documented engagement captures.
              </h2>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                A case study is only proof if it can be checked. Ours follow the
                same structure every time, so the result speaks for itself.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {ANATOMY.map((a, i) => (
              <Reveal key={a.n} delay={i * 70} className="bg-canvas">
                <div className="h-full p-8">
                  <span className="font-display text-3xl text-brass">{a.n}</span>
                  <h3 className="mt-5 font-display" style={{ fontSize: '1.4rem' }}>
                    {a.title}
                  </h3>
                  <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-ink-60">
                    {a.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* What we move (illustrative) */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <Eyebrow>What we move</Eyebrow>
                <h2 className="text-display-md mt-6">
                  The dimensions each engagement is built to change.
                </h2>
                <p className="mt-6 font-sans text-[1rem] leading-relaxed text-ink-60">
                  These are the measures we baseline on day one and report against
                  throughout: the axes a Rothenhall case study is written along.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {METRICS.map((m, i) => (
                  <Reveal key={m.v} delay={i * 70} className="bg-canvas">
                    <div className="h-full p-7">
                      <p className="font-display text-brass-deep" style={{ fontSize: '1.3rem' }}>
                        {m.v}
                      </p>
                      <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-ink-60">
                        {m.d}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Documented engagements */}
      <section className="border-t border-line">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Documented engagements</Eyebrow>
              <h2 className="text-display-md mt-6">The proof, client by client.</h2>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                Every engagement opens with the same diagnostic: a measured AI
                Visibility Score and the specific, reproducible reasons an
                assistant does or does not recommend the company. Read the full
                brief for any of them.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {CASE_STUDIES.map((cs, i) => (
              <Reveal key={cs.slug} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-canvas p-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink-45">
                      {cs.tag}
                    </span>
                    <span className="whitespace-nowrap rounded-full border border-line-strong px-3 py-1 font-sans text-[0.62rem] uppercase tracking-[0.1em] text-brass-deep">
                      {cs.type}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display" style={{ fontSize: '1.7rem' }}>
                    {cs.client}
                  </h3>
                  <div className="mt-5 flex items-baseline gap-3">
                    <span
                      className="font-display text-brass-deep"
                      style={{ fontSize: '2.3rem', lineHeight: 1 }}
                    >
                      {cs.metric}
                    </span>
                    <span className="font-sans text-[0.8rem] text-ink-45">
                      {cs.metricLabel}
                    </span>
                  </div>
                  <p className="mt-5 font-sans text-[0.98rem] font-medium leading-snug text-ink">
                    {cs.result}
                  </p>
                  <p className="mt-3 font-sans text-[0.92rem] leading-relaxed text-ink-60">
                    {cs.body}
                  </p>
                  <a
                    href={cs.report}
                    target="_blank"
                    rel="noopener"
                    className="link-line mt-6 inline-flex items-center gap-2 font-sans text-[0.9rem] font-medium text-ink"
                  >
                    Read the AI visibility brief
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 max-w-3xl font-sans text-[0.8rem] leading-relaxed text-ink-45">
            Napkin and BetterWaves engaged for the diagnostic. DayOne Technologies
            engaged for the diagnostic and the first phase of remediation; the
            movement shown reflects that engagement against the baseline captured
            at kickoff.
          </p>
        </Container>
      </section>

      {/* Founding cohort (honest state) */}
      <section className="border-t border-line bg-canvas-2">
        <Container width="narrow" className="py-24 sm:py-32 text-center">
          <Reveal>
            <Eyebrow className="justify-center inline-flex">Founding engagements</Eyebrow>
            <h2 className="text-display-md mt-8">
              Your company could be the next brief.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-ink-60">
              Rothenhall is taking on a small founding cohort of startups and
              portfolio companies. Early clients get a senior operator’s full
              attention, and become the documented proof this practice is built
              on. If you want to be first, the seat is worth taking.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">
                Become a founding client
              </Link>
              <Link to="/approach" className="btn btn-ghost">
                See the model
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
