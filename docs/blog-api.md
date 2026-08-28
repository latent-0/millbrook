# Rothenhall Blog Publishing API

A REST API for publishing GTM blog posts to `rothenhall.com` without touching
the codebase. Implements `BLOG_API_CONTRACT.md`. Posts render on-brand at
`/blogs` (the Journal index) and `/blog/{slug}` (the article), with full SEO,
Open Graph, and dynamic JSON-LD.

- **Base URL:** `https://www.rothenhall.com/api/v1`
- **Auth:** `Authorization: Bearer <BLOG_API_TOKEN>` on every request
- **Content-Type:** `application/json`

---

## 1. One-time setup (do this before the API works in production)

The API needs two things in the Vercel project (Settings -> Environment
Variables), then a redeploy:

1. **`BLOG_API_TOKEN`** - a long random secret. This is the Bearer token the
   marketing team uses. Generate one, e.g. `openssl rand -hex 32`. Without it,
   every write returns `500 ServerMisconfigured` (fail closed, never open).

2. **A Redis REST store** so posts persist across serverless invocations. Either
   works, both use the same env var names:
   - **Vercel KV** (Storage tab -> create KV) - it auto-adds
     `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
   - **Upstash Redis** (free tier) - copy its REST URL + token into
     `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` /
     `UPSTASH_REDIS_REST_TOKEN`).

   With no store configured the API still runs, but falls back to a local file
   (`.data/blog-kv.json`) that only exists on one machine - fine for `npm run
   dev`, not for production.

Optional: `SITE_URL` (defaults to `https://www.rothenhall.com`) is used to build
`canonicalUrl` and `publishedUrl`.

### Local dev

`.env` already has `BLOG_API_TOKEN=dev-local-token-change-me`. Run `npm run dev`
and hit `http://localhost:3000/api/v1/...`. Data persists to `.data/` (gitignored).

---

## 2. The fast path: publish a GTM post in one call

Most GTM posts skip the review workflow. Send `status: "published"` to go live
immediately:

```bash
curl -X POST https://www.rothenhall.com/api/v1/blog/upload \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to show up in ChatGPT answers as a B2B SaaS",
    "markdown": "# How to show up in ChatGPT answers\n\nIntro...\n\n## Why AEO is different\n\n...",
    "excerpt": "AI answer engines cite a small set of sources. Here are the levers that get you named.",
    "metaDescription": "A practical guide to AEO for B2B SaaS: entity clarity, off-site corpus, answer-shaped pages.",
    "coverImage": { "url": "https://cdn.example.com/card-800x600.webp", "alt": "Diagram of the three AEO levers" },
    "ogImage":    { "url": "https://cdn.example.com/og-1200x630.webp", "alt": "AEO for B2B SaaS, social card" },
    "author": {
      "name": "Kunal Achintya Reddy",
      "title": "Founder",
      "url": "https://www.rothenhall.com/about#founder"
    },
    "category": "aeo",
    "tags": ["aeo", "geo", "b2b-saas"],
    "status": "published",
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "How to show up in ChatGPT answers as a B2B SaaS",
      "author": { "@type": "Organization", "name": "Rothenhall Partners" }
    }
  }'
```

The response includes `slug`, `canonicalUrl`, and `publishedUrl`. The post is now
live at `/blog/{slug}` and listed on `/blogs`.

Required fields: `title`, `markdown`, `excerpt`, `coverImage`, `ogImage`,
`metaDescription`, `jsonLd`. `slug` auto-generates from the title if omitted.
Server derives `html` from `markdown` - do not send `html`.

---

