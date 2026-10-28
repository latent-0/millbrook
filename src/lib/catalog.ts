/* ------------------------------------------------------------------ */
/*  The engagement catalogue: one source for the pricing page and the   */
/*  atelier (/engage).                                                  */
/*                                                                      */
/*  Every figure here is a STARTING POINT, shown as "from". Rothenhall  */
/*  does not publish fixed prices: scope, size and markets change the   */
/*  work, so the final price is agreed on a call and set out in a       */
/*  proposal. Change a starting point here and both pages follow.       */
/* ------------------------------------------------------------------ */

export type Currency = 'USD' | 'EUR'
export type Money = { usd: number; eur: number }

/** Euro price derived from dollars, rounded to the nearest 5, unless set by hand. */
const m = (usd: number, eur?: number): Money => ({
  usd,
  eur: eur ?? Math.round((usd * 0.92) / 5) * 5,
})

/* ---------------------------- engagement lengths ---------------------------- */

export type TermKey = 'quarterly' | 'half-yearly' | 'annual'

export const TERMS: {
  key: TermKey
  label: string
  months: number
  /** Discount on every monthly fee for the whole term. One-off projects are never discounted. */
  off: number
  tag: string
  line: string
}[] = [
  { key: 'quarterly', label: 'Quarterly', months: 3, off: 0.1, tag: 'Three months', line: 'A focused sprint with a clear baseline and a clear result.' },
  { key: 'half-yearly', label: 'Half-yearly', months: 6, off: 0.15, tag: 'Six months', line: 'Time for the work to compound and for the numbers to show it.' },
  { key: 'annual', label: 'Annual', months: 12, off: 0.25, tag: 'Twelve months', line: 'A full year of one operator’s attention, at the best monthly rate.' },
]

export const isTerm = (v: unknown): v is TermKey => TERMS.some((t) => t.key === v)

/** The Founding Partner rate: applies to the first three months of any engagement, in place of the term discount. */
export const FOUNDING_OFF = 0.3
export const FOUNDING_MONTHS = 3
/** Share of every one-off project paid to begin; the rest is due on delivery. */
export const ONE_OFF_DEPOSIT = 0.5

/* ------------------------------- umbrellas ------------------------------- */

export type UmbrellaId =
  | 'brand'
  | 'seo'
  | 'aeo'
  | 'geo'
  | 'content'
  | 'paid'
  | 'social'
  | 'leadgen'
  | 'crm'
  | 'web'
  | 'pr'
  | 'analytics'
  | 'growth'

export const UMBRELLAS: { id: UmbrellaId; name: string; tagline: string }[] = [
  { id: 'brand', name: 'Brand strategy and positioning', tagline: 'Decide who you are for, and say it so it sticks.' },
  { id: 'seo', name: 'Search engine optimization', tagline: 'Be found on the results page by people ready to buy.' },
  { id: 'aeo', name: 'Answer engine optimization', tagline: 'Be named and cited when buyers ask an AI who to trust.' },
  { id: 'geo', name: 'Generative engine optimization', tagline: 'Make your company readable, resolvable and quotable by models.' },
  { id: 'content', name: 'Content marketing and thought leadership', tagline: 'Publish the work that earns trust before the first call.' },
  { id: 'paid', name: 'Performance marketing and paid media', tagline: 'Buy attention carefully, and prove what each pound or dollar returns.' },
  { id: 'social', name: 'Social media marketing and management', tagline: 'A steady, considered presence on the channels that matter.' },
  { id: 'leadgen', name: 'Lead generation and demand generation', tagline: 'Create demand, then capture it with a system that runs.' },
  { id: 'crm', name: 'CRM, email marketing and marketing automation', tagline: 'Know every lead, and follow up without dropping one.' },
  { id: 'web', name: 'Web design, development and CRO', tagline: 'A site that is fast, clear and built to convert.' },
  { id: 'pr', name: 'Public relations and digital authority', tagline: 'Earn the mentions, reviews and profiles others point to.' },
  { id: 'analytics', name: 'Marketing analytics and intelligence', tagline: 'Measure what moves revenue, and watch your rivals.' },
  { id: 'growth', name: 'Growth strategy, GTM and RevOps', tagline: 'One plan and one owner for the whole growth system.' },
]

