import { G } from './CailyxShowcase'
import type { ProductKey } from '../lib/products'

/* ------------------------------------------------------------------ */
/*  Visuals for the Products menu and the Openkit and Things sections. */
/*  Drawn in SVG and CSS so they load instantly and never break.       */
/* ------------------------------------------------------------------ */

/** Small tile used in the Products menu and the product cards. Cailyx and Motion carry their own marks; Openkit and Things carry the Rothenhall monogram. */
export function Glyph({ k, size = 44 }: { k: ProductKey; size?: number }) {
  const shell = 'grid shrink-0 place-items-center overflow-hidden rounded-xl'
  const box = { width: size, height: size }
  if (k === 'cailyx')
    return (
      <span className={shell} style={{ ...box, background: '#26282b' }} aria-hidden>
        <img src="/brand/cailyx-mark.svg" alt="" style={{ width: size * 0.62, height: size * 0.62 }} />
      </span>
    )
  if (k === 'motion')
    return (
      <span className={shell} style={{ ...box, background: '#fefefe', boxShadow: `inset 0 0 0 1px ${G.lineStrong}` }} aria-hidden>
        <img src="/brand/motion-mark.png" alt="" style={{ width: size * 0.66, height: 'auto' }} />
      </span>
    )
  return (
    <span className={shell} style={{ ...box, background: '#f7f3ea', boxShadow: 'inset 0 0 0 1px #ddd5c4' }} aria-hidden>
      <img src="/brand/griffin.png" alt="" style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain" }} />
    </span>
  )
}
