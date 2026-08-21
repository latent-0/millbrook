import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  useInView,
  animate,
  type Variants,
} from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Container } from './site'

const HEADER = '4.75rem'

/* ------------------------------------------------------------------ */
/*  Shared motion variants                                             */
/* ------------------------------------------------------------------ */

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.04 } },
}

export const riseItem: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(7px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 24, stiffness: 120 },
  },
}

/* A drop-in stagger group: children fade + rise in sequence on scroll-in. */
export function Stagger({
  children,
  className = '',
  amount = 0.3,
}: {
  children: ReactNode
  className?: string
  amount?: number
}) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div variants={riseItem} className={className} style={style}>
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  CountUp — animates a number when it scrolls into view              */
/* ------------------------------------------------------------------ */

export function CountUp({
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.5,
  className = '',
  style,
}: {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  GrowBar — a horizontal bar that grows to its width on scroll-in    */
/* ------------------------------------------------------------------ */

export function GrowBar({
  pct,
  className = '',
  delay = 0,
}: {
  pct: number
  className?: string
  delay?: number
}) {
  return (
    <div className="relative h-9 w-full overflow-hidden rounded-sm bg-canvas-2">
      <motion.div
        className={`absolute inset-y-0 left-0 rounded-sm ${className}`}
        initial={{ width: '0%' }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  ResearchHero — cinematic scroll hero                               */
/*  Headline springs in line by line; on scroll the whole stage        */
/*  drifts and settles, a cognac glow breathes, grain drifts.          */
/* ------------------------------------------------------------------ */

const TITLE_LINES = ['When Claude', 'recommends,', 'why not you?']

const heroTitle: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
}
const heroLine: Variants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(9px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 26, stiffness: 90, mass: 1.1 },
  },
}

// Avatar stack used in the social-proof pill.
function AvatarStack({ size = 32 }: { size?: number }) {
  return (
    <div className="flex">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full border"
          style={{
            width: size,
            height: size,
            marginLeft: i === 0 ? 0 : -(size * 0.32),
            borderColor: 'var(--color-night)',
            background:
              i === 2
                ? 'linear-gradient(135deg, var(--color-cognac-soft), var(--color-cognac-deep))'
                : i === 1
                  ? 'linear-gradient(135deg, var(--color-brass-soft), var(--color-brass-deep))'
                  : 'linear-gradient(135deg, #d8cbb0, var(--color-brass))',
          }}
        />
      ))}
    </div>
  )
}

