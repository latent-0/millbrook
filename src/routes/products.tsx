import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal, StatusBadge } from '../components/site'
import { Glyph } from '../components/ProductVisuals'
import { PRODUCTS } from '../lib/products'
import { seo, SITE } from '../lib/seo'

const platform = PRODUCTS.filter((p) => p.group === 'platform')
const tools = PRODUCTS.filter((p) => p.group === 'tool')

const TODAY: Record<string, string> = {
  cailyx:
    'Our team runs Cailyx for every client. You see the results in your weekly report and your Fix Plan, and each fix is tested on the live site before it is marked done.',
  motion:
    'Motion is not open to clients yet. The early access list is open, and we will invite people in turn.',
}

const CTA: Record<string, string> = {
  cailyx: 'About Cailyx',
  motion: 'Join the early access list',
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Rothenhall products',
  itemListElement: PRODUCTS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.name,
    description: p.line,
    url: `${SITE.url}${p.to}`,
  })),
}

export const Route = createFileRoute('/products')({
  head: () => ({
    ...seo({
      path: '/products',
      title: 'Products · Cailyx, Motion, Openkit and Things · Rothenhall Partners',
      description:
        'The platform behind Rothenhall’s work and two free tools. Cailyx measures how AI describes you and tracks every fix, Motion plans your social posts, and Openkit and Things are free to use.',
    }),
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(schema) }],
  }),
  component: Products,
})

function Products() {
  return (
    <>
      <section className="border-b border-line">
        <Container className="pt-24 pb-16 sm:pt-32 sm:pb-20">
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Reveal>
                <Eyebrow>Products</Eyebrow>
                <h1 className="text-display-lg mt-8 max-w-3xl">
                  The platform behind the work,{' '}
                  <span style={{ color: 'var(--color-cognac)' }}>and two free tools.</span>
                </h1>
              </Reveal>
            </div>
            <div className="md:col-span-4">
              <Reveal delay={100}>
                <p className="font-sans text-body leading-relaxed text-ink-60">
                  Rothenhall is the operator, and these are what we build and
                  run on. Each one says plainly what it is today.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20 sm:py-24">
          <Reveal>
            <Eyebrow>The platform</Eyebrow>
            <h2 className="text-display-md mt-6 max-w-2xl">Built for our own engagements first.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {platform.map((p, i) => (
              <Reveal key={p.key} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col rounded-2xl bg-night p-8 text-canvas shadow-[0_40px_80px_-40px_rgba(26,23,18,0.55)] sm:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <Glyph k={p.key} size={56} />
                    <StatusBadge p={p} dark />
                  </div>
                  <h3 className="mt-6 font-display text-canvas" style={{ fontSize: '2rem', lineHeight: 1.05 }}>
                    {p.name}
                  </h3>
                  <p className="mt-3 font-sans text-body leading-relaxed text-canvas/70">{p.line}</p>
                  <ul className="mt-6 space-y-2.5">
                    {p.facts.map((f) => (
                      <li key={f} className="flex gap-3 font-sans text-caption leading-snug text-canvas/80">
                        <span aria-hidden className="mt-[0.5rem] h-1.5 w-1.5 flex-none rotate-45 bg-brass-soft" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 border-t border-night-line pt-6">
                    <p className="eyebrow eyebrow-light">Today</p>
                    <p className="mt-3 font-sans text-caption leading-relaxed text-canvas/65">{TODAY[p.key]}</p>
                  </div>
                  <Link to={p.to as '/cailyx' | '/motion'} className="btn btn-light mt-8 self-start">
                    {CTA[p.key]}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-canvas-2">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <Eyebrow>Free tools</Eyebrow>
            <h2 className="text-display-md mt-6 max-w-2xl">Two small tools, open to anyone.</h2>
            <p className="text-lead mt-5 max-w-2xl text-ink-60">No account and no card. They exist to be useful, and to show how we think.</p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {tools.map((p, i) => (
              <Reveal key={p.key} delay={i * 80} className="h-full">
                <a
                  href={p.to}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-canvas p-8 transition-colors hover:border-line-strong hover:bg-paper"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Glyph k={p.key} size={52} />
                    <StatusBadge p={p} />
                  </div>
                  <h3 className="mt-6 font-display text-ink" style={{ fontSize: '1.7rem', lineHeight: 1.05 }}>
                    {p.name}
                  </h3>
                  <p className="mt-2 font-sans text-caption text-ink-45">{p.short}</p>
                  <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">{p.line}</p>
                  <span className="mt-6 font-sans text-caption text-ink-80">
                    Open {p.name} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-night text-canvas">
        <Container width="narrow" className="py-24 text-center sm:py-28">
          <Reveal>
            <Eyebrow className="eyebrow-light inline-flex justify-center">How it fits together</Eyebrow>
            <h2 className="mt-8 font-display text-canvas" style={{ fontSize: 'clamp(1.9rem,4vw,2.8rem)', lineHeight: 1.1, fontWeight: 300 }}>
              You buy the work. The platform is how we do it.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-body leading-relaxed text-canvas/70">
              Every operating tier runs on Cailyx. See what each tier includes,
              or start with a Diagnostic.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/pricing" className="btn btn-light">
                See pricing
              </Link>
              <Link to="/services" className="btn btn-ghost-light">
                How we work
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
