# Rothenhall Partners, brand & design system

The single reference for the website's look: colors, type, components, motion, and
voice. Source of truth is `src/styles.css` (design tokens) and `src/components/site.tsx`.

Aesthetic in one line: **neo-classical editorial. Warm paper, ink, and brass, with
dramatic dark bands, high whitespace, and restrained luxury.**

---

## 1. Brand identity

| | |
|---|---|
| **Name** | Rothenhall Partners (short: Rothenhall) |
| **Tagline** | Be the company the AI recommends. |
| **What it is** | India-first fractional operating partner for venture- and PE-backed companies: AEO/GEO (AI visibility), go-to-market, and RevOps as one accountable engine. |
| **Wordmark** | `/brand/wordmark.png`, set ~1.7rem tall. On dark surfaces it is inverted to white with `filter: brightness(0) invert(1)`. |
| **Mark** | Griffin crest, `/brand/griffin.png`. Used large and faint as a watermark (opacity ~0.04 to 0.06), inverted white on dark. |
| **Favicons** | `/favicon-griffin.png`, `/favicon.svg`, `/favicon-rh.png`. |

---

## 2. Color palette

All tokens are CSS variables in `@theme`. Use the token, not the raw hex, in code
(e.g. `text-ink`, `bg-canvas`, `var(--color-cognac)`).

### Paper & ink (the base, light theme)

| Token | Hex | Role |
|---|---|---|
| `--color-canvas` | `#f7f3ea` | Primary page background (warm paper) |
| `--color-canvas-2` | `#efe9dc` | Secondary/alternating sections, slightly darker panel |
| `--color-paper` | `#fbf9f3` | Raised cards, the lightest surface |
| `--color-ink` | `#1a1712` | Primary text, near-black warm |
| `--color-ink-80` | `#3a352c` | Strong body text |
| `--color-ink-60` | `#5c5648` | Secondary text, descriptions |
| `--color-ink-45` | `#857d6c` | Muted text, captions, footnotes |
| `--color-line` | `#ddd5c4` | Hairline borders, dividers |
| `--color-line-strong` | `#cbc0a9` | Stronger borders, ghost-button outline |

### Brass accent (quiet, classical)

| Token | Hex | Role |
|---|---|---|
| `--color-brass` | `#9a7a4a` | Numerals, bar fills, selection highlight |
| `--color-brass-deep` | `#7c6238` | Eyebrows, dropcap, primary-button hover |
| `--color-brass-soft` | `#b79a6b` | Eyebrows on dark surfaces, hatch lines |

### Cognac accent (warmer, more saturated, the "hero" accent)

| Token | Hex | Role |
|---|---|---|
| `--color-cognac` | `#a85c30` | Headline accent words, dots, links on hover |
| `--color-cognac-deep` | `#8a4a26` | Error text, deeper accent, traveling line-art highlight |
| `--color-cognac-soft` | `#c67c48` | Accent on dark surfaces, glows |

### Night (dramatic dark bands)

| Token | Hex | Role |
|---|---|---|
| `--color-night` | `#14120d` | Dark hero/CTA sections, near-black warm |
| `--color-night-2` | `#201c15` | Raised surfaces on dark, form cards |
| `--color-night-line` | `#35301f` | Borders on dark surfaces |

### Accent gradients & washes (used, not tokens)

- **Cognac glow** (dark sections): `radial-gradient(58% 55% at 20% 42%, rgba(168,92,48,0.24), rgba(20,18,13,0) 66%)`
- **Cognac wash** (light sections): `radial-gradient(...at 18% 26%, rgba(198,124,72,0.16), rgba(247,243,234,0) 58%)`
- **Diagonal hatch** (house texture): `repeating-linear-gradient(-72deg, rgba(154,122,74,0.08) 0 1px, transparent 1px 30px)`
- **Selection**: brass background, white text.

### Palette rules

- **Light surfaces**: `canvas` / `canvas-2` / `paper` backgrounds, `ink*` text, `line*` borders. Accents in `brass-deep` (eyebrows) and `cognac` (highlights).
- **Dark surfaces**: `night` / `night-2` backgrounds, `canvas`/`canvas/opacity` text, `night-line` borders. Accents in `brass-soft` and `cognac-soft`.
- **One accent per moment.** Brass is the quiet default; cognac is the warmer spotlight. Do not use both loudly in the same block.

---

## 3. Typography

Two families, loaded from Google Fonts.

| Family | Token | Weights | Use |
|---|---|---|---|
| **Jost** | `--font-display` | 300, 400, 500 (300..600 loaded) | Headings, display, huge hero words. The smooth geometric "line" font. |
| **Inter** | `--font-sans` | 400, 450, 500, 600 | Body, labels, eyebrows, buttons. |

Fallback stack: `ui-sans-serif, system-ui, -apple-system, sans-serif`.

**Body defaults:** 1.02rem / 1.6 line-height, `ink` on `canvas`, with luxury OpenType
features on (`kern, liga, calt, onum, pnum`, old-style figures), antialiased.

