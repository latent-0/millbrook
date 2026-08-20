import { motion, type Variants } from 'motion/react'
import { Container } from './site'

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', damping: 24, stiffness: 120 },
  },
}

const bigNumber: React.CSSProperties = {
  fontSize: 'clamp(4rem, 11vw, 11.5rem)',
  fontWeight: 600,
  lineHeight: 0.84,
  letterSpacing: '-0.05em',
}
const midNumber: React.CSSProperties = {
  fontSize: 'clamp(2.4rem, 4.6vw, 3.6rem)',
  fontWeight: 500,
  lineHeight: 0.95,
  letterSpacing: '-0.03em',
}

const SECONDARY = [
  {
    value: '1,000–1,600',
    line: 'new Indian startups do exactly the same, every month.',
  },
  {
    value: '22–34%',
    line: 'the real reason startups fail is go-to-market, not product.',
  },
]

export function StatBlock() {
  return (
    <section className="border-t border-line bg-canvas">
      <Container width="wide" className="py-28 sm:py-40">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid items-center gap-y-16 md:grid-cols-12 md:gap-x-12"
        >
          {/* Left — the dominant number */}
          <motion.div variants={item} className="md:col-span-7">
            <p
              className="mb-6 font-sans uppercase text-cognac"
              style={{ letterSpacing: '0.22em', fontSize: '0.78rem', fontWeight: 500 }}
            >
              Every month, globally
            </p>
            <div className="font-display text-ink" style={bigNumber}>
              900K–1.4M
            </div>
            <p className="mt-8 max-w-md font-sans text-[1.15rem] leading-relaxed text-ink-60">
              new companies launch with no effective go-to-market plan.
            </p>
          </motion.div>

          {/* Right — two stacked stats */}
          <div className="md:col-span-4 md:col-start-9">
            <div className="flex flex-col divide-y divide-line border-y border-line">
              {SECONDARY.map((s) => (
                <motion.div key={s.value} variants={item} className="py-8">
                  <div className="font-display text-cognac" style={midNumber}>
                    {s.value}
                  </div>
                  <p className="mt-3 font-sans text-[0.98rem] leading-relaxed text-ink-60">
                    {s.line}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="mt-16 max-w-xl font-sans text-[0.78rem] leading-relaxed text-ink-45">
          Estimates derived from DPIIT registration data and published startup
          failure-cause statistics.
        </p>
      </Container>
    </section>
  )
}
