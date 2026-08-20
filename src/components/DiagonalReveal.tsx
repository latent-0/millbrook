import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'motion/react'
import { useRef } from 'react'
import { Container } from './site'

const IMAGE = 'https://picsum.photos/seed/rothenhall-reveal/1600/1000'
const SLANT = 14 // % horizontal offset top-to-bottom → the diagonal

export function DiagonalReveal() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Band half-width (% of viewport) grows from a thin diagonal strip to full.
  const band = useTransform(scrollYProgress, [0, 0.55], [9, 135])
  const leftTop = useTransform(band, (v) => 50 - v + SLANT)
  const rightTop = useTransform(band, (v) => 50 + v + SLANT)
  const rightBot = useTransform(band, (v) => 50 + v - SLANT)
  const leftBot = useTransform(band, (v) => 50 - v - SLANT)
  const clipPath = useMotionTemplate`polygon(${leftTop}% 0%, ${rightTop}% 0%, ${rightBot}% 100%, ${leftBot}% 100%)`

  const imgScale = useTransform(scrollYProgress, [0, 0.55], [1.15, 1])
  // Intro stays put and recolors as the image slides under it; fades at the end.
  const introOpacity = useTransform(scrollYProgress, [0.52, 0.66], [1, 0])
  const lineOpacity = useTransform(scrollYProgress, [0.42, 0.6], [1, 0])

  if (reduce) {
    return <ReducedFallback />
  }

  return (
    <section ref={ref} className="relative bg-canvas-2" style={{ height: '240vh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* faint diagonal parallel lines across the whole space */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-72deg, rgba(154,122,74,0.12) 0px, rgba(154,122,74,0.12) 1px, transparent 1px, transparent 26px)',
          }}
        />

        {/* the image, clipped to the expanding diagonal band */}
        <motion.div style={{ clipPath }} className="absolute inset-0">
          <motion.div
            style={{
              scale: imgScale,
              backgroundImage: `url(${IMAGE})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="absolute inset-0"
          />
          {/* filter to keep it monochrome + on brand */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply"
            style={{ background: 'rgba(32,26,18,0.28)' }}
          />
          {/* legibility gradient at the bottom-right for the persistent caption */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(305deg, rgba(12,10,7,0.66) 0%, rgba(12,10,7,0) 46%)',
            }}
          />
        </motion.div>

        {/* the two diagonal edge lines */}
        <motion.svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{ opacity: lineOpacity }}
        >
          <motion.line
            x1={leftTop}
            y1={0}
            x2={leftBot}
            y2={100}
            stroke="var(--color-cognac)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
          <motion.line
            x1={rightTop}
            y1={0}
            x2={rightBot}
            y2={100}
            stroke="var(--color-cognac)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        </motion.svg>

        {/* intro text: ink base + white copy clipped to the image band, so the
            words recolor to white in real time as the image slides under them */}
        <motion.div style={{ opacity: introOpacity }} className="absolute inset-0">
          <IntroLayer color="var(--color-ink)" eyebrowColor="var(--color-cognac)" />
          <motion.div style={{ clipPath }} className="absolute inset-0">
            <IntroLayer color="var(--color-canvas)" eyebrowColor="var(--color-brass-soft)" />
          </motion.div>
        </motion.div>

        {/* persistent caption, bottom-right; recolors as the image covers it */}
        <div className="absolute inset-0">
          <SolutionLayer color="var(--color-ink)" eyebrowColor="var(--color-cognac)" />
          <motion.div style={{ clipPath }} className="absolute inset-0">
            <SolutionLayer color="var(--color-canvas)" eyebrowColor="var(--color-brass-soft)" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function IntroLayer({
  color,
  eyebrowColor,
}: {
  color: string
  eyebrowColor: string
}) {
  return (
    <div className="flex h-full items-center">
      <Container width="wide">
        <div className="max-w-xl">
          <p
            className="font-sans uppercase"
            style={{ color: eyebrowColor, letterSpacing: '0.2em', fontSize: '0.72rem', fontWeight: 500 }}
          >
            The old way
          </p>
          <h2 className="text-display-lg mt-5" style={{ color }}>
            A tangle of vendors. No one accountable.
          </h2>
        </div>
      </Container>
    </div>
  )
}

function SolutionLayer({
  color,
  eyebrowColor,
}: {
  color: string
  eyebrowColor: string
}) {
  return (
    <div className="flex h-full items-end">
      <Container width="wide" className="pb-14 sm:pb-20">
        <div className="ml-auto max-w-md text-right">
          <p
            className="font-sans uppercase"
            style={{ color: eyebrowColor, letterSpacing: '0.2em', fontSize: '0.72rem', fontWeight: 500 }}
          >
            The Rothenhall way
          </p>
          <h3
            className="mt-4 font-display"
            style={{ color, fontSize: 'clamp(1.7rem,3.4vw,2.9rem)', fontWeight: 400, lineHeight: 1.12 }}
          >
            One operator owns the entire stack.
          </h3>
        </div>
      </Container>
    </div>
  )
}

function ReducedFallback() {
  return (
    <section className="relative overflow-hidden bg-night text-canvas">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
        }}
      />
      <Container className="relative py-32 text-center">
        <p className="eyebrow" style={{ color: 'var(--color-brass-soft)', letterSpacing: '0.2em' }}>
          The Rothenhall way
        </p>
        <h3 className="mt-5 font-display" style={{ fontSize: 'clamp(1.8rem,3.6vw,3rem)', fontWeight: 400 }}>
          One operator owns the entire stack.
        </h3>
      </Container>
    </section>
  )
}
