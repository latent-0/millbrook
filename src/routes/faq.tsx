import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/faq')({
  head: () =>
    seo({
      path: '/faq',
      title: 'FAQ · AEO, GEO & AI Visibility, Answered · Rothenhall Partners',
      description:
        'Plain answers on getting your company cited by ChatGPT, Perplexity, and Google AI Overviews: what AEO and GEO are, how they differ from SEO, why AI may not mention you, and how Cailyx gets your company found, understood and recommended.',
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
        a: 'GEO is optimising content and entities so generative AI models surface and cite your brand in the responses they write. Cailyx treats AEO and GEO as one AI-visibility discipline.',
      },
      {
        q: 'Is SEO dead? Do I still need it?',
        a: 'No. Classic SEO still helps, and the pages that rank often become the sources AI cites. But ranking is no longer enough. AEO adds the work of being the answer, not just a link in a list.',
      },
      {
        q: 'Why doesn’t ChatGPT or Perplexity mention my company?',
        a: 'Usually because the model has little or conflicting information about you, few credible third-party citations, and content that is hard to quote. Cailyx diagnoses which of these is holding you back and fixes the ones that move citations.',
      },
    ],
  },
  {
    title: 'For founders',
    items: [
      {
        q: 'How do I get my startup discovered when buyers ask AI?',
        a: 'By building the entities, content and citations that answer engines trust. Cailyx finds what is missing, tells you what to fix first, and builds it, so the demand you create is actually found.',
      },
      {
        q: 'I have no marketing team. Can Cailyx run this for us?',
        a: 'Yes. Cailyx does the work, not just the reporting. On managed plans our team runs the agentic execution alongside you, so you do not need in-house depth to move the number.',
      },
      {
        q: 'How do I show up in ChatGPT, Perplexity, and Google AI Overviews?',
        a: 'Each engine weighs sources differently, so Cailyx tracks where you appear across ChatGPT, Perplexity, Google AI Overviews, Google AI Mode, Gemini, Google Search, and Copilot, then builds the content and citations each one rewards and measures the change.',
      },
      {
        q: 'We are pre-revenue and lean. Is it too early for this?',
        a: 'No. Start free with an AI Visibility Score to see exactly where you stand, then move only when it is worth it. The earlier your entity is clean, the sooner it compounds.',
      },
    ],
  },
  {
    title: 'Product and plans',
    items: [
      {
        q: 'What is Cailyx?',
        a: 'Cailyx is an AI-visibility platform. It tracks how AI assistants see you, diagnoses why you are missing, and runs the agentic work to fix it, across every major answer engine.',
      },
      {
        q: 'Is Cailyx just another tracker?',
        a: 'No. Trackers stop at the score and hand the work back to you. Cailyx closes the loop: it diagnoses the causes and builds the fixes, so the number actually moves.',
      },
      {
        q: 'How do plans work?',
        a: 'Start free with an AI Visibility Score, subscribe to Cailyx for continuous tracking and prioritised fixes, or add managed execution where our team runs the work with you. Pricing scales to the stage you are at.',
      },
    ],
  },
  {
    title: 'Getting started',
    items: [
      {
        q: 'How do I get started?',
        a: 'Start with a free AI Visibility Score. It runs on your public footprint and returns the number and the specific reasons behind it, with no card and no call.',
      },
      {
        q: 'How fast will we see results?',
        a: 'Early visibility gains show in weeks; citation share and pipeline compound from there. Cailyx baselines on day one so every change is measured.',
      },
      {
        q: 'How does Cailyx measure success?',
        a: 'By AI citation share across ChatGPT, Perplexity, Google AI Overviews, Google AI Mode, Gemini, Google Search, and Copilot, plus the qualified pipeline and conversion that visibility drives.',
      },
      {
        q: 'Where are you based, and is Cailyx available worldwide?',
        a: 'Rothenhall is based in Bengaluru, India, with a presence in Edinburgh, UK. Cailyx works for companies worldwide.',
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
              Cailyx gets you found, understood and recommended by AI assistants.
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
                        <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
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
        <Container className="py-24 sm:py-32 text-center">
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