/* --------------------------- common starting points ---------------------------- */

/** Realistic combinations of services that clients often begin with. They are examples, not packages. */
export const PRESETS: {
  id: string
  name: string
  who: string
  term: TermKey
  ids: string[]
}[] = [
  {
    id: 'visibility-sprint',
    name: 'AI visibility sprint',
    who: 'For a company that wants to know how AI describes it, and fix what is wrong first.',
    term: 'quarterly',
    ids: ['aeo-baseline', 'aeo-measure', 'geo-crawl', 'geo-entity', 'seo-onpage'],
  },
  {
    id: 'content-engine',
    name: 'Visibility and content engine',
    who: 'For a team that needs a steady rhythm of content that search and AI can quote.',
    term: 'half-yearly',
    ids: ['aeo-measure', 'aeo-content', 'content-blog', 'seo-onpage', 'content-casestudy'],
  },
  {
    id: 'demand-engine',
    name: 'Demand engine',
    who: 'For a company that has traffic and needs it turned into qualified conversations.',
    term: 'half-yearly',
    ids: ['lead-funnel', 'lead-outbound', 'crm-setup', 'crm-email', 'an-tracking'],
  },
  {
    id: 'growth-system',
    name: 'Full growth system',
    who: 'For a founder or fund that wants one accountable owner across the whole system.',
    term: 'annual',
    ids: ['growth-operator', 'aeo-measure', 'seo-onpage', 'content-thought', 'paid-manage', 'an-kpi'],
  },
]

/* ------------------------------- services -------------------------------- */

export type Service = {
  id: string
  umbrella: UmbrellaId
  name: string
  blurb: string
  /** `month` recurs for the whole term, `once` is a project. Both prices are starting points. */
  unit: 'month' | 'once'
  /** For priced-per-unit services: what the unit is, and how many can be taken. */
  per?: { label: string; max: number }
  /** The starting point ("from") for this service. The final price is agreed after a call. */
  price: Money
}

