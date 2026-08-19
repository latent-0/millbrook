import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import { useRef } from 'react'

type Beat = {
  text: string
  img: string
  rot: number
  side: 'left' | 'right'
  accent?: boolean
}

const TEXTURE = '/fabric-texture.jpg'

const STORY: Beat[] = [
  {
    text: 'Every unicorn once started in a studio.',
    img: 'https://picsum.photos/seed/rothenhall-a/560/720',
    rot: -7,
    side: 'right',
  },
  {
    text: 'A few people, and one relentless idea.',
    img: 'https://picsum.photos/seed/rothenhall-b/560/720',
    rot: 6,
    side: 'left',
  },
  {
    text: 'But buyers no longer search. They ask.',
    img: 'https://picsum.photos/seed/rothenhall-c/560/720',
    rot: -11,
    side: 'right',
  },
  {
    text: 'And if the answer never names you, you do not exist.',
    img: 'https://picsum.photos/seed/rothenhall-d/560/720',
    rot: 9,
    side: 'left',
  },
  {
    text: 'Let us make you the one it recommends.',
    img: 'https://picsum.photos/seed/rothenhall-e/560/720',
    rot: -5,
    side: 'right',
    accent: true,
  },
]

const textureStyle: React.CSSProperties = {
  backgroundImage: `url(${TEXTURE})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

export function StoryScroll() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  if (reduce) {
    return (
      <section className="relative text-canvas" style={textureStyle}>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(rgba(18,15,11,0.84), rgba(14,12,8,0.9))' }}
        />
        <div className="relative mx-auto max-w-4xl space-y-20 px-6 py-32 text-center">
          {STORY.map((s, i) => (
            <h2
              key={i}
              className="font-display text-canvas"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 3.4rem)', fontWeight: 300, lineHeight: 1.15 }}
            >
              {s.text}
            </h2>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${STORY.length * 100}vh` }}
    >
      <div
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden text-canvas"
        style={textureStyle}
      >
        {/* darken the linen so the white type reads, weave still visible */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(rgba(18,15,11,0.82), rgba(13,11,7,0.9))',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 55% at 50% 45%, rgba(168,92,48,0.12), rgba(20,18,13,0) 70%)',
          }}
        />
        {STORY.map((s, i) => (
          <Beat
            key={i}
            index={i}
            total={STORY.length}
            progress={scrollYProgress}
            beat={s}
          />
        ))}
      </div>
    </section>
  )
}

function Beat({
  index,
  total,
  progress,
  beat,
}: {
  index: number
  total: number
  progress: MotionValue<number>
  beat: Beat
}) {
  const seg = 1 / total
  const start = index * seg
  const end = (index + 1) * seg
  const inAt = start + seg * 0.2
  const outAt = end - seg * 0.28

  const opacity = useTransform(progress, [start, inAt, outAt, end], [0, 1, 1, 0])
  const blurPx = useTransform(progress, [start, inAt, outAt, end], [16, 0, 0, 16])
  const filter = useMotionTemplate`blur(${blurPx}px)`
  const textY = useTransform(progress, [start, end], [70, -70])
  const imgY = useTransform(progress, [start, end], [110, -110])

  return (
    <motion.div
      style={{ opacity, filter }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="relative mx-auto w-full max-w-5xl">
        {/* Tilted random image */}
        <motion.div
          style={{ y: imgY, rotate: beat.rot }}
          className={`absolute top-1/2 hidden -translate-y-1/2 lg:block ${
            beat.side === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="overflow-hidden rounded-2xl border border-line bg-paper p-2 shadow-[0_40px_80px_-32px_rgba(26,23,18,0.45)]">
            <img
              src={beat.img}
              alt=""
              className="block h-64 w-52 rounded-xl object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Sentence */}
        <motion.h2
          style={{
            y: textY,
            fontSize: 'clamp(2rem, 5vw, 4.25rem)',
            fontWeight: 300,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
          }}
          className="relative z-10 mx-auto max-w-3xl text-center font-display text-canvas"
        >
          {beat.text}
        </motion.h2>
      </div>
    </motion.div>
  )
}
