import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'
import { getPublishedBlogs, type PublicBlogCard } from '../server/blog/queries'

export const Route = createFileRoute('/blogs')({
  head: () =>
    seo({
      path: '/blogs',
      title: 'The Journal · AEO, GTM & RevOps Field Notes · Rothenhall Partners',
      description:
        'Field notes from Rothenhall Partners on Answer Engine Optimization (AEO/GEO), go-to-market, and revenue operations. Practical playbooks for becoming the company the AI recommends.',
      keywords:
        'AEO blog, GEO blog, answer engine optimization guide, GTM playbook, RevOps blog, AI search visibility, Rothenhall journal',
    }),
  loader: async () => ({ posts: await getPublishedBlogs() }),
  pendingMs: 150,
  pendingComponent: BlogIndexPending,
  component: BlogIndex,
})

function fmtDate(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

/* Bento rhythm: tiles tile into 6-wide rows (4+2 / 2+2+2 / 3+3), repeating.
   grid-flow-dense backfills any gaps so the wall always looks intentional. */
const LAYOUT: Array<{ span: string; variant: 'feature' | 'wide' | 'small' }> = [
  { span: 'sm:col-span-2 lg:col-span-4', variant: 'feature' },
  { span: 'sm:col-span-1 lg:col-span-2', variant: 'small' },
  { span: 'sm:col-span-1 lg:col-span-2', variant: 'small' },
  { span: 'sm:col-span-2 lg:col-span-2', variant: 'small' },
  { span: 'sm:col-span-1 lg:col-span-2', variant: 'small' },
  { span: 'sm:col-span-2 lg:col-span-3', variant: 'wide' },
  { span: 'sm:col-span-2 lg:col-span-3', variant: 'wide' },
]

function Meta({ post }: { post: PublicBlogCard }) {
  const bits = [
    post.authorName,
    post.readingMinutes ? `${post.readingMinutes} min` : '',
    fmtDate(post.publishedAt),
  ].filter(Boolean)
  return (
    <p className="font-sans text-label tracking-wide text-ink-45">
      {bits.join('  ·  ')}
    </p>
  )
}

function CategoryTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line-strong bg-canvas/60 px-3 py-1 font-sans text-label uppercase tracking-eyebrow text-ink-80 backdrop-blur">
      {label}
    </span>
  )
}

function BentoTile({
  post,
  span,
  variant,
}: {
  post: PublicBlogCard
  span: string
  variant: 'feature' | 'wide' | 'small'
}) {
  const minH =
    variant === 'feature'
      ? 'min-h-[16rem]'
      : variant === 'wide'
        ? 'min-h-[11rem]'
        : 'min-h-[9rem]'
  const titleSize =
    variant === 'feature' ? '2rem' : variant === 'wide' ? '1.45rem' : '1.25rem'
  const showExcerpt = variant !== 'small'

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={`group convex-light flex h-full flex-col overflow-hidden rounded-[1.6rem] ${span}`}
    >
      <div className={`relative ${minH} flex-1 overflow-hidden bg-canvas-2`}>
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            width={1200}
            height={800}
            decoding="async"
            loading={variant === 'feature' ? 'eager' : 'lazy'}
            className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 flex items-center justify-center bg-canvas-2">
            <span className="block h-px w-16 bg-brass/40" />
          </div>
        )}
        <div className="absolute left-4 top-4">
          <CategoryTag label={post.category || 'Field note'} />
        </div>
      </div>
      <div className={`flex flex-col ${variant === 'feature' ? 'p-8' : 'p-6'}`}>
        <h2
          className="font-display text-ink"
          style={{ fontSize: titleSize, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.015em' }}
        >
          {post.title}
        </h2>
        {showExcerpt && (
          <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
            {post.excerpt.length > (variant === 'feature' ? 200 : 120)
              ? `${post.excerpt.slice(0, variant === 'feature' ? 200 : 120).trim()}…`
              : post.excerpt}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-3">
          <Meta post={post} />
          <span
            aria-hidden
            className="font-sans text-caption text-cognac-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            Read →
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="convex-light rounded-[2rem] p-12 text-center sm:p-16">
      <p className="eyebrow justify-center inline-flex">Coming soon</p>
      <h2 className="text-display-md mt-6">The first dispatches are being written.</h2>
      <p className="mx-auto mt-5 max-w-lg font-sans text-body leading-relaxed text-ink-60">
        Playbooks on AEO, GTM, and RevOps are on the way. In the meantime, the
        Founders Circle is where the sharpest of it happens first.
      </p>
      <div className="mt-8 flex justify-center">
        <Link to="/community" className="btn btn-primary">
          Request a free invite
        </Link>
      </div>
    </div>
  )
}

function BlogIndexPending() {
  return (
    <div className="bg-canvas text-ink">
      <section className="border-b border-line">
        <Container width="wide" className="pt-16 pb-14 sm:pt-24 sm:pb-16">
          <div className="h-4 w-32 animate-pulse rounded-full bg-canvas-2" />
          <div className="mt-7 h-16 max-w-3xl animate-pulse rounded-2xl bg-canvas-2" />
          <div className="mt-3 h-16 max-w-2xl animate-pulse rounded-2xl bg-canvas-2" />
        </Container>
      </section>
      <section>
        <Container width="wide" className="py-14 sm:py-20">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`min-h-[9rem] animate-pulse rounded-[1.6rem] bg-canvas-2 ${
                  i === 0 ? 'sm:col-span-2 lg:col-span-4' : 'lg:col-span-2'
                }`}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

function BlogIndex() {
  const { posts } = Route.useLoaderData()

  return (
    <div className="bg-canvas text-ink">
      {/* Header */}
      <section className="border-b border-line">
        <Container width="wide" className="pt-16 pb-14 sm:pt-24 sm:pb-16">
          <Reveal>
            <Eyebrow>The Journal</Eyebrow>
            <h1 className="text-display-lg mt-7 max-w-4xl">
              Notes on becoming the company{' '}
              <span className="text-cognac">the AI recommends.</span>
            </h1>
            <p className="mt-7 max-w-2xl font-sans text-body-lg leading-relaxed text-ink-60">
              Field notes on Answer Engine Optimization, go-to-market, and revenue
              operations, from the partners who run them for a living.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Bento wall */}
      <section>
        <Container width="wide" className="py-14 sm:py-20">
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-flow-dense auto-rows-auto grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {posts.map((post, i) => {
                const l = LAYOUT[i % LAYOUT.length]
                return (
                  <BentoTile key={post.id} post={post} span={l.span} variant={l.variant} />
                )
              })}
            </div>
          )}
        </Container>
      </section>

      {/* CTA band */}
      <section className="border-t border-line bg-canvas-2">
        <Container width="wide" className="py-16 sm:py-20">
          <div className="convex-light flex flex-col items-start justify-between gap-6 rounded-[2rem] rounded-tl-[4rem] p-8 sm:flex-row sm:items-center sm:p-12">
            <div className="max-w-xl">
              <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', lineHeight: 1.2 }}>
                Want this run for your company, not just read?
              </h2>
              <p className="mt-3 font-sans text-body leading-relaxed text-ink-60">
                The Founders Circle pairs a private network of founders with a free
                AI Visibility Score and early access to Cailyx.
              </p>
            </div>
            <Link to="/community" className="btn btn-primary shrink-0">
              Request a free invite
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
