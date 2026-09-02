import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import {
  ResearchHero,
  SlitReveal,
  CountUp,
  GrowBar,
  Stagger,
  StaggerItem,
} from '../components/ResearchMotion'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/research')({
  head: () =>
    seo({
      path: '/research',
      title: 'How Claude Decides Who to Recommend · Research · Rothenhall Partners',
      description:
        'A Rothenhall field study of how Claude recommends brands: more than half of answers come from memory, not web search. Built on ~90,000 AI answers across 15+ industries, and how to earn a place on the shortlist.',
      keywords:
        'AI visibility research, how Claude recommends, answer engine optimization study, AEO, GEO, LLM brand memory, ChatGPT Perplexity citations',
    }),
  component: Research,
})

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const HEADLINE_STATS: {
  to?: number
  decimals?: number
  suffix?: string
  static?: string
  l: string
}[] = [
  { to: 52, suffix: '%', l: 'of Claude answers come from memory, with no web search at all.' },
  { static: '3–4', l: 'brands named in a typical recommendation. Prescribed, not browsable.' },
  { to: 48, suffix: '%', l: 'of prompts trigger a live search. On those, other people’s pages win.' },
]

const VS = [
  { metric: 'Searches the web at all', chatgpt: '~90%', claude: '48%', note: 'Claude holds an opinion before it looks.' },
  { metric: 'Answers a comparison from memory', chatgpt: '27%', claude: '89%', note: 'Three times more likely to skip the search.' },
  { metric: 'Cites Reddit', chatgpt: 'Constantly, its #2 source', claude: 'Almost never', note: 'Reddit now blocks LLMs in robots.txt.' },
  { metric: 'Uses your own site once it opens it', chatgpt: '61%', claude: '32%', note: 'Claude would rather someone else describe you.' },
]

const INDUSTRY_MEMORY = [
  { name: 'Software / SaaS', pct: 66 },
  { name: 'Health', pct: 63 },
  { name: 'Home & garden', pct: 46 },
  { name: 'Finance', pct: 44 },
  { name: 'Consumer tech', pct: 40 },
  { name: 'Local services', pct: 4 },
]

const QUESTION_TYPES = [
  { q: '“What should I do about…”', pct: '98%', tag: 'Pure memory' },
  { q: '“Which is better, X or Y?”', pct: '89%', tag: 'Memory' },
  { q: '“Is this brand any good?”', pct: '87%', tag: 'Memory' },
  { q: '“What should I buy?”', pct: '27%', tag: 'Often searches' },
  { q: '“What’s near me?”', pct: '2%', tag: 'Pure search' },
]

const READS_QUOTES = [
  { industry: 'Overall average', reads: '~7', quotes: '~3', ratio: '43%' },
  { industry: 'Home & garden', reads: '~5', quotes: '~2.5', ratio: '53%' },
  { industry: 'Consumer tech', reads: '~6', quotes: '~2.5', ratio: '47%' },
  { industry: 'Finance', reads: '~7', quotes: '~2.6', ratio: '43%' },
  { industry: 'Software / SaaS', reads: '~8', quotes: '~2.6', ratio: '32%' },
  { industry: 'Health', reads: '~3', quotes: '<1', ratio: '34%' },
]

const SOURCES = [
  {
    cat: 'Software / SaaS',
    get: 'G2, Capterra, GetApp, plus Forbes and vendor round-ups',
    move: 'Own your category on the review aggregators and the “best X software” listicles.',
  },
  {
    cat: 'Consumer tech',
    get: 'RTINGS, TechRadar, Tom’s Guide, Consumer Reports',
    move: 'Get the product independently tested and reviewed by the specialist testers.',
  },
  {
    cat: 'Finance',
    get: 'NerdWallet, Forbes, CNBC-class editorial',
    move: 'Earn comparison and “best of” coverage in finance editorial.',
  },
  {
    cat: 'Home & garden',
    get: 'Category review sites and specialist testers',
    move: 'Get into the niche testing sites, where Claude quotes most generously.',
  },
  {
    cat: 'Any category',
    get: 'Forbes and TechRadar',
    move: 'The two dual-winners. Worth pursuing whatever your category.',
  },
]

