# Rothenhall Partners

Marketing website for Rothenhall Partners, a fractional operating partner practice
owning AI answer-engine visibility (AEO/GEO), go-to-market, and revenue operations
as one accountable engine.

Built with **TanStack Start** (React 19, SSR + file-based routing), **Tailwind CSS v4**,
and the **Fraunces** + **Inter** type pairing. Server-rendered on purpose: a firm that
sells AI-citation visibility should be crawlable and citable itself.

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (client + SSR) into dist/
npm run preview  # preview the production build
```

## Structure

```
src/
  routes/
    __root.tsx        # document shell, fonts, SEO meta, JSON-LD, header/footer, 404
    index.tsx         # Home  (hero flow diagram, the shift, the model, engagements, moat, CTA)
    approach.tsx      # Approach (four disciplines, how an engagement runs, positioning)
    case-studies.tsx  # Case Studies (proof philosophy, anatomy, founding cohort)
    about.tsx         # About (thesis, compounding-library moat, principles, who it's for)
    contact.tsx       # Contact (form wired to a server function)
  server/
    inquiry.ts        # createServerFn that validates + receives contact submissions
  components/
    site.tsx          # Header, Footer, Container, Eyebrow, Reveal, Wordmark
  styles.css          # design tokens (colors, type scale, components)
public/
  favicon.svg
```

## Editing content

Page copy lives directly in each route file, mostly in the arrays near the top
(`PILLARS`, `ENGAGEMENTS`, `DISCIPLINES`, etc.). Design tokens (paper, ink, brass,
type scale) live in `src/styles.css` under `@theme`.

## Wiring the contact form

The form already submits end to end through the server function in
[`src/server/inquiry.ts`](src/server/inquiry.ts); submissions are validated and
logged server-side. To deliver them somewhere real, replace the `console.log` in
the `.handler()` with one of:

- **Email** — e.g. Resend: `await resend.emails.send({ to: 'office@rothenhall.com', ... })`
- **CRM** — POST to HubSpot / Attio / your RevOps stack
- **Store** — append to a database or Google Sheet

## Placeholders to replace

- `office@rothenhall.com` — the contact email (in `site.tsx` footer and `contact.tsx`)
- `https://rothenhall.com` — the canonical URL in the JSON-LD / SEO meta (`__root.tsx`)
- The "illustrative" framing on Case Studies once real before-and-after studies exist

## Deploy

`npm run build` produces a standard TanStack Start / Nitro output. Deploy to
Netlify, Vercel, or any Node host. To target a specific platform, re-scaffold with
`--deployment <netlify|cloudflare|railway>` or add the matching Nitro preset.
```
