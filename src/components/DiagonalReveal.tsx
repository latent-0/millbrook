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
  const scrimOpacity = useTransform(scrollYProgress, [0.4, 0.72], [0, 0.6])
  const cardOpacity = useTransform(scrollYProgress, [0.62, 0.86], [0, 1])
  const cardY = useTransform(scrollYProgress, [0.62, 0.9], [50, 0])

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
          {/* darkening scrim for the glass card */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{ opacity: scrimOpacity, background: 'rgba(12,10,7,1)' }}
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

        {/* glass card — fades in once the image is full */}
        <motion.div
          style={{ opacity: cardOpacity, y: cardY }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div
            className="max-w-xl rounded-3xl border border-white/20 p-10 text-center backdrop-blur-md sm:p-12"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <p className="eyebrow" style={{ color: 'var(--color-brass-soft)', letterSpacing: '0.2em' }}>
              The Rothenhall way
            </p>
            <h3 className="mt-5 font-display text-canvas" style={{ fontSize: 'clamp(1.8rem,3.6vw,3rem)', fontWeight: 400, lineHeight: 1.1 }}>
              One operator owns the entire stack.
            </h3>
            <p className="mx-auto mt-5 max-w-md font-sans text-[1.02rem] leading-relaxed text-canvas/70">
              AI visibility, go-to-market, and revenue operations, run as one
              accountable engine.
            </p>
          </div>
        </motion.div>
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
