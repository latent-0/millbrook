import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

/* The founders' group photo. No border: the picture itself is cut into an
   uneven shape (two opposite corners deeply rounded, the other two tight)
   and, like the home hero, it opens up as you scroll. It starts as a narrow,
   heavily rounded window, widens to the full frame, and the image settles
   from a slight zoom. */
export function FoundersPhoto() {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'center 52%'] })

  const insetX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 16, 0])
  const insetY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 22, 0])
  const big = useTransform(scrollYProgress, [0, 1], [reduce ? 150 : 260, 150])
  const small = useTransform(scrollYProgress, [0, 1], [reduce ? 28 : 120, 28])
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${big}px ${small}px ${big}px ${small}px)`
  const zoom = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 1.18, 1])

  return (
    <div ref={ref}>
      <motion.div style={{ clipPath }} className="relative overflow-hidden">
        <motion.img
          src="/brand/team/founders-group.jpg"
          alt="The four founders of Rothenhall Partners together: Kunal, Lokesh, Madan and Nitish"
          width={1920}
          height={1280}
          style={{ scale: zoom }}
          className="aspect-[4/3] w-full object-cover object-[50%_30%] sm:aspect-[16/9]"
        />
      </motion.div>
    </div>
  )
}
