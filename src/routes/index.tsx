import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { HomeHero } from '../components/HomeHero'
import { StoryScroll } from '../components/StoryScroll'
import { StatScroll } from '../components/StatScroll'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Millbrook Partners · The Operating Partner for AI-Era Growth' },
      {
        name: 'description',
        content:
          'One accountable operator across AI answer-engine visibility, go-to-market, and revenue operations for venture- and PE-backed companies.',
      },
    ],
  }),
  component: Home,
})

/* ---------------------------------------------------------------- */

const PILLARS = [
  {
    n: '01',
    title: 'AI Visibility',
    tag: 'AEO · GEO',
    body: 'We make you the company ChatGPT, Perplexity, and Google AI Overviews name. We engineer the content, entities, and citations that answer engines actually surface.',
  },
  {
    n: '02',
    title: 'Go-to-Market',
    tag: 'GTM Operations',
    body: 'Positioning, messaging, and launch: the sharp story and the operating cadence that turn a category insight into pipeline the market understands.',
  },
  {
    n: '03',
    title: 'Revenue Operations',
    tag: 'RevOps',
    body: 'The CRM, attribution, and reporting plumbing that makes growth measurable, so every dollar and every citation ties back to revenue.',
  },
  {
    n: '04',
    title: 'Growth Operating',
    tag: 'Acquisition & Conversion',
    body: 'The running engine: the acquisition and conversion work that compounds demand into booked revenue, owned and iterated week over week.',
  },
]

const ENGAGEMENTS = [
  {
    kicker: 'For early-stage startups',
    title: 'Fixed-fee Sprints',
    body: 'A defined, time-boxed push with a clear scope and a clear outcome. The momentum of a senior operator without the cost or commitment of a full hire.',
  },
  {
    kicker: 'For portfolio companies',
    title: 'Operating Retainers',
    body: 'An ongoing operating partner embedded in a single portfolio company, owning the full revenue stack and accountable for the number, month after month.',
  },
  {
    kicker: 'For funds',
    title: 'Portfolio-wide Retainers',
    body: 'One operating standard applied across a fund’s portfolio, backed by playbooks proven inside it. Consistent growth infrastructure, centrally accountable.',
  },
]

function Home() {
  return (
    <>
      <HomeHero />
      <StoryScroll />
      <StatScroll />
      <TheShift />
      <TheModel />
      <Engagements />
      <TheMoat />
      <ProofBand />
    </>
  )
}


/* ---------------------------------------------------------------- */
/*  The shift                                                        */
/* ---------------------------------------------------------------- */