const DEPRIORITISE = [
  {
    habit: 'Chasing Reddit',
    why: 'A top-cited source on ChatGPT.',
    claude: 'Cited essentially never across 657 searched prompts.',
  },
  {
    habit: 'Fighting for position one',
    why: 'A decade of SEO instinct.',
    claude: 'Membership in the top ten is the gate. Position inside it does nothing measurable.',
  },
  {
    habit: 'Leaning on your own site',
    why: 'Your best asset on ChatGPT at 61%.',
    claude: 'Used 32% of the time. Keep it, but do not make it the main play.',
  },
  {
    habit: 'Treating local as a web game',
    why: 'Landing pages and local content.',
    claude: 'Claude goes to a map, not the open web. A business-profile job, not a content one.',
  },
]

const FIELD_NOTES = [
  {
    t: 'Memory is a hypothesis it then tries to confirm',
    b: 'Claude forms a view from training data first, then, when it does search, uses the pages to back up or adjust that view. Search is corroboration, not discovery. Your reputation sets the starting position.',
  },
  {
    t: 'The shortlist is written before the search runs',
    b: 'Across 1,000 unbranded buying questions, the internal queries Claude wrote for itself already named specific brands one time in six, against a 2.6% random baseline. The category leaders were decided in memory.',
  },
  {
    t: 'Query fan-out is far narrower than ChatGPT',
    b: 'When Claude does search, it issues far fewer sub-queries. For local intent it appends the country (“best plumber in Manchester UK”) because local facts change. Less breadth, more weight on what it already believes.',
  },
  {
    t: 'It reads more than it quotes, on purpose',
    b: 'On a searched prompt Claude opens about seven pages and quotes about three. On health it reads three and quotes fewer than one. It is selective about who it repeats, which raises the bar on source quality.',
  },
  {
    t: 'Silent blocking is the quiet killer',
    b: 'ClaudeBot respects robots.txt, and a CDN can block AI bots on a prefetch rule with nothing to warn you. Test it: ask Claude to fetch your H1 from the source. If it cannot, you are invisible, and nothing drops in rank to signal it.',
  },
  {
    t: 'The audience skews to high-trust buyers',
    b: 'Claude’s user base leans toward finance, technology, engineering, and clinical professionals. In the categories those people buy for, being the name Claude already trusts is worth more than any single page.',
  },
]