**Headings (h1 to h4):** Jost, weight 400, `letter-spacing: -0.015em`, line-height 1.08,
`text-wrap: balance`. Hero display often drops to weight 300 for the airy look.

### Fluid display scale (utility classes)

| Class | Size (clamp) | Line height | Tracking |
|---|---|---|---|
| `.text-display-xl` | `3rem → 7.5rem` | 0.96 | -0.025em |
| `.text-display-lg` | `2.4rem → 4.6rem` | 1.01 | -0.018em |
| `.text-display-md` | `1.9rem → 3rem` | 1.06 | -0.012em |
| `.text-lead` | `1.1rem → 1.35rem` | 1.55 | -0.005em |

### Eyebrow (the small-caps label)

`.eyebrow`: Inter 500, 0.7rem, `text-transform: uppercase`, `letter-spacing: 0.24em`
(`--tracking-eyebrow`), color `brass-deep`. On dark use `.eyebrow-light` (color `brass-soft`).

### Dropcap

`.dropcap::first-letter`: Jost 400, large float (`3.6em`), color `brass-deep`. Used on
editorial lead paragraphs.

---

## 4. Components & surfaces

### Buttons (`.btn`, pill-shaped, `border-radius: 999px`)

| Class | Look | Hover |
|---|---|---|
| `.btn-primary` | Ink fill, canvas text | Fills `brass-deep`, white text |
| `.btn-ghost` | Transparent, ink text, `line-strong` border | Border to `ink` |
| `.btn-light` | Canvas fill, ink text (for dark sections) | Fills `brass-soft` |
| `.btn-ghost-light` | Transparent, canvas text, faint border (dark sections) | Border to canvas, faint fill |

### Links

`.link-line`: understated animated underline that wipes in left-to-right on hover
(`cubic-bezier(0.22, 1, 0.36, 1)`).

### Raised surfaces

- `.convex-light`: paper card with a soft top highlight and gentle drop shadow (light theme).
- `.convex-dark`: night-2 card with inset highlight and deep shadow (dark theme).
- **Liquid glass** (the /founders form): translucent white/cognac gradient, `backdrop-filter: blur(22px) saturate(1.4)`, a white top-edge inset highlight, and a specular sheen. Pairs with a hover **glare sweep** (a skewed light band translating across).

### Texture & shape

- `.grain`: fine SVG film-grain overlay, used at low opacity (0.05 to 0.06), often `mix-blend-overlay`.
- `.socket` / `.socket-shadow`: carves a semicircle notch into a surface top (mask + drop-shadow).
- **Line-art motif**: thin cognac-stroke "R" monogram, drawn in on load, with a light that travels along the strokes.
- **Concave/notched corners** and **diagonal seams**: recurring non-rectangular framing, echoing the diagonal hatch.

---

## 5. Motion

- **Signature easing**: `cubic-bezier(0.22, 1, 0.36, 1)` (used across reveals, links, transitions).
- **Reveal on scroll** (`.reveal` / motion): fade up 20px with a slight blur, ~0.7 to 1s.
- **Staggered spring headlines**: blur + x/y in, `type: spring, damping ~24, stiffness ~100`.
- **Scroll-linked sticky sections**: panel zoom, diagonal-slit clip reveals, story beats.
- **Ambient life**: `.animate-float` (7s gentle bob), `.animate-slow-spin` (120s rosette), breathing cognac glows, drifting blobs.
- **Micro-interactions**: button hover-lift + press, input focus border to cognac, hover glare on cards and buttons.
- All motion respects `prefers-reduced-motion` (animations collapse to near-instant).

---

## 6. Layout & rhythm

- **Container**: max-width `88rem`, horizontal padding `1.5rem → 3rem` (`px-6 sm:px-8 lg:px-12`). A `narrow`/`wide` variant is used per section.
- **Section rhythm**: generous vertical padding (`py-24 sm:py-32`), alternating `canvas` and `canvas-2`, separated by `border-line` hairlines.
- **Dark bands**: `night` sections for heroes, pivots, and CTAs, for contrast and drama.
- **Whitespace is the luxury signal.** Let type breathe; avoid dense blocks.

---

## 7. Voice & copy

- **No em dashes, ever.** Use commas, periods, or short sentences.
- Confident, editorial, benefit-led. Short and concrete over clever.
- One idea per section. Lead with the point, then support it.
- Sentence case for most copy; small-caps eyebrows for labels.
- Numbers and proof over adjectives.

---

## 8. Quick copy-paste palette

```
Canvas    #f7f3ea    Canvas-2  #efe9dc    Paper     #fbf9f3
Ink       #1a1712    Ink-80    #3a352c    Ink-60    #5c5648    Ink-45  #857d6c
Line      #ddd5c4    Line-strong #cbc0a9
Brass     #9a7a4a    Brass-deep #7c6238   Brass-soft #b79a6b
Cognac    #a85c30    Cognac-deep #8a4a26  Cognac-soft #c67c48
Night     #14120d    Night-2   #201c15    Night-line #35301f
```

Fonts: **Jost** (display) + **Inter** (sans). Accent easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
