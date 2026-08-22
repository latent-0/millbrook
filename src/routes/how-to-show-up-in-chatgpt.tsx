import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo, SITE } from '../lib/seo'

export const Route = createFileRoute('/how-to-show-up-in-chatgpt')({
  head: () =>
    seo({
      path: '/how-to-show-up-in-chatgpt',
      title: 'How to Show Up in ChatGPT, Perplexity & Google AI Overviews',
      description:
        'A step-by-step guide to getting your company named and cited by AI answer engines: make your entity unambiguous, publish quotable content, earn third-party citations, stay crawlable, and track citation share.',
      keywords:
        'how to show up in ChatGPT, get cited by ChatGPT, rank in Perplexity, Google AI Overviews, AEO guide, GEO, AI search visibility, entity SEO',
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
    text: 'Measure whether you are named, cited, and recommended across ChatGPT, Perplexity, Gemini, and Google AI Overviews for your target questions. Record position, description, source cited, and competitor mentions, then close the gaps.',
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
    inLanguage: 'en',
    publisher: { '@id': `${SITE.url}/#organization` },
    step: STEPS.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
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
              <p className="eyebrow" style={{ letterSpacing: '0.16em' }}>
                Short answer
              </p>
              <p className="mt-3 font-display text-ink" style={{ fontSize: 'clamp(1.15rem,1.8vw,1.5rem)', lineHeight: 1.4 }}>
                To show up in ChatGPT you need three things: a clear,
                machine-readable entity so the model knows who you are; credible
                third-party citations so it trusts you; and quotable, structured
                content it can lift. AI answers come largely from memory and are
                corroborated with live search, so on-site and off-site signals
                both matter.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section>
        <Container width="narrow" className="py-16 sm:py-20">
          <Reveal>
            <p className="font-sans text-[1.05rem] leading-relaxed text-ink-60">
              A hard truth first: capability is not the same as discoverability.
              A firm can be excellent at something and still never surface,
              because the model could not confidently connect the brand to the
              topic from the evidence it could retrieve. Showing up is the work of
              closing that gap. Here is how.
            </p>
          </Reveal>

          <ol className="mt-12 space-y-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.name} delay={i * 50}>
                <li className="flex gap-6">
                  <span className="font-display text-4xl text-cognac" style={{ lineHeight: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-display text-ink" style={{ fontSize: 'clamp(1.35rem,2.2vw,1.8rem)' }}>
                      {s.name}
                    </h2>
                    <p className="mt-3 font-sans text-[1.05rem] leading-relaxed text-ink-60">
                      {s.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <p className="mt-12 font-sans text-[1.05rem] leading-relaxed text-ink-60">
              Not sure how AEO differs from classic search? Read{' '}
              <Link to="/aeo-vs-seo" className="link-line text-cognac">
                AEO vs SEO
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
            <p className="eyebrow" style={{ color: 'var(--color-brass-soft)', letterSpacing: '0.2em' }}>
              This is what we do
            </p>
            <h2 className="text-display-md mt-5 text-canvas" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>
              Rothenhall makes you the company the AI recommends.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-light">Request a diagnostic</Link>
              <Link to="/faq" className="btn btn-ghost-light">Read the FAQ</Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  )
}