export function ResearchHero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative bg-canvas" style={{ marginTop: `-${HEADER}` }}>
      {/* clear the fixed header, then frame the card with an even inset */}
      <div style={{ paddingTop: HEADER }}>
        <div className="p-2.5 sm:p-4 lg:p-5" style={{ height: `calc(100svh - ${HEADER})` }}>
          <div
            className="relative h-full min-h-[34rem] overflow-hidden border text-canvas shadow-[0_34px_90px_-45px_rgba(20,18,13,0.5)]"
            style={{
              background: 'var(--color-night)',
              borderColor: 'rgba(183,154,107,0.22)',
              // asymmetric lozenge: two deep corners, two near-square
              borderRadius: '3.75rem 1rem 3.75rem 1rem',
            }}
          >
            {/* IMAGE PANEL: large image, cut off the dark space on a DIAGONAL seam */}
            <div className="absolute inset-0 md:[clip-path:polygon(0%_0%,72%_0%,58%_100%,0%_100%)]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(/hero-skyline.jpg)',
                  // pull the photo toward warm monochrome so the brand grade reads true
                  filter: 'grayscale(0.7) sepia(0.4) brightness(0.66) contrast(1.08)',
                }}
                role="img"
                aria-label="A city skyline at dusk, seen through a tall window"
              />
              {/* deep dark-brown duotone: multiply crushes shadows to brand brown */}
              <div
                className="absolute inset-0 mix-blend-multiply"
                style={{ background: 'linear-gradient(135deg, rgba(58,30,15,0.92), rgba(20,18,13,0.96))' }}
              />
              {/* cognac soft-light wash warms the midtones */}
              <div
                className="absolute inset-0 mix-blend-soft-light"
                style={{ background: 'linear-gradient(135deg, var(--color-cognac), var(--color-brass-deep))', opacity: 0.55 }}
              />
              {/* lift toward night at the top-left so it settles into the card */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(20,18,13,0.55), rgba(20,18,13,0) 45%)' }} />
              {/* five-panel vertical divisions, echoing the reference architecture */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(20,18,13,0) 0, rgba(20,18,13,0) calc(20% - 1px), rgba(12,10,7,0.55) calc(20% - 1px), rgba(12,10,7,0.55) 20%)',
                }}
              />
              {/* fade into the dark negative space at the right edge */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(20,18,13,0) 58%, var(--color-night) 100%)' }} />
              {/* readability wash under the lower-right headline */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(315deg, rgba(12,10,7,0.82) 0%, rgba(12,10,7,0) 50%)' }} />
              <div className="grain absolute inset-0 opacity-[0.06]" aria-hidden />
            </div>

            {/* breathing cognac glow in the negative space */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(42% 42% at 86% 32%, rgba(168,92,48,0.24), rgba(20,18,13,0) 70%)' }}
              animate={reduce ? undefined : { opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* the diagonal seam line, a house motif */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            >
              <line x1="72" y1="0" x2="58" y2="100" stroke="var(--color-cognac)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" opacity="0.55" />
            </svg>

            {/* Floating social-proof pill, bottom-left */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-6 left-6 z-20 hidden items-center gap-3 rounded-full border py-2 pl-2 pr-5 md:flex"
              style={{ borderColor: 'rgba(247,243,234,0.16)', background: 'rgba(20,18,13,0.5)', backdropFilter: 'blur(6px)' }}
            >
              <AvatarStack size={30} />
              <div className="leading-tight">
                <p className="font-display text-canvas" style={{ fontSize: '0.98rem' }}>≈90,000 answers</p>
                <p className="font-sans text-canvas/55" style={{ fontSize: '0.72rem' }}>analysed · 15+ industries</p>
              </div>
            </motion.div>

            {/* Headline block, overlapping the lower-right of the image */}
            <div className="relative z-10 flex h-full flex-col">
              <div className="mt-auto max-w-xl p-7 sm:p-10 md:ml-auto md:p-12 md:text-right lg:p-14">
                <motion.h1
                  variants={heroTitle}
                  initial="hidden"
                  animate="visible"
                  className="font-display uppercase"
                  style={{ fontSize: 'clamp(2rem, 4.4vw, 4.1rem)', lineHeight: 1.02, letterSpacing: '0.01em', fontWeight: 500, textShadow: '0 2px 24px rgba(12,10,7,0.55)' }}
                >
                  {TITLE_LINES.map((line, i) => (
                    <motion.span
                      key={i}
                      variants={heroLine}
                      className="block"
                      style={i === 2 ? { color: 'var(--color-cognac-soft)' } : undefined}
                    >
                      {line}
                    </motion.span>
                  ))}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6 font-sans text-canvas/70 md:ml-auto md:max-w-md"
                  style={{ fontSize: 'clamp(0.98rem, 1.2vw, 1.12rem)', lineHeight: 1.55 }}
                >
                  More than half the time, Claude answers from memory, not search. We
                  mapped how it decides, and how to earn a place on the shortlist.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8 flex flex-wrap gap-3 md:justify-end"
                >
                  <Link
                    to="/contact"
                    className="btn !py-3 !px-6 text-[0.85rem]"
                    style={{ background: 'var(--color-cognac)', color: '#fff', border: '1px solid var(--color-cognac)' }}
                  >
                    Request a diagnostic
                  </Link>
                  <a href="#findings" className="btn btn-ghost-light !py-3 !px-6 text-[0.85rem]">
                    See the findings
                  </a>
                </motion.div>

                {/* proof, inline on mobile */}
                <div className="mt-8 flex items-center gap-3 md:hidden">
                  <AvatarStack size={28} />
                  <p className="font-sans text-canvas/60" style={{ fontSize: '0.8rem' }}>
                    ≈90,000 answers analysed · 15+ industries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  SlitReveal — the signature diagonal wipe, for the one big line     */
/*  A dark panel opens along a diagonal as you scroll; the setup line   */
/*  recolors to canvas in real time as the panel slides under it.       */
/* ------------------------------------------------------------------ */

const SLANT = 13

export function SlitReveal() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const bandRaw = useTransform(scrollYProgress, [0, 0.55], [8, 135])
  const leftTop = useTransform(bandRaw, (v) => 50 - v + SLANT)
  const rightTop = useTransform(bandRaw, (v) => 50 + v + SLANT)
  const rightBot = useTransform(bandRaw, (v) => 50 + v - SLANT)
  const leftBot = useTransform(bandRaw, (v) => 50 - v - SLANT)
  const clipPath = useMotionTemplate`polygon(${leftTop}% 0%, ${rightTop}% 0%, ${rightBot}% 100%, ${leftBot}% 100%)`

  const lineOpacity = useTransform(scrollYProgress, [0.42, 0.6], [1, 0])
  const setupOpacity = useTransform(scrollYProgress, [0.5, 0.64], [1, 0])
  const payoffOpacity = useTransform(scrollYProgress, [0.34, 0.5], [0, 1])

  if (reduce) {
    return (
      <section className="relative overflow-hidden bg-night text-canvas">
        <Container width="narrow" className="py-28 text-center">
          <p className="eyebrow" style={{ color: 'var(--color-brass-soft)', letterSpacing: '0.22em' }}>
            If you only did one thing
          </p>
          <h2 className="text-display-lg mt-7 text-canvas">
            Write less about yourself. Get more written about you.
          </h2>
        </Container>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative bg-canvas-2" style={{ height: '230vh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* diagonal hatch backdrop */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-72deg, rgba(154,122,74,0.12) 0px, rgba(154,122,74,0.12) 1px, transparent 1px, transparent 26px)',
          }}
        />

        {/* the dark panel, clipped to the expanding diagonal band */}
        <motion.div style={{ clipPath }} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-night"
            style={{
              backgroundImage:
                'radial-gradient(65% 60% at 70% 60%, rgba(168,92,48,0.22), rgba(20,18,13,0) 70%)',
            }}
          />
          <div className="grain absolute inset-0 opacity-[0.06]" aria-hidden />
        </motion.div>

        {/* the two diagonal edge lines */}
        <motion.svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{ opacity: lineOpacity }}
        >
          <motion.line x1={leftTop} y1={0} x2={leftBot} y2={100} stroke="var(--color-cognac)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          <motion.line x1={rightTop} y1={0} x2={rightBot} y2={100} stroke="var(--color-cognac)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        </motion.svg>

        {/* setup line: ink base, recolors to canvas where the panel covers it */}
        <motion.div style={{ opacity: setupOpacity }} className="absolute inset-0">
          <SlitLayer color="var(--color-ink)" eyebrowColor="var(--color-cognac)" align="start" eyebrow="The one move" text="Half the answers never trigger a search." />
          <motion.div style={{ clipPath }} className="absolute inset-0">
            <SlitLayer color="var(--color-canvas)" eyebrowColor="var(--color-brass-soft)" align="start" eyebrow="The one move" text="Half the answers never trigger a search." />
          </motion.div>
        </motion.div>

        {/* payoff line: fades in over the dark panel, bottom-right */}
        <motion.div style={{ opacity: payoffOpacity }} className="absolute inset-0">
          <div className="flex h-full items-end">
            <Container width="wide" className="pb-16 sm:pb-24">
              <div className="ml-auto max-w-2xl text-right">
                <p className="font-sans uppercase" style={{ color: 'var(--color-brass-soft)', letterSpacing: '0.2em', fontSize: '0.72rem', fontWeight: 500 }}>
                  If you only did one thing
                </p>
                <h2
                  className="mt-5 font-display text-canvas"
                  style={{ fontSize: 'clamp(2rem, 5vw, 4.4rem)', fontWeight: 300, lineHeight: 1.06, letterSpacing: '-0.02em' }}
                >
                  Write less about yourself.<br />Get more written about you.
                </h2>
                <p className="ml-auto mt-6 max-w-md font-sans text-[1.02rem] leading-relaxed text-canvas/70">
                  Memory is built from what others say about you. And when Claude does
                  search, it trusts other people’s pages over yours by two to one.
                </p>
              </div>
            </Container>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SlitLayer({
  color,
  eyebrowColor,
  eyebrow,
  text,
  align,
}: {
  color: string
  eyebrowColor: string
  eyebrow: string
  text: string
  align: 'start' | 'end'
}) {
  return (
    <div className="flex h-full items-center">
      <Container width="wide">
        <div className={align === 'end' ? 'ml-auto max-w-xl text-right' : 'max-w-xl'}>
          <p className="font-sans uppercase" style={{ color: eyebrowColor, letterSpacing: '0.2em', fontSize: '0.72rem', fontWeight: 500 }}>
            {eyebrow}
          </p>
          <h2 className="text-display-lg mt-5" style={{ color, fontWeight: 300 }}>
            {text}
          </h2>
        </div>
      </Container>
    </div>
  )
}
