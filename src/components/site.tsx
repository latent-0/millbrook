import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/*  Layout primitives                                                  */
/* ------------------------------------------------------------------ */

export function Container({
  children,
  className = '',
  width = 'default',
}: {
  children: ReactNode
  className?: string
  width?: 'default' | 'narrow' | 'wide'
}) {
  const max =
    width === 'narrow'
      ? 'max-w-3xl'
      : width === 'wide'
        ? 'max-w-[88rem]'
        : 'max-w-[76rem]'
  return (
    <div className={`mx-auto w-full ${max} px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  )
}

export function Eyebrow({
  children,
  line = true,
  className = '',
}: {
  children: ReactNode
  line?: boolean
  className?: string
}) {
  return (
    <p className={`eyebrow ${line ? 'eyebrow-line' : ''} ${className}`}>
      {children}
    </p>
  )
}

/* Fades child in on first scroll into view. Text is always in the DOM. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: any
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as any}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/*  Wordmark                                                           */
/* ------------------------------------------------------------------ */

export function Wordmark({
  tone = 'ink',
  className = '',
}: {
  tone?: 'ink' | 'light'
  className?: string
}) {
  return (
    <img
      src="/brand/wordmark.png"
      alt="Rothenhall Partners"
      className={`block w-auto ${className}`}
      style={{
        height: '1.7rem',
        filter: tone === 'light' ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/approach', label: 'Approach' },
  { to: '/research', label: 'Research' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/about', label: 'About' },
] as const

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Light nav (over a dark hero), only at the top of the home page.
  const light = pathname === '/' && !scrolled && !open
  const barBg = light ? 'bg-canvas' : 'bg-ink'

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-canvas/85 backdrop-blur-md border-b border-line'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <Container width="wide">
        <div className="flex h-[4.75rem] items-center justify-between">
          <Link to="/" aria-label="Rothenhall Partners, home" onClick={() => setOpen(false)}>
            <Wordmark tone={light ? 'light' : 'ink'} />
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`font-sans text-[0.82rem] tracking-wide transition-colors ${
                  light
                    ? 'text-canvas/80 hover:text-canvas'
                    : 'text-ink-80 hover:text-ink'
                }`}
                activeProps={{ className: light ? 'text-canvas' : 'text-ink' }}
                activeOptions={{ exact: item.to === '/' }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className={`btn !px-5 !py-2.5 text-[0.82rem] ${
                light ? 'btn-light' : 'btn-primary'
              }`}
            >
              Start a conversation
            </Link>
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-6 transition-all duration-300 ${barBg} ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-6 transition-all duration-300 ${barBg} ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-6 transition-all duration-300 ${barBg} ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-line bg-canvas md:hidden transition-[max-height] duration-400 ease-out ${
          open ? 'max-h-96' : 'max-h-0 border-transparent'
        }`}
      >
        <Container>
          <nav className="flex flex-col py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-display text-2xl py-3 text-ink-80"
                activeProps={{ className: 'text-ink' }}
                activeOptions={{ exact: item.to === '/' }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-4 w-full"
            >
              Start a conversation
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-canvas">
      {/* Griffin watermark */}
      <img
        src="/brand/griffin.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 hidden w-[32rem] select-none md:block"
        style={{ filter: 'brightness(0) invert(1)', opacity: 0.05 }}
      />
      <Container width="wide" className="relative py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <img
              src="/brand/griffin.png"
              alt=""
              aria-hidden
              className="mb-6 h-16 w-auto select-none"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }}
            />
            <Wordmark tone="light" />
            <p className="mt-5 max-w-sm font-sans text-[0.95rem] leading-relaxed text-canvas/60">
              The fractional operating partner for AI-era growth. AI visibility,
              go-to-market, and revenue operations, owned as one accountable
              engine.
            </p>
          </div>

          <div>
            <p className="eyebrow text-brass-soft">Navigate</p>
            <ul className="mt-5 space-y-3 font-sans text-[0.95rem] text-canvas/70">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-line" activeOptions={{ exact: item.to === '/' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/faq" className="link-line">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/aeo-vs-seo" className="link-line">
                  AEO vs SEO
                </Link>
              </li>
              <li>
                <Link to="/how-to-show-up-in-chatgpt" className="link-line">
                  Show up in ChatGPT
                </Link>
              </li>
              <li>
                <Link to="/contact" className="link-line">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-brass-soft">Enquiries</p>
            <ul className="mt-5 space-y-3 font-sans text-[0.95rem] text-canvas/70">
              <li>
                <a href="mailto:office@rothenhall.com" className="link-line">
                  office@rothenhall.com
                </a>
              </li>
              <li>
                <a href="tel:+919398386765" className="link-line">
                  +91 93983 86765
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/rothenhall/"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="link-line"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
            <address className="mt-4 font-sans text-[0.9rem] not-italic leading-relaxed text-canvas/50">
              2nd Floor, HAL 2nd Stage
              <br />
              Vimanapura S.O., Bengaluru 560017
              <br />
              Karnataka, India
            </address>
            <Link to="/contact" className="btn btn-light mt-6 !py-2.5 !px-5 text-[0.82rem]">
              Start a conversation
            </Link>
          </div>
        </div>

        <hr className="mt-14 border-0 border-t border-night-line" />
        <div className="mt-6 flex flex-col justify-between gap-3 font-sans text-[0.78rem] text-canvas/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Rothenhall Partners. All rights reserved.</p>
          <p className="tracking-wide">AEO · GEO · GTM · RevOps · Growth Operating</p>
        </div>
      </Container>
    </footer>
  )
}
