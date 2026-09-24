import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo, SITE } from '../lib/seo'

export const Route = createFileRoute('/aeo-vs-seo')({
  head: () =>
    seo({
      path: '/aeo-vs-seo',
      title: 'AEO vs SEO: What Is the Difference, and Do You Need Both?',
      description:
        'AEO means being cited inside AI answers from ChatGPT and Perplexity; SEO means ranking in a list of links. A plain comparison and how they work together.',
    }),
  component: AeoVsSeo,
})

const ROWS: [string, string, string][] = [
  ['Goal', 'Rank in a list of links', 'Be named and cited in the AI answer'],
  ['Surface', 'Google and Bing results pages', 'ChatGPT, Perplexity, Google AI Overviews'],
  ['Unit of success', 'Position (rank)', 'Citation and mention'],
  ['Optimizes', 'Keywords, backlinks, page speed', 'Entities, citations, quotable structured content'],
  ['Click model', 'The user clicks your link', 'The AI summarizes; often zero-click'],
  ['Measured by', 'Rankings and organic traffic', 'Citation share and mentions across engines'],
]

const GLOSSARY: { term: string; def: string }[] = [
  {
    term: 'SEO (Search Engine Optimization)',
    def: 'Optimizing pages to rank in a list of links on Google or Bing. Rewards keywords, backlinks, technical structure, and page experience.',
  },
  {
    term: 'AEO (Answer Engine Optimization)',
    def: 'Optimizing to be named or cited inside a synthesized AI answer, rather than ranked in a list. Rewards entity clarity, third-party evidence, and quotable content.',
  },
  {
    term: 'GEO (Generative Engine Optimization)',
    def: 'Near-synonym for AEO used by some vendors and researchers — optimizing content and entities so generative models surface and cite your brand. Rothenhall treats AEO and GEO as one discipline; if a source distinguishes them, GEO usually emphasizes the generative model\'s training-time memory and AEO the live answer surface.',
  },
  {
    term: 'AI SEO / LLM SEO / "answer optimization"',
    def: 'Informal, overlapping terms marketers use for the same general practice as AEO/GEO. There is no standardized industry line between them — when you see one, check whether the author means entity/citation work (AEO-style) or classic keyword SEO applied to AI-era queries.',
  },
]

const MEASUREMENT_METRICS: { name: string; def: string }[] = [
  { name: 'Query coverage', def: 'Share of your tracked prompts where the brand appears at all.' },
  { name: 'Mention rate', def: 'Share of sampled answers that name your brand.' },
  { name: 'Citation rate', def: 'Share of answers that link to a source you control.' },
  { name: 'Competitor share', def: 'Your appearances relative to the total across a defined competitor set.' },
]

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Is AEO the same as GEO?',
    a: 'Close enough in practice that most teams run them as one discipline. Where sources do split them, GEO tends to describe optimizing for a model\'s trained-in memory, and AEO the live, retrieval-backed answer surface. Define your own usage once and stay consistent.',
  },
  {
    q: 'Do I need to choose between SEO and AEO?',
    a: 'No. They compound. Strong SEO gets your content indexed, crawlable, and trusted; strong AEO shapes that same content into something a model can lift and cite. Treat them as one system with two surfaces.',
  },
  {
    q: 'How do I measure AEO progress?',
    a: 'Run a fixed panel of prompts that match how your buyers actually ask, on a schedule, and track mention rate, citation rate, and competitor share over time. See the full framework in how to measure AI search ROI.',
  },
  {
    q: 'Will AEO work replace my SEO budget?',
    a: 'No — it sits alongside it. The pages your SEO program makes authoritative and crawlable are frequently the same pages an AI answer cites. Cutting SEO to fund AEO usually shrinks the evidence base AEO depends on.',
  },
]

