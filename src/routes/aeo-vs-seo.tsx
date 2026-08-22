import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo, SITE } from '../lib/seo'

export const Route = createFileRoute('/aeo-vs-seo')({
  head: () =>
    seo({
      path: '/aeo-vs-seo',
      title: 'AEO vs SEO: What Is the Difference, and Do You Need Both?',
      description:
        'AEO (Answer Engine Optimization) is being named and cited inside AI answers from ChatGPT, Perplexity, and Google AI Overviews. SEO is ranking in a list of links. A plain comparison, and how they work together, from Rothenhall Partners.',
      keywords:
        'AEO vs SEO, answer engine optimization vs search engine optimization, GEO vs SEO, AI search optimization, ChatGPT SEO, Perplexity SEO, Google AI Overviews',
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

function AeoVsSeo() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'AEO vs SEO: what is the difference, and do you need both?',
    description:
      'A plain comparison of Answer Engine Optimization and Search Engine Optimization, and how they work together.',
    datePublished: '2026-08-22',
    dateModified: '2026-08-22',
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
              <p className="eyebrow" style={{ letterSpacing: '0.16em' }}>
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
                  <table className="w-full border-collapse text-left font-sans text-[0.95rem]">
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

            <GuideBlock title="How to start with AEO">
              Establish an unambiguous entity, publish answer-shaped content mapped
              to the exact questions buyers ask, and earn third-party citations
              that reinforce the same associations. For the step-by-step, see{' '}
              <Link to="/how-to-show-up-in-chatgpt" className="link-line text-cognac">
                how to show up in ChatGPT
              </Link>
              .
            </GuideBlock>
          </article>
        </Container>
      </section>

      <section className="bg-night text-canvas">
        <Container width="narrow" className="py-16 sm:py-20 text-center">
          <Reveal>
            <p className="eyebrow" style={{ color: 'var(--color-brass-soft)', letterSpacing: '0.2em' }}>
              One accountable owner
            </p>
            <h2 className="text-display-md mt-5 text-canvas" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>
              Rothenhall runs AEO, GEO, GTM, and RevOps as one engine.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-light">Start a conversation</Link>
              <Link to="/approach" className="btn btn-ghost-light">See the model</Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
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
        <p className="mt-4 font-sans text-[1.05rem] leading-relaxed text-ink-60">
          {children}
        </p>
      </div>
    </Reveal>
  )
}
