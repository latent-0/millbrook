import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/faq')({
  head: () =>
    seo({
      path: '/faq',
      title: 'FAQ · AEO, GEO & AI Visibility, Answered · Rothenhall Partners',
      description:
        'Plain answers on getting your company cited by ChatGPT, Perplexity, and Google AI Overviews: what AEO and GEO are, how they differ from SEO, why AI may not mention you, and how Rothenhall works with founders and funds in India and worldwide.',
      keywords:
        'what is AEO, what is GEO, AEO vs SEO, how to show up in ChatGPT, get cited by Perplexity, Google AI Overviews, fractional operating partner, AI visibility India',
    }),
  component: Faq,
})

type QA = { q: string; a: string }
type Group = { title: string; items: QA[] }

const GROUPS: Group[] = [
  {
    title: 'The basics',
    items: [
      {
        q: 'How do people find companies now that they use AI?',
        a: 'Increasingly they ask an AI assistant instead of scrolling a list of links. ChatGPT, Perplexity, and Google AI Overviews return a short synthesised answer that names a handful of companies. If you are not in that answer, you are not in the consideration set.',
      },
      {
        q: 'What is Answer Engine Optimization (AEO)?',
        a: 'AEO is the practice of getting your company named and cited in AI-generated answers, rather than only ranking in a list of search results. It focuses on the entities, sources, and structured content that answer engines actually pull from.',
      },
      {
        q: 'What is Generative Engine Optimization (GEO)?',
        a: 'GEO is optimising content and entities so generative AI models surface and cite your brand in the responses they write. Rothenhall runs AEO and GEO as one AI-visibility discipline.',
      },
      {
        q: 'Is SEO dead? Do I still need it?',
        a: 'No. Classic SEO still helps, and the pages that rank often become the sources AI cites. But ranking is no longer enough. AEO adds the work of being the answer, not just a link in a list.',
      },
      {
        q: 'Why doesn’t ChatGPT or Perplexity mention my company?',
        a: 'Usually because the model has little or conflicting information about you, few credible third-party citations, and content that is hard to quote. We diagnose which of these is holding you back and fix the ones that move citations.',
      },
    ],
  },
  {
    title: 'For founders',
    items: [
      {
        q: 'How do I get my startup discovered when buyers ask AI?',
        a: 'By building the entities, content, and citations that answer engines trust, then wiring the go-to-market and RevOps so the demand you create is captured and measured. We do both as one engagement.',
      },
      {
        q: 'I have no marketing team. Can you run growth for us?',
        a: 'Yes. That is the point of a fractional operating partner. We act as the senior operator you cannot yet hire full time, owning the work end to end.',
      },
      {
        q: 'How do I show up in ChatGPT, Perplexity, and Google AI Overviews?',
        a: 'Each engine weighs sources differently, so we track where you appear across all three and engineer the content and citations that each one rewards, then measure the change.',
      },
      {
        q: 'We are pre-revenue and lean. Is it too early for this?',
        a: 'A fixed-fee sprint is designed for exactly this: a defined, time-boxed push that builds the foundation without the cost or risk of a full hire.',
      },
    ],
  },
  {
    title: 'For funds and portfolio companies',
    items: [
      {
        q: 'How does this work across a whole portfolio?',
        a: 'We start with one or two portfolio companies, prove the model with documented before-and-after results, then apply one operating standard across the portfolio through a portfolio-wide retainer.',
      },
      {
        q: 'What is a fractional operating partner?',
        a: 'A senior operator who owns a company’s growth part-time, embedded and accountable for the outcome, without the cost or permanence of a full-time executive.',
      },
      {
        q: 'How is Rothenhall different from an SEO agency, a RevOps consultant, or a fractional CMO?',
        a: 'Each of those owns one slice. Rothenhall owns AI visibility, go-to-market, and revenue operations as one system, under a single accountable owner, so nothing falls between the seams.',
      },
    ],
  },
  {
    title: 'Working with Rothenhall',
    items: [
      {
        q: 'How do engagements and pricing work?',
        a: 'Three models: fixed-fee sprints for a defined push, monthly operating retainers where we own the full revenue stack, and portfolio-wide retainers for funds. Scope and fee are set to the stage you are at.',
      },
      {
        q: 'How fast will we see results?',
        a: 'Infrastructure and early visibility gains show in weeks; compounding citation share and pipeline build over the engagement. We baseline on day one so every change is measured.',
      },
      {
        q: 'How do you measure success?',
        a: 'By AI citation share across ChatGPT, Perplexity, and Google AI Overviews, qualified pipeline, conversion rate, and reporting integrity, all traced through the CRM.',
      },
      {
        q: 'Where are you based, and do you work outside India?',
        a: 'We are based in Bengaluru, India, and work with founders and funds across the globe.',
      },
    ],
  },
]

function Faq() {
  const all = GROUPS.flatMap((g) => g.items)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: all.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <section className="border-b border-line">
        <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20">
          <Reveal>
            <Eyebrow>Frequently asked</Eyebrow>
            <h1 className="text-display-lg mt-8 max-w-3xl">
              AI visibility, answered plainly.
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-ink-60">
              What AEO and GEO are, why an AI might not mention you yet, and how
              Rothenhall works with founders and funds in India and worldwide.
            </p>
          </Reveal>
        </Container>
      </section>

      {GROUPS.map((group) => (
        <section key={group.title} className="border-t border-line first:border-t-0">
          <Container className="py-16 sm:py-20">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <Reveal>
                  <h2 className="text-display-md" style={{ fontSize: 'clamp(1.5rem,2.4vw,2rem)' }}>
                    {group.title}
                  </h2>
                </Reveal>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <div className="divide-y divide-line border-y border-line">
                  {group.items.map((item, i) => (
                    <Reveal key={item.q} delay={i * 40}>
                      <div className="py-6">
                        <h3 className="font-display text-ink" style={{ fontSize: '1.3rem' }}>
                          {item.q}
                        </h3>
                        <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-60">
                          {item.a}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}

      <section className="bg-night text-canvas">
        <Container className="py-20 sm:py-28 text-center">
          <Reveal>
            <h2 className="text-display-md mx-auto max-w-2xl text-canvas">
              Still deciding where you stand in the answers?
            </h2>
            <div className="mt-9 flex justify-center">
              <Link to="/contact" className="btn btn-light">
                Request a diagnostic
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
