import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo, SITE } from '../lib/seo'

export const Route = createFileRoute('/how-to-show-up-in-chatgpt')({
  head: () =>
    seo({
      path: '/how-to-show-up-in-chatgpt',
      title: 'How to Show Up in ChatGPT, Perplexity & Google AI Overviews',
      description:
        'A step-by-step guide to getting named and cited by AI answer engines: entity clarity, quotable content, third-party citations, crawlability, citation tracking.',
    }),
  component: HowTo,
})

const STEPS: { name: string; text: string }[] = [
  {
    name: 'Make your entity unambiguous',
    text: 'Give the model one clear answer to "who are you and what do you do". Use Organization or ProfessionalService structured data, a consistent name, address, and phone, and links to authoritative profiles like LinkedIn, Crunchbase, and G2. If your brand name collides with another meaning, disambiguate it aggressively across every profile.',
  },
  {
    name: 'Publish quotable, answer-shaped content',
    text: 'Write direct answers, definitions, FAQs, and comparison pages that map to the exact questions buyers ask. Lead each page with a short, standalone answer a model can lift verbatim, then support it with structure and detail.',
  },
  {
    name: 'Earn third-party citations',
    text: 'AI answers lean heavily on what others say about you. Get named in listicles, directories, reviews, podcasts, partner pages, and press. Every credible external mention that repeats the same entity-to-topic association raises the model’s confidence.',
  },
  {
    name: 'Stay crawlable',
    text: 'Server-render your pages, welcome AI crawlers in robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended), publish a sitemap, and keep the important text in the initial HTML rather than behind scripts.',
  },
  {
    name: 'Track citation share and iterate',
    text: 'Measure whether you are named, cited, and recommended across ChatGPT, Perplexity, Google AI Overviews, Google AI Mode, Gemini, Google Search, and Copilot for your target questions. Record position, description, source cited, and competitor mentions, then close the gaps.',
  },
]

const COMPARISON_ROWS: [string, string, string][] = [
  ['Unit of success', 'A ranked link in a list', 'A mention, citation, or recommendation inside one synthesized answer'],
  ['What gets optimized', 'Keywords, backlinks, page speed', 'Entity clarity, third-party evidence, quotable structure'],
  ['Click model', 'The user clicks through to your page', 'Often zero-click; the model answers for them'],
  ['Who decides', 'A ranking algorithm scoring pages', 'A model synthesizing an answer from memory and retrieval'],
  ['Where signals come from', 'Mostly on-site + backlinks', 'On-site content, plus how consistently others describe you'],
]

const MYTHS: { claim: string; reality: string }[] = [
  {
    claim: '"You can submit your site to ChatGPT and guarantee a mention."',
    reality: 'There is no submission form and no guaranteed placement. You can only improve the odds by fixing entity clarity, evidence, and content structure — the same levers every competitor is also pulling.',
  },
  {
    claim: '"AI visibility is just Google ranking with extra steps."',
    reality: 'The mechanics differ. AI answers draw on training-time memory and live retrieval; a page can rank well on Google and still never get named, and vice versa.',
  },
  {
    claim: '"Publishing a huge volume of AI-focused content guarantees mentions."',
    reality: 'Volume without distinct evidence and entity signal usually creates near-duplicate pages that dilute authority rather than build it.',
  },
  {
    claim: '"One citation means you have won AI search."',
    reality: 'A single citation is a data point, not a trend. AI outputs are probabilistic and change between runs, models, and updates — track a defined query set over time instead.',
  },
]

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'How do I get my company into ChatGPT?',
    a: 'You cannot submit your site directly. Instead, make your entity unambiguous, publish answer-shaped content, earn third-party citations, and stay crawlable so the model can find and trust the information when a relevant question is asked.',
  },
  {
    q: 'Can SEO help me appear in ChatGPT?',
    a: 'Yes, indirectly. The pages that rank well and get crawled by Bing and Google often become the same sources an AI answer draws from or cites. SEO builds the corpus AI visibility work draws on; it is not a substitute for entity and citation work.',
  },
  {
    q: 'How do I know if ChatGPT mentions my brand?',
    a: 'ChatGPT has no public analytics dashboard for this. Run a fixed panel of prompts that match how your buyers actually ask, repeat monthly, and log whether you appear, in what position, and alongside which competitors.',
  },
  {
    q: 'Can I track ChatGPT and Perplexity visibility over time?',
    a: 'Yes, with a repeatable manual or tool-assisted panel: the same prompt set, run on a schedule, scored for mention, citation, and context. See our full framework in how to measure AI search ROI.',
  },
  {
    q: 'What is AEO?',
    a: 'Answer Engine Optimization is the practice of being the company an AI answer names and cites, instead of only ranking in a list of links. See AEO vs SEO for the full comparison.',
  },
  {
    q: 'Is AEO different from SEO?',
    a: 'Yes. SEO optimizes for ranking position in a list of results; AEO optimizes for being named or cited inside one generated answer. They share inputs (crawlable, authoritative content) but reward different outputs.',
  },
]