const CAN = [
  'The shortlist forms in memory, before any search.',
  'You can measure whether your brand is on it.',
  'You can shape what the model learns about you over time.',
]
const CANT = [
  'That being on the list guarantees you win the answer.',
  'That any one tactic reliably puts you there.',
  'That you can move it overnight.',
]

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function SectionHead({
  kicker,
  title,
  lead,
}: {
  kicker: string
  title: string
  lead?: string
}) {
  return (
    <div className="max-w-3xl">
      <Reveal>
        <Eyebrow>{kicker}</Eyebrow>
        <h2 className="text-display-md mt-6">{title}</h2>
        {lead ? (
          <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
            {lead}
          </p>
        ) : null}
      </Reveal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function Research() {
  return (
    <>
      {/* Hero */}
      <ResearchHero />

      {/* Headline stats */}
      <section id="findings" className="scroll-mt-24 border-b border-line bg-canvas">
        <Container width="wide" className="py-20 sm:py-28">
          <Stagger className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {HEADLINE_STATS.map((s) => (
              <StaggerItem key={s.static ?? s.to} className="bg-canvas">
                <div className="h-full p-9">
                  <div
                    className="font-display text-ink"
                    style={{ fontSize: 'clamp(3rem, 6vw, 4.6rem)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
                  >
                    {s.static ?? (
                      <CountUp to={s.to!} decimals={s.decimals ?? 0} suffix={s.suffix ?? ''} />
                    )}
                  </div>
                  <p className="mt-5 font-sans text-[1rem] leading-relaxed text-ink-60">
                    {s.l}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-8 max-w-2xl font-sans text-[0.8rem] leading-relaxed text-ink-45">
            Based on approximately 90,000 sources across 15 or more industries.
            Claude’s search behaviour is inferred from the network requests the app
            makes, observed through the interface rather than the API.
          </p>
        </Container>
      </section>

      {/* Lead essay */}
      <section className="border-b border-line">
        <Container width="narrow" className="py-20 sm:py-28">
          <Reveal>
            <p className="dropcap font-sans text-[1.15rem] leading-relaxed text-ink-80">
              A Claude recommendation is a short list. Ask it for the best option in
              your category and it will name three or four brands, prescribed to the
              reader, not offered as ten blue links to browse. That scarcity is the
              whole game. And more than half the time, the names in that list were
              chosen before Claude read a single web page.
            </p>
            <p className="mt-6 font-sans text-[1.08rem] leading-relaxed text-ink-80">
              This is what makes Claude different from Google, and from ChatGPT. It
              leans on what it already knows, its parametric memory, and treats a web
              search as a way to confirm a view it already holds. For considered,
              reputation-led categories, the answer is effectively decided in memory.
              Search optimisation only applies to the half of questions where Claude
              actually searches. For the other half, the work is reputational, and it
              moves on training-cycle time, not publish-this-week time.
            </p>
            <p className="mt-6 font-sans text-[1.08rem] leading-relaxed text-ink-80">
              The rest of this study lays out the mechanics: how the balance shifts by
              industry and by question, what shapes the memory, where Claude looks when
              it does search, and how to measure whether it knows you at all.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Claude vs ChatGPT */}
      <section className="border-b border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="Part one · The diagnosis"
            title="Claude relies on memory far more than ChatGPT."
            lead="Same prompt set, two very different engines. The habits that win on ChatGPT are not the habits that win here."
          />
          <div className="mt-14 overflow-x-auto">
            <div className="min-w-[44rem]">
              <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr_1.6fr] gap-4 border-b border-line-strong pb-4">
                {['', 'ChatGPT', 'Claude', ''].map((h, i) => (
                  <div
                    key={i}
                    className="eyebrow"
                    style={{ letterSpacing: '0.16em' }}
                  >
                    {h}
                  </div>
                ))}
              </div>
              {VS.map((r) => (
                <Reveal key={r.metric}>
                  <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr_1.6fr] items-baseline gap-4 border-b border-line py-5">
                    <div className="font-sans text-[1rem] text-ink-80">{r.metric}</div>
                    <div className="font-display text-ink-45" style={{ fontSize: '1.5rem' }}>
                      {r.chatgpt}
                    </div>
                    <div className="font-display text-cognac" style={{ fontSize: '1.7rem' }}>
                      {r.claude}
                    </div>
                    <div className="font-sans text-[0.92rem] leading-relaxed text-ink-60">
                      {r.note}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Memory by industry */}
      <section className="border-b border-line">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="Behaviour by industry"
            title="Some categories run almost entirely on memory."
            lead="Considered, reputation-led categories such as software and health skew to memory. Live and local questions skew to search."
          />
          <Stagger className="mt-14 space-y-6" amount={0.2}>
            {INDUSTRY_MEMORY.map((row, i) => (
              <StaggerItem key={row.name}>
                <div className="flex items-center gap-6">
                  <div className="w-40 shrink-0 font-sans text-[0.98rem] text-ink-80">
                    {row.name}
                  </div>
                  <div className="flex-1">
                    <GrowBar pct={row.pct} className="bg-brass/85" delay={i * 0.06} />
                  </div>
                  <div className="w-16 shrink-0 text-right font-display text-ink" style={{ fontSize: '1.4rem' }}>
                    <CountUp to={row.pct} suffix="%" duration={1.2} />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-8 font-sans text-[0.85rem] text-ink-45">
            Share of answers drawn from memory, with no web search, by category.
          </p>
        </Container>
      </section>

      {/* Question types */}
      <section className="border-b border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="Behaviour by question"
            title="The commercial questions are the memory questions."
            lead="Advice, comparisons and “is it any good” run on memory. Shopping and local questions are what trigger a search."
          />
          <div className="mt-14 divide-y divide-line border-y border-line">
            {QUESTION_TYPES.map((r) => (
              <Reveal key={r.q}>
                <div className="flex flex-wrap items-baseline justify-between gap-4 py-6">
                  <div className="font-display text-ink" style={{ fontSize: '1.5rem' }}>
                    {r.q}
                  </div>
                  <div className="flex items-baseline gap-5">
                    <span className="eyebrow" style={{ letterSpacing: '0.14em' }}>
                      {r.tag}
                    </span>
                    <span className="font-display text-cognac" style={{ fontSize: '2rem' }}>
                      {r.pct}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 font-sans text-[0.95rem] leading-relaxed text-ink-60">
            A head-to-head comparison is answered from memory almost nine times in ten.
            The shortlist forms from reputation, not from the comparison pages you built.
          </p>
        </Container>
      </section>

      {/* Reads vs quotes */}
      <section className="border-b border-line">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="Even when it searches"
            title="The funnel narrows twice."
            lead="On a searched prompt Claude opens about seven pages and quotes about three. It is far more reluctant than ChatGPT to repeat a page it just found."
          />
          <div className="mt-14 overflow-x-auto">
            <div className="min-w-[36rem]">
              <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr] gap-4 border-b border-line-strong pb-4">
                {['Industry', 'Reads', 'Quotes', 'Quote rate'].map((h) => (
                  <div key={h} className="eyebrow" style={{ letterSpacing: '0.14em' }}>
                    {h}
                  </div>
                ))}
              </div>
              {READS_QUOTES.map((r, i) => (
                <Reveal key={r.industry}>
                  <div
                    className={`grid grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr] items-baseline gap-4 py-4 ${
                      i === 0 ? 'border-b border-line-strong' : 'border-b border-line'
                    }`}
                  >
                    <div className={`font-sans text-[1rem] ${i === 0 ? 'text-ink font-medium' : 'text-ink-80'}`}>
                      {r.industry}
                    </div>
                    <div className="font-display text-ink-60" style={{ fontSize: '1.2rem' }}>{r.reads}</div>
                    <div className="font-display text-ink-60" style={{ fontSize: '1.2rem' }}>{r.quotes}</div>
                    <div className="font-display text-cognac" style={{ fontSize: '1.2rem' }}>{r.ratio}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Part two: Memory */}
      <section className="border-b border-line bg-night text-canvas">
        <Container width="narrow" className="py-24 sm:py-32">
          <Reveal>
            <Eyebrow className="eyebrow-light">Part two · What shapes the memory</Eyebrow>
            <h2 className="text-display-md mt-6 text-canvas">
              The shortlist forms before the search starts.
            </h2>
            <p className="mt-8 font-sans text-[1.08rem] leading-relaxed text-canvas/75">
              Take a thousand unbranded buying questions and read the internal queries
              the model writes for itself before it reads a single page. One in six
              already name a specific brand that nobody put in the question. Those
              names were not retrieved. They were remembered.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-night-line bg-night-line sm:grid-cols-2">
            <Reveal className="bg-night-2">
              <div className="p-9">
                <div className="font-display text-canvas" style={{ fontSize: 'clamp(3rem,6vw,4.5rem)', lineHeight: 0.9 }}>
                  <CountUp to={74.7} decimals={1} suffix="%" />
                </div>
                <p className="mt-5 font-sans text-[0.98rem] leading-relaxed text-canvas/70">
                  of those internally named brands sat in the model’s own top-ten
                  recalled list for the category, against a 2.6% random baseline.
                </p>
              </div>
            </Reveal>
            <Reveal className="bg-night-2" delay={80}>
              <div className="p-9">
                <div className="font-display text-canvas" style={{ fontSize: 'clamp(3rem,6vw,4.5rem)', lineHeight: 0.9 }}>
                  1 in 6
                </div>
                <p className="mt-5 font-sans text-[0.98rem] leading-relaxed text-canvas/70">
                  internal searches named a brand on their own, unprompted. The
                  category leader was chosen in memory, then confirmed by search.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Who is easiest to miss + what shapes memory */}
      <section className="border-b border-line">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionHead
                kicker="Who the model misses"
                title="New and changing brands are the easiest to leave off the list."
              />
              <Reveal>
                <ul className="mt-8 divide-y divide-line border-y border-line">
                  {[
                    ['New entrants', 'Launched since the model last learned? You are light in its memory. Not permanent, but the gap to close first.'],
                    ['Rebrands and renames', 'The model may still hold the old you. Redirects, entities and consistent naming tell it who you are now.'],
                    ['Challengers to an incumbent', 'The default answer is the name everyone knows. The work is giving the model reasons to say yours too.'],
                    ['Fast-movers', 'A new product, a pivot, a reputation you have already fixed. The memory has not caught up yet.'],
                  ].map(([k, v]) => (
                    <li key={k} className="py-5">
                      <p className="font-display text-ink" style={{ fontSize: '1.2rem' }}>{k}</p>
                      <p className="mt-2 font-sans text-[0.95rem] leading-relaxed text-ink-60">{v}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <SectionHead
                kicker="How memory is built"
                title="It runs on your reputation as the model absorbed it."
                lead="You are not editing a page and watching a rank move. You are changing what the wider internet says about you, so the next time the model learns, it learns something better."
              />
              <Reveal delay={100}>
                <div className="mt-8 space-y-6">
                  <div className="rounded-xl border border-line bg-canvas-2 p-6">
                    <p className="eyebrow">Be described the same way everywhere</p>
                    <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-80">
                      A “platform” here and a “tool” there blurs the picture. One clear
                      category claim, repeated across trusted sources, settles into the
                      model as a fact about you.
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-canvas-2 p-6">
                    <p className="eyebrow">Be a custodian of your own brand</p>
                    <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-80">
                      Earned media is downstream of what you say about yourself. Surface
                      your positioning, your features and your proof so publications can
                      learn it and repeat it. That is the citation loop.
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-canvas-2 p-6">
                    <p className="eyebrow">A result that moved</p>
                    <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-80">
                      In one controlled test, restructuring a section into
                      question-shaped pages produced the first AI citations within{' '}
                      <span className="font-medium text-ink">four days</span>, and about{' '}
                      <span className="font-medium text-ink">2.6x</span> the citations
                      three weeks later. It can change.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Sources by industry */}
      <section className="border-b border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="Where to get written about"
            title="The sources Claude trusts, by category."
            lead="Get onto the pages Claude already reads for your category. Two names win across all of them: Forbes and TechRadar."
          />
          <div className="mt-14 divide-y divide-line border-y border-line">
            {SOURCES.map((s) => (
              <Reveal key={s.cat}>
                <div className="grid gap-4 py-7 md:grid-cols-12">
                  <div className="md:col-span-3">
                    <p className="font-display text-ink" style={{ fontSize: '1.25rem' }}>{s.cat}</p>
                  </div>
                  <div className="md:col-span-4">
                    <p className="eyebrow mb-2" style={{ letterSpacing: '0.14em' }}>Get into</p>
                    <p className="font-sans text-[0.98rem] leading-relaxed text-ink-80">{s.get}</p>
                  </div>
                  <div className="md:col-span-5">
                    <p className="eyebrow mb-2" style={{ letterSpacing: '0.14em' }}>The move</p>
                    <p className="font-sans text-[0.98rem] leading-relaxed text-ink-60">{s.move}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Part three: the searched half, Brave */}
      <section className="border-b border-line">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="Part three · The searched half"
            title="When Claude searches, it is reading Brave, not Google."
            lead="Behavioural inference from what Claude fetches. The ranking work poured into Google has been aimed at the wrong index."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-line bg-canvas p-9">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-display text-cognac" style={{ fontSize: 'clamp(3rem,6vw,4.6rem)', lineHeight: 0.9 }}>
                      <CountUp to={63} suffix="%" />
                    </div>
                    <p className="mt-3 font-sans text-[0.95rem] text-ink-60">in Brave’s top ten</p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-ink-45" style={{ fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 0.9 }}>
                      <CountUp to={34} suffix="%" />
                    </div>
                    <p className="mt-3 font-sans text-[0.95rem] text-ink-45">in Google’s top ten</p>
                  </div>
                </div>
                <p className="mt-7 font-sans text-[0.98rem] leading-relaxed text-ink-80">
                  Share of the pages Claude fetched that sit in each index’s top ten for
                  the same query. When the two lists differ, Claude follows Brave by
                  roughly six to one.
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="rounded-2xl border border-line bg-canvas p-9">
                <p className="eyebrow">Inside the top ten, position does not matter</p>
                <p className="mt-4 font-sans text-[1rem] leading-relaxed text-ink-80">
                  Claude grabs Brave’s top ten as a set, then reorders by relevance to
                  the prompt. Quote rate is roughly flat whether a page sat at rank one
                  or rank ten. The target is not “rank number one”. It is “be anywhere
                  in Brave’s top ten for your category”. A lower bar, and a clearer one.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* The one thing, as a diagonal slit reveal */}
      <SlitReveal />

      {/* Own site vs earned media */}
      <section className="border-b border-line bg-canvas">
        <Container width="narrow" className="py-20 sm:py-28 text-center">
          <Reveal>
            <Eyebrow className="justify-center inline-flex">Owned versus earned</Eyebrow>
            <p className="mx-auto mt-8 max-w-xl font-sans text-[1.08rem] leading-relaxed text-ink-80">
              On Claude, a page on your own domain is worth about half what a mention on
              a site it trusts is worth. That reweights the whole plan: less polish our
              pages, more get onto theirs.
            </p>
            <div className="mx-auto mt-10 flex max-w-md items-stretch justify-center gap-4">
              <div className="flex-1 rounded-xl border border-line bg-canvas-2 p-6">
                <div className="font-display text-ink-45" style={{ fontSize: '2.4rem', lineHeight: 1 }}>
                  <CountUp to={61} suffix="%" />
                </div>
                <p className="mt-2 font-sans text-[0.85rem] text-ink-60">ChatGPT uses your own site</p>
              </div>
              <div className="flex-1 rounded-xl border border-line bg-canvas-2 p-6">
                <div className="font-display text-cognac" style={{ fontSize: '2.4rem', lineHeight: 1 }}>
                  <CountUp to={32} suffix="%" />
                </div>
                <p className="mt-2 font-sans text-[0.85rem] text-ink-60">Claude uses your own site</p>
              </div>
            </div>
            <p className="mx-auto mt-8 max-w-xl font-sans text-[0.95rem] text-ink-45">
              It is an earned-media engine, not an owned-media one.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Access */}
      <section className="border-b border-line">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="Before anything else"
            title="If it can’t be read, it can’t be cited."
            lead="A blocked page does not drop in rank. It simply never appears, in any answer, ever. And nothing warns you."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              ['The crawler is blocked', 'ClaudeBot respects robots.txt, so a stray rule shuts it out. Worse, Cloudflare or Akamai can block AI bots by default on a prefetch rule, with nothing in robots.txt to warn you.'],
              ['The page needs JavaScript', 'AI crawlers do not run JavaScript; Google is the exception, not the rule. If content only appears after a script runs, Claude sees a blank page. Serve the words in the HTML, render server-side.'],
              ['The silent-block test', 'Ask Claude to fetch the H1 from your page’s source. If it cannot, you have been silently blocked. Anthropic’s crawler converts at roughly 2.4% crawl to referral: crawling is necessary, not sufficient.'],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 70}>
                <div className="h-full rounded-2xl border border-line bg-canvas-2 p-8">
                  <p className="font-display text-ink" style={{ fontSize: '1.35rem' }}>{t}</p>
                  <p className="mt-4 font-sans text-[0.96rem] leading-relaxed text-ink-60">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* De-prioritise */}
      <section className="border-b border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="What to de-prioritise"
            title="The old reflexes, and what they do on Claude."
            lead="None of these are “never do them”. They are “do not let them be your Claude plan”."
          />
          <div className="mt-14 divide-y divide-line border-y border-line">
            {DEPRIORITISE.map((r) => (
              <Reveal key={r.habit}>
                <div className="grid gap-4 py-6 md:grid-cols-12">
                  <div className="md:col-span-3 font-display text-ink" style={{ fontSize: '1.25rem' }}>
                    {r.habit}
                  </div>
                  <div className="md:col-span-4 font-sans text-[0.95rem] leading-relaxed text-ink-45">
                    {r.why}
                  </div>
                  <div className="md:col-span-5 font-sans text-[0.98rem] leading-relaxed text-ink-80">
                    {r.claude}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Field notes */}
      <section className="border-b border-line">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="Field notes"
            title="Six things we learned watching Claude work."
            lead="The details behind the headline numbers, from observing how the model behaves prompt by prompt."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {FIELD_NOTES.map((n, i) => (
              <Reveal key={n.t} delay={(i % 2) * 70} className="bg-canvas">
                <div className="h-full p-8">
                  <p className="font-display text-brass-deep" style={{ fontSize: '1.3rem', lineHeight: 1.2 }}>
                    {n.t}
                  </p>
                  <p className="mt-4 font-sans text-[0.98rem] leading-relaxed text-ink-60">
                    {n.b}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The test */}
      <section className="border-b border-line bg-canvas-2">
        <Container className="py-24 sm:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionHead
                kicker="Part four · The test"
                title="Does Claude name you, unprompted, when nobody asked it to?"
                lead="The instinct is to ask “does Claude cite me”. Half the time it is not citing anyone, it is recalling. So measure recall, not citations."
              />
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={100}>
                <ol className="space-y-6">
                  {[
                    ['Read the memory', 'Ask Claude to name the top brands in your category. That list is its memory out loud. Find your row, or notice you have none.'],
                    ['Watch it leak', 'Ask the real buying question, framed the way a customer would, with no brand in it. See whether the names from step one walk into the answer.'],
                    ['Count, do not eyeball', 'Roughly 98.7% of brand appearances change from one run to the next. Run the question about forty times and count how often your name returns.'],
                    ['Weight it 90 / 10', 'Track mostly unbranded prompts (around 90%), a few branded (around 10%). Branded prompts always surface you; unbranded prompts tell you the truth.'],
                  ].map(([t, b], i) => (
                    <li key={t} className="flex gap-5">
                      <span className="font-display text-brass shrink-0" style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-display text-ink" style={{ fontSize: '1.25rem' }}>{t}</p>
                        <p className="mt-2 font-sans text-[0.98rem] leading-relaxed text-ink-60">{b}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Honest limits */}
      <section className="border-b border-line">
        <Container className="py-24 sm:py-32">
          <SectionHead
            kicker="Intellectual honesty"
            title="What we can say, and what we can’t."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-line bg-canvas p-8">
                <p className="eyebrow text-brass-deep">What we can say</p>
                <ul className="mt-6 space-y-4">
                  {CAN.map((c) => (
                    <li key={c} className="flex gap-3 font-sans text-[1rem] leading-relaxed text-ink-80">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="h-full rounded-2xl border border-line bg-canvas p-8">
                <p className="eyebrow" style={{ color: 'var(--color-ink-45)' }}>What we can’t</p>
                <ul className="mt-6 space-y-4">
                  {CANT.map((c) => (
                    <li key={c} className="flex gap-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-45" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-night text-canvas">
        <Container className="py-24 sm:py-32 text-center">
          <Reveal>
            <h2 className="text-display-md mx-auto max-w-3xl text-canvas">
              On Google you earn a ranking. On Claude you earn a reputation.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-canvas/70">
              We run the diagnostic on your brand and tell you exactly where you stand
              in the model’s memory, then build the plan to move it. That plan is the
              engagement, not a download.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-light">
                Request a diagnostic
              </Link>
              <Link to="/about" className="btn btn-ghost-light">
                See how we work
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
