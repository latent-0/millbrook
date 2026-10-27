import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { SERVICE_BY_ID } from '../lib/catalog'

/**
 * "Read my website": fetches a company's public homepage, robots.txt, sitemap
 * and llms.txt, reads what is publicly visible, and turns it into a short
 * list of observations and recommended services. It looks only at public
 * pages, never logs in, and is honest about what one page can and cannot show.
 *
 * Safety: only http(s) on the default ports, every hop (including redirects)
 * must resolve to a public address, bodies are size-capped, requests time out,
 * and each visitor is rate limited.
 */

export type Tone = 'good' | 'watch' | 'bad'
export type Signal = { label: string; value: string; tone: Tone }
export type Recommendation = { id: string; why: string }
export type ScanResult =
  | { ok: true; host: string; profile: string; signals: Signal[]; recommended: Recommendation[] }
  | { ok: false; message: string }

/* ----------------------------- network guards ----------------------------- */

function isPrivateAddress(ip: string): boolean {
  const v = ip.toLowerCase()
  if (v.startsWith('::ffff:')) return isPrivateAddress(v.slice(7))
  if (isIP(v) === 6) return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb')
  const p = v.split('.').map(Number)
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true
  const [a, b] = p
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224
}

async function assertPublicHost(hostname: string) {
  if (hostname === 'localhost' || hostname.endsWith('.local') || hostname.endsWith('.internal')) throw new Error('private')
  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new Error('private')
    return
  }
  const addrs = await lookup(hostname, { all: true })
  if (!addrs.length || addrs.some((a) => isPrivateAddress(a.address))) throw new Error('private')
}

function normalizeUrl(input: string): URL {
  let raw = input.trim()
  if (!raw) throw new Error('empty')
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) raw = 'https://' + raw
  const u = new URL(raw)
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error('protocol')
  if (u.port && u.port !== '80' && u.port !== '443') throw new Error('port')
  if (!u.hostname.includes('.')) throw new Error('host')
  u.username = ''
  u.password = ''
  u.hash = ''
  return u
}

type Fetched = { status: number; text: string; url: URL; ms: number; bytes: number }

async function fetchPublic(start: URL, opts: { timeout: number; maxBytes: number }): Promise<Fetched> {
  let url = start
  const t0 = Date.now()
  for (let hop = 0; hop < 4; hop++) {
    await assertPublicHost(url.hostname)
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), opts.timeout)
    try {
      const res = await fetch(url, {
        redirect: 'manual',
        signal: ctl.signal,
        headers: { 'user-agent': 'RothenhallSiteReader/1.0 (+https://www.rothenhall.com)', accept: 'text/html,text/plain,application/xml;q=0.9,*/*;q=0.5' },
      })
      const ms = Date.now() - t0
      if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        url = new URL(res.headers.get('location')!, url)
        if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('protocol')
        continue
      }
      const reader = res.body?.getReader()
      const chunks: Uint8Array[] = []
      let bytes = 0
      if (reader) {
        while (bytes < opts.maxBytes) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          bytes += value.length
        }
        reader.cancel().catch(() => {})
      }
      const text = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8')
      return { status: res.status, text, url, ms, bytes }
    } finally {
      clearTimeout(timer)
    }
  }
  throw new Error('redirects')
}

/* ------------------------------- rate limit -------------------------------- */