export const SERVICES: Service[] = [
  // Brand strategy and positioning
  { id: 'brand-positioning', umbrella: 'brand', name: 'Positioning and ICP workshop', blurb: 'A defined position, ideal customer and message hierarchy, agreed in one working session.', unit: 'once', price: m(750, 700) },
  { id: 'brand-messaging', umbrella: 'brand', name: 'Messaging and narrative framework', blurb: 'The story, proof points and objection answers every page and pitch draws from.', unit: 'once', price: m(900) },
  { id: 'brand-rival-map', umbrella: 'brand', name: 'Competitive positioning map', blurb: 'Who you really compete with for the buyer, and the space only you can hold.', unit: 'once', price: m(550, 500) },
  { id: 'brand-identity', umbrella: 'brand', name: 'Brand identity refresh', blurb: 'Direction, voice and guidelines, so the brand looks and sounds like one company.', unit: 'once', price: m(1800) },

  // SEO
  { id: 'seo-audit', umbrella: 'seo', name: 'Technical SEO audit and fix plan', blurb: 'Crawl, speed, structure and indexing checked, with a ranked list of fixes.', unit: 'once', price: m(600, 550) },
  { id: 'seo-onpage', umbrella: 'seo', name: 'On-page and content optimization', blurb: 'Titles, copy, internal links and page roles tuned to the queries that convert.', unit: 'month', price: m(500) },
  { id: 'seo-links', umbrella: 'seo', name: 'Link building and off-site authority', blurb: 'Relevant, earned links from sites your buyers and search engines trust.', unit: 'month', price: m(600) },
  { id: 'seo-local', umbrella: 'seo', name: 'Local SEO and listings', blurb: 'Profiles, citations and reviews that put every location on the map.', unit: 'month', price: m(300) },

  // AEO
  { id: 'aeo-baseline', umbrella: 'aeo', name: 'AEO baseline and buyer-question audit', blurb: 'How often AI names you across a set of real buyer questions, and who wins instead.', unit: 'once', price: m(950, 875) },
  { id: 'aeo-measure', umbrella: 'aeo', name: 'Monthly AEO measurement and reporting', blurb: 'Rates across repeated runs on Cailyx, with every fix tracked until it is verified.', unit: 'month', price: m(550, 500) },
  { id: 'aeo-content', umbrella: 'aeo', name: 'Answer-ready content and FAQ build', blurb: 'Pages written in the shape of the answer, built to be quoted.', unit: 'month', price: m(450) },
  { id: 'aeo-citations', umbrella: 'aeo', name: 'Citation and third-party presence', blurb: 'Comparison tables, communities and listings that models already cite.', unit: 'month', price: m(500) },

  // GEO
  { id: 'geo-entity', umbrella: 'geo', name: 'Entity and schema implementation', blurb: 'Structured data and entity signals so a model knows it is reading you.', unit: 'once', price: m(700) },
  { id: 'geo-crawl', umbrella: 'geo', name: 'AI crawler access and rendering fixes', blurb: 'Robots, firewall and JavaScript walls cleared so assistants can read the page.', unit: 'once', price: m(500) },
  { id: 'geo-corpus', umbrella: 'geo', name: 'Model-readable content layer', blurb: 'A clean, quotable body of facts about your company, kept current.', unit: 'month', price: m(450) },
  { id: 'geo-engine', umbrella: 'geo', name: 'Extra AI engine or region in measurement', blurb: 'Add one more engine or market to your tracked query set.', unit: 'month', per: { label: 'engine or region', max: 4 }, price: m(75, 70) },

  // Content
  { id: 'content-blog', umbrella: 'content', name: 'Blog engine, four posts', blurb: 'Four researched, on-brand posts a month, briefed, written and edited.', unit: 'month', price: m(250, 230) },
  { id: 'content-thought', umbrella: 'content', name: 'Thought-leadership and executive writing', blurb: 'Founder articles and LinkedIn writing in your voice, with your ideas.', unit: 'month', price: m(600) },
  { id: 'content-casestudy', umbrella: 'content', name: 'Case-study production', blurb: 'A before-and-after story with a baseline, a result and a client quote.', unit: 'once', per: { label: 'case study', max: 4 }, price: m(450) },
  { id: 'content-playbook', umbrella: 'content', name: 'Playbooks and lead magnets', blurb: 'A guide worth giving an email address for, designed and written.', unit: 'once', price: m(700) },

  // Paid
  { id: 'paid-audit', umbrella: 'paid', name: 'Paid ads account audit', blurb: 'Spend, structure, tracking and creative reviewed, with what to cut and what to scale.', unit: 'once', price: m(450) },
  { id: 'paid-manage', umbrella: 'paid', name: 'Paid media management', blurb: 'Google and Meta campaigns run, tested and reported. Ad spend is billed at cost.', unit: 'month', price: m(900) },
  { id: 'paid-creative', umbrella: 'paid', name: 'Ad creative production', blurb: 'Static and short-form ad creative, refreshed before it tires.', unit: 'month', price: m(500) },

  // Social
  { id: 'social-channel', umbrella: 'social', name: 'Social channel management', blurb: 'Planning, posting and light community care on one channel.', unit: 'month', per: { label: 'channel', max: 4 }, price: m(150, 140) },
  { id: 'social-video', umbrella: 'social', name: 'Short-form video', blurb: 'Scripted, shot or edited vertical video, priced from the simplest cut.', unit: 'once', per: { label: 'piece', max: 6 }, price: m(320, 290) },
  { id: 'social-community', umbrella: 'social', name: 'Community management and replies', blurb: 'Comments and messages answered in your voice, on time.', unit: 'month', price: m(350) },
  { id: 'social-audit', umbrella: 'social', name: 'Social media audit', blurb: 'Accounts, post analytics and engagement reviewed, with what to change.', unit: 'once', price: m(400) },

  // Lead gen
  { id: 'lead-funnel', umbrella: 'leadgen', name: 'Funnel plan', blurb: 'Reach, capture and convert, with the assets, channels and measures for each stage.', unit: 'once', price: m(450, 400) },
  { id: 'lead-outbound', umbrella: 'leadgen', name: 'Outbound lead generation', blurb: 'Researched email and LinkedIn outreach to your ideal accounts, with replies handled.', unit: 'month', price: m(1200, 1100) },
  { id: 'lead-demand', umbrella: 'leadgen', name: 'Demand programmes', blurb: 'Webinars, events and partner campaigns that create pipeline, not just attendance.', unit: 'month', price: m(800) },

  // CRM
  { id: 'crm-setup', umbrella: 'crm', name: 'CRM setup and pipeline design', blurb: 'Stages, fields, ownership and reports set up so the team actually uses it.', unit: 'once', price: m(950, 875) },
  { id: 'crm-email', umbrella: 'crm', name: 'Email and newsletter programme', blurb: 'Written, scheduled and measured emails that keep you in the room.', unit: 'month', price: m(450) },
  { id: 'crm-automation', umbrella: 'crm', name: 'Marketing automation workflows', blurb: 'Nurture, onboarding and re-engagement flows built and tuned.', unit: 'month', price: m(600) },
  { id: 'crm-scoring', umbrella: 'crm', name: 'Lead scoring and routing', blurb: 'The right lead to the right person, fast, with rules you can read.', unit: 'once', price: m(700) },

  // Web
  { id: 'web-copy', umbrella: 'web', name: 'Website revamp: content only', blurb: 'Every key page rewritten for clarity, proof and a single next step.', unit: 'once', price: m(1500) },
  { id: 'web-structure', umbrella: 'web', name: 'Website revamp: structure and UX', blurb: 'Site map, page roles, navigation and layout reworked and designed.', unit: 'once', price: m(3000, 2750) },
  { id: 'web-rebuild', umbrella: 'web', name: 'Website revamp: full rebuild', blurb: 'Design, build, content and launch on a fast, search-ready stack.', unit: 'once', price: m(6500, 6000) },
  { id: 'web-cro', umbrella: 'web', name: 'Conversion rate optimization programme', blurb: 'A steady rhythm of tested changes to the pages that earn the revenue.', unit: 'month', price: m(700) },

  // PR
  { id: 'pr-media', umbrella: 'pr', name: 'Digital PR and media outreach', blurb: 'Stories placed with the publications your buyers and the models read.', unit: 'month', price: m(900) },
  { id: 'pr-reviews', umbrella: 'pr', name: 'Reviews and reputation', blurb: 'More honest reviews on the platforms that matter, and a calm response to the rest.', unit: 'month', price: m(350) },
  { id: 'pr-presence', umbrella: 'pr', name: 'Digital presence audit and build', blurb: 'The profiles, listings and directories you should hold, claimed and made consistent.', unit: 'once', price: m(450) },
  { id: 'pr-founder', umbrella: 'pr', name: 'Founder and executive profile building', blurb: 'A visible, credible public profile for the people behind the company.', unit: 'month', price: m(500) },

  // Analytics
  { id: 'an-tracking', umbrella: 'analytics', name: 'Analytics and tracking setup', blurb: 'Tags, events, consent and goals checked, fixed and documented.', unit: 'once', price: m(450) },
  { id: 'an-dashboard', umbrella: 'analytics', name: 'Reporting dashboard', blurb: 'One live view of spend, pipeline and results, built from your own data.', unit: 'once', price: m(800, 750) },
  { id: 'an-rivals', umbrella: 'analytics', name: 'Competitor intelligence tracking', blurb: 'Rivals’ site, search, content and AI presence watched every month.', unit: 'month', price: m(500) },
  { id: 'an-kpi', umbrella: 'analytics', name: 'Attribution and KPI framework', blurb: 'The few numbers that matter, defined, owned and reported the same way each month.', unit: 'once', price: m(900, 825) },

  // Growth
  { id: 'growth-gtm', umbrella: 'growth', name: 'GTM strategy and launch plan', blurb: 'Market, offer, channels and a sequenced plan for the next two quarters.', unit: 'once', price: m(1500) },
  { id: 'growth-pricing', umbrella: 'growth', name: 'Pricing strategy', blurb: 'Packaging, price points and the logic behind them, tested against the market.', unit: 'once', price: m(1200, 1100) },
  { id: 'growth-revops', umbrella: 'growth', name: 'Revenue operations and funnel metrics', blurb: 'Handoffs, definitions and reporting so marketing and sales share one number.', unit: 'month', price: m(900) },
  { id: 'growth-operator', umbrella: 'growth', name: 'Fractional growth operator', blurb: 'A named senior operator who owns agreed outcomes across the whole system.', unit: 'month', price: m(2600, 2400) },
]

