import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/ai-visibility-score')({
  head: () =>
    seo({
      path: '/ai-visibility-score',
      title: 'The AI Visibility Score · Rothenhall Partners',
      description:
        'The AI Visibility Score is Rothenhall Partners’ 0 to 100 measure of how likely an AI assistant is to recommend a company. Five weighted dimensions, measured across ChatGPT, Claude, Perplexity, and Google’s AI surfaces.',
      keywords:
        'AI Visibility Score, AEO score, GEO measurement, AI search visibility metric, ChatGPT visibility, Rothenhall framework',
    }),
  component: AIVisibilityScore,
})

const DIMENSIONS = [
  {
    w: 25,
    q: 'Can the AI crawlers actually fetch your site?',
    name: 'Machine access',
    body: 'Whether GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot and the rest are served or refused, at both the robots.txt and the CDN layer. A silent block here zeroes everything downstream.',
  },
  {
    w: 25,
    q: 'Does a model know which company you are?',
    name: 'Entity clarity',
    body: 'Whether the assistants resolve your name to you, and not a competitor or a same-named product, backed by Organization and Person schema and one consistent descriptor across the web.',
  },
  {
    w: 20,
    q: 'Are you named when buyers ask?',
    name: 'Shortlist presence',
    body: 'Your mention and citation rate on the questions buyers actually type, and your share of voice against named competitors on the third-party lists assistants quote.',
  },
  {
    w: 20,
    q: 'Can a model read and quote your pages?',
    name: 'On-page extractability',
    body: 'Whether your content is server-rendered, chunk-structured, answer-first, and full of extractable claims, or hidden behind JavaScript a crawler never runs.',
  },
  {
    w: 10,
    q: 'Is there real-world proof to reward?',
    name: 'Authority signal',
    body: 'The founders, press, partners, reviews and original data that give a model a reason to trust you and repeat you.',
  },
]

const BANDS = [
  {
    r: '0 – 40',
    name: 'Invisible',
    body: 'The assistants cannot find you, cannot read you, or do not know who you are. New or blocked companies live here.',
  },
  {
    r: '41 – 60',
    name: 'Faint',
    body: 'You exist to the models but rarely surface. Strong companies with weak machine-visibility sit here.',
  },
  {
    r: '61 – 80',
    name: 'Present',
    body: 'You appear for some of the queries that matter, and you are read and understood correctly.',
  },
  {
    r: '81 – 100',
    name: 'Recommended',
    body: 'You are named, cited, and characterised well across surfaces for the queries your buyers ask.',
  },
]

const EXAMPLES = [
  {
    client: 'BetterWaves',
    score: '14',
    band: 'Invisible',
    note: 'A new app with almost no web footprint to be found by.',
  },
  {
    client: 'Napkin',
    score: '43',
    band: 'Faint',
    note: 'A strong studio the AI engines were being blocked from reading.',
  },
  {
    client: 'DayOne Technologies',
    score: '62',
    band: 'Present',
    note: 'Open and credible, but its pages were hidden behind JavaScript.',
  },
]

