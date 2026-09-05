import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/careers')({
  head: () =>
    seo({
      path: '/careers',
      title: 'Careers · Build the Company AI Recommends · Rothenhall Partners',
      description:
        'Join Rothenhall Partners and Cailyx. We are building an AI-native growth engine for the answer-engine era: AEO and GEO, go-to-market, and RevOps as one accountable practice. Open roles, internships, and the Campus Scouts program.',
      keywords:
        'Rothenhall careers, Cailyx jobs, AEO SEO jobs India, AI startup careers Bengaluru, growth operator role, founding engineer AI',
    }),
  component: Careers,
})

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 24, stiffness: 120 },
  },
}

const APPLY = 'mailto:careers@rothenhall.com'

type Role = {
  id: string
  title: string
  type: string
  place: string
  body: string
}

const ROLES: Role[] = [
  {
    id: 'founding-growth-operator',
    title: 'Founding Growth Operator',
    type: 'Full-time',
    place: 'Bengaluru · Hybrid',
    body: 'Own go-to-market and demand for Rothenhall and Cailyx end to end. You have run growth for a startup before and want to build the engine, not just work a channel.',
  },
  {
    id: 'aeo-seo-strategist',
    title: 'AEO and SEO Strategist',
    type: 'Full-time or contract',
    place: 'Remote · India',
    body: 'Live in the mechanics of how AI answer engines and search decide what to surface. You turn diagnostics into shipped changes that move a company from invisible to recommended.',
  },
  {
    id: 'founding-engineer-cailyx',
    title: 'Founding Engineer, Cailyx',
    type: 'Full-time',
    place: 'Bengaluru · Hybrid',
    body: 'Build the agentic AEO product from the studs up. TypeScript, React, TanStack, and the LLM plumbing behind it. You ship, measure, and iterate without waiting for permission.',
  },
  {
    id: 'ai-engineer-retrieval',
    title: 'AI Engineer, Retrieval and LLMs',
    type: 'Full-time',
    place: 'Remote · India',
    body: 'Design the systems that read the web the way answer engines do, and the agents that fix what they find. Retrieval, evaluations, and prompt orchestration are your craft.',
  },
  {
    id: 'editorial-content-lead',
    title: 'Editorial and Content Lead',
    type: 'Full-time',
    place: 'Remote · India',
    body: 'Set the voice of a practice known for how it writes. Turn research into the pieces founders cite, and run the Journal that seeds our own visibility.',
  },
]

const VALUES = [
  {
    n: '01',
    title: 'Execution over advice',
    body: 'Anyone can hand a company a report. We diagnose, then do the work, then measure what changed.',
  },
  {
    n: '02',
    title: 'Proof over adjectives',
    body: 'Numbers and shipped outcomes make the case. Leads, citations, and before-and-afters, not superlatives.',
  },
  {
    n: '03',
    title: 'One accountable engine',
    body: 'AEO, GTM, and RevOps are one system with one owner. No handoffs, no finger-pointing between agencies.',
  },
  {
    n: '04',
    title: 'Learn in public',
    body: 'We publish what we find. The work builds our own visibility while it teaches the market.',
  },
]

const PATHS = [
  {
    title: 'Campus Scouts',
    tag: 'Students',
    body: 'Our campus ambassador program. Learn AEO and GEO, publish in public, and rank up through a three-month cohort with real swag, credentials, and an internship path.',
    cta: 'See the program',
    href: '/scouts',
    internal: true,
  },
  {
    title: 'Internships',
    tag: 'Early career',
    body: 'Project-based internships across engineering, AEO strategy, and content. Real ownership on live client work, not fetch-and-carry.',
    cta: 'Apply for an internship',
    href: 'mailto:careers@rothenhall.com?subject=Internship%20application',
    internal: false,
  },
  {
    title: 'Founders Circle',
    tag: 'Founders',
    body: 'Not a job, a network. Our initial cohort of founders gets the Rothenhall engine at no cost in exchange for becoming the proof this practice is known by.',
    cta: 'Request an invite',
    href: '/community',
    internal: true,
  },
]

