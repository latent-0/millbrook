# Deprecated: the Rothenhall brand system moved

This file was one of three copies describing the same brand, and the copies had drifted
apart. It is no longer maintained.

**Go to `../Brand/` in the `Rothenhall` workspace folder.**

```bash
cd Brand && npm install && npm run dev    # http://localhost:3100
```

Or read the one-page cheat sheet at `../Brand/docs/quick-reference.md`.

## Where each part went

| Was here | Now |
|---|---|
| Colour palette and tokens | `Brand/` section 03 Color, `Brand/tokens/` |
| Typography and ramps | Section 04 Typography |
| Buttons, surfaces, texture | Section 05 Elements |
| Motion and reduced motion | Section 06 Motion |
| Layout and responsive rules | Section 09 Layout |
| Voice and copy rules | Section 08 Voice & copy |
| Logo usage | Section 02 Logo |
| Channel specs | Section 10 Channels |
| How to change a value | Section 13 Governance |

## Precedence

`src/styles.css`, the `@theme` block, wins. Then `Brand/tokens/`. Then the kit prose.
If a document in this workspace contradicts those three, the document is stale.

## One caveat about this repo

`Brand/` sits outside the millbrook git repository, so a fresh clone of this site does
not carry the kit. If you need it, ask for the `Brand/` folder, or make it its own repo
and vendor it. The design tokens themselves are always available in `src/styles.css`.

Do not add rules back into this file.
