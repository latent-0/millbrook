# Rothenhall Blog Publishing API

A REST API for publishing GTM blog posts to `rothenhall.com` without touching
the codebase. Posts render on-brand at `/blogs` (the Journal index) and
`/blog/{slug}` (the article), with full SEO, Open Graph, and dynamic JSON-LD.
This document is the complete contract — every endpoint, field, and error the
API returns.

- **Base URL:** `https://www.rothenhall.com/api/v1`
- **Auth:** `Authorization: Bearer <BLOG_API_TOKEN>` on every request
- **Content-Type:** `application/json` on every request with a body
- **CRUD at a glance:** create → `POST /blog/upload`; read →
  `GET /blog/:id` and `GET /blogs`; update → `PATCH`/`PUT /blog/:id`; delete →
  `DELETE /blog/:id`. Full reference in §3.

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

Every endpoint except the sitemap requires the `Authorization: Bearer` header.
`:id` accepts either the blog id (`blog_…`) or the slug in the `:id` position on
every single-post route — `GET`, `PATCH`, `PUT`, `DELETE`, and the status/author
sub-routes all resolve both.

### Create — `POST /blog/upload`

See §2 for the full request. Returns `201` with the created record plus a
`nextActions` hint. `slug` auto-generates from `title` when omitted; a duplicate
slug returns `409`.

### Read one — `GET /blog/:id`

Returns the full record, including rendered `html` and every SEO field. Works by
id, by slug in the path, or by an explicit `?slug=` query.

```bash
curl https://www.rothenhall.com/api/v1/blog/$ID \
  -H "Authorization: Bearer $BLOG_API_TOKEN"
# by slug:
curl "https://www.rothenhall.com/api/v1/blog/_?slug=my-post-slug" \
  -H "Authorization: Bearer $BLOG_API_TOKEN"
```

Missing id/slug returns `404`.

### Read many — `GET /blogs`

Lists lightweight index entries, newest first. All filters are optional and
combine (AND):

| Query | Meaning |
|---|---|
| `status` | Exact status (`draft`, `published`, `archived`, …) |
| `category` | Exact category match |
| `tag` | Entries whose `tags` include this value |
| `q` | Case-insensitive substring of `title` or `excerpt` |
| `limit` | Page size (default `20`) |
| `offset` | Page offset (default `0`) |

```bash
curl "https://www.rothenhall.com/api/v1/blogs?status=published&tag=aeo&limit=10" \
  -H "Authorization: Bearer $BLOG_API_TOKEN"
```

Response: `{ "items": [ …index entries… ], "total": 42, "limit": 10, "offset": 0 }`.
`total` is the count after filtering, before paging. Each item carries `id`,
`slug`, `status`, `title`, `excerpt`, `category`, `tags`, `authorName`,
`coverImageUrl`, `readingMinutes`, `publishedAt`, `createdAt`, `updatedAt`,
`noIndex` (see §7 for the full field reference).

### Update (partial) — `PATCH /blog/:id`

Send only the fields you want to change; everything else is untouched. Any
create field is accepted. Changing `markdown` or `jsonLd` re-renders `html` and
recomputes `readingMinutes`. Renaming `slug` is allowed until a post is
published, after which it returns `409` (published URLs are permanent).

**Round-trip friendly:** you can `GET` a post, change a field, and send the
whole record straight back. Server-owned fields in the response (`id`, `html`,
`readingMinutes`, `jsonLdTypes`, `coverImageUrl`/`ogImageUrl`, `scheduledAt`,
`createdAt`, …) and any field returned as `null` are ignored rather than
rejected; only genuine unknown keys (a typo in an editable field) return `400`.

```bash
curl -X PATCH https://www.rothenhall.com/api/v1/blog/$ID \
  -H "Authorization: Bearer $BLOG_API_TOKEN" -H "Content-Type: application/json" \
  -d '{ "excerpt": "A sharper one-line summary.", "tags": ["aeo", "geo"] }'
```

Returns `200` with the updated record.

### Update (full replace) — `PUT /blog/:id`

Replaces the whole post body. The request must satisfy every required create
field (`title`, `markdown`, `excerpt`, `coverImage`, `ogImage`,
`metaDescription`, `jsonLd`); array fields you omit (`tags`, `keywords`, `faq`,
`metaTags`) are cleared. The `id` and `createdAt` are preserved. Prefer `PATCH`
for small edits.

