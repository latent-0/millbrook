import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'
import { HomeHero } from '../components/HomeHero'
import { StoryScroll } from '../components/StoryScroll'
import { StatBlock } from '../components/StatBlock'
import { DiagonalReveal } from '../components/DiagonalReveal'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      path: '/',
      title: 'Rothenhall Partners · AEO, GEO, GTM & RevOps for AI-Era Growth',
      description:
        'India-first fractional operating partner for venture- and PE-backed companies worldwide. We make you the company AI answer engines (ChatGPT, Perplexity, Google AI Overviews) recommend, and own the go-to-market and RevOps behind the demand.',
      keywords:
        'answer engine optimization, AEO, GEO, generative engine optimization, AI search visibility, fractional operating partner, RevOps, go-to-market, ChatGPT visibility, Perplexity, Google AI Overviews, India',
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
      <StatBlock />
      <TheShift />
      <DiagonalReveal />
      <TheModel />
      <Engagements />
      <CommunityTeaser />
      <TheMoat />
      <CailyxTeaser />
      <Faq />
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
    <section
      className="relative overflow-hidden border-t border-line"
      style={{
        backgroundImage: 'url(/paper-texture.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* warm ivory wash so the crumple reads but ink text stays crisp */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(rgba(247,243,234,0.62), rgba(243,238,225,0.74))',
        }}
      />
      <Container width="narrow" className="relative py-24 sm:py-32 text-center">
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
            The thesis behind Rothenhall →
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

/* ---------------------------------------------------------------- */
/*  FAQ (answer-shaped, with FAQPage structured data)               */
/* ---------------------------------------------------------------- */

const FAQ_ITEMS = [
  {
    q: 'What is Rothenhall Partners?',
    a: 'Rothenhall Partners is an India-first fractional operating partner practice for venture- and PE-backed companies worldwide. One accountable operator owns AI answer-engine visibility (AEO and GEO), go-to-market, and revenue operations as a single engine.',
  },
  {
    q: 'What is Answer Engine Optimization (AEO)?',
    a: 'Answer Engine Optimization is the practice of getting a company named and cited in the answers generated by AI engines like ChatGPT, Perplexity, and Google AI Overviews, rather than only ranking in a list of search results.',
  },
  {
    q: 'How is AEO different from SEO?',
    a: 'SEO optimizes to rank in a list of links. AEO optimizes to be the source an AI answer names and cites. It focuses on entities, citations, and quotable, well-structured content that models pull into their responses.',
  },
  {
    q: 'What is Generative Engine Optimization (GEO)?',
    a: 'GEO is optimizing content and entities so generative AI models surface and cite your brand in their generated answers. Rothenhall treats AEO and GEO as one AI-visibility discipline.',
  },
  {
    q: 'Who does Rothenhall Partners work with?',
    a: 'Early-stage startups through fixed-fee sprints, PE and VC portfolio companies through operating retainers, and funds through portfolio-wide retainers, in India and across the globe.',
  },
  {
    q: 'How do engagements work?',
    a: 'Three models: fixed-fee sprints for a defined push, monthly operating retainers where Rothenhall owns the full revenue stack, and portfolio-wide retainers that apply one operating standard across a fund.',
  },
  {
    q: 'How does Rothenhall measure results?',
    a: 'By AI citation share across ChatGPT, Perplexity, and Google AI Overviews, qualified pipeline, conversion rate, and reporting integrity, all traced through the CRM.',
  },
  {
    q: 'Does Rothenhall work with companies outside India?',
    a: 'Yes. Rothenhall is India-first and works with founders and funds worldwide.',
  },
]

function CommunityTeaser() {
  return (
    <section className="border-t border-line bg-canvas-2">
      <Container className="py-20 sm:py-28">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <Reveal>
              <Eyebrow>By invitation</Eyebrow>
              <h2 className="text-display-md mt-6">
                Join the{' '}
                <span style={{ color: 'var(--color-cognac)' }}>Founders Circle</span>.
              </h2>
              <p className="mt-5 max-w-xl font-sans text-[1.05rem] leading-relaxed text-ink-60">
                A private founders network, with our growth engine behind you.
                Founding members get GTM and AEO from Rothenhall, at no cost.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={100}>
              <div className="flex flex-col gap-4 md:items-end">
                <Link to="/community" className="btn btn-primary">
                  Apply to join
                </Link>
                <Link
                  to="/community"
                  className="link-line font-sans text-[0.95rem] text-ink-80"
                >
                  See what members get →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}

function CailyxTeaser() {
  return (
    <section className="border-t border-line">
      <Container className="py-20 sm:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-night px-8 py-14 text-canvas sm:px-14 sm:py-20">
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <Eyebrow className="eyebrow-light">Our product</Eyebrow>
                <h2 className="text-display-md mt-6 text-canvas">
                  Cailyx, our agentic AEO engine.
                </h2>
                <p className="mt-5 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/65">
                  The AI-native engine that powers our work: it maps how AI sees
                  you, builds the entities and citations that move visibility, and
                  tracks citation share across engines. A Cailyx MCP is on the
                  roadmap.
                </p>
              </div>
              <div className="md:col-span-4">
                <div className="flex flex-col gap-4 md:items-end">
                  <Link to="/cailyx" className="btn btn-light">
                    Explore Cailyx
                  </Link>
                  <Link
                    to="/cailyx"
                    hash="waitlist"
                    className="link-line font-sans text-[0.95rem] text-canvas/80"
                  >
                    Join the waitlist →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

function Faq() {
  return (
    <section className="border-t border-line bg-canvas-2">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>Common questions</Eyebrow>
              <h2 className="text-display-md mt-6">The answers, plainly.</h2>
              <Link
                to="/faq"
                className="link-line mt-6 inline-block font-sans text-[0.95rem] text-ink-80"
              >
                See all questions →
              </Link>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="divide-y divide-line border-y border-line">
              {FAQ_ITEMS.map((item, i) => (
                <Reveal key={item.q} delay={i * 40}>
                  <div className="py-7">
                    <h3 className="font-display text-ink" style={{ fontSize: '1.35rem' }}>
                      {item.q}
                    </h3>
                    <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                      {item.a}
                    </p>
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
