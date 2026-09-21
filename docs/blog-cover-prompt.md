# Rothenhall Blog Cover — Locked Style Prompt

> The reusable prompt for generating on-brand blog cover art with **any** AI image
> generator (ImageGen, Midjourney, DALL·E, SDXL, Flux, etc.). Distilled from the
> 6 approved reference plates (01 paper-light, 02 turned-brass, 03 ink-diffusion,
> 04 guilloche, 05 colonnade, 06 slat-shadows; 07 night-seam and 08 gilded-edge
> were rejected) on 2026-09-18, re-persisted 2026-09-21.
> Reference PNGs (`Assets/blog-cover-references/`) are NOT in this repo — they
> live only on the original Windows workspace.

## The contract (what the image must be)

1. One **recognizable single subject** with mood — not an abstract texture study.
2. **No text** of any kind in the image.
3. The subject is a **metaphor drawn from the article's argument** — it hints at a
   small overview of the post; it never summarises the post inside the image.
4. If multiplicity is the point (many agencies, many engines, many questions),
   encode the relevant **count or arrangement**, don't force a single light source.
5. Never generic interchangeable mood.

## Master prompt template

Replace `{MOTIF}` (and optionally `{ARRANGEMENT}`) per post, then paste as one block:

```text
Painterly gouache editorial cover illustration of {MOTIF}, {ARRANGEMENT},
single recognizable inanimate subject placed off-centre, antique printmaking
meets mid-century technical plate, warm paper ground (#f7f3ea family) with ink,
cognac and muted brass accents, visible brush and paper grain, soft raking
directional light with one clear long shadow, precise linework and restrained
ornament, quiet and scholarly rather than tech-glossy, high negative space,
3:2 landscape composition.
No people, no faces, no text, no letters, no numbers, no logos, no watermarks,
no UI, no diagrammatic chart aesthetics, no neon, no gradient mesh.
```

- **Size:** 1536px wide (or nearest 3:2 the generator allows; Midjourney: `--ar 3:2`).
- **{MOTIF}:** one concrete noun-phrase object/scene (see derivation rules below).
- **{ARRANGEMENT}:** optional clause for count/positioning, e.g. "six identical
  brass dividers spaced in a row, one slightly askew" — omit for single objects.

## Negative-prompt field (for generators that take one separately)

```text
text, letters, numbers, words, typography, logo, watermark, UI, screenshot,
people, faces, hands, chart, infographic, diagram, neon, gradient mesh,
3D render, photorealism, lens flare, bokeh, cluttered composition, centered subject
```

## Motif derivation rules (do this before filling {MOTIF})

1. Read the post body (`GET /blog/:id`) and its **H2 headings**.
2. State the post's argument in one sentence.
3. Choose one physical object or scene that *is* that argument as a metaphor —
   recognizable at thumbnail size, inanimate, on the gouache/antique-plate register.
4. Decide whether count/arrangement carries meaning (multiplicity → encode it).
5. Sanity check: would someone who read the post nod at the cover? Would someone
   who hasn't still read it as a handsome editorial plate? Both required.

## Approved motif bank (lettered studies, proven against this prompt)

| Motif | Metaphor register |
|---|---|
| a — threshold | doorways/boundaries, before-and-after states |
| b — lighthouse beam | visibility, being found, guidance in fog |
| c — telegraph room | autonomous systems sending messages, agents |
| d — chart dividers | splitting, division of resources/cost |
| e — hairline network | many engines/nodes connected precisely |
| f — night network | (variant of e, darker mood — use cautiously) |
| g — reading room | research, study, measurement |
| h — pigeonholes | categorisation, attribution, sorting |

## Filled example

Post: *Real cost of splitting GTM across multiple agencies* → argument: overlapping
mandates quietly divide budget and accountability.

```text
Painterly gouache editorial cover illustration of a single heavy brass paper
divider slicing a neat stack of blank cream ledgers into unequal columns,
five columns left, two right, single recognizable inanimate subject placed
off-centre, antique printmaking meets mid-century technical plate, warm paper
ground (#f7f3ea family) with ink, cognac and muted brass accents, visible brush
and paper grain, soft raking directional light with one clear long shadow,
precise linework and restrained ornament, quiet and scholarly rather than
tech-glossy, high negative space, 3:2 landscape composition.
No people, no faces, no text, no letters, no numbers, no logos, no watermarks,
no UI, no diagrammatic chart aesthetics, no neon, no gradient mesh.
```

## Post-generation spec (for publishing)

Deliverables per post: `Assets/blog-covers/<slug>.jpg` (≤150 KB gouache-look JPEG),
plus publish derivatives `<slug>-cover-1200x800.webp` and `<slug>-og-1200x630.jpg`.
Patch live via `PATCH /blog/:id` with `coverImage {url, alt, width, height}` and
`ogImage {url, alt}` — contract in `docs/blog-api.md`. API token/R2 keys are never
stored in the repo.
