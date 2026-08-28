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
    <p className="font-sans text-[0.76rem] tracking-wide text-ink-45">
      {bits.join('  ·  ')}
    </p>
  )
}

function CategoryTag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-line-strong bg-canvas/60 px-3 py-1 font-sans text-ink-80 backdrop-blur"
      style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}
    >
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
      <div className={`relative ${minH} flex-1 overflow-hidden`}>
        <img
          src={post.coverImageUrl}
          alt={post.title}
          loading={variant === 'feature' ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(20,18,13,0) 45%, rgba(20,18,13,0.28))' }}
        />
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
          <p className="mt-3 font-sans text-[0.98rem] leading-relaxed text-ink-60">
            {post.excerpt.length > (variant === 'feature' ? 200 : 120)
              ? `${post.excerpt.slice(0, variant === 'feature' ? 200 : 120).trim()}…`
              : post.excerpt}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-3">
          <Meta post={post} />
          <span
            aria-hidden
            className="font-sans text-[0.85rem] text-cognac-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
      <p className="mx-auto mt-5 max-w-lg font-sans text-[1.05rem] leading-relaxed text-ink-60">
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

function BlogIndex() {
  const { posts } = Route.useLoaderData()

  return (
    <div className="bg-canvas text-ink">
      {/* Header */}
      <section className="border-b border-line">
        <Container width="wide" className="pt-16 pb-14 sm:pt-24 sm:pb-16">
          <Reveal>
            <Eyebrow>The Journal</Eyebrow>
            <h1
              className="mt-7 max-w-4xl font-display"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5.2rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.02 }}
            >
              Notes on becoming the company{' '}
              <span style={{ color: 'var(--color-cognac)' }}>the AI recommends.</span>
            </h1>
            <p className="mt-7 max-w-2xl font-sans text-[1.15rem] leading-relaxed text-ink-60">
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
              <p className="mt-3 font-sans text-[1.02rem] leading-relaxed text-ink-60">
                The Founders Circle gets the entire Rothenhall engine, GTM, AEO,
                and growth, at no cost for our initial cohort.
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