export const SERVICE_BY_ID = new Map(SERVICES.map((s) => [s.id, s]))

/* -------------------------------- pricing -------------------------------- */

export type Cart = Record<string, number>

export type PricedLine = {
  id: string
  name: string
  umbrella: UmbrellaId
  qty: number
  unit: 'month' | 'once'
  per?: string
  each: number
  total: number
}

export type Pricing = {
  currency: Currency
  months: number
  off: number
  lines: PricedLine[]
  /** List price of all monthly services, per month. */
  monthlyList: number
  /** Monthly fee after the term discount. */
  monthly: number
  /** Monthly fee for the first three months with the Founding Partner rate, otherwise the same as `monthly`. */
  monthlyFirst: number
  oneOff: number
  /** Everything over the whole term: monthly fees plus one-off projects. */
  termTotal: number
  /** Saved against list price on the monthly services, over the term. */
  saving: number
  /** Paid today: the first month plus the deposit on one-off projects. */
  dueToday: number
  /** The one-off balance, due on delivery. */
  oneOffBalance: number
  isEmpty: boolean
}

export function priceCart(cart: Cart, term: TermKey, currency: Currency, founding = false): Pricing {
  const t = TERMS.find((x) => x.key === term) ?? TERMS[0]
  const pick = (mm: Money) => (currency === 'EUR' ? mm.eur : mm.usd)
  const lines: PricedLine[] = []
  for (const [id, raw] of Object.entries(cart)) {
    const s = SERVICE_BY_ID.get(id)
    if (!s) continue
    const qty = Math.max(0, Math.min(s.per?.max ?? 1, Math.floor(Number(raw) || 0)))
    if (!qty) continue
    const each = pick(s.price)
    lines.push({ id, name: s.name, umbrella: s.umbrella, qty, unit: s.unit, per: s.per?.label, each, total: each * qty })
  }
  const monthlyList = lines.filter((l) => l.unit === 'month').reduce((n, l) => n + l.total, 0)
  const oneOff = lines.filter((l) => l.unit === 'once').reduce((n, l) => n + l.total, 0)
  // Each line is rounded on its own, so the lines always add up to the monthly fee shown.
  const monthlyLines = lines.filter((l) => l.unit === 'month')
  const monthly = monthlyLines.reduce((n, l) => n + Math.round(l.total * (1 - t.off)), 0)
  const foundingOn = founding && monthlyList > 0
  const monthlyFirst = foundingOn ? monthlyLines.reduce((n, l) => n + Math.round(l.total * (1 - FOUNDING_OFF)), 0) : monthly
  const firstMonths = foundingOn ? Math.min(FOUNDING_MONTHS, t.months) : 0
  const recurring = monthlyFirst * firstMonths + monthly * (t.months - firstMonths)
  const termTotal = recurring + oneOff
  const deposit = Math.round(oneOff * ONE_OFF_DEPOSIT)
  return {
    currency,
    months: t.months,
    off: t.off,
    lines,
    monthlyList,
    monthly,
    monthlyFirst,
    oneOff,
    termTotal,
    saving: monthlyList * t.months - recurring,
    dueToday: (monthlyList > 0 ? monthlyFirst : 0) + deposit,
    oneOffBalance: oneOff - deposit,
    isEmpty: lines.length === 0,
  }
}

export function formatMoney(n: number, currency: Currency): string {
  const sym = currency === 'EUR' ? '€' : '$'
  return sym + Math.round(n).toLocaleString(currency === 'EUR' ? 'en-IE' : 'en-US')
}

/** A one-line summary of a cart, for notes and order records. */
export function cartSummary(p: Pricing, termLabel: string): string {
  const names = p.lines.map((l) => (l.qty > 1 ? `${l.name} x${l.qty}` : l.name)).join('; ')
  return `${termLabel} engagement (${p.months} months). ${names}`.slice(0, 280)
}