function AeoVsSeo() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'AEO vs SEO: what is the difference, and do you need both?',
    description:
      'A plain comparison of Answer Engine Optimization and Search Engine Optimization, and how they work together.',
    datePublished: '2026-08-22',
    dateModified: '2026-09-24',
    inLanguage: 'en',
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    about: [
      'Answer Engine Optimization',
      'Search Engine Optimization',
      'Generative Engine Optimization',
      'AI search visibility',
    ],
    mainEntityOfPage: `${SITE.url}/aeo-vs-seo`,
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'AEO vs SEO', item: `${SITE.url}/aeo-vs-seo` },
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
              AEO vs SEO: what’s the difference, and do you need both?
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 rounded-2xl border border-line bg-paper p-6 sm:p-7">
              <p className="eyebrow">
                Short answer
              </p>
              <p className="mt-3 font-display text-ink" style={{ fontSize: 'clamp(1.15rem,1.8vw,1.5rem)', lineHeight: 1.4 }}>
                AEO (Answer Engine Optimization) is the work of being named and
                cited inside AI-generated answers from ChatGPT, Perplexity, and
                Google AI Overviews. SEO (Search Engine Optimization) is the work
                of ranking in a list of links. They overlap, but optimize for
                different surfaces, and today you need both.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section>
        <Container width="narrow" className="py-16 sm:py-20">
          <article className="space-y-12">
            <Reveal>
              <div>
                <h2 className="text-display-md" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)' }}>
                  The difference at a glance
                </h2>
                <div className="mt-6 overflow-x-auto rounded-xl border border-line">
                  <table className="w-full border-collapse text-left font-sans text-body">
                    <thead>
                      <tr className="bg-canvas-2">
                        <th className="p-4 font-medium text-ink-45"></th>
                        <th className="p-4 font-semibold text-ink">SEO</th>
                        <th className="p-4 font-semibold text-cognac">AEO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ROWS.map(([dim, seoCell, aeoCell]) => (
                        <tr key={dim} className="border-t border-line align-top">
                          <td className="p-4 font-medium text-ink-45">{dim}</td>
                          <td className="p-4 text-ink-80">{seoCell}</td>
                          <td className="p-4 text-ink-80">{aeoCell}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>

            <GuideBlock title="What is SEO?">
              Search Engine Optimization is the practice of ranking your pages in
              a list of results on Google or Bing. It rewards keywords, quality
              backlinks, clean technical structure, and page experience. The prize
              is a high position and the click that follows.
            </GuideBlock>

            <GuideBlock title="What is AEO?">
              Answer Engine Optimization is the practice of being the company an
              AI answer names and cites. Instead of a ranked list, an answer
              engine returns one synthesized response that mentions a handful of
              sources. AEO rewards a clear entity, credible third-party citations,
              and quotable, well-structured content that models can lift.
            </GuideBlock>

            <Reveal>
              <div>
                <h2 className="text-display-md" style={{ fontSize: 'clamp(1.4rem,2.2vw,1.9rem)' }}>
                  Glossary: AEO, GEO, AI SEO, LLM SEO
                </h2>
                <p className="mt-4 font-sans text-body leading-relaxed text-ink-60">
                  These terms get used loosely and interchangeably across the
                  industry. Here is what each one usually means, so you can read
                  past the branding:
                </p>
                <dl className="mt-6 space-y-5">
                  {GLOSSARY.map((g) => (
                    <div key={g.term}>
                      <dt className="font-display text-ink" style={{ fontSize: '1.1rem' }}>
                        {g.term}
                      </dt>
                      <dd className="mt-1 font-sans text-body leading-relaxed text-ink-60">
                        {g.def}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <GuideBlock title="Is SEO still worth it?">
              Yes. Classic SEO still drives traffic, and the pages that rank often
              become the very sources an AI answer cites. SEO builds the corpus
              AEO draws from. The mistake is stopping at the ranking, when the
              buyer never sees the list because the AI answered for them.
            </GuideBlock>

            <GuideBlock title="How AEO and SEO work together">
              Treat them as one system. Strong SEO gets your content indexed and
              trusted; strong AEO shapes that content into answers, reinforces
              your entity, and earns the external citations that make an AI
              confident enough to recommend you. One without the other leaves
              value on the table.
            </GuideBlock>

            <Reveal>
              <div>
                <h2 className="text-display-md" style={{ fontSize: 'clamp(1.4rem,2.2vw,1.9rem)' }}>
                  How to measure AEO progress
                </h2>
                <p className="mt-4 font-sans text-body leading-relaxed text-ink-60">
                  Unlike SEO, there is no standard rank tracker for AI answers.
                  Build a lightweight measurement panel instead:
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 font-sans text-body leading-relaxed text-ink-60">
                  {MEASUREMENT_METRICS.map((m) => (
                    <li key={m.name}>
                      <strong className="text-ink">{m.name}.</strong> {m.def}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-sans text-body leading-relaxed text-ink-60">
                  For the full framework and attribution model, see{' '}
                  <Link to="/blog/$slug" params={{ slug: 'how-to-measure-ai-search-roi' }} className="link-line text-cognac">
                    how to measure AI search ROI
                  </Link>
                  .
                </p>
              </div>
            </Reveal>

            <GuideBlock title="How to start with AEO">
              Establish an unambiguous entity, publish answer-shaped content mapped
              to the exact questions buyers ask, and earn third-party citations
              that reinforce the same associations. For the step-by-step, see{' '}
              <Link to="/how-to-show-up-in-chatgpt" className="link-line text-cognac">
                how to show up in ChatGPT
              </Link>
              , or the platform-specific guides for{' '}
              <Link to="/blog/$slug" params={{ slug: 'how-to-appear-in-chatgpt' }} className="link-line text-cognac">
                ChatGPT
              </Link>{' '}
              and{' '}
              <Link to="/blog/$slug" params={{ slug: 'how-to-rank-in-perplexity' }} className="link-line text-cognac">
                Perplexity
              </Link>
              . For a full definition of the discipline, read{' '}
              <Link to="/blog/$slug" params={{ slug: 'what-is-aeo-3' }} className="link-line text-cognac">
                what is AEO
              </Link>
              .
            </GuideBlock>
          </article>
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
        </Container>
      </section>

      <section className="bg-night text-canvas">
        <Container width="narrow" className="py-16 sm:py-20 text-center">
          <Reveal>
            <p className="eyebrow eyebrow-light">
              One accountable owner
            </p>
            <h2 className="text-display-md mt-5 text-canvas" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>
              Rothenhall runs AEO, GEO, GTM, and RevOps as one engine.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-light">Start a conversation</Link>
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

function GuideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div>
        <h2 className="text-display-md" style={{ fontSize: 'clamp(1.4rem,2.2vw,1.9rem)' }}>
          {title}
        </h2>
        <p className="mt-4 font-sans text-body leading-relaxed text-ink-60">
          {children}
        </p>
      </div>
    </Reveal>
  )
}
