import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/scouts')({
  head: () =>
    seo({
      path: '/scouts',
      title: 'Campus Scouts · The Ambassador Program · Rothenhall Partners',
      description:
        'Rothenhall Campus Scouts is a three-month campus ambassador program. Learn AEO and GEO, publish in public, and rank up through four tiers with real swag, credentials, Cailyx access, and an internship path.',
      keywords:
        'campus ambassador program India, Rothenhall Campus Scouts, AEO GEO ambassador, student ambassador AI, marketing internship India, write about AEO SEO',
    }),
  component: Scouts,
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

const APPLY = 'mailto:careers@rothenhall.com?subject=Campus%20Scouts%20application'

const FACTS = [
  { n: '3', l: 'Month cohort' },
  { n: '2', l: 'Posts per week' },
  { n: '4', l: 'Tiers to climb' },
  { n: '40', l: 'Scouts, max' },
]

const WHY = [
  { k: 'Skill', title: 'Master AEO and GEO', body: 'Answer engine optimization is where discovery is heading. Learn it hands on, months before it shows up in a syllabus.' },
  { k: 'Proof', title: 'Publish in public', body: 'Every blog you write is a real, bylined portfolio piece. You leave with a body of work, not a certificate line.' },
  { k: 'Signal', title: 'Credentials that carry', body: 'A verified certificate, a personal letter of recommendation, and a LinkedIn recommendation from the founder.' },
  { k: 'Access', title: 'Use the product', body: 'Free Cailyx credits and early access to the AI visibility tools you are writing about.' },
  { k: 'Reward', title: 'Earn the swag', body: 'Real gear at every milestone, from the welcome tee to the Campus Head jacket. You keep what you climb to.' },
  { k: 'Path', title: 'A door in', body: 'Top Scouts are first in line for paid project work, internships, and a co-authored Rothenhall piece.' },
]

type Tier = {
  step: string
  name: string
  when: string
  req: string
  rewards: string[]
  peak?: boolean
}

const TIERS: Tier[] = [
  {
    step: 'Tier 01',
    name: 'Scout',
    when: 'On selection',
    req: 'You are in. Onboarding call, brand kit, and your first topic claimed.',
    rewards: ['Welcome tee and sticker set', 'Private Scouts community', 'Induction certificate'],
  },
  {
    step: 'Tier 02',
    name: 'Advocate',
    when: 'Month 1 cleared',
    req: '8 approved posts published, onboarding done, rhythm held every week.',
    rewards: ['Cap and field notebook', 'Verified certificate', 'LinkedIn recommendation', 'Cailyx free tier'],
  },
  {
    step: 'Tier 03',
    name: 'Lead',
    when: 'Month 2 cleared',
    req: '16 posts total, plus at least one hosted event or campus talk.',
    rewards: ['Hoodie and bottle', 'AEO Certified pin', 'Letter of recommendation', 'Founder community invite'],
  },
  {
    step: 'Tier 04',
    name: 'Campus Head',
    when: 'Month 3, top performers',
    req: '24 posts, all program milestones met, standout contribution.',
    rewards: ['Jacket or backpack', 'Framed certificate and LOR', 'Paid internship or project work', 'Co-author a research piece'],
    peak: true,
  },
]

const RHYTHM = [
  { n: '1', title: 'One original blog', body: '500 to 800 words on a claimed concept. Cites rothenhall.com and names Cailyx once. Published on Medium, Dev.to, Hashnode, or your own site.' },
  { n: '2', title: 'One cross-post or long-form', body: 'A LinkedIn long-form take or a cross-post of your blog. Same citation value, less burnout, wider reach.' },
  { n: '✓', title: 'Claim before you write', body: 'Pick your angle from the concept menu so no two Scouts ship the same post in the same week.' },
]

const TRACKS = [
  { k: 'A', title: 'Content and citations', body: 'The core. Your weekly posts, threads, carousels, and the occasional guest post on a real publication.' },
  { k: 'B', title: 'Events and community', body: 'Host a webinar, run a campus talk, or start a four session AI visibility study circle. This unlocks the Lead tier.' },
  { k: 'C', title: 'Growth', body: 'Refer a founder for a free diagnostic. Conversions earn bonus swag, product credits, and leaderboard standing.' },
  { k: 'D', title: 'Insight', body: 'Run a real AI visibility audit on a local business, or interview a founder on how they get discovered.' },
]

