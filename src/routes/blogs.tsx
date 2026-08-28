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

function Meta({ post }: { post: PublicBlogCard }) {
  const bits = [
    post.authorName,
    post.readingMinutes ? `${post.readingMinutes} min read` : '',
    fmtDate(post.publishedAt),
  ].filter(Boolean)
  return (
    <p className="font-sans text-[0.8rem] tracking-wide text-ink-45">
      {bits.join('  ·  ')}
    </p>
  )
}

function CategoryTag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-line-strong px-3 py-1 font-sans text-ink-80"
      style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}
    >
      {label}
    </span>
  )
}

function FeaturedCard({ post }: { post: PublicBlogCard }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group convex-light block overflow-hidden rounded-[2rem] rounded-br-[4.5rem] md:grid md:grid-cols-2"
    >
      <div className="relative aspect-[16/11] overflow-hidden md:aspect-auto md:h-full">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          loading="eager"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col justify-between p-8 sm:p-10">
        <div>
          <div className="flex items-center gap-2.5">
            <CategoryTag label={post.category || 'Field note'} />
            <span className="font-sans text-[0.68rem] uppercase tracking-[0.16em] text-cognac">
              Latest
            </span>
          </div>
          <h2
            className="mt-6 font-display text-ink"
            style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.7rem)', fontWeight: 500, lineHeight: 1.06, letterSpacing: '-0.02em' }}
          >
            {post.title}
          </h2>
          <p className="mt-4 max-w-xl font-sans text-[1.05rem] leading-relaxed text-ink-60">
            {post.excerpt}
          </p>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <Meta post={post} />
          <span className="font-sans text-[0.85rem] font-medium text-cognac-deep">
            Read
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1"> →</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

function Card({ post }: { post: PublicBlogCard }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group convex-light flex flex-col overflow-hidden rounded-[1.75rem]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-center gap-2">
          <CategoryTag label={post.category || 'Field note'} />
        </div>
        <h3
          className="mt-5 font-display text-ink"
          style={{ fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.01em' }}
        >
          {post.title}
        </h3>
        <p className="mt-3 flex-1 font-sans text-[0.98rem] leading-relaxed text-ink-60">
          {post.excerpt.length > 140 ? `${post.excerpt.slice(0, 140).trim()}…` : post.excerpt}
        </p>
        <div className="mt-6">
          <Meta post={post} />
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
  const [featured, ...rest] = posts

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

      {/* Posts */}
      <section>
        <Container width="wide" className="py-16 sm:py-20">
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <FeaturedCard post={featured} />
              {rest.length > 0 && (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Card key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
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
