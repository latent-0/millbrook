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

const FOUNDER_LINKS = [
  {
    label: 'Kunal on LinkedIn',
    href: 'https://www.linkedin.com/in/kunalachintyareddy/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.64h.06c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9z" />
      </svg>
    ),
  },
  {
    label: 'Kunal on Google Scholar',
    href: 'https://scholar.google.com/citations?user=8ajuQHEAAAAJ&hl=en',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
        <path d="M12 3 1 9l11 6 7-3.82V17h2V9.9L23 9zM5 13.18V17c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.82l-7 3.82z" />
      </svg>
    ),
  },
  {
    label: 'Email Kunal',
    href: 'mailto:kunal@rothenhall.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="18" height="18" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </svg>
    ),
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

      {/* Founder */}
      <section id="founder" className="scroll-mt-28 border-b border-line">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <Reveal>
                <div className="convex-light overflow-hidden rounded-[2rem] rounded-br-[4rem] p-2">
                  <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[1.6rem] rounded-br-[3.4rem] bg-canvas-2">
                    <span className="font-display text-7xl text-line-strong" aria-hidden>
                      KA
                    </span>
                    <img
                      src="/brand/founder.jpg"
                      alt="Kunal Achintya Reddy, founder of Rothenhall Partners"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={100}>
                <Eyebrow>Founder</Eyebrow>
                <h2 className="text-display-md mt-6">Kunal Achintya Reddy</h2>
                <p className="mt-3 font-sans text-[0.82rem] uppercase tracking-[0.16em] text-cognac-deep">
                  Founder, Rothenhall Partners
                </p>
                <p className="mt-7 text-lead text-ink-80">
                  Kunal founded Rothenhall to close the gap the AI boom opened: a
                  new front page made of AI answers, and lean teams with no way to
                  appear in it.
                </p>
                <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                  He is the operating partner behind AEO, GTM, and RevOps for
                  founders and funds, and researches how answer engines decide who
                  gets recommended. The practice is that research turned into a
                  repeatable operating standard.
                </p>
                <div className="mt-8 flex items-center gap-3">
                  {FOUNDER_LINKS.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      aria-label={l.label}
                      title={l.label}
                      target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={l.href.startsWith('mailto:') ? undefined : 'me noopener noreferrer'}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-45 transition-colors hover:border-cognac hover:text-cognac-deep"
                    >
                      {l.icon}
                    </a>
                  ))}
                </div>
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