const CONCEPTS = [
  {
    group: 'Explainer',
    items: [
      'What is Answer Engine Optimization, and why 2026 is its year',
      'GEO versus SEO: from ranking on Google to being cited by AI',
      'The ten blue links are dying: how people discover companies through ChatGPT, Claude, and Perplexity now',
      'How to check if your brand shows up in AI answers, in fifteen minutes',
    ],
  },
  {
    group: 'How-to',
    items: [
      'llms.txt explained, and how to write one',
      'robots.txt for AI crawlers: GPTBot, ClaudeBot, PerplexityBot, and who you block by accident',
      'Structured data that makes AI understand what your company does',
      'Why third party citations beat your own website for AI recommendations',
      'Building your company as an entity AI can recognize and trust',
    ],
  },
  {
    group: 'Opinion',
    items: [
      'Why your startup is invisible to AI, and the five reasons it usually happens',
      'E-E-A-T in the age of AI answers',
      'Prompt testing your brand: a repeatable way to see how AI describes you',
      'What an AI visibility diagnostic actually looks at',
    ],
  },
]

type Rung = { stage: string; when: string; items: string[]; peak?: boolean }

const LADDER: Rung[] = [
  { stage: 'Stage 01', when: 'On selection', items: ['Branded tee', 'Sticker sheet and logo pin', 'Digital badge and certificate'] },
  { stage: 'Stage 02', when: 'Month 1 cleared', items: ['Cap or beanie', 'Notebook and pen', 'Advocate badge'] },
  { stage: 'Stage 03', when: 'Month 2 cleared', items: ['Hoodie', 'Bottle or tumbler', 'AEO Certified pin, members only'] },
  { stage: 'Stage 04', when: 'Campus Head', items: ['Jacket or backpack', 'Framed certificate and LOR', 'Cailyx credits and community'], peak: true },
]

const DROPS = [
  ['First blog', 'sticker and shoutout'],
  ['First event hosted', 'branded mug'],
  ['Referral booked', 'giftable bonus tee'],
  ['Monthly leaderboard', 'tote and site feature'],
  ['Cohort MVP', 'premium jacket and internship offer'],
]

const REWARDS = [
  { title: 'Credentials', body: 'A verified certificate, a personal letter of recommendation, a LinkedIn recommendation from the founder, and a feature on the Rothenhall Scouts page.' },
  { title: 'Product access', body: 'Free Cailyx credits, early access to new tools, and an invitation into the Rothenhall founder community once you reach Lead.' },
  { title: 'The path in', body: 'Standout Scouts are first considered for paid project work, internships, a co-authored research piece, and full roles as we grow.' },
]

const STEPS = ['Apply', 'Short intro call', 'Claim your first topic', 'Start shipping']