function TheShift() {
  return (
    <section className="border-t border-line bg-canvas-2">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>The shift</Eyebrow>
              <h2 className="text-display-md mt-6">
                The AI boom created this bottleneck. It didn’t solve it.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={100}>
              <p className="text-lead text-ink-80 dropcap">
                Discovery has moved. Buyers once searched and scrolled; now they
                ask, and an answer engine decides which handful of companies are
                worth naming. Most venture- and PE-backed companies have no
                strategy for being found or cited there.
              </p>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                And even when demand does arrive, the revenue infrastructure
                behind it is fragmented and manual. These companies are lean by
                design, rarely carrying in-house marketing or RevOps depth. So
                they do nothing and lose visibility to competitors already in the
                answers, or they bolt together disconnected point solutions that
                never coordinate: a legacy SEO agency with no grasp of citation
                mechanics, a separate RevOps consultant, a fractional CMO. The
                result is duplicated spend, and no single owner of the outcome.
              </p>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
                {[
                  { k: 'Do nothing', v: 'Visibility erodes to competitors already cited by AI.' },
                  { k: 'Point solutions', v: 'Three vendors, three roadmaps, no shared accountability.' },
                  { k: 'One hire', v: 'A single lead who can’t cover AEO, GTM, and RevOps at once.' },
                ].map((c) => (
                  <div key={c.k} className="bg-canvas p-6">
                    <p className="eyebrow" style={{ letterSpacing: '0.16em' }}>
                      {c.k}
                    </p>
                    <p className="mt-3 font-sans text-[0.92rem] leading-relaxed text-ink-60">
                      {c.v}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  The model (four pillars)                                         */
/* ---------------------------------------------------------------- */

function TheModel() {
  return (
    <section className="border-t border-line">
      <Container className="py-24 sm:py-32">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>The model</Eyebrow>
            <h2 className="text-display-lg mt-6">
              One operator owns the entire revenue stack.
            </h2>
            <p className="text-lead mt-6 text-ink-60">
              Not a coordinator of vendors. The operator. Four disciplines most
              companies buy separately, run by one accountable partner as a
              single, compounding engine.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 70} className="bg-canvas">
              <div className="group h-full p-8 sm:p-10 transition-colors hover:bg-canvas-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-4xl text-cognac">{p.n}</span>
                  <span className="eyebrow" style={{ letterSpacing: '0.16em' }}>
                    {p.tag}
                  </span>
                </div>
                <h3 className="text-display-md mt-6" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)' }}>
                  {p.title}
                </h3>
                <p className="mt-4 font-sans text-[1rem] leading-relaxed text-ink-60">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <Link to="/approach" className="link-line font-sans text-[0.95rem]">
              Read the full approach →
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Engagements                                                      */
/* ---------------------------------------------------------------- */

function Engagements() {
  return (
    <section className="border-t border-line bg-canvas-2">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>Engagements</Eyebrow>
              <h2 className="text-display-md mt-6">
                Priced to the stage you’re at.
              </h2>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                Three ways to work together, from a single defined push to a
                standard applied across an entire portfolio.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <div className="flex flex-col divide-y divide-line border-y border-line">
              {ENGAGEMENTS.map((e, i) => (
                <Reveal key={e.title} delay={i * 80}>
                  <div className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-baseline sm:gap-10">
                    <div className="sm:w-40 shrink-0">
                      <p className="eyebrow" style={{ letterSpacing: '0.14em' }}>
                        {e.kicker}
                      </p>
                    </div>
                    <div>
                      <h3
                        className="font-display transition-colors group-hover:text-cognac"
                        style={{ fontSize: 'clamp(1.5rem,2.6vw,2.1rem)' }}
                      >
                        {e.title}
                      </h3>
                      <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                        {e.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  The moat                                                         */
/* ---------------------------------------------------------------- */

function TheMoat() {
  return (
    <section className="border-t border-line">
      <Container width="narrow" className="py-24 sm:py-32 text-center">
        <Reveal>
          <Eyebrow className="justify-center inline-flex">The compounding advantage</Eyebrow>
        </Reveal>
        <Reveal delay={90}>
          <blockquote className="mt-8">
            <p className="font-display text-ink" style={{ fontSize: 'clamp(1.7rem,3.4vw,2.75rem)', lineHeight: 1.16 }}>
              “Every engagement adds to a proprietary library: citation-tracking
              data, RevOps diagnostics, and portfolio playbooks built from real
              work. It isn’t patentable. It functions like it is.”
            </p>
          </blockquote>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-8 max-w-xl font-sans text-[1.02rem] leading-relaxed text-ink-60">
            Full-stack ownership is not just cleaner to buy. It compounds. What we
            learn making one company the answer makes the next one faster, and
            that library cannot be replicated by reading a blog post or hiring a
            single specialist.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <Link to="/about" className="link-line mt-8 inline-block font-sans text-[0.95rem]">
            The thesis behind Millbrook →
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Proof / CTA band                                                */
/* ---------------------------------------------------------------- */

function ProofBand() {
  return (
    <section className="bg-night text-canvas">
      <Container className="py-24 sm:py-32">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <Eyebrow className="text-brass-soft">Proof, not claims</Eyebrow>
              <h2 className="text-display-lg mt-6 text-canvas">
                Credibility here is earned in before-and-after, not bought in ads.
              </h2>
              <p className="mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/60">
                Funds and founders trust demonstrated results. Our marketing is
                the work itself: documented engagements showing what changed, and
                what it was worth.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={120}>
              <div className="flex flex-col items-start gap-5 md:items-end">
                <Link to="/case-studies" className="btn btn-light w-full sm:w-auto">
                  View case studies
                </Link>
                <Link to="/contact" className="link-line font-sans text-[0.95rem] text-canvas/80">
                  Or start a conversation →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