const PROCESS = [
  { n: '01', title: 'Apply', body: 'Send your work, not just a resume. A link, a repo, a piece you wrote.' },
  { n: '02', title: 'Intro call', body: 'A short conversation to see if the problem and the pace fit you.' },
  { n: '03', title: 'A real exercise', body: 'A small, paid piece of the actual work. We both learn more from this than any interview.' },
  { n: '04', title: 'Meet the founder', body: 'Talk through how you think, what you would own, and where this goes.' },
  { n: '05', title: 'Offer', body: 'If it is a fit, we move quickly.' },
]

function Careers() {
  const reduce = useReducedMotion()

  return (
    <div className="bg-canvas text-ink">
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-canvas">
        <img
          src="/brand/griffin.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-10 hidden w-[34rem] select-none md:block"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.05 }}
        />
        <Container width="wide" className="relative py-20 sm:py-28">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} className="max-w-3xl">
            <motion.div variants={rise}>
              <Eyebrow className="text-brass-soft">Careers</Eyebrow>
            </motion.div>
            <motion.h1
              variants={rise}
              className="mt-7 font-display"
              style={{
                fontSize: 'clamp(2.6rem, 5.4vw, 5rem)',
                fontWeight: 300,
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
              }}
            >
              Build the company{' '}
              <span style={{ color: 'var(--color-cognac-soft)' }}>AI recommends.</span>
            </motion.h1>
            <motion.p
              variants={rise}
              className="mt-8 max-w-xl font-sans text-[1.12rem] leading-relaxed text-canvas/70"
            >
              Discovery is moving from search engines to answer engines, and most
              companies have no idea whether they show up. We are building the
              AI-native practice that fixes that, then proves it. Come build it
              with us.
            </motion.p>
            <motion.div variants={rise} className="mt-9 flex flex-wrap gap-3">
              <a href="#open-roles" className="btn btn-light !px-6">
                See open roles
              </a>
              <a href="#ways-in" className="btn btn-ghost-light !px-6">
                Other ways in
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* What we are building */}
      <section aria-labelledby="building-heading" className="border-t border-line">
        <Container className="py-20 sm:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
            <Reveal>
              <Eyebrow>What we are building</Eyebrow>
              <h2 id="building-heading" className="text-display-md mt-6">
                An operating partner for the AI era.
              </h2>
            </Reveal>
            <Reveal>
              <div className="max-w-xl font-sans text-[1.05rem] leading-relaxed text-ink-60">
                <p>
                  Rothenhall is the fractional operating partner for
                  venture-backed and PE-backed companies. AI visibility, go-to-market,
                  and revenue operations, owned as one accountable engine.
                </p>
                <p className="mt-4">
                  Cailyx is the product we are building on top of it: an AI-native
                  system that diagnoses why a company is invisible to answer engines,
                  then executes the fixes. We already have real customers, measurable
                  outcomes, and a customer who came back for more. Now we are turning
                  the practice into software.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How we work */}
      <section aria-labelledby="values-heading" className="border-t border-line bg-canvas-2">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>How we work</Eyebrow>
              <h2 id="values-heading" className="text-display-md mt-6">
                Four things we do not compromise on.
              </h2>
            </Reveal>
          </div>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-14 grid list-none gap-5 p-0 sm:grid-cols-2"
          >
            {VALUES.map((v) => (
              <motion.li key={v.n} variants={rise} className="convex-light rounded-[1.75rem] p-8 sm:p-10">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl font-display text-2xl text-cognac"
                  style={{ background: 'rgba(168,92,48,0.10)' }}
                  aria-hidden
                >
                  {v.n}
                </span>
                <h3 className="mt-6 font-display text-ink" style={{ fontSize: '1.5rem' }}>
                  {v.title}
                </h3>
                <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">{v.body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </Container>
      </section>

      {/* Open roles */}
      <section aria-labelledby="open-roles-heading" id="open-roles" className="border-t border-line scroll-mt-24">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>Open roles</Eyebrow>
              <h2 id="open-roles-heading" className="text-display-md mt-6">
                Where you would own something real.
              </h2>
              <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                We are early, so every role is a founding one. If you are close but
                not exact, write to us anyway.
              </p>
            </Reveal>
          </div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className="mt-12 grid list-none gap-4 p-0"
          >
            {ROLES.map((r) => (
              <motion.li key={r.id} variants={rise}>
                <a
                  href={`${APPLY}?subject=${encodeURIComponent('Application: ' + r.title)}`}
                  aria-label={`Apply for ${r.title}`}
                  className="group block rounded-[1.5rem] border border-line bg-paper p-7 transition-colors hover:border-line-strong sm:p-9"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-ink" style={{ fontSize: '1.6rem', lineHeight: 1.1 }}>
                          {r.title}
                        </h3>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border border-line-strong px-3 py-1 font-sans text-ink-80" style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                          {r.type}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-line-strong px-3 py-1 font-sans text-ink-80" style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                          {r.place}
                        </span>
                      </div>
                      <p className="mt-4 font-sans text-[1rem] leading-relaxed text-ink-60">{r.body}</p>
                    </div>
                    <span
                      className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-ink text-canvas transition-colors group-hover:bg-cognac"
                      aria-hidden
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </Container>
      </section>

      {/* Other ways in */}
      <section aria-labelledby="ways-in-heading" id="ways-in" className="border-t border-line bg-canvas-2 scroll-mt-24">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>Other ways in</Eyebrow>
              <h2 id="ways-in-heading" className="text-display-md mt-6">
                Not looking for a full-time role yet?
              </h2>
            </Reveal>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-14 grid gap-5 md:grid-cols-3"
          >
            {PATHS.map((p) => (
              <motion.article
                key={p.title}
                variants={rise}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="convex-light flex flex-col rounded-[1.75rem] p-8"
              >
                <p className="eyebrow">{p.tag}</p>
                <h3 className="mt-4 font-display text-ink" style={{ fontSize: '1.6rem' }}>
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 font-sans text-[0.98rem] leading-relaxed text-ink-60">{p.body}</p>
                {p.internal ? (
                  <Link to={p.href} className="link-line mt-6 self-start font-sans text-[0.95rem] text-ink">
                    {p.cta}
                  </Link>
                ) : (
                  <a href={p.href} className="link-line mt-6 self-start font-sans text-[0.95rem] text-ink">
                    {p.cta}
                  </a>
                )}
              </motion.article>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Hiring process */}
      <section aria-labelledby="process-heading" className="border-t border-line">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>How hiring works</Eyebrow>
              <h2 id="process-heading" className="text-display-md mt-6">
                Fast, and built around your actual work.
              </h2>
            </Reveal>
          </div>
          <ol className="mt-14 grid list-none gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line p-0 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((s) => (
              <li key={s.n} className="flex flex-col bg-paper p-7">
                <span className="font-display text-2xl text-brass" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-ink" style={{ fontSize: '1.2rem' }}>
                  {s.title}
                </h3>
                <p className="mt-2 font-sans text-[0.92rem] leading-relaxed text-ink-60">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-heading" className="relative overflow-hidden border-t border-night-line bg-night text-canvas">
        <Container className="relative py-20 text-center sm:py-28">
          <Reveal>
            <Eyebrow className="text-brass-soft">Introduce yourself</Eyebrow>
            <h2 id="cta-heading" className="text-display-md mt-6" style={{ color: 'var(--color-canvas)' }}>
              Don’t see your exact role?
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/70">
              We are always meeting sharp people early. Tell us what you would own
              and why this problem is yours to solve.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={`${APPLY}?subject=${encodeURIComponent('Introduction')}`} className="btn btn-light !px-6">
                Write to us
              </a>
              <Link to="/about" className="btn btn-ghost-light !px-6">
                Read our story
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
