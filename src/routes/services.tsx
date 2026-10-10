import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/services')({
  head: () =>
    seo({
      path: '/services',
      title: 'Services · How We Work · Rothenhall Partners',
      description:
        'How Rothenhall runs AI visibility, go-to-market and revenue operations as one engagement: a Diagnostic, a named set of deliverables for each stage, and clear lines on what we do and what we need from you.',
    }),
  component: Services,
})

/** Who gets a deliverable. Kept in step with the tier lists on /pricing. */
type Who = 'all' | 'growth' | 'operating' | 'agreed'
const WHO: Record<Who, string> = {
  all: 'All tiers',
  growth: 'Growth and up',
  operating: 'Operating Partner',
  agreed: 'Where agreed',
}

const ARC: {
  n: string
  title: string
  when: string
  body: string
  docs: { name: string; who: Who }[]
}[] = [
  {
    n: 'I',
    title: 'Diagnose',
    when: 'Weeks 1 to 4',
    body: 'We read where you stand before we recommend anything: how answer engines describe you, how your site is built, who you really compete with, and where the buyer drops out.',
    docs: [
      { name: 'Onboarding brief, tailored to your business', who: 'all' },
      { name: 'AEO visibility baseline', who: 'all' },
      { name: 'Fix Plan, with each fix tracked to done', who: 'all' },
      { name: 'Site structure review', who: 'growth' },
      { name: 'Competitor analysis', who: 'growth' },
    ],
  },
  {
    n: 'II',
    title: 'Decide',
    when: 'Weeks 3 to 6',
    body: 'The evidence becomes a position. Who you are for, what you say, which channels earn their place, and what to measure.',
    docs: [
      { name: 'Positioning and ICP', who: 'growth' },
      { name: 'Messaging hierarchy', who: 'growth' },
      { name: 'Funnel plan with measures', who: 'growth' },
      { name: 'Channel and content plan, 90 days', who: 'growth' },
    ],
  },
  {
    n: 'III',
    title: 'Operate',
    when: 'Month 2 onward',
    body: 'We run the plan with you, each deliverable tested against a written definition of done, and reported every week.',
    docs: [
      { name: 'Weekly report', who: 'all' },
      { name: 'Fixes verified on the live site', who: 'all' },
      { name: 'Content, citations and website specifications', who: 'growth' },
      { name: 'Monthly review with the founder or fund', who: 'operating' },
    ],
  },
  {
    n: 'IV',
    title: 'Compound',
    when: 'Quarterly',
    body: 'Results feed the playbook. Scope is reset each quarter against what moved, so the next cycle starts further ahead.',
    docs: [
      { name: 'Quarterly re-baseline', who: 'growth' },
      { name: 'Updated plan and priorities', who: 'growth' },
      { name: 'Case study', who: 'agreed' },
    ],
  },
]

const DISCIPLINES = [
  {
    tag: 'AEO · GEO',
    title: 'AI visibility',
    body: 'Being named and cited by answer engines. Entities, structured content and third-party citations, measured as rates across repeated runs.',
  },
  {
    tag: 'GTM',
    title: 'Go-to-market',
    body: 'Positioning, ICP, messaging and the channel plan, adapted to your product, market and stage.',
  },
  {
    tag: 'RevOps',
    title: 'Revenue operations',
    body: 'Tracking, attribution and reporting, so every result ties back to pipeline you can see.',
  },
  {
    tag: 'Growth',
    title: 'Growth operating',
    body: 'The running acquisition and conversion work, owned and iterated week over week.',
  },
]

const SPLIT = {
  you: [
    'One point of contact and one approver, with an agreed turnaround',
    'Facts about your business: products, customers, pricing and proof',
    'Permission to name customers and use figures',
    'Platform access for your site, analytics and social accounts, given by permission and never by shared password',
    'A short founder note on why you exist and what a good year looks like',
  ],
  us: [
    'Research on your market, competitors and answer-engine presence before we ask you anything',
    'A request list built for your business, not a generic form',
    'A check of what you send against what we found, flagging anything that does not match',
    'Every deliverable with a written definition of done',
    'Claims stated as rates and ranges, with no promises about rankings',
  ],
}

