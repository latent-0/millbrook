import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'

export const Route = createFileRoute('/case-studies')({
  head: () => ({
    meta: [
      { title: 'Case Studies · Millbrook Partners' },
      {
        name: 'description',
        content:
          'How Millbrook documents proof: the anatomy of a before-and-after case study across AI visibility, GTM, and RevOps, and the outcomes each engagement is built to move.',
      },
    ],
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
                  throughout: the axes a Millbrook case study is written along.
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

      {/* Founding cohort (honest state) */}
      <section className="border-t border-line">
        <Container width="narrow" className="py-24 sm:py-32 text-center">
          <Reveal>
            <Eyebrow className="justify-center inline-flex">Founding engagements</Eyebrow>
            <h2 className="text-display-md mt-8">
              The first case studies are being written now.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-ink-60">
              Millbrook is taking on a small founding cohort of startups and
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