```bash
curl -X PUT https://www.rothenhall.com/api/v1/blog/$ID \
  -H "Authorization: Bearer $BLOG_API_TOKEN" -H "Content-Type: application/json" \
  -d @full-post.json
```

### Delete — `DELETE /blog/:id`

Default is a **soft delete**: the post is archived (`status: "archived"`) and
drops off `/blogs` and the sitemap, but the record and its slug are kept.
`?hard=true` **permanently** removes the record and frees its slug — allowed on
`draft` posts only; a hard delete of anything else returns `409`.

```bash
curl -X DELETE https://www.rothenhall.com/api/v1/blog/$ID \
  -H "Authorization: Bearer $BLOG_API_TOKEN"                 # soft-archive
curl -X DELETE "https://www.rothenhall.com/api/v1/blog/$ID?hard=true" \
  -H "Authorization: Bearer $BLOG_API_TOKEN"                 # hard-delete a draft
```

Soft delete returns `{ "id": "...", "status": "archived" }`; hard delete returns
`{ "deleted": true }`.

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
- `409 Conflict` - duplicate slug, renaming a published post's slug, hard-deleting
  a non-draft, or an illegal workflow transition.
- `500 ServerMisconfigured` - `BLOG_API_TOKEN` not set on the server.

Errors carry a JSON body: `{ "error": "...", "message": "..." }` (or
`{ "error": "ValidationError", "issues": [...] }` for `400`).

---

## 7. Field reference

### Request fields (`POST /blog/upload`, `PATCH`, `PUT`)

Required on create/replace: `title`, `markdown`, `excerpt`, `coverImage`,
`ogImage`, `metaDescription`, `jsonLd`. On `PATCH`, every field is optional.

| Field | Type | Rules |
|---|---|---|
| `title` | string | 10-300 chars |
| `slug` | string | lowercase, hyphen-separated, ≤75; auto-derived from `title` if omitted; immutable after publish |
| `markdown` | string | 200-60,000 chars; server renders `html` from it (never send `html`) |
| `excerpt` | string | 40-600 chars |
| `metaDescription` | string | 50-400 chars |
| `seoTitle` | string | 10-200 chars; defaults to `title` |
| `canonicalUrl` | string (URL) | defaults to `{SITE_URL}/blog/{slug}` |
| `coverImage` / `ogImage` | image | `{ url, alt(5-250), width?, height?, caption? }` |
| `jsonLd` | object/array | single node, array, or `@graph`; each node needs `@type`, plus `@context` |
| `author` | object | `{ name(1-100), title?, url?, externalId?, avatarUrl? }` |
| `category` | string | ≤50 chars |
| `tags` | string[] | ≤10 items, each ≤30 chars |
| `keywords` | string[] | ≤10 items, each ≤50 chars |
| `faq` | object[] | ≤8 × `{ question, answer }` |
| `metaTags` | object[] | ≤12 × `{ name, content }` |
| `status` | enum | `draft` (default), `in_review`, `approved`, `scheduled`, `published` |
| `publishedAt` | date | ISO 8601; used when creating already-`published` |
| `noIndex` | boolean | default `false`; excludes from `/blogs` + sitemap |

Unknown fields are rejected (`400`). A stray `html` field is an unknown field.

### Response fields (`GET`/`POST`/`PATCH`/`PUT` on one post)

`id`, `slug`, `status`, `title`, `seoTitle`, `metaDescription`, `canonicalUrl`,
`excerpt`, `html`, `coverImage`, `ogImage`, `coverImageUrl`, `ogImageUrl`,
`author`, `category`, `tags`, `keywords`, `faq`, `jsonLd`, `jsonLdValid`,
`jsonLdTypes`, `noIndex`, `readingMinutes`, `publishedAt`, `scheduledAt`,
`createdAt`, `updatedAt`. Server-owned fields (`id`, `html`, `readingMinutes`,
`jsonLdTypes`, `createdAt`, `updatedAt`, the `*Url` mirrors) are read-only.

### List item fields (`GET /blogs`)

Lightweight entries: `id`, `slug`, `status`, `title`, `excerpt`, `category`,
`tags`, `authorName`, `coverImageUrl`, `readingMinutes`, `publishedAt`,
`createdAt`, `updatedAt`, `noIndex`. Fetch one post for the full record + `html`.

---

## 8. Where it lives in the repo

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