## 3. Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/blog/upload` | Create (draft, or `status:"published"` to go live now). `201` |
| `GET` | `/blogs?status=&category=&tag=&q=&limit=&offset=` | List with filters |
| `GET` | `/blog/:id` (or `/blog/x?slug=my-slug`) | Fetch one, returns `html` + all SEO fields |
| `PATCH` | `/blog/:id` | Partial update (any field) |
| `PUT` | `/blog/:id` | Full replace |
| `DELETE` | `/blog/:id?hard=true` | `hard=true` deletes a draft; default soft-archives |
| `PATCH` | `/blog/:id/author` | Author rotation only |
| `POST` | `/blog/:id/status` | Workflow transition |
| `GET` | `/blog-sitemap.xml` | Public sitemap of published posts (no auth) |

### Status workflow (`POST /blog/:id/status`)

```
draft -> in_review -> approved -> published
                          |            |
                          +-> scheduled +-> archived
```

Allowed: `draft->in_review`; `in_review->approved|changes_requested|draft`;
`approved->scheduled|published|in_review`; `scheduled->in_review|published`;
`published->archived`. Illegal moves return `409`. `scheduled` needs a future
`publishAt`. Or just bypass gates with `POST /blog/upload {"status":"published"}`.

```bash
curl -X POST .../blog/$ID/status -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"published"}'
```

---

## 4. Author byline (linked)

`author` is `{ name, title?, url? }`. On the article the byline reads
**By {name}**, and when `url` is set the name becomes a clickable link.

- Link it to the founder section: `"url": "https://www.rothenhall.com/about#founder"`
  (same-tab). This is the usual choice for posts written by Kunal.
- Or link a personal profile, e.g. LinkedIn (opens in a new tab):
  `"url": "https://www.linkedin.com/in/kunalachintyareddy/"`.

```json
"author": { "name": "Kunal Achintya Reddy", "title": "Founder", "url": "https://www.rothenhall.com/about#founder" }
```

Update the byline later without touching the post body:

```bash
curl -X PATCH https://www.rothenhall.com/api/v1/blog/BLOG_ID/author \
  -H "Authorization: Bearer $BLOG_API_TOKEN" -H "Content-Type: application/json" \
  -d '{ "author": { "name": "Kunal Achintya Reddy", "title": "Founder", "url": "https://www.rothenhall.com/about#founder" } }'
```

---

## 5. Image + JSON-LD notes

- **coverImage** = the card image on `/blogs` (aim 800x600, WebP, < 75KB).
- **ogImage** = the social/share card (1200x630, < 300KB). If you only have one
  image, send the same URL in both.
- **alt** is required on both (5-250 chars), and should differ.
- **jsonLd** is dynamic: send a single object, an array of objects, or an
  `@graph` wrapper. Each node needs `@type` (and `@context`, shared or per-node).
  Pick the schemas that match the post - `BlogPosting` + `Organization` +
  `Person` + `FAQPage` + `BreadcrumbList` etc. The server stores it verbatim and
  emits one `<script type="application/ld+json">` per node into the article.
  Validate at <https://validator.schema.org/> before posting.

---

## 6. Errors

- `400 ValidationError` - `{ error, issues: [{ path, message }] }`. Validation
  runs before conflict checks.
- `401 Unauthorized` - missing/invalid Bearer token.
- `404 NotFound` - no blog with that id/slug.
- `409 Conflict` - duplicate slug, or illegal workflow transition.
- `500 ServerMisconfigured` - `BLOG_API_TOKEN` not set on the server.

---

## 7. Where it lives in the repo

- `api/v1/**` - the Nitro REST handlers (thin; registered in `vite.config.ts`).
- `src/server/blog/` - the engine: `store.ts` (KV/file), `schema.ts` (zod
  validation), `service.ts` (business logic + workflow), `render.ts`
  (markdown -> html + JSON-LD), `queries.ts` (server fns the pages read).
- `src/routes/blogs.tsx` - the `/blogs` Journal index.
- `src/routes/blog.$slug.tsx` - the `/blog/{slug}` article.
- `api/blog-sitemap.get.ts` - the published-posts sitemap.

The API routes are wired as explicit Nitro handlers in `vite.config.ts` because
this TanStack Start version has no file-based server routes; the SSR catch-all
would otherwise shadow a scanned `api/` directory.