function HowTo() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to show up in ChatGPT, Perplexity, and Google AI Overviews',
    description:
      'Five steps to get a company named and cited by AI answer engines.',
    datePublished: '2026-08-22',
    dateModified: '2026-09-24',
    inLanguage: 'en',
    publisher: { '@id': `${SITE.url}/#organization` },
    step: STEPS.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'How to show up in ChatGPT',
        item: `${SITE.url}/how-to-show-up-in-chatgpt`,
      },
    ],
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <section className="border-b border-line">
        <Container width="narrow" className="pt-20 pb-14 sm:pt-28 sm:pb-16">
          <Reveal>
            <Eyebrow>Guide</Eyebrow>
            <h1 className="text-display-lg mt-8">
              How to show up in ChatGPT, Perplexity, and Google AI Overviews
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 rounded-2xl border border-line bg-paper p-6 sm:p-7">
              <p className="eyebrow">
                Short answer
              </p>
              <p className="mt-3 font-display text-ink" style={{ fontSize: 'clamp(1.15rem,1.8vw,1.5rem)', lineHeight: 1.4 }}>
                To show up in ChatGPT you need three things: a clear,
                machine-readable entity so the model knows who you are; credible
                third-party citations so it trusts you; and quotable, structured
                content it can lift. AI answers come largely from memory and are
                corroborated with live search, so on-site and off-site signals
                both matter. There is no submission form and no guaranteed
                placement — only the levers below.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section>
        <Container width="narrow" className="py-16 sm:py-20">
          <Reveal>
            <p className="font-sans text-body leading-relaxed text-ink-60">
              A hard truth first: capability is not the same as discoverability.
              A firm can be excellent at something and still never surface,
              because the model could not confidently connect the brand to the
              topic from the evidence it could retrieve. Showing up is the work of
              closing that gap. Here is what "showing up" actually means, how it
              differs from classic search, and how to do it.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container width="narrow" className="py-16 sm:py-20">
          <Reveal>
            <h2 className="text-display-md" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)' }}>
              What "showing up" actually means
            </h2>
            <p className="mt-5 font-sans text-body leading-relaxed text-ink-60">
              There is no single ranking to chase. AI answer visibility breaks
              into three distinct outcomes, and they matter differently:
            </p>
            <ul className="mt-6 space-y-4 font-sans text-body leading-relaxed text-ink-60">
              <li>
                <strong className="text-ink">Mention.</strong> Your brand name
                appears in the answer text, with no link — the model naming you
                alongside others as it answers.
              </li>
              <li>
                <strong className="text-ink">Citation.</strong> A clickable
                source next to or below the answer, pointing back to your page.
              </li>
              <li>
                <strong className="text-ink">Recommendation.</strong> You are
                named as a provider to consider, often with a qualifier — the
                highest-value outcome because it shapes the buyer's evaluation
                set directly.
              </li>
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container width="narrow" className="py-16 sm:py-20">
          <Reveal>
            <h2 className="text-display-md" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)' }}>
              How AI answers differ from traditional search
            </h2>
            <p className="mt-5 font-sans text-body leading-relaxed text-ink-60">
              AI visibility adds a discovery layer on top of classic search — it
              does not replace the need for a technically sound, well-linked
              website.
            </p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-left font-sans text-body">
                <thead>
                  <tr className="bg-canvas-2">
                    <th className="p-4 font-medium text-ink-45"></th>
                    <th className="p-4 font-semibold text-ink">Traditional search</th>
                    <th className="p-4 font-semibold text-cognac">AI answers</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map(([dim, left, right]) => (
                    <tr key={dim} className="border-t border-line align-top">
                      <td className="p-4 font-medium text-ink-45">{dim}</td>
                      <td className="p-4 text-ink-80">{left}</td>
                      <td className="p-4 text-ink-80">{right}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container width="narrow" className="py-16 sm:py-20">
          <Reveal>
            <h2 className="text-display-md" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)' }}>
              How to increase your AI visibility
            </h2>
          </Reveal>
          <ol className="mt-10 list-none space-y-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.name} delay={i * 50}>
                <li className="flex gap-6">
                  <span className="font-display text-4xl text-cognac" style={{ lineHeight: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-ink" style={{ fontSize: 'clamp(1.2rem,2vw,1.5rem)' }}>
                      {s.name}
                    </h3>
                    <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
                      {s.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container width="narrow" className="py-16 sm:py-20">
          <Reveal>
            <h2 className="text-display-md" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)' }}>
              How to measure AI visibility
            </h2>
            <p className="mt-5 font-sans text-body leading-relaxed text-ink-60">
              There is no built-in analytics dashboard for AI mentions, so
              measurement has to be built deliberately. Track:
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 font-sans text-body leading-relaxed text-ink-60">
              <li>Mention rate — the share of a fixed prompt panel where you are named</li>
              <li>Citation rate — the share of answers linking back to a page you control</li>
              <li>Source share — which domains the model cites most often in your category</li>
              <li>Competitor share — your mentions relative to the total across named competitors</li>
              <li>Context quality — positive, neutral, negative, or inaccurate</li>
              <li>Referral and branded-search lift — the downstream traffic signal</li>
            </ul>
            <p className="mt-6 font-sans text-body leading-relaxed text-ink-60">
              For the full measurement framework and attribution model, see{' '}
              <Link to="/blog/$slug" params={{ slug: 'how-to-measure-ai-search-roi' }} className="link-line text-cognac">
                how to measure AI search ROI
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container width="narrow" className="py-16 sm:py-20">
          <Reveal>
            <h2 className="text-display-md" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)' }}>
              Common myths
            </h2>
            <div className="mt-8 space-y-8">
              {MYTHS.map((m) => (
                <div key={m.claim}>
                  <p className="font-display text-ink" style={{ fontSize: '1.1rem' }}>
                    {m.claim}
                  </p>
                  <p className="mt-2 font-sans text-body leading-relaxed text-ink-60">
                    {m.reality}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container width="narrow" className="py-16 sm:py-20">
          <Reveal>
            <h2 className="text-display-md" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)' }}>
              FAQ
            </h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {FAQ_ITEMS.map((item, i) => (
                <Reveal key={item.q} delay={i * 30}>
                  <div className="py-6">
                    <h3 className="font-display text-ink" style={{ fontSize: '1.2rem' }}>
                      {item.q}
                    </h3>
                    <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
                      {item.a}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="mt-12 font-sans text-body leading-relaxed text-ink-60">
              Not sure how AEO differs from classic search? Read{' '}
              <Link to="/aeo-vs-seo" className="link-line text-cognac">
                AEO vs SEO
              </Link>
              . For the platform-specific playbook, see{' '}
              <Link to="/blog/$slug" params={{ slug: 'how-to-appear-in-chatgpt' }} className="link-line text-cognac">
                how to appear in ChatGPT
              </Link>{' '}
              and{' '}
              <Link to="/blog/$slug" params={{ slug: 'how-to-rank-in-perplexity' }} className="link-line text-cognac">
                how to rank in Perplexity
              </Link>
              . For the evidence behind memory-driven answers, see our{' '}
              <Link to="/research" className="link-line text-cognac">
                research on how Claude decides who to recommend
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-night text-canvas">
        <Container width="narrow" className="py-16 sm:py-20 text-center">
          <Reveal>
            <p className="eyebrow eyebrow-light">
              This is what we do
            </p>
            <h2 className="text-display-md mt-5 text-canvas" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>
              Rothenhall makes you the company the AI recommends.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-light">Request a diagnostic</Link>
              <Link to="/cailyx" className="btn btn-ghost-light">See how Cailyx measures it</Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  )
}