function AIVisibilityScore() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-7">
              <Reveal>
                <Eyebrow>The framework</Eyebrow>
                <h1 className="text-display-lg mt-8">The AI Visibility Score.</h1>
              </Reveal>
            </div>
            <div className="md:col-span-5 flex items-end">
              <Reveal delay={100}>
                <p className="text-lead text-ink-80">
                  A single number, 0 to 100, for how likely an AI assistant is to
                  recommend a company. We built it because &ldquo;are we visible in
                  AI&rdquo; was a feeling, and a feeling cannot be improved.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Definition (extractable) */}
      <section>
        <Container width="narrow" className="py-20 sm:py-28">
          <Reveal>
            <div className="rounded-2xl border border-line bg-paper p-8 sm:p-10">
              <p className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-brass-deep">
                Definition
              </p>
              <p className="mt-4 font-display text-ink" style={{ fontSize: 'clamp(1.3rem,2.4vw,1.75rem)', lineHeight: 1.32 }}>
                The <strong className="font-medium">AI Visibility Score</strong> is a
                Rothenhall Partners framework: a 0 to 100 measure of how likely an
                AI assistant is to recommend a company, rolled up from five weighted
                dimensions and measured across ChatGPT, Claude, Perplexity, and
                Google&rsquo;s AI surfaces.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-8 font-sans text-[1.05rem] leading-relaxed text-ink-60">
              Ranking in Google no longer decides whether you make a buyer&rsquo;s
              shortlist, because that shortlist is increasingly built inside an AI
              assistant first. The AI Visibility Score measures that new surface
              directly: not where you rank, but whether the models can reach you,
              know who you are, and name you when it counts.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Five dimensions */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>What it measures</Eyebrow>
              <h2 className="text-display-md mt-6">Five weighted dimensions.</h2>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                Each dimension answers one question a model implicitly asks before
                it recommends you. The weights reflect what actually decides an AI
                answer, access and identity first, proof last.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-line">
            {DIMENSIONS.map((d, i) => (
              <Reveal key={d.name} delay={i * 60}>
                <div
                  className="grid gap-5 bg-canvas p-7 sm:grid-cols-12 sm:items-baseline sm:p-8"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-line)' }}
                >
                  <div className="sm:col-span-2">
                    <span className="font-display text-brass" style={{ fontSize: '2.4rem', lineHeight: 1 }}>
                      {d.w}
                    </span>
                    <span className="ml-1 font-sans text-[0.75rem] text-ink-45">pts</span>
                  </div>
                  <div className="sm:col-span-4">
                    <p className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-brass-deep">
                      {d.name}
                    </p>
                    <p className="mt-2 font-display text-ink" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>
                      {d.q}
                    </p>
                  </div>
                  <div className="sm:col-span-6">
                    <p className="font-sans text-[0.98rem] leading-relaxed text-ink-60">
                      {d.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Bands */}
      <section className="border-t border-line">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>How to read a score</Eyebrow>
              <h2 className="text-display-md mt-6">Four bands.</h2>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                The number is a communication device. The band is what a founder
                remembers.
              </p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {BANDS.map((b, i) => (
              <Reveal key={b.name} delay={i * 70} className="bg-canvas">
                <div className="h-full p-8">
                  <p className="font-display text-brass-deep tabular-nums" style={{ fontSize: '1.15rem' }}>
                    {b.r}
                  </p>
                  <h3 className="mt-2 font-display" style={{ fontSize: '1.5rem' }}>
                    {b.name}
                  </h3>
                  <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-ink-60">
                    {b.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How it is measured */}
      <section className="border-t border-line bg-canvas-2">
        <Container width="narrow" className="py-24 sm:py-32">
          <Reveal>
            <Eyebrow>How it is measured</Eyebrow>
            <h2 className="text-display-md mt-6">
              Distributions, not a single screenshot.
            </h2>
          </Reveal>
          <div className="mt-10 space-y-6">
            {[
              ['A defined query set.', 'We never score against a vibe. The score is computed against a named, versioned set of the prompts your buyers actually type, which you own.'],
              ['At least five runs, at least two geographies.', 'AI answers are non-deterministic. A single run is noise. Every prompt runs five or more times, across geographies, so the number is a rate, not a lucky screenshot.'],
              ['Rates, never rankings.', 'There is no rank in an AI answer. We report how often you appear, are cited, and are described accurately, as distributions across ChatGPT, Claude, Perplexity, and Google.'],
              ['Every number sourced and caveated.', 'Referral data is an undercount and we say so. We do not promise placement in any individual answer, because nobody controls a probabilistic synthesis step.'],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 60}>
                <div className="border-l-2 border-brass pl-5">
                  <h3 className="font-display text-ink" style={{ fontSize: '1.2rem' }}>
                    {t}
                  </h3>
                  <p className="mt-2 font-sans text-[0.98rem] leading-relaxed text-ink-60">
                    {b}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* What it is not */}
      <section className="border-t border-line">
        <Container width="narrow" className="py-20 sm:py-28">
          <Reveal>
            <Eyebrow>Claims discipline</Eyebrow>
            <h2 className="text-display-md mt-6">What the score is not.</h2>
            <ul className="mt-8 space-y-3 font-sans text-[1.02rem] leading-relaxed text-ink-60">
              <li>Not a ranking. There is no position to hold in a synthesised answer.</li>
              <li>Not a guarantee. We move rates, never the outcome of any single response.</li>
              <li>Not a one-off. A single measurement decays within days, so the score is a tracked line, not a certificate.</li>
              <li>Not a black box. Every sub-score traces back to the runs and checks that produced it.</li>
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Scores in the wild */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Scores in the wild</Eyebrow>
              <h2 className="text-display-md mt-6">The same measure, three companies.</h2>
              <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                The score is only useful if it is comparable. Here it is, applied to
                three real diagnostics.
              </p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {EXAMPLES.map((e, i) => (
              <Reveal key={e.client} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-canvas p-8">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-brass-deep tabular-nums" style={{ fontSize: '3rem', lineHeight: 1 }}>
                      {e.score}
                    </span>
                    <span className="font-sans text-[0.8rem] text-ink-45">/ 100</span>
                  </div>
                  <p className="mt-3 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-brass-deep">
                    {e.band}
                  </p>
                  <h3 className="mt-4 font-display" style={{ fontSize: '1.35rem' }}>
                    {e.client}
                  </h3>
                  <p className="mt-2 font-sans text-[0.95rem] leading-relaxed text-ink-60">
                    {e.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <Link to="/case-studies" className="link-line mt-10 inline-block font-sans text-[0.95rem]">
              Read the full case studies &rarr;
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <Container width="narrow" className="py-24 sm:py-32 text-center">
          <Reveal>
            <h2 className="text-display-md">What is your AI Visibility Score?</h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-ink-60">
              We run the diagnostic on your public footprint and return the score,
              the five sub-scores, and the specific, reproducible reasons behind
              each one. The findings are yours to keep.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">
                Request your diagnostic
              </Link>
              <Link to="/about" className="btn btn-ghost">
                See how we work
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
