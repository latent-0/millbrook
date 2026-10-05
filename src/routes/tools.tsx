import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { TOOLS, ToolCard } from '../components/FreeTools'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/tools')({
  head: () => ({
    ...seo({
      path: '/tools',
      title: 'Free tools · Openkit and Things · Rothenhall Partners',
      description:
        'Free tools from Rothenhall Partners: Openkit, a voice Sales Call Trainer, and Things, a plush-character builder that can work as a mascot on your site. No account needed.',
    }),
  }),
  component: Tools,
})

const WHY = [
  { title: 'Useful on their own', body: 'Each tool solves a real problem without a sales call. If it helps, good. That is the whole deal.' },
  { title: 'Built the way we work', body: 'They run on the same stack and standards as our client work, so they also show how we build.' },
  { title: 'A natural next step', body: 'If a tool shows you a gap, we can help you close it across the whole team. Only if you want.' },
]

function Tools() {
  return (
    <>
      <section className="relative overflow-hidden bg-night text-canvas">
        <Container className="relative pt-24 pb-20 sm:pt-32 sm:pb-24">
          <Reveal>
            <Eyebrow className="eyebrow-light">Free tools · Built by Rothenhall</Eyebrow>
            <h1
              className="mt-8 max-w-4xl font-display"
              style={{ fontSize: 'clamp(2.6rem, 6.4vw, 5.2rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.02 }}
            >
              Tools we built, free to use.
            </h1>
            <p className="mt-8 max-w-2xl font-sans text-body-lg leading-relaxed text-canvas/70">
              Small, finished products from the Rothenhall team. Practice a sales call out loud, or build a
              character that greets your visitors. No account, no card.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              {TOOLS.map((t) => (
                <a key={t.key} href={`#${t.key}`} className="btn btn-ghost-light">
                  {t.name}
                </a>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line bg-canvas-2">
        <Container className="space-y-8 py-20 sm:py-24">
          {TOOLS.map((tool, i) => (
            <div key={tool.key} id={tool.key} className="scroll-mt-28">
              <ToolCard tool={tool} placement="hub" index={i} />
            </div>
          ))}
        </Container>
      </section>

      <section className="border-t border-line bg-canvas">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <Eyebrow>Why we build them</Eyebrow>
            <h2 className="text-display-md mt-6 max-w-3xl">A firm that builds in the open is easier to trust.</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div className="h-full bg-canvas p-7">
                  <h3 className="font-display text-ink" style={{ fontSize: '1.25rem' }}>{w.title}</h3>
                  <p className="mt-3 font-sans text-caption leading-relaxed text-ink-60">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-night text-canvas">
        <Container width="narrow" className="py-24 text-center sm:py-28">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-canvas" style={{ fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 1.08, fontWeight: 300 }}>
              Want this level of build for your own company?
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-body leading-relaxed text-canvas/70">
              Rothenhall is a fractional operating partner for AI visibility, go-to-market and revenue.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-light">Talk to us</Link>
              <Link to="/cailyx" className="btn btn-ghost-light">See Cailyx</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
