import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { FreeToolsBlock } from '../components/FreeTools'
import { seo } from '../lib/seo'
import { HomeHero } from '../components/HomeHero'
import { StoryScroll } from '../components/StoryScroll'
import { StatBlock } from '../components/StatBlock'
import { DiagonalReveal } from '../components/DiagonalReveal'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      path: '/',
      title: 'Rothenhall · Cailyx, the AI Visibility Platform',
      description:
        'Rothenhall is a startup building Cailyx, the AI-visibility platform that makes your company the one AI assistants recommend. Cailyx tracks how ChatGPT, Perplexity and Google AI Overviews see you, diagnoses the gaps, and does the work to fix them.',
    }),
  component: Home,
})

/* ---------------------------------------------------------------- */

const PILLARS = [
  {
    n: '01',
    title: 'Track',
    tag: 'Visibility',
    body: 'See exactly how ChatGPT, Perplexity, Gemini and Google AI Overviews describe and rank you, scored and tracked over time across the prompts your buyers actually ask.',
  },
  {
    n: '02',
    title: 'Diagnose',
    tag: 'Diagnosis',
    body: 'Cailyx finds why you are missing: entity gaps, thin or unreadable content, and missing citations, then tells you what to fix first.',
  },
  {
    n: '03',
    title: 'Fix',
    tag: 'Agentic execution',
    body: 'Agentic workflows build the entities, content and citations that move the score. Cailyx does the work, not just the report.',
  },
  {
    n: '04',
    title: 'Prove',
    tag: 'Outcomes',
    body: 'Every change ties back to citation share, pipeline and revenue, so you can see what visibility is actually worth.',
  },
]

const ENGAGEMENTS = [
  {
    kicker: 'Start free',
    title: 'AI Visibility Score',
    body: 'Run the diagnostic on your public footprint and get your score, and the specific reasons behind it, in minutes. No card, no call.',
  },
  {
    kicker: 'Self-serve',
    title: 'Cailyx subscription',
    body: 'Continuous tracking, diagnosis and prioritised fixes across every major answer engine. Software that moves the number, week over week.',
  },
  {
    kicker: 'Done with you',
    title: 'Managed by Cailyx',
    body: 'Our team runs the agentic execution alongside you, building the entities, content and citations. The service, delivered as part of the product.',
  },
]

function Home() {
  return (
    <>
      <HomeHero />
      <NetworkStrip />
      <StoryScroll />
      <StatBlock />
      <TheShift />
      <DiagonalReveal />
      <TheModel />
      <Engagements />
      <CommunityTeaser />
      <TheMoat />
      <CailyxTeaser />
      <FreeToolsBlock placement="home" />
      <Faq />
      <ProofBand />
    </>
  )
}


/* ---------------------------------------------------------------- */
/*  Network strip (early credential band)                            */
/* ---------------------------------------------------------------- */

