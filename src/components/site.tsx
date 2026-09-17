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
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>
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
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
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
      width={1029}
      height={180}
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
  { to: '/community', label: 'Community' },
  { to: '/cailyx', label: 'Cailyx' },
  { to: '/blogs', label: 'Journal' },
  { to: '/research', label: 'Research' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/careers', label: 'Careers' },
  { to: '/about', label: 'About' },
] as const

/* Footer groups. Three short labelled columns rather than one long list, and
   no route appears twice. Every file in src/routes stays reachable here. */
const FOOTER_LINKS = {
  product: [
    { to: '/cailyx', label: 'Cailyx' },
    { to: '/ai-visibility-score', label: 'AI Visibility Score' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/research', label: 'Research' },
    { to: '/case-studies', label: 'Case Studies' },
  ],
  firm: [
    { to: '/about', label: 'About' },
    { to: '/community', label: 'Founders Circle' },
    { to: '/careers', label: 'Careers' },
    { to: '/scouts', label: 'Campus Scouts' },
    { to: '/contact', label: 'Contact' },
  ],
  learn: [
    { to: '/blogs', label: 'Journal' },
    { to: '/faq', label: 'FAQ' },
    { to: '/aeo-vs-seo', label: 'AEO vs SEO' },
    { to: '/how-to-show-up-in-chatgpt', label: 'Show up in ChatGPT' },
  ],
} as const

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
  // The bar must go opaque as soon as the copy turns dark, which includes the
  // menu-open state. Reacting to `scrolled` alone left dark bars on the dark
  // home hero whenever the menu was open at the top of the page.
  const solid = scrolled || open
  const barBg = light ? 'bg-canvas' : 'bg-ink'

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        solid
          ? 'bg-canvas/85 backdrop-blur-md border-b border-line'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <Container width="wide">
        <div className="flex h-[4.75rem] items-center justify-between gap-6">
          <Link to="/" aria-label="Rothenhall Partners, home" onClick={() => setOpen(false)}>
            <Wordmark tone={light ? 'light' : 'ink'} />
          </Link>

          {/* Turns on at lg, not md. At 768px the seven labels, the gaps and
              the CTA need roughly 980px of the 704px available, and flex
              items will not shrink below their own text. */}
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ 'aria-current': 'page' }}
                activeOptions={{ exact: false }}
                className={`relative font-sans text-label tracking-wide transition-colors ${
                  light
                    ? 'text-canvas/80 hover:text-canvas'
                    : 'text-ink-80 hover:text-ink'
                }`}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {/* Active is a mark, not an opacity delta: activeProps
                        merges its class with the base one, so a colour swap
                        alone could be cancelled out by stylesheet order. */}
                    <span
                      aria-hidden
                      className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-brass transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </Link>
            ))}
            <Link
              to="/contact"
              className={`btn !px-5 !py-2.5 text-label ${
                light ? 'btn-light' : 'btn-primary'
              }`}
            >
              Talk to us
            </Link>
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center lg:hidden"
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

      {/* Mobile menu. A 0fr to 1fr grid row animates to intrinsic height, so
          the panel can never clip the list the way a fixed max-height did. */}
      <div
        className={`grid bg-canvas transition-[grid-template-rows] duration-400 ease-out lg:hidden ${
          open ? 'grid-rows-[1fr] border-t border-line' : 'grid-rows-[0fr] border-t border-transparent'
        }`}
      >
        <div className="overflow-hidden">
          <Container>
            <nav className="flex flex-col py-4">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl py-3 text-ink-80"
                  activeProps={{ className: 'text-ink', 'aria-current': 'page' }}
                  activeOptions={{ exact: false }}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-4 w-full"
              >
                Talk to us
              </Link>
            </nav>
          </Container>
        </div>
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
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.25fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="/brand/griffin.png"
              alt=""
              aria-hidden
              className="mb-6 h-16 w-auto select-none"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }}
            />
            <Wordmark tone="light" />
            <p className="mt-5 max-w-sm font-sans text-caption leading-relaxed text-canvas/60">
              The fractional operating partner for AI-era growth. AI visibility,
              go-to-market, and revenue operations, owned as one accountable
              engine.
            </p>
          </div>

          <div>
            <p className="eyebrow eyebrow-light">Product</p>
            <ul className="mt-5 space-y-3 font-sans text-caption text-canvas/70">
              {FOOTER_LINKS.product.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-line">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-light">Firm</p>
            <ul className="mt-5 space-y-3 font-sans text-caption text-canvas/70">
              {FOOTER_LINKS.firm.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-line">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-light">Learn</p>
            <ul className="mt-5 space-y-3 font-sans text-caption text-canvas/70">
              {FOOTER_LINKS.learn.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-line">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-light">Enquiries</p>
            <ul className="mt-5 space-y-3 font-sans text-caption text-canvas/70">
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
            <div className="mt-4 space-y-3">
              <address className="font-sans text-caption not-italic leading-relaxed text-canvas/50">
                <span className="block text-label uppercase tracking-[0.14em] text-canvas/40">
                  India
                </span>
                2nd Floor, HAL 2nd Stage
                <br />
                Vimanapura S.O., Bengaluru 560017
                <br />
                Karnataka, India
              </address>
              <address className="font-sans text-caption not-italic leading-relaxed text-canvas/50">
                <span className="block text-label uppercase tracking-[0.14em] text-canvas/40">
                  United Kingdom
                </span>
                Office 657, 18 Young St, Unit LGE
                <br />
                Edinburgh EH2 4JB
                <br />
                Scotland
              </address>
            </div>
            <Link to="/contact" className="btn btn-light mt-6 !py-2.5 !px-5 text-label">
              Start a conversation
            </Link>
          </div>
        </div>

        <hr className="mt-14 border-0 border-t border-night-line" />
        <div className="mt-6 flex flex-col justify-between gap-3 font-sans text-label text-canvas/45 sm:flex-row">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} Rothenhall Partners. All rights reserved.</span>
            <Link to="/terms" className="link-line text-canvas/60 hover:text-canvas">
              Terms
            </Link>
          </p>
          <p className="tracking-wide">AEO · GEO · GTM · RevOps · Growth Operating</p>
        </div>
      </Container>
    </footer>
  )
}
