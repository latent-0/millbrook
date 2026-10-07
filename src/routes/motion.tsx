import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { BoardingPass, MotionTour, MotionWaitlist, MotionWordmark } from '../components/MotionShowcase'
import { seo, SITE } from '../lib/seo'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Motion',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Social studio for Instagram, Facebook and Threads by Rothenhall Partners: a planner, a pre-flight check that predicts how a post will land, a content lab and comment-to-DM automations. Early access list open.',
  creator: { '@id': `${SITE.url}/#organization` },
  publisher: { '@id': `${SITE.url}/#organization` },
  url: `${SITE.url}/motion`,
}

export const Route = createFileRoute('/motion')({
  head: () => ({
    ...seo({
      path: '/motion',
      title: 'Motion · Social studio for Instagram, Facebook and Threads · Rothenhall Partners',
      description:
        'Motion is Rothenhall’s social studio: plan the week, check a post before it goes out, and run comment-to-DM automations. Boarding soon. Join the early access list.',
    }),
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(schema) }],
  }),
  component: Motion,
})

const POINTS = [
  ['Plan', 'A week-and-month planner with thumbnails, drag to reschedule, and a feed preview.'],
  ['Pre-flight', 'Check a reel, image, carousel or text post before it goes out. Get a verdict, scores and timestamped fixes.'],
  ['Engage', 'Reply to keyword comments with a DM you wrote, automatically, with every rule in one place.'],
]

function Motion() {
  return (
    <>
      <section className="relative overflow-hidden bg-night text-canvas">
        <img
          src="/brand/griffin.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 hidden w-[34rem] select-none md:block"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.05 }}
        />
        <Container className="relative pt-24 pb-24 sm:pt-32 sm:pb-28">
          <Reveal>
            <Eyebrow className="eyebrow-light">Motion · Social studio</Eyebrow>
            <div className="mt-8" aria-hidden>
              <MotionWordmark size={46} dark />
            </div>
            <h1 className="mt-8 max-w-4xl font-display" style={{ fontSize: 'clamp(2.6rem, 6.4vw, 5.4rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.02 }}>
              Motion is on the runway.
            </h1>
            <p className="text-lead mt-8 max-w-2xl text-canvas/70">
              A social studio for Instagram, Facebook and Threads. Plan the week, check a post
              before it goes out, and let comment-to-DM run while you sleep. The studio is built
              and being readied for take-off.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#motion-waitlist" className="btn btn-light">Join the early access list</a>
              <a href="#inside" className="btn btn-ghost-light">See inside</a>
            </div>
          </Reveal>
          <div className="mt-20">
            <BoardingPass />
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-canvas">
        <Container className="py-24 sm:py-28">
          <div className="grid gap-10 md:grid-cols-3">
            {POINTS.map(([t, b], i) => (
              <Reveal key={t} delay={i * 80}>
                <p className="eyebrow">{`0${i + 1}`} · {t}</p>
                <p className="mt-4 font-sans text-body leading-relaxed text-ink-80">{b}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="inside" className="scroll-mt-20 border-t border-night-line bg-night text-canvas">
        <Container width="wide" className="py-24 sm:py-32">
          <Reveal>
            <h2 className="font-display text-canvas" style={{ fontSize: 'clamp(1.9rem,3.6vw,2.9rem)', lineHeight: 1.08 }}>
              A look inside the cockpit.
            </h2>
          </Reveal>
          <div className="mt-12">
            <MotionTour />
          </div>
        </Container>
      </section>

      <section id="motion-waitlist" className="scroll-mt-20 border-t border-night-line bg-night text-canvas">
        <Container width="narrow" className="pb-24 pt-8 sm:pb-32">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
            <Reveal>
              <Eyebrow className="eyebrow-light">Early access</Eyebrow>
              <h2 className="mt-5 font-display text-canvas" style={{ fontSize: 'clamp(1.8rem,3.4vw,2.7rem)', lineHeight: 1.06 }}>
                Be on the first flight.
              </h2>
              <p className="mt-4 font-sans text-body leading-relaxed text-canvas/65">
                Join the list and Rothenhall will reach out when early access opens. No card, no spam, just a seat.
              </p>
              <p className="mt-8 font-sans text-caption text-canvas/50">
                Looking for how AI describes your brand? See <Link to="/cailyx" className="link-line text-canvas/80">Cailyx</Link>.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <MotionWaitlist />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
