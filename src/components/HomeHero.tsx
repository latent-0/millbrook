import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import { useRef } from 'react'

const HEADER = '4.75rem'

/* Save the supplied skyline photo here: public/hero-skyline.jpg */
const BACKGROUND_IMAGE = '/hero-skyline.jpg'

const TITLE_LINES = ['Be the company', 'the AI', 'recommends.']

/* -- Entrance animations -- */

const titleContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
}
const titleLine: Variants = {
  hidden: { opacity: 0, x: -32, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 24, stiffness: 100, mass: 1.1 },
  },
}

export function HomeHero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // The photo panel zooms out into a rounded card and locks at 65%.
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, reduce ? 1 : 0.65])
  const radius = useTransform(scrollYProgress, [0, 0.4], [0, reduce ? 0 : 40])

  // The white text is clipped to the shrinking panel. Where the panel no
  // longer covers it, the cognac layer beneath shows through in real time.
  const clipInset = useTransform(scrollYProgress, [0, 0.4], [0, reduce ? 0 : 17.5])
  const clipRadius = useTransform(scrollYProgress, [0, 0.4], [0, reduce ? 0 : 26])
  const clipPath = useMotionTemplate`inset(${clipInset}% round ${clipRadius}px)`

  return (
    <section
      ref={ref}
      className="relative bg-canvas"
      style={{ marginTop: `-${HEADER}`, height: reduce ? '100svh' : '190vh' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Photo panel — scales + rounds */}
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="absolute inset-0 overflow-hidden bg-night shadow-[0_50px_120px_-50px_rgba(0,0,0,0.6)]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
            role="img"
            aria-label="Manhattan skyline at dusk, seen through a floor-to-ceiling window"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(72% 62% at 20% 32%, rgba(20,18,13,0.88), rgba(20,18,13,0.18) 62%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(18,15,11,0.5) 0%, rgba(18,15,11,0.1) 42%, rgba(12,10,7,0.68) 100%)',
            }}
          />
          <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
        </motion.div>

        {/* Text — full size. Cognac base shows wherever the panel has
            moved out from under the white copy clipped to the panel. */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <HeadlineLayer color="var(--color-cognac-soft)" />
        </div>
        <motion.div
          style={{ clipPath }}
          className="pointer-events-none absolute inset-0 z-10"
        >
          <HeadlineLayer color="var(--color-canvas)" />
        </motion.div>
      </div>
    </section>
  )
}

function HeadlineLayer({ color }: { color: string }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[88rem] flex-col justify-center px-6 sm:px-8 lg:px-12">
      <motion.h1
        variants={titleContainer}
        initial="hidden"
        animate="visible"
        className="max-w-4xl font-display"
        style={{
          fontSize: 'clamp(3rem, 8.5vw, 7.75rem)',
          lineHeight: 1.04,
          letterSpacing: '-0.02em',
          fontWeight: 300,
          color,
        }}
      >
        {TITLE_LINES.map((line, i) => (
          <motion.span key={i} variants={titleLine} className="block">
            {line}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  )
}
