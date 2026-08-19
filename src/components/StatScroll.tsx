import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import { useRef } from 'react'

type Stat = {
  big: string
  mid: string
  line: string
}

const STATS: Stat[] = [
  {
    big: '50M',
    mid: '≈ 4.1M a month',
    line: 'new businesses form worldwide, every year.',
  },
  {
    big: '22–34%',
    mid: 'not the product',
    line: 'the real reason startups fail is go-to-market.',
  },
  {
    big: '900K–1.4M',
    mid: '1,000–1,600 in India',
    line: 'launch every month with no plan to be found.',
  },
]

const SOURCE =
  'Estimates derived from DPIIT registration data and published startup failure-cause statistics.'

const bigStyle: React.CSSProperties = {
  fontSize: 'clamp(3.5rem, 13vw, 13rem)',
  fontWeight: 500,
  lineHeight: 0.88,
  letterSpacing: '-0.045em',
}

const midStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 3.6vw, 2.9rem)',
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: '-0.02em',
}

export function StatScroll() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  if (reduce) {
    return (
      <section className="bg-canvas">
        <div className="mx-auto max-w-4xl space-y-28 px-6 py-32 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <div
                className="font-display text-ink"
                style={{ ...bigStyle, fontSize: 'clamp(3rem, 9vw, 6rem)' }}
              >
                {s.big}
              </div>
              <div className="mt-4 font-display text-cognac" style={midStyle}>
                {s.mid}
              </div>
              <p className="mx-auto mt-5 max-w-md font-sans text-[1.1rem] leading-relaxed text-ink-60">
                {s.line}
              </p>
            </div>
          ))}
          <p className="font-sans text-[0.8rem] text-ink-45">{SOURCE}</p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="relative bg-canvas"
      style={{ height: `${STATS.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {STATS.map((s, i) => (
          <StatBeat
            key={i}
            index={i}
            total={STATS.length}
            progress={scrollYProgress}
            stat={s}
          />
        ))}

        {/* progress ticks */}
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
          {STATS.map((_, i) => (
            <Tick key={i} index={i} total={STATS.length} progress={scrollYProgress} />
          ))}
        </div>

        <p className="absolute bottom-8 left-0 right-0 mx-auto max-w-xl px-6 text-center font-sans text-[0.78rem] leading-relaxed text-ink-45">
          {SOURCE}
        </p>
      </div>
    </section>
  )
}

function StatBeat({
  index,
  total,
  progress,
  stat,
}: {
  index: number
  total: number
  progress: MotionValue<number>
  stat: Stat
}) {
  const seg = 1 / total
  const start = index * seg
  const end = (index + 1) * seg
  const inAt = start + seg * 0.22
  const outAt = end - seg * 0.3

  const opacity = useTransform(progress, [start, inAt, outAt, end], [0, 1, 1, 0])
  const blurPx = useTransform(progress, [start, inAt, outAt, end], [12, 0, 0, 12])
  const filter = useMotionTemplate`blur(${blurPx}px)`
  const scale = useTransform(progress, [start, inAt], [1.14, 1])
  const y = useTransform(progress, [start, end], [50, -50])
  const midY = useTransform(progress, [start, end], [70, -70])

  return (
    <motion.div
      style={{ opacity, filter }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="mx-auto max-w-5xl text-center">
        <motion.div style={{ scale, ...bigStyle }} className="font-display text-ink">
          {stat.big}
        </motion.div>
        <motion.div
          style={{ y: midY, ...midStyle }}
          className="mt-5 font-display text-cognac"
        >
          {stat.mid}
        </motion.div>
        <motion.p
          style={{ y }}
          className="mx-auto mt-6 max-w-md font-sans text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-ink-60"
        >
          {stat.line}
        </motion.p>
      </div>
    </motion.div>
  )
}

function Tick({
  index,
  total,
  progress,
}: {
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const seg = 1 / total
  const opacity = useTransform(
    progress,
    [index * seg, index * seg + seg * 0.22, (index + 1) * seg - seg * 0.3, (index + 1) * seg],
    [0.25, 1, 1, 0.25],
  )
  const scaleX = useTransform(
    progress,
    [index * seg, index * seg + seg * 0.22, (index + 1) * seg - seg * 0.3, (index + 1) * seg],
    [1, 2.4, 2.4, 1],
  )
  return (
    <motion.span style={{ opacity }} className="flex h-2 w-6 items-center justify-end">
      <motion.span
        style={{ scaleX }}
        className="block h-px w-4 origin-right bg-cognac"
      />
    </motion.span>
  )
}