function Scouts() {
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
              <Eyebrow className="text-brass-soft">Campus Ambassador Program · Cohort I</Eyebrow>
            </motion.div>
            <motion.h1
              variants={rise}
              className="mt-7 font-display"
              style={{ fontSize: 'clamp(2.6rem, 5.4vw, 5rem)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.02 }}
            >
              Rothenhall{' '}
              <span style={{ color: 'var(--color-cognac-soft)' }}>Campus Scouts.</span>
            </motion.h1>
            <motion.p variants={rise} className="mt-8 max-w-xl font-sans text-[1.12rem] leading-relaxed text-canvas/70">
              Learn how AI decides which companies to recommend, then build the
              proof in public. Write, host, and grow the movement around answer
              engine visibility, and rank up as you go.
            </motion.p>
            <motion.div variants={rise} className="mt-9 flex flex-wrap gap-3">
              <a href={APPLY} className="btn btn-light !px-6">Apply to join</a>
              <a href="#journey" className="btn btn-ghost-light !px-6">See the journey</a>
            </motion.div>
          </motion.div>

          <motion.dl
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line sm:grid-cols-4"
          >
            {FACTS.map((f) => (
              <motion.div variants={rise} key={f.l} className="bg-night px-5 py-5">
                <dt className="sr-only">{f.l}</dt>
                <dd className="m-0">
                  <span className="font-display text-cognac-soft" style={{ fontSize: '1.9rem', fontVariantNumeric: 'tabular-nums' }}>
                    {f.n}
                  </span>
                  <p className="mt-1 font-sans text-canvas/60" style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {f.l}
                  </p>
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </Container>
      </section>

      {/* Why join */}
      <section aria-labelledby="why-heading" className="border-t border-line">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>Why it is worth your semester</Eyebrow>
              <h2 id="why-heading" className="text-display-md mt-6">
                A portfolio, a credential, and a head start in a category just forming.
              </h2>
            </Reveal>
          </div>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-14 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3"
          >
            {WHY.map((w) => (
              <motion.li key={w.title} variants={rise} className="convex-light rounded-[1.75rem] p-8">
                <p className="eyebrow">{w.k}</p>
                <h3 className="mt-4 font-display text-ink" style={{ fontSize: '1.5rem' }}>{w.title}</h3>
                <p className="mt-3 font-sans text-[0.98rem] leading-relaxed text-ink-60">{w.body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </Container>
      </section>

      {/* The journey */}
      <section aria-labelledby="journey-heading" id="journey" className="border-t border-line bg-canvas-2 scroll-mt-24">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>The journey</Eyebrow>
              <h2 id="journey-heading" className="text-display-md mt-6">Four tiers over three months. You climb by shipping.</h2>
              <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                Everyone starts as a Scout. Keep the weekly rhythm and hit each
                checkpoint to rank up. Higher tiers unlock better swag, deeper
                access, and the internship track.
              </p>
            </Reveal>
          </div>
          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-12 grid list-none gap-4 p-0 lg:grid-cols-4"
          >
            {TIERS.map((t) => (
              <motion.li
                key={t.name}
                variants={rise}
                className={`flex flex-col rounded-[1.5rem] p-7 ${
                  t.peak ? 'bg-night text-canvas' : 'border border-line bg-paper'
                }`}
              >
                <span className={`font-sans ${t.peak ? 'text-cognac-soft' : 'text-ink-45'}`} style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                  {t.step}
                </span>
                <h3 className="mt-2 font-display" style={{ fontSize: '1.7rem', lineHeight: 1.05 }}>{t.name}</h3>
                <span className={`mt-1 font-sans text-[0.82rem] font-medium ${t.peak ? 'text-cognac-soft' : 'text-cognac-deep'}`}>{t.when}</span>
                <p className={`mt-4 border-t pt-4 font-sans text-[0.9rem] leading-relaxed ${t.peak ? 'border-night-line text-canvas/65' : 'border-line text-ink-60'}`}>{t.req}</p>
                <ul className="mt-4 flex list-none flex-col gap-2 p-0">
                  {t.rewards.map((r) => (
                    <li key={r} className={`flex gap-2.5 font-sans text-[0.9rem] ${t.peak ? 'text-canvas/90' : 'text-ink-80'}`}>
                      <span aria-hidden className={t.peak ? 'text-cognac-soft' : 'text-brass'}>◆</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </motion.ol>
        </Container>
      </section>

      {/* What you do */}
      <section aria-labelledby="rhythm-heading" className="border-t border-line">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>What you actually do</Eyebrow>
              <h2 id="rhythm-heading" className="text-display-md mt-6">Two posts a week is the backbone. Everything else stacks on top.</h2>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
            <Reveal className="convex-light rounded-[1.75rem] p-8 sm:p-10">
              <ol className="flex list-none flex-col p-0">
                {RHYTHM.map((r, i) => (
                  <li key={r.title} className={`flex items-start gap-4 py-5 ${i < RHYTHM.length - 1 ? 'border-b border-line' : ''} ${i === 0 ? 'pt-0' : ''}`}>
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-line-strong bg-canvas-2 font-display text-[1.05rem] text-brass-deep" aria-hidden>
                      {r.n}
                    </span>
                    <div>
                      <h3 className="font-sans text-[1rem] font-medium text-ink">{r.title}</h3>
                      <p className="mt-1 font-sans text-[0.9rem] leading-relaxed text-ink-60">{r.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal>
              <ul className="flex list-none flex-col gap-6 p-0">
                {TRACKS.map((t) => (
                  <li key={t.k} className="flex gap-4">
                    <span className="font-display text-[1.1rem] text-cognac" aria-hidden style={{ width: '1.6rem' }}>{t.k}</span>
                    <div>
                      <h3 className="font-sans text-[1.05rem] font-medium text-ink">{t.title}</h3>
                      <p className="mt-1 font-sans text-[0.92rem] leading-relaxed text-ink-60">{t.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Concept menu */}
      <section aria-labelledby="concepts-heading" className="border-t border-line bg-canvas-2">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>The concept menu</Eyebrow>
              <h2 id="concepts-heading" className="text-display-md mt-6">Claim a topic, own the angle.</h2>
              <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                Every post teaches one idea and points back to Rothenhall. Pick the
                level that fits where you are. More get added each month.
              </p>
            </Reveal>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className="mt-12 grid gap-8 md:grid-cols-3"
          >
            {CONCEPTS.map((c) => (
              <motion.div key={c.group} variants={rise}>
                <h3 className="inline-block border-b-2 border-brass pb-2 font-display text-ink" style={{ fontSize: '1.2rem' }}>{c.group}</h3>
                <ol className="mt-5 flex list-none flex-col gap-3 p-0">
                  {c.items.map((it, i) => (
                    <li key={it} className="flex gap-3 font-sans text-[0.92rem] leading-snug text-ink-80">
                      <span className="font-display text-[0.8rem] text-ink-45" aria-hidden style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Swag ladder */}
      <section aria-labelledby="swag-heading" className="relative overflow-hidden border-t border-night-line bg-night text-canvas">
        <Container className="relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow className="text-brass-soft">The swag ladder</Eyebrow>
              <h2 id="swag-heading" className="text-display-md mt-6" style={{ color: 'var(--color-canvas)' }}>Gear you earn, not gear you are given.</h2>
              <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-canvas/65">
                Each checkpoint unlocks the next drop. Wear it, and you carry the
                brand across campus.
              </p>
            </Reveal>
          </div>
          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-12 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4"
          >
            {LADDER.map((r) => (
              <motion.li
                key={r.stage}
                variants={rise}
                className={`flex flex-col gap-3 rounded-[1.5rem] border p-7 ${
                  r.peak ? 'border-cognac-deep' : 'border-night-line bg-night-2'
                }`}
                style={r.peak ? { background: 'linear-gradient(160deg, rgba(198,124,72,0.16), rgba(32,28,21,0.5))' } : undefined}
              >
                <div>
                  <p className="font-sans font-semibold text-cognac-soft" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{r.stage}</p>
                  <p className="mt-1 font-sans text-canvas/55" style={{ fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{r.when}</p>
                </div>
                <ul className="flex list-none flex-col gap-2 p-0">
                  {r.items.map((it) => (
                    <li key={it} className="flex items-baseline gap-2.5 font-sans text-[0.9rem] text-canvas/90">
                      <span aria-hidden className="text-[0.6rem] text-brass-soft">◆</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </motion.ol>

          <Reveal className="mt-14">
            <p className="eyebrow text-brass-soft">Achievement drops, stacked on top</p>
            <ul className="mt-5 flex list-none flex-wrap gap-3 p-0">
              {DROPS.map(([a, b]) => (
                <li key={a} className="inline-flex items-center gap-2 rounded-full border border-night-line bg-night-2 px-4 py-2 font-sans text-[0.86rem] text-canvas/90">
                  <b className="font-semibold text-cognac-soft">{a}</b>
                  <span className="text-canvas/70">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Beyond the swag */}
      <section aria-labelledby="rewards-heading" className="border-t border-line">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>Beyond the swag</Eyebrow>
              <h2 id="rewards-heading" className="text-display-md mt-6">Three things that outlast the cohort.</h2>
            </Reveal>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-14 grid gap-5 md:grid-cols-3"
          >
            {REWARDS.map((r) => (
              <motion.article
                key={r.title}
                variants={rise}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="convex-light rounded-[1.75rem] p-8"
              >
                <h3 className="font-display text-ink" style={{ fontSize: '1.5rem' }}>{r.title}</h3>
                <p className="mt-3 font-sans text-[0.98rem] leading-relaxed text-ink-60">{r.body}</p>
              </motion.article>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Apply */}
      <section aria-labelledby="apply-heading" className="relative overflow-hidden border-t border-night-line bg-night text-canvas">
        <Container className="relative py-20 text-center sm:py-28">
          <Reveal>
            <Eyebrow className="text-brass-soft">Cohort I is open</Eyebrow>
            <h2 id="apply-heading" className="text-display-md mt-6" style={{ color: 'var(--color-canvas)' }}>
              Ready to be the reason AI knows a company exists?
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/70">
              We are taking up to 40 Scouts this cohort, across a handful of
              campuses. Applications are reviewed on a rolling basis.
            </p>
            <ol className="mx-auto mt-8 flex max-w-2xl list-none flex-wrap justify-center gap-x-3 gap-y-2 p-0 font-sans text-[0.86rem] text-canvas/60">
              {STEPS.map((s, i) => (
                <li key={s} className="inline-flex items-center gap-3">
                  <span><b className="font-display font-medium text-cognac-soft">{String(i + 1).padStart(2, '0')}</b> {s}</span>
                  {i < STEPS.length - 1 && <span aria-hidden className="text-night-line">/</span>}
                </li>
              ))}
            </ol>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={APPLY} className="btn btn-light !px-6">Apply now</a>
              <Link to="/careers" className="btn btn-ghost-light !px-6">See all the ways in</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
