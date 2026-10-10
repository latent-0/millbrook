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
        a: 'Yes. Our operating tiers run the work alongside you, on our own platform, so you do not need in-house depth to move the number. Foundation measures and tracks the fixes, Growth adds strategy and content, and Operating Partner gives you a named operator who owns the result.',
      },
      {
        q: 'How do I show up in ChatGPT, Perplexity, and Google AI Overviews?',
        a: 'Each engine weighs sources differently, so Cailyx tracks where you appear across ChatGPT, Perplexity, Google AI Overviews, Google AI Mode and Gemini, with Google Search and Copilot next, then builds the content and citations each one rewards and measures the change.',
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
        a: 'Cailyx is Rothenhall’s AI-visibility platform. It tracks how AI assistants see you, diagnoses why you are missing, and runs the agentic work to fix it, across every major answer engine. Our team runs it for clients today, and direct client access will follow later.',
      },
      {
        q: 'Is Cailyx just another tracker?',
        a: 'No. Trackers stop at the score and hand the work back to you. Cailyx closes the loop: it diagnoses the causes and builds the fixes, so the number actually moves.',
      },
      {
        q: 'How do plans work?',
        a: 'Start with a free AI Visibility Score or a paid Diagnostic. Then choose a monthly operating tier (Foundation, Growth or Operating Partner), and add single modules or one-off projects where you need them. The pricing page lists exactly what each one includes.',
      },
    ],
  },
  {
    title: 'Working with Rothenhall',
    items: [
      {
        q: 'What do you actually deliver?',
        a: 'A named set of documents and work for each stage: an onboarding brief, an AI visibility baseline, a site structure review with a tracked Fix Plan, a competitor analysis, positioning and ICP, a funnel plan, then weekly reports and a monthly review. Each has a written definition of done. The services page lists them.',
      },
      {
        q: 'Do we need to take everything?',
        a: 'No. Most clients take one operating tier, and some take a single add-on or a one-off project. Every company is different, so we adapt the deliverables to your business, industry and stage.',
      },
      {
        q: 'What do you need from us?',
        a: 'Facts about your business that only you hold: products, customers, pricing and proof, plus platform access given by permission. We research your market first, then ask only for what we cannot find, and we never ask for shared passwords.',
      },
      {
        q: 'What are the contract terms?',
        a: 'A three-month minimum, then 30 days written notice. Monthly invoicing in advance with 30-day payment, prices exclusive of VAT or GST, one Master Services Agreement, and a Statement of Work for each engagement. A data processing agreement is available under GDPR.',
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
        a: 'By AI citation share across ChatGPT, Perplexity, Google AI Overviews, Google AI Mode and Gemini, plus the qualified pipeline and conversion that visibility drives.',
      },
      {
        q: 'Where are you based, and who do you work with?',
        a: 'Rothenhall is based in Bengaluru, India, with a presence in Edinburgh, UK. We work with companies in India, Europe and the US.',
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