function NetworkStrip() {
  return (
    <section className="border-b border-line bg-canvas">
      <Container width="wide" className="py-7 sm:py-8">
        <Reveal>
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
            <p className="eyebrow">
              Built with founders across
            </p>
            <div className="flex items-center gap-4 font-display text-body text-ink">
              <span>Europe</span>
              <span className="text-line-strong">·</span>
              <span>India</span>
              <span className="text-line-strong">·</span>
              <span>USA</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
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
                The AI boom created this problem. It has not solved it.
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
              <p className="mt-6 font-sans text-body leading-relaxed text-ink-60">
                And the tools that exist stop at the score. A tracker tells you
                that you are invisible, then hands the work back to you. Most
                companies do nothing and lose ground to competitors already in
                the answers, or bolt together a dashboard, an SEO agency and a
                freelancer that never coordinate. The result is a number that
                never moves.
              </p>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
                {[
                  { k: 'Do nothing', v: 'Visibility erodes to competitors already cited by AI.' },
                  { k: 'Point solutions', v: 'Three vendors, three roadmaps, no shared accountability.' },
                  { k: 'One tracker', v: 'A dashboard shows the score but leaves the work to you.' },
                ].map((c) => (
                  <div key={c.k} className="bg-canvas p-6">
                    <p className="eyebrow">
                      {c.k}
                    </p>
                    <p className="mt-3 font-sans text-caption leading-relaxed text-ink-60">
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
              One platform runs the whole visibility loop.
            </h2>
            <p className="text-lead mt-6 text-ink-60">
              Not a dashboard that stops at the score. Cailyx measures, diagnoses,
              fixes and proves, as one system, so the number actually moves.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 70} className="bg-canvas">
              <div className="group h-full p-8 sm:p-10 transition-colors hover:bg-canvas-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-4xl text-cognac">{p.n}</span>
                  <span className="eyebrow">
                    {p.tag}
                  </span>
                </div>
                <h3 className="text-display-md mt-6">
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
            <Link to="/about" className="link-line font-sans text-body">
              See how Cailyx works →
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
              <Eyebrow>Plans</Eyebrow>
              <h2 className="text-display-md mt-6">
                Start free. Scale as you grow.
              </h2>
              <p className="mt-6 font-sans text-body leading-relaxed text-ink-60">
                Three ways in: get your score for free, subscribe to track and
                fix, or have our team run it with you.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <div className="flex flex-col divide-y divide-line border-y border-line">
              {ENGAGEMENTS.map((e, i) => (
                <Reveal key={e.title} delay={i * 80}>
                  <div className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-baseline sm:gap-10">
                    <div className="sm:w-40 shrink-0">
                      <p className="eyebrow">
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
              “Every company Cailyx works on adds to a proprietary library: what
              AI sees, what we changed, and what moved. It is not patentable. It
              compounds like it is.”
            </p>
          </blockquote>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-8 max-w-xl font-sans text-body leading-relaxed text-ink-60">
            Owning the whole loop is not just cleaner to buy. It compounds. What
            Cailyx learns making one company the answer makes the next one faster,
            and that library cannot be replicated by a dashboard or a blog post.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <Link to="/about" className="link-line mt-8 inline-block font-sans text-body">
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
              <p className="mt-6 max-w-xl font-sans text-body leading-relaxed text-canvas/60">
                Founders trust demonstrated results. Our marketing is the work
                itself: documented before-and-after showing what changed in the
                answers, and what it was worth.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={120}>
              <div className="flex flex-col items-start gap-5 md:items-end">
                <Link to="/case-studies" className="btn btn-light w-full sm:w-auto">
                  View case studies
                </Link>
                <Link to="/contact" className="link-line font-sans text-body text-canvas/80">
                  Or get your free score →
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
    q: 'What is Rothenhall?',
    a: 'Rothenhall is a startup building Cailyx, an AI-visibility platform. Cailyx tracks how AI assistants like ChatGPT, Perplexity and Google AI Overviews see your company, diagnoses why you are missing, and does the work to fix it.',
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
    a: 'GEO is optimizing content and entities so generative AI models surface and cite your brand in their generated answers. Cailyx treats AEO and GEO as one AI-visibility discipline.',
  },
  {
    q: 'Who is Cailyx for?',
    a: 'Founders and teams who need to be found and recommended by AI assistants: startups, scale-ups and the agencies that serve them, in India and worldwide.',
  },
  {
    q: 'How do plans work?',
    a: 'Start free with an AI Visibility Score, subscribe to Cailyx for continuous tracking and prioritised fixes, or add managed execution where our team runs the work with you.',
  },
  {
    q: 'How does Cailyx measure results?',
    a: 'By AI citation share across ChatGPT, Perplexity, Google AI Overviews, Google AI Mode, Gemini, Google Search, and Copilot, plus the pipeline and conversion that visibility drives.',
  },
  {
    q: 'Is Cailyx available outside India?',
    a: 'Yes. Rothenhall is India-first and Cailyx works for companies worldwide.',
  },
]

function CommunityTeaser() {
  return (
    <section className="border-t border-line bg-canvas-2">
      <Container className="py-24 sm:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <Reveal>
              <Eyebrow>By invitation · Private community</Eyebrow>
              <h2 className="text-display-md mt-6">
                Join the{' '}
                <span style={{ color: 'var(--color-cognac)' }}>Founders Circle</span>.
              </h2>
              <p className="mt-5 max-w-xl font-sans text-body leading-relaxed text-ink-60">
                A private founders network, with our growth engine behind you.
                Members span founders and operators across Europe, India, and the
                USA. Start with a free AI Visibility Score and see exactly where you
                stand in the answers.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {['Europe', 'India', 'USA'].map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center rounded-full border border-line-strong px-3.5 py-1.5 font-sans text-label uppercase tracking-[0.14em] text-ink-80"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={100}>
              <div className="flex flex-col gap-4 md:items-end">
                <Link to="/community" className="btn btn-primary">
                  Request a free invite
                </Link>
                <Link
                  to="/community"
                  className="link-line font-sans text-body text-ink-80"
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
      <Container className="py-24 sm:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-night px-8 py-14 text-canvas sm:px-14 sm:py-20">
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <Eyebrow className="eyebrow-light">The product</Eyebrow>
                <h2 className="text-display-md mt-6 text-canvas">
                  Cailyx, our agentic AI-visibility platform.
                </h2>
                <p className="mt-5 max-w-xl font-sans text-body leading-relaxed text-canvas/65">
                  The product we are building: it maps how AI sees you, builds the
                  entities and citations that move visibility, and tracks citation
                  share across engines. A Cailyx MCP is on the roadmap.
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
                    className="link-line font-sans text-body text-canvas/80"
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
                className="link-line mt-6 inline-block font-sans text-body text-ink-80"
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