const hits = new Map<string, number[]>()
function allowed(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  if (recent.length >= 6) {
    hits.set(ip, recent)
    return false
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return true
}

/* -------------------------------- reading ---------------------------------- */

const pick = (re: RegExp, s: string) => re.exec(s)?.[1]?.replace(/\s+/g, ' ').trim()

function metaContent(html: string, key: string): string | undefined {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]*>`, 'i')
  const tag = re.exec(html)?.[0]
  return tag ? pick(/content=["']([^"']*)["']/i, tag) : undefined
}

function jsonLdTypes(html: string): string[] {
  const out: string[] = []
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    try {
      const walk = (n: unknown) => {
        if (Array.isArray(n)) n.forEach(walk)
        else if (n && typeof n === 'object') {
          const o = n as Record<string, unknown>
          const t = o['@type']
          if (typeof t === 'string') out.push(t)
          else if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && out.push(x))
          Object.values(o).forEach(walk)
        }
      }
      walk(JSON.parse(m[1]))
    } catch {
      /* ignore malformed JSON-LD */
    }
  }
  return [...new Set(out)]
}

const AI_BOTS = ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'OAI-SearchBot']

function blockedBots(robots: string): string[] {
  const groups: { agents: string[]; disallowAll: boolean }[] = []
  let cur: { agents: string[]; disallowAll: boolean } | null = null
  let lastWasAgent = false
  for (const lineRaw of robots.split(/\r?\n/)) {
    const line = lineRaw.replace(/#.*/, '').trim()
    const m = /^([a-z-]+)\s*:\s*(.*)$/i.exec(line)
    if (!m) continue
    const k = m[1].toLowerCase()
    const v = m[2].trim()
    if (k === 'user-agent') {
      if (!cur || !lastWasAgent) {
        cur = { agents: [], disallowAll: false }
        groups.push(cur)
      }
      cur.agents.push(v.toLowerCase())
      lastWasAgent = true
    } else {
      lastWasAgent = false
      if (cur && k === 'disallow' && v === '/') cur.disallowAll = true
    }
  }
  const blocked = new Set<string>()
  const star = groups.find((g) => g.agents.includes('*'))
  for (const bot of AI_BOTS) {
    const own = groups.find((g) => g.agents.includes(bot.toLowerCase()))
    if (own ? own.disallowAll : !!star?.disallowAll) blocked.add(bot)
  }
  return [...blocked]
}

const LOCAL_WORDS = /\b(clinic|dental|dentist|hospital|doctor|salon|spa|restaurant|cafe|hotel|gym|studio|boutique|school|academy|law firm|real estate|realty|repair|plumb|salon)\b/i
const SHOP_WORDS = /\b(shop|store|cart|checkout|buy now|add to bag|free shipping|collection)\b/i
const SOFTWARE_WORDS = /\b(software|saas|platform|app|api|dashboard|automation|cloud|ai-powered|integrations?)\b/i
const SERVICE_WORDS = /\b(agency|consulting|consultancy|advisory|services|solutions|partners)\b/i

/* --------------------------------- scan ------------------------------------ */

function validateScan(data: unknown): { url: string } {
  if (!data || typeof data !== 'object') throw new Error('Enter your website address.')
  const url = String((data as Record<string, unknown>).url ?? '').trim().slice(0, 200)
  if (!url) throw new Error('Enter your website address.')
  return { url }
}

export const scanSite = createServerFn({ method: 'POST' })
  .validator(validateScan)
  .handler(async ({ data }): Promise<ScanResult> => {
    const ip = (getRequestHeader('x-forwarded-for') || getRequestHeader('x-real-ip') || 'local').split(',')[0].trim()
    if (!allowed(ip)) return { ok: false, message: 'That is a lot of scans in a short time. Please try again in a few minutes.' }

    let start: URL
    try {
      start = normalizeUrl(data.url)
    } catch {
      return { ok: false, message: 'That does not look like a website address. Try something like yourcompany.com.' }
    }

    let page: Fetched
    try {
      page = await fetchPublic(start, { timeout: 9000, maxBytes: 1_500_000 })
    } catch (e) {
      const why = e instanceof Error ? e.message : ''
      return {
        ok: false,
        message:
          why === 'private'
            ? 'We can only read public websites.'
            : 'We could not reach that site. Check the address, or choose your services from the catalogue instead.',
      }
    }
    if (page.status >= 400 || !/<html|<head|<body/i.test(page.text)) {
      return { ok: false, message: 'We could not read a public page at that address. You can still choose your services from the catalogue.' }
    }

    const origin = new URL(page.url.origin)
    const small = (path: string) => fetchPublic(new URL(path, origin), { timeout: 4000, maxBytes: 200_000 }).catch(() => null)
    const [robotsRes, sitemapRes, llmsRes] = await Promise.all([small('/robots.txt'), small('/sitemap.xml'), small('/llms.txt')])

    const html = page.text
    const lower = html.toLowerCase()
    const host = page.url.hostname.replace(/^www\./, '')
    const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/i, html) ?? ''
    const description = metaContent(html, 'description') ?? ''
    const h1s = (html.match(/<h1[\s>]/gi) ?? []).length
    const types = jsonLdTypes(html)
    const hasOrgSchema = types.some((t) => /^(Organization|LocalBusiness|Corporation|ProfessionalService|Store|Restaurant|MedicalBusiness|Person)$/i.test(t))
    const robots = robotsRes && robotsRes.status === 200 ? robotsRes.text : ''
    const blocked = robots ? blockedBots(robots) : []
    const hasSitemap = (sitemapRes && sitemapRes.status === 200 && /<urlset|<sitemapindex/i.test(sitemapRes.text)) || /sitemap:/i.test(robots)
    const hasLlms = !!(llmsRes && llmsRes.status === 200 && llmsRes.text.trim().length > 20 && !/<html/i.test(llmsRes.text))
    const socials = ['linkedin.com', 'instagram.com', 'facebook.com', 'twitter.com', 'x.com/', 'youtube.com', 'tiktok.com'].filter((d) => lower.includes(d)).length
    const analytics = /googletagmanager\.com|gtag\(|google-analytics\.com|plausible\.io|matomo|segment\.com|mixpanel|posthog|clarity\.ms/.test(lower)
    const adPixel = /fbq\(|connect\.facebook\.net\/[a-z_]+\/fbevents|googleadservices\.com|googleads\.g\.doubleclick|['"]aw-\d{6,}|snap\.licdn\.com|static\.ads-twitter\.com|analytics\.tiktok\.com/.test(lower)
    const crm = /hubspot|salesforce|pardot|zoho|pipedrive|mailchimp|klaviyo|activecampaign|convertkit|brevo|sendinblue|marketo/.test(lower)
    const forms = (html.match(/<form[\s>]/gi) ?? []).length
    const leadPath = forms > 0 || /mailto:|calendly\.com|cal\.com|book (a|your) (call|demo)|get (a )?quote|request (a )?(demo|quote)|subscribe|newsletter/i.test(html)
    const contentHub = /href=["'][^"']*\/(blogs?|insights|journal|resources|articles|news|learn)(\/|["'?#])/i.test(html)
    const proof = /case stud|testimonial|reviews?\b|trusted by|our clients|customers love|rated|stars/i.test(html)
    const viewport = /<meta[^>]+name=["']viewport["']/i.test(html)
    const text = `${title} ${description}`

    const profile = LOCAL_WORDS.test(text)
      ? 'a local, location-led business'
      : SHOP_WORDS.test(lower.slice(0, 20000))
        ? 'an online shop'
        : SOFTWARE_WORDS.test(text)
          ? 'a software company'
          : SERVICE_WORDS.test(text)
            ? 'a services business'
            : 'a business'

    const S: Signal[] = []
    const push = (label: string, value: string, tone: Tone) => S.push({ label, value, tone })
    push('Secure connection', page.url.protocol === 'https:' ? 'HTTPS' : 'Not HTTPS', page.url.protocol === 'https:' ? 'good' : 'bad')
    push('Server response', `${page.ms} ms to respond`, page.ms < 800 ? 'good' : page.ms < 1800 ? 'watch' : 'bad')
    push('Page title', !title ? 'Missing' : title.length < 20 ? 'Very short' : title.length > 65 ? 'Long, may be cut off' : 'Clear length', !title ? 'bad' : title.length < 20 || title.length > 65 ? 'watch' : 'good')
    push('Search description', !description ? 'Missing' : description.length < 50 ? 'Thin' : 'Present', !description ? 'bad' : description.length < 50 ? 'watch' : 'good')
    push('Main heading', h1s === 1 ? 'One clear H1' : h1s === 0 ? 'No H1 found' : `${h1s} H1s`, h1s === 1 ? 'good' : h1s === 0 ? 'bad' : 'watch')
    push('Structured data', hasOrgSchema ? `Entity data found (${types.slice(0, 2).join(', ')})` : types.length ? `Only ${types.slice(0, 2).join(', ')}` : 'None found', hasOrgSchema ? 'good' : types.length ? 'watch' : 'bad')
    push('AI crawler access', !robots ? 'No robots.txt to read' : blocked.length ? `Blocks ${blocked.slice(0, 3).join(', ')}` : 'Open to AI crawlers', !robots ? 'watch' : blocked.length ? 'bad' : 'good')
    push('Sitemap and llms.txt', `${hasSitemap ? 'Sitemap' : 'No sitemap'}, ${hasLlms ? 'llms.txt' : 'no llms.txt'}`, hasSitemap && hasLlms ? 'good' : hasSitemap || hasLlms ? 'watch' : 'bad')
    push('Social profiles linked', socials ? `${socials} found` : 'None linked', socials >= 3 ? 'good' : socials ? 'watch' : 'bad')
    push('Analytics', analytics ? 'Tracking detected' : 'None detected', analytics ? 'good' : 'bad')
    push('Way to enquire', leadPath ? 'Form or booking path found' : 'No clear next step', leadPath ? 'good' : 'bad')
    push('Content and proof', `${contentHub ? 'Content hub' : 'No content hub'}, ${proof ? 'proof present' : 'little proof'}`, contentHub && proof ? 'good' : contentHub || proof ? 'watch' : 'bad')

    /* ----------------------------- recommendations ---------------------------- */
    const R: (Recommendation & { p: number })[] = []
    const add = (id: string, why: string, p: number) => {
      if (SERVICE_BY_ID.has(id) && !R.some((r) => r.id === id)) R.push({ id, why, p })
    }
    add('aeo-baseline', `Every engagement starts here: how often AI names ${host} for the questions your buyers ask, and who wins instead.`, 100)
    if (blocked.length) add('geo-crawl', `Your robots.txt turns away ${blocked.slice(0, 3).join(', ')}, so those assistants cannot read the site.`, 95)
    if (!hasOrgSchema) add('geo-entity', 'No entity data found, so a model has little to confirm who you are.', 90)
    const seoIssues = [!title || title.length < 20 || title.length > 65, !description, h1s !== 1, !hasSitemap, page.ms >= 1800, !viewport].filter(Boolean).length
    if (seoIssues >= 2) add('seo-audit', `${seoIssues} basic search signals need attention (titles, description, headings, sitemap, speed).`, 85)
    if (!title || !description) add('seo-onpage', 'The page title or description is missing or thin, which weakens how you appear in results.', 70)
    if (!analytics) add('an-tracking', 'No analytics was detected, so results cannot be measured.', 88)
    if (!leadPath) add('lead-funnel', 'No form, booking link or clear next step was found on the homepage.', 82)
    if (!leadPath || !proof) add('web-cro', 'The page gives visitors little to act on or to trust, which is where conversion is won.', 64)
    if (!contentHub) add('content-blog', 'No blog or resource section was found, so there is little for search and AI to quote.', 76)
    if (!proof) add('content-casestudy', 'Little proof was visible on the homepage: no case studies, reviews or testimonials.', 74)
    if (socials === 0) add('social-channel', 'No social channels are linked from the site.', 66)
    else if (socials < 3) add('social-audit', `Only ${socials} social ${socials === 1 ? 'profile is' : 'profiles are'} linked, so the presence looks thin.`, 60)
    if (!crm) add('crm-setup', 'No CRM or email platform was detected behind the site.', 58)
    if (adPixel) add('paid-audit', 'Ad tracking is installed, so paid media is likely running. An audit shows what to cut and scale.', 62)
    if (socials < 2 || !hasOrgSchema) add('pr-presence', 'Few profiles tie the brand together across the web.', 56)
    if (!title || title.length < 20 || !description) add('brand-positioning', 'The first screen does not say clearly who you serve and why, which is a positioning question.', 52)
    if (LOCAL_WORDS.test(text)) add('seo-local', 'You look location-led, so listings and reviews carry a lot of weight.', 68)
    if (!viewport) add('web-structure', 'No mobile viewport was set, so the site may not display well on phones.', 54)

    const recommended = R.sort((a, b) => b.p - a.p).slice(0, 8).map(({ id, why }) => ({ id, why }))
    return { ok: true, host, profile, signals: S, recommended }
  })