function Services() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="pt-24 pb-16 sm:pt-32 sm:pb-20">
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Reveal>
                <Eyebrow>Services</Eyebrow>
                <h1 className="text-display-lg mt-8 max-w-3xl">
                  One operator across the whole{' '}
                  <span style={{ color: 'var(--color-cognac)' }}>revenue stack.</span>
                </h1>
              </Reveal>
            </div>
            <div className="md:col-span-4">
              <Reveal delay={100}>
                <p className="font-sans text-body leading-relaxed text-ink-60">
                  Rothenhall is a fractional operating partner for AI-era growth.
                  We start from the evidence, name every deliverable, and run the
                  work on our own platform.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link to="/pricing" className="btn btn-primary">
                    See pricing
                  </Link>
                  <Link to="/contact" search={{ plan: 'diagnostic' }} className="btn btn-ghost">
                    Book a Diagnostic
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Disciplines */}
      <section>
        <Container className="py-20 sm:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>What we cover</Eyebrow>
              <h2 className="text-display-md mt-6">Four disciplines, run as one system.</h2>
              <p className="text-lead mt-5 text-ink-60">
                AI visibility without revenue operations cannot be measured, and
                revenue operations without a growth engine has nothing to measure.
                One owner keeps them joined.
              </p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {DISCIPLINES.map((d, i) => (
              <Reveal key={d.title} delay={i * 60} className="bg-canvas">
                <div className="h-full p-7 transition-colors hover:bg-canvas-2">
                  <p className="eyebrow">{d.tag}</p>
                  <h3 className="mt-4 font-display text-ink" style={{ fontSize: '1.4rem' }}>
                    {d.title}
                  </h3>
                  <p className="mt-3 font-sans text-caption leading-relaxed text-ink-60">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Arc and deliverables */}
      <section className="border-t border-line bg-canvas-2">
        <Container className="py-20 sm:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>How an engagement runs</Eyebrow>
              <h2 className="text-display-md mt-6">Evidence first, then a plan, then the work.</h2>
              <p className="text-lead mt-5 text-ink-60">
                The documents below are what you actually receive. A tag on each
                one shows which tier includes it, and each is adapted to your
                company, industry and stage.
              </p>
              <p className="mt-4 max-w-2xl font-sans text-caption leading-relaxed text-ink-60">
                Timing is typical for Growth and Operating Partner. Foundation
                starts measuring in week one and does not include the Decide
                stage. Your Statement of Work sets the dates.{' '}
                <Link to="/pricing" className="link-line text-ink-80">
                  Compare the tiers
                </Link>
              </p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-4">
            {ARC.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-canvas p-7">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-4xl text-cognac">{s.n}</span>
                    <span className="eyebrow">{s.when}</span>
                  </div>
                  <h3 className="mt-5 font-display text-ink" style={{ fontSize: '1.5rem' }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 font-sans text-caption leading-relaxed text-ink-60">{s.body}</p>
                  <ul className="mt-6 space-y-3 border-t border-line pt-5">
                    {s.docs.map((d) => (
                      <li key={d.name} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-1.5 flex-none rotate-45 bg-brass" />
                        <span className="min-w-0">
                          <span className="block font-sans text-caption leading-snug text-ink-80">{d.name}</span>
                          <span
                            className={`mt-1 inline-block rounded-full border px-2 py-px font-sans text-[0.64rem] tracking-wide ${
                              d.who === 'all'
                                ? 'border-line-strong text-ink-60'
                                : d.who === 'agreed'
                                  ? 'border-line-strong text-ink-45'
                                  : 'border-cognac/40 text-cognac'
                            }`}
                          >
                            {WHO[d.who]}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Who does what */}
      <section className="border-t border-line">
        <Container className="py-20 sm:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>Working together</Eyebrow>
              <h2 className="text-display-md mt-6">You know your business. We do the research.</h2>
              <p className="text-lead mt-5 text-ink-60">
                Every company is different, so we do not send one list to everyone.
                We study your market first, then ask only for what we cannot find.
              </p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            <Reveal className="bg-canvas">
              <div className="h-full p-8 sm:p-10">
                <p className="eyebrow">From you</p>
                <ul className="mt-6 space-y-4">
                  {SPLIT.you.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-1.5 flex-none rotate-45 bg-brass" />
                      <span className="font-sans text-body leading-relaxed text-ink-80">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={80} className="bg-night text-canvas">
              <div className="h-full p-8 sm:p-10">
                <p className="eyebrow eyebrow-light">From us</p>
                <ul className="mt-6 space-y-4">
                  {SPLIT.us.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-1.5 flex-none rotate-45 bg-cognac-soft" />
                      <span className="font-sans text-body leading-relaxed text-canvas/85">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Engine */}
      <section className="border-t border-line bg-canvas-2">
        <Container width="narrow" className="py-20 text-center sm:py-24">
          <Reveal>
            <Eyebrow className="inline-flex justify-center">The platform</Eyebrow>
            <h2 className="text-display-md mt-6">The work runs on our own platform.</h2>
            <p className="mx-auto mt-5 max-w-xl font-sans text-body leading-relaxed text-ink-60">
              Cailyx measures how AI describes you, audits your site and tracks
              every fix until it is verified. Motion, our social studio, joins it
              when it opens. Our team runs Cailyx for you, and you see the
              results in the weekly report. Direct client access to both will
              follow later.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/products" className="btn btn-ghost">
                Our products
              </Link>
              <Link to="/pricing" className="btn btn-primary">
                Choose a tier
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
