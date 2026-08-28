import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Container, Eyebrow } from '../components/site'
import { seo, SITE } from '../lib/seo'
import { getPublishedBlog } from '../server/blog/queries'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPublishedBlog({ data: params.slug })
    if (!post) throw notFound()
    return { post }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
    if (!post) {
      return seo({
        path: '/blogs',
        title: 'Article · Rothenhall Partners',
        description: 'Field notes from Rothenhall Partners.',
      })
    }
    const base = seo({
      path: `/blog/${post.slug}`,
      title: post.seoTitle || post.title,
      description: post.metaDescription,
      image: post.ogImage?.url || SITE.ogImage,
      keywords: post.keywords?.join(', ') || post.tags?.join(', '),
    })

    // Honor an author-supplied canonical, and mark this as an article.
    const links = base.links.map((l) =>
      l.rel === 'canonical' && post.canonicalUrl ? { ...l, href: post.canonicalUrl } : l,
    )
    const meta = base.meta.map((m) =>
      m.property === 'og:type' ? { property: 'og:type', content: 'article' } : m,
    )
    if (post.publishedAt) {
      meta.push({ property: 'article:published_time', content: post.publishedAt })
    }
    if (post.updatedAt) {
      meta.push({ property: 'article:modified_time', content: post.updatedAt })
    }
    if (post.author?.name) {
      meta.push({ property: 'article:author', content: post.author.name })
    }
    return { meta, links }
  },
  component: BlogPost,
})

function fmtDate(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

function BlogPost() {
  const { post } = Route.useLoaderData()
  const meta = [
    post.author?.name,
    post.readingMinutes ? `${post.readingMinutes} min read` : '',
    fmtDate(post.publishedAt),
  ].filter(Boolean)

  return (
    <div className="bg-canvas text-ink">
      <article>
        {/* Header */}
        <header className="border-b border-line">
          <Container width="default" className="pt-14 pb-12 sm:pt-20 sm:pb-14">
            <Link
              to="/blogs"
              className="font-sans text-[0.82rem] text-ink-45 transition-colors hover:text-cognac-deep"
            >
              ← The Journal
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span
                className="inline-flex items-center rounded-full border border-line-strong px-3 py-1 font-sans text-ink-80"
                style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}
              >
                {post.category || 'Field note'}
              </span>
            </div>
            <h1
              className="mt-6 max-w-4xl font-display"
              style={{ fontSize: 'clamp(2.2rem, 4.6vw, 4rem)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1.04 }}
            >
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-[1.2rem] leading-relaxed text-ink-60">
              {post.excerpt}
            </p>
            {meta.length > 0 && (
              <p className="mt-8 font-sans text-[0.85rem] tracking-wide text-ink-45">
                {meta.join('  ·  ')}
              </p>
            )}
          </Container>
        </header>

        {/* Cover */}
        {post.coverImage?.url && (
          <Container width="wide" className="pt-10 sm:pt-14">
            <div className="overflow-hidden rounded-[2rem] rounded-br-[4rem] border border-line">
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                className="aspect-[16/8] w-full object-cover"
              />
            </div>
          </Container>
        )}

        {/* Body (rendered from stored markdown + JSON-LD script blocks) */}
        <Container width="narrow" className="py-14 sm:py-20">
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-14 flex flex-wrap gap-2 border-t border-line pt-8">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-canvas-2 px-3.5 py-1.5 font-sans text-[0.78rem] text-ink-60"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </Container>
      </article>

      {/* CTA */}
      <section className="border-t border-line bg-canvas-2">
        <Container width="default" className="py-16 text-center sm:py-20">
          <Eyebrow className="justify-center inline-flex">Rothenhall Partners</Eyebrow>
          <h2 className="text-display-md mx-auto mt-6 max-w-2xl">
            Be the company the AI recommends.
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-sans text-[1.05rem] leading-relaxed text-ink-60">
            We own AEO, GTM, and RevOps as one accountable engine. See what that
            looks like for your company.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn btn-primary">
              Start a conversation
            </Link>
            <Link to="/blogs" className="btn btn-ghost">
              More from the Journal
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
