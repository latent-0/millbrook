import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/about')({
  head: () =>
    seo({
      path: '/about',
      title: 'About · The AI-Era Operating Partner · Rothenhall Partners',
      description:
        'Rothenhall Partners is an India-first fractional operating partner practice for the AI era, owning AI answer-engine visibility, go-to-market, and revenue operations as one compounding engine for founders and funds worldwide.',
      keywords:
        'fractional operating partner, AI era growth, AEO, GEO, RevOps, go-to-market, India',
    }),
  component: About,
})

const PRINCIPLES = [
  {
    n: '01',
    title: 'One accountable owner',
    body: 'No hand-offs, no diffusion of responsibility. A single operator owns the outcome across every discipline, so there is always one person answerable for the number.',
  },
  {
    n: '02',
    title: 'Own the full stack',
    body: 'Visibility, positioning, plumbing, and the growth engine are one system. We run them together because the value is in how they connect, not in any one part.',
  },
  {
    n: '03',
    title: 'Proof over claims',
    body: 'We market with documented before-and-afters, not adjectives. If we can’t show it, we don’t say it.',
  },
  {
    n: '04',
    title: 'Compound everything',
    body: 'Every engagement feeds the library. The lessons of one company make the next one faster, an advantage that grows with the work.',
  },
]

const FOR = [
  {
    k: 'Early-stage startups',
    v: 'That need a defined, senior push: real momentum without the cost or risk of a full-time hire.',
  },
  {
    k: 'PE & VC portfolio companies',
    v: 'Lean by design, with no in-house marketing or RevOps depth, that need an operator to own growth.',
  },
  {
    k: 'Funds',
    v: 'That want one operating standard applied across a portfolio, backed by playbooks proven inside it.',
  },
]

function About() {
  return (
    <>
      {/* Header / thesis */}
      <section className="border-b border-line">
        <Container className="pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <Eyebrow>About</Eyebrow>
                <h1 className="text-display-lg mt-8">
                  Built for the bottleneck the AI boom created.
                </h1>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex items-end">
              <Reveal delay={100}>
                <p className="text-lead text-ink-80 dropcap">
                  The technology that changed how buyers discover companies did
                  not hand those companies a way to be found. That gap, between a
                  new front page made of AI answers and the lean teams with no
                  strategy for appearing in them, is the reason Rothenhall exists.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* The moat / library */}
      <section className="bg-night text-canvas">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <Eyebrow className="text-brass-soft">The compounding library</Eyebrow>
                <h2 className="text-display-md mt-6 text-canvas">
                  The closest thing to intellectual property this work can have.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={100}>
                <p className="text-lead text-canvas/70">
                  Full-stack ownership does something a set of point solutions
                  never can: it accumulates. Every engagement adds to a
                  proprietary library: citation-tracking data on how answer
                  engines actually behave, RevOps diagnostics from real revenue
                  systems, and portfolio playbooks refined against outcomes.
                </p>
                <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-canvas/60">
                  It is not patentable. It functions like it is. You cannot
                  reproduce it by reading a blog post or hiring a single
                  specialist, and it is why the second engagement is sharper than
                  the first, and the tenth sharper still.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section className="border-t border-line">
        <Container className="py-24 sm:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Operating principles</Eyebrow>
              <h2 className="text-display-lg mt-6">How Rothenhall works.</h2>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 70} className="bg-canvas">
                <div className="h-full p-8 sm:p-10">
                  <span className="font-display text-4xl text-brass">{p.n}</span>
                  <h3 className="mt-5 font-display" style={{ fontSize: '1.6rem' }}>
                    {p.title}
                  </h3>
                  <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Who it's for */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <Eyebrow>Who it’s for</Eyebrow>
                <h2 className="text-display-md mt-6">
                  Lean teams that still have to win.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <div className="divide-y divide-line border-y border-line">
                {FOR.map((f, i) => (
                  <Reveal key={f.k} delay={i * 80}>
                    <div className="py-7">
                      <p className="font-display text-ink" style={{ fontSize: '1.4rem' }}>
                        {f.k}
                      </p>
                      <p className="mt-2 font-sans text-[1rem] leading-relaxed text-ink-60">
                        {f.v}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <Container width="narrow" className="py-24 sm:py-32 text-center">
          <Reveal>
            <h2 className="text-display-md">
              If the gap is yours, let’s close it.
            </h2>
            <div className="mt-9 flex justify-center">
              <Link to="/contact" className="btn btn-primary">
                Start a conversation
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
