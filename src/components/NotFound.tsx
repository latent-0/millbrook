import { Link } from '@tanstack/react-router'
import { Container } from './site'

/**
 * Human-facing 404 page. Automated clients (AI agents, crawlers, curl) are
 * intercepted earlier in the loader and receive a markdown 404 instead — see
 * src/server/notfound.ts. This is the styled fallback for browsers.
 */
export function NotFound() {
  return (
    <Container className="py-32 text-center sm:py-44">
      <p className="eyebrow">Error 404</p>
      <h1 className="text-display-lg mt-8">This page has moved on.</h1>
      <p className="mx-auto mt-6 max-w-md font-sans text-body leading-relaxed text-ink-60">
        The page you were looking for is not here. Everything worth finding is a
        click away.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link to="/blogs" className="btn btn-ghost">
          Read the Journal
        </Link>
        <Link to="/contact" className="btn btn-ghost">
          Talk to us
        </Link>
      </div>
    </Container>
  )
}
