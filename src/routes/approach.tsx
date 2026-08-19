import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'

export const Route = createFileRoute('/approach')({
  head: () => ({
    meta: [
      { title: 'Approach · Millbrook Partners' },
      {
        name: 'description',
        content:
          'The Millbrook operating model: AEO/GEO for AI visibility, GTM operations, RevOps, and growth operating, owned end to end by one accountable partner.',
      },
    ],
  }),
  component: Approach,
})

const DISCIPLINES = [
  {
    n: '01',
    tag: 'AEO · GEO',
    title: 'AI Visibility',
    lead: 'Making you the company answer engines name and cite.',
    points: [
      'Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) built on how ChatGPT, Perplexity, and Google AI Overviews actually select and cite sources.',
      'Entity and content architecture: the structured, quotable, well-attributed material that models pull into answers.',
      'Citation tracking that shows where and how you appear across engines over time, not vanity keyword ranks.',
    ],
  },
  {
    n: '02',
    tag: 'GTM Operations',
    title: 'Go-to-Market',
    lead: 'A sharp story and the cadence to run it.',
    points: [
      'Positioning and messaging that give the market a clear reason to choose you, and give answer engines something specific to cite.',
      'Launch planning and execution, coordinated across channels rather than scattered across vendors.',
      'A GTM operating rhythm the team can actually sustain after the sprint ends.',
    ],
  },
  {
    n: '03',
    tag: 'RevOps',
    title: 'Revenue Operations',
    lead: 'The plumbing that makes growth measurable.',
    points: [
      'CRM configured to reflect how you actually sell: clean stages, clean data, no guesswork.',
      'Attribution that connects demand back to source, including AI-driven discovery, so spend is defensible.',
      'Reporting a founder or a fund can read in a glance and trust.',
    ],
  },
  {
    n: '04',
    tag: 'Acquisition & Conversion',
    title: 'Growth Operating',
    lead: 'The engine that turns visibility into revenue.',
    points: [
      'The running acquisition and conversion work, owned, iterated, and reported week over week.',
      'Experiments prioritized by expected impact, not by what is easy to ship.',
      'A conversion path that compounds: every improvement makes the next one worth more.',
    ],
  },
]

const STEPS = [
  {
    n: 'I',
    title: 'Diagnose',
    body: 'A full read of where you stand across AI visibility, GTM, and RevOps, and where revenue is leaking between them.',
  },
  {
    n: 'II',
    title: 'Build',
    body: 'Fix the infrastructure and ship the visibility work, in the sequence that produces measurable movement fastest.',
  },
  {
    n: 'III',
    title: 'Operate',
    body: 'Run the engine (acquisition, conversion, reporting), iterating against the number, not against a checklist.',
  },
  {
    n: 'IV',
    title: 'Compound',
    body: 'Feed every result back into the playbook, so the next cycle, and the next company, starts further ahead.',
  },
]

function Approach() {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-line">
        <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
          <Reveal>
            <Eyebrow>The approach</Eyebrow>
            <h1 className="text-display-lg mt-8 max-w-4xl">
              Four disciplines. One operator. A single accountable engine.
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-ink-60">
              Most companies buy these separately and hope they add up. Millbrook
              runs them as one system, because AI visibility without RevOps is
              unmeasurable, and RevOps without a growth engine has nothing to
              measure.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Disciplines */}
      <section>
        <Container className="py-8 sm:py-12">
          {DISCIPLINES.map((d, i) => (
            <Reveal key={d.n}>
              <div
                className={`grid gap-8 py-16 sm:py-20 md:grid-cols-12 ${
                  i !== 0 ? 'border-t border-line' : ''
                }`}
              >
                <div className="md:col-span-5">
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-5xl text-brass">{d.n}</span>
                    <span className="eyebrow" style={{ letterSpacing: '0.16em' }}>
                      {d.tag}
                    </span>
                  </div>
                  <h2 className="text-display-md mt-6">{d.title}</h2>
                  <p className="mt-4 font-display text-ink-60" style={{ fontSize: '1.3rem', lineHeight: 1.35 }}>
                    {d.lead}
                  </p>
                </div>
                <div className="md:col-span-6 md:col-start-7 flex items-center">
                  <ul className="w-full divide-y divide-line border-y border-line">
                    {d.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex gap-4 py-5 font-sans text-[1.02rem] leading-relaxed text-ink-80"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* How an engagement runs */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>How an engagement runs</Eyebrow>
              <h2 className="text-display-lg mt-6">
                Diagnose, build, operate, compound.
              </h2>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 70} className="bg-canvas">
                <div className="h-full p-8">
                  <span className="font-display text-3xl text-brass">{s.n}</span>
                  <h3 className="mt-5 font-display" style={{ fontSize: '1.5rem' }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-ink-60">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Where Millbrook fits */}
      <section className="border-t border-line">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <Eyebrow>Where Millbrook fits</Eyebrow>
                <h2 className="text-display-md mt-6">
                  The specialists do one thing. We own how they add up.
                </h2>
                <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                  There are excellent point solutions in the market. What none of
                  them do is combine AI-visibility work with RevOps and GTM
                  execution under a single owner accountable for the result.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={100}>
                <div className="divide-y divide-line border-y border-line">
                  {[
                    {
                      k: 'GEO / AEO specialists',
                      v: 'Move your citations, then hand the pipeline to someone else.',
                    },
                    {
                      k: 'RevOps & fractional GTM firms',
                      v: 'Fix the plumbing, without owning whether AI ever names you.',
                    },
                    {
                      k: 'Fractional CMO firms',
                      v: 'Bring senior marketing leadership, rarely the AI-citation and RevOps depth.',
                    },
                    {
                      k: 'Legacy SEO & generalists',
                      v: 'Optimize for a search era that answer engines are replacing.',
                    },
                  ].map((r) => (
                    <div key={r.k} className="py-6">
                      <p className="font-display text-ink" style={{ fontSize: '1.25rem' }}>
                        {r.k}
                      </p>
                      <p className="mt-2 font-sans text-[0.98rem] leading-relaxed text-ink-60">
                        {r.v}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 font-sans text-[1.05rem] leading-relaxed text-ink-80">
                  Millbrook is the one seat that holds all of it, so there is no
                  gap between being found, being measured, and being sold.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-night text-canvas">
        <Container className="py-20 sm:py-28 text-center">
          <Reveal>
            <h2 className="text-display-md mx-auto max-w-3xl text-canvas">
              Ready to see where you stand across the stack?
            </h2>
            <div className="mt-9 flex justify-center">
              <Link to="/contact" className="btn btn-light">
                Request a diagnostic
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
