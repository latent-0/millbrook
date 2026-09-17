import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, Eyebrow } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/napkin-rothenhall')({
  head: () => {
    const s = seo({
      path: '/napkin-rothenhall',
      title: 'Creative Agency AI Visibility Diagnostics · Rothenhall Partners',
      description:
        'A comprehensive AI Visibility diagnostic across seven Irish and global creative agencies, scored on the Rothenhall five-dimension framework, with radar analytics, findings, and prioritised fixes.',
    })
    return {
      ...s,
      meta: s.meta.map((m) =>
        (m as { name?: string }).name === 'robots'
          ? { name: 'robots', content: 'noindex, nofollow' }
          : m,
      ),
    }
  },
  component: Diagnostics,
})

/* ------------------------------------------------------------------ */
/*  Framework                                                          */
/* ------------------------------------------------------------------ */

type DimKey = 'access' | 'entity' | 'shortlist' | 'extract' | 'authority'

const AXES: { key: DimKey; short: string; label: string; w: number; q: string }[] = [
  { key: 'access', short: 'Access', label: 'Machine access', w: 25, q: 'Can the AI crawlers fetch and read the site?' },
  { key: 'entity', short: 'Entity', label: 'Entity clarity', w: 25, q: 'Does a model know which company this is?' },
  { key: 'shortlist', short: 'Shortlist', label: 'Shortlist presence', w: 20, q: 'Is it named when buyers ask?' },
  { key: 'extract', short: 'Extract', label: 'On-page extractability', w: 20, q: 'Can a model read and quote the pages?' },
  { key: 'authority', short: 'Authority', label: 'Authority signal', w: 10, q: 'Is there real-world proof to reward?' },
]

const BANDS = [
  { min: 81, name: 'Recommended', body: 'Named, cited, and characterised well for the queries buyers ask.' },
  { min: 61, name: 'Present', body: 'Appears for some queries that matter, and is read and understood correctly.' },
  { min: 41, name: 'Faint', body: 'Exists to the models but rarely surfaces. Strong companies with weak machine-visibility sit here.' },
  { min: 0, name: 'Invisible', body: 'The assistants cannot find, read, or identify the company.' },
]

function bandOf(score: number) {
  return BANDS.find((b) => score >= b.min) ?? BANDS[BANDS.length - 1]
}

type Dims = Record<DimKey, number>
type Finding = { title: string; detail: string; cost: string }
type Fix = { action: string; detail: string; effort: 'Low' | 'Medium' | 'High'; impact: 'High' | 'Medium' }
type Signal = { k: string; v: string; tone?: 'ok' | 'warn' | 'bad' }
type Agency = {
  slug: string
  name: string
  domain: string
  region: string
  score: number
  verdict: string
  sub: string
  dims: Dims
  findings: Finding[]
  fixes: Fix[]
  signals: Signal[]
  research: string
}

/* ------------------------------------------------------------------ */
/*  Data (measured 14 September 2026)                                  */
/* ------------------------------------------------------------------ */

const AGENCIES: Agency[] = [
  {
    slug: 'connelly-partners',
    name: 'Connelly Partners',
    domain: 'connellypartners.com',
    region: 'Global · Boston, Dublin, Vancouver',
    score: 76,
    verdict: 'A global agency AI places everywhere but Dublin.',
    sub: 'The global reputation is real and well cited. What is missing is a cleanly resolved Dublin entity and a place on the Irish lists AI draws on, so local queries connect to it.',
    dims: { access: 90, entity: 70, shortlist: 66, extract: 78, authority: 74 },
    findings: [
      { title: 'The Dublin office is the weak node', detail: 'The global brand is well cited, but “Connelly Partners Dublin” is not a cleanly resolved, well-linked entity, so Irish buyer queries do not connect to it.', cost: 'Competes globally, but not locally, in the answer.' },
      { title: 'Mixed structural signals', detail: 'Four h1 tags on the homepage blur what the page is about for a parser reading structure.', cost: 'Weaker machine understanding of its own page.' },
      { title: 'Absent from the Irish shortlist', detail: 'Despite a global reputation, the directory lists AI cites for Dublin agencies do not name it.', cost: 'Local buyers never see it presented.' },
    ],
    fixes: [
      { action: 'Publish a distinct Dublin entity', detail: 'A dedicated, schema-marked Dublin location with its own Organization/LocalBusiness node and sameAs links, so “Connelly Partners Dublin” resolves cleanly.', effort: 'Medium', impact: 'High' },
      { action: 'Collapse to one h1', detail: 'A single, descriptive h1 on the homepage; demote the rest to h2/h3.', effort: 'Low', impact: 'Medium' },
      { action: 'Claim the Irish directory profiles', detail: 'Sortlist, Clutch, Goodfirms and AdForum entries for the Dublin office, consistently named.', effort: 'Medium', impact: 'High' },
      { action: 'Add an Irish case-study hub', detail: 'Server-rendered, quotable case studies tagged to Ireland, to earn local shortlist mentions.', effort: 'Medium', impact: 'Medium' },
    ],
    signals: [
      { k: 'AI crawler access', v: '200 to GPTBot & PerplexityBot, no block', tone: 'ok' },
      { k: 'Render', v: 'Server-rendered, ~118KB', tone: 'ok' },
      { k: 'Readable text', v: '~5,550 characters (richest of the set)', tone: 'ok' },
      { k: 'Schema', v: 'Organization, WebSite, BreadcrumbList', tone: 'ok' },
      { k: 'Headings', v: '4× h1 on the homepage', tone: 'warn' },
      { k: 'Meta description', v: 'Present, descriptive', tone: 'ok' },
    ],
    research:
      'Homepage and robots.txt measured 14 Sep 2026. Off-site corpus assessed from Ad Age (A-List), ZoomInfo, LinkedIn and agency directories; strong globally. The Dublin shortlist read is from the six Irish agency lists AI cites, where it did not appear. Next step: a five-run test of the nine buyer questions on ChatGPT, Claude and Perplexity to lock the local rate.',
  },
  {
    slug: 'headcase',
    name: 'Headcase',
    domain: 'headcase.ie',
    region: 'Strategy & creative · Dublin',
    score: 69,
    verdict: 'The best machine-readable identity here, that almost nobody cites yet.',
    sub: 'The structured data is the strongest of the seven, so AI can already tell who and where it is. What is missing is the off-site corpus that turns a clear identity into a recommendation.',
    dims: { access: 90, entity: 86, shortlist: 34, extract: 72, authority: 42 },
    findings: [
      { title: 'Strongest machine identity of the seven', detail: 'Organization and ProfessionalService data with a contact point, postal address and geo-coordinates. AI can already resolve who and where it is.', cost: 'A foundation most peers simply do not have.' },
      { title: 'Almost nobody vouches for it off-site', detail: 'The directory and press footprint is light, so models have little third-party evidence to cite.', cost: 'Good plumbing, little flowing through it.' },
      { title: '“Headcase” is a common word', detail: 'The name competes with slang and film titles, adding resolution noise.', cost: 'Ambiguity in the one place it wants to be clear.' },
    ],
    fixes: [
      { action: 'Build the off-site corpus', detail: 'Clutch, Sortlist, AdForum and trade-press placements, consistently named, to give assistants a reason to cite it.', effort: 'Medium', impact: 'High' },
      { action: 'Publish original, quotable data', detail: 'A recurring point-of-view or research piece that others link to and models quote.', effort: 'High', impact: 'High' },
      { action: 'Reinforce name disambiguation', detail: 'sameAs links and a consistent “Headcase, Dublin” descriptor across every profile.', effort: 'Low', impact: 'Medium' },
    ],
    signals: [
      { k: 'AI crawler access', v: '200 to GPTBot & PerplexityBot, no block', tone: 'ok' },
      { k: 'Render', v: 'Server-rendered, ~110KB', tone: 'ok' },
      { k: 'Readable text', v: '~3,150 characters', tone: 'ok' },
      { k: 'Schema', v: 'Organization + ProfessionalService, ContactPoint, PostalAddress, GeoCoordinates', tone: 'ok' },
      { k: 'Headings', v: 'Clean single h1', tone: 'ok' },
      { k: 'Meta description', v: 'Present, sharp and quotable', tone: 'ok' },
    ],
    research:
      'Homepage and robots.txt measured 14 Sep 2026. Schema is the strongest observed. Off-site corpus assessed as light across directories and press. Not present in the six Dublin agency lists AI cites. Next step: a five-run test to confirm the low shortlist rate and baseline the corpus build.',
  },
  {
    slug: 'pluto',
    name: 'Pluto',
    domain: 'pluto.ie',
    region: 'Creative & experiential · Dublin',
    score: 63,
    verdict: 'A multi-award agency AI keeps confusing with a planet.',
    sub: 'The site and the work are strong. The problem is the name: “Pluto” points to the dwarf planet, Disney and a TV service, and nothing on the record tells an assistant which Pluto this is.',
    dims: { access: 90, entity: 44, shortlist: 50, extract: 72, authority: 56 },
    findings: [
      { title: 'The name points everywhere but here', detail: '“Pluto” is dominated by the dwarf planet, Disney and Pluto TV. Nothing on the public record tells an assistant which Pluto this is.', cost: 'Even people who half-remember it are pointed elsewhere.' },
      { title: 'Absent from the shortlist AI builds', detail: 'The directory lists assistants cite for Dublin agencies do not name it.', cost: 'Not compared, because not presented.' },
      { title: 'Awards are not machine-visible', detail: 'The recognition is real, but little of that record sits on the pages models read.', cost: 'Reputation that does not reach the answer.' },
    ],
    fixes: [
      { action: 'Disambiguate the name hard', detail: 'A consistent “Pluto (agency, Dublin)” descriptor, plus sameAs to LinkedIn, AdForum and awards bodies.', effort: 'Low', impact: 'High' },
      { action: 'Add an awards + credentials page', detail: 'Server-rendered, structured list of awards and clients so the recognition is readable and quotable.', effort: 'Low', impact: 'Medium' },
      { action: 'Claim the Dublin directory profiles', detail: 'Sortlist, Clutch and Goodfirms entries, consistently named, to enter the shortlist set.', effort: 'Medium', impact: 'High' },
    ],
    signals: [
      { k: 'AI crawler access', v: '200 to GPTBot & PerplexityBot, no block', tone: 'ok' },
      { k: 'Render', v: 'Server-rendered (WordPress), ~179KB', tone: 'ok' },
      { k: 'Readable text', v: '~3,270 characters', tone: 'ok' },
      { k: 'Schema', v: 'Organization, WebSite', tone: 'ok' },
      { k: 'Headings', v: 'Single h1', tone: 'ok' },
      { k: 'Meta description', v: 'Present, strong', tone: 'ok' },
    ],
    research:
      'Homepage and robots.txt measured 14 Sep 2026. Site and copy are strong; the score is lost to a colliding name and a light directory footprint. Not present in the six Dublin agency lists AI cites. Next step: a five-run test plus an entity-collision check across ChatGPT and Perplexity.',
  },
  {
    slug: 'ringers',
    name: 'Ringers',
    domain: 'ringers.ie',
    region: 'Brand & problems · Dublin',
    score: 58,
    verdict: 'A sharp positioning that gives AI almost nothing to read.',
    sub: 'The schema is in place and the idea is clear, but the homepage is thin and the name is a common word. Give the machines real, quotable copy and a distinct identity, and the picture changes quickly.',
    dims: { access: 90, entity: 60, shortlist: 40, extract: 42, authority: 44 },
    findings: [
      { title: 'Very little for AI to read', detail: 'The homepage is thin; the abstract “Proper Problems” line gives a model almost nothing concrete to repeat.', cost: 'Even a willing assistant finds little to say.' },
      { title: '“Ringers” is a common word', detail: 'It collides with boxing, darts and “dead ringer”, adding entity-resolution noise.', cost: 'Harder for AI to be sure a page is about it.' },
      { title: 'Off the directory shortlist', detail: 'The lists AI cites for Dublin agencies do not name it.', cost: 'Absent before the comparison starts.' },
    ],
    fixes: [
      { action: 'Add concrete, quotable copy', detail: 'Plain statements of what it does, for whom, and the outcomes, server-rendered on the homepage and services pages.', effort: 'Low', impact: 'High' },
      { action: 'Strengthen entity + sameAs', detail: 'A consistent descriptor and links to LinkedIn and directory profiles to fix the name ambiguity.', effort: 'Low', impact: 'Medium' },
      { action: 'Enter the directory set', detail: 'Sortlist, Clutch and Goodfirms profiles to appear in the lists assistants quote.', effort: 'Medium', impact: 'High' },
    ],
    signals: [
      { k: 'AI crawler access', v: '200 to GPTBot & PerplexityBot, no block', tone: 'ok' },
      { k: 'Render', v: 'Server-rendered (WordPress), ~79KB', tone: 'ok' },
      { k: 'Readable text', v: '~1,210 characters (thin)', tone: 'bad' },
      { k: 'Schema', v: 'Organization, WebSite, BreadcrumbList', tone: 'ok' },
      { k: 'Headings', v: 'Single h1', tone: 'ok' },
      { k: 'Meta description', v: 'Present', tone: 'ok' },
    ],
    research:
      'Homepage and robots.txt measured 14 Sep 2026. Foundations are sound; the score is held down by how little quotable text sits on the page. Not present in the six Dublin agency lists AI cites. Next step: a five-run test after the copy expansion to measure the lift.',
  },
  {
    slug: 'javelin',
    name: 'Javelin',
    domain: 'javelin.ie',
    region: 'Full-service advertising · Dublin',
    score: 53,
    verdict: 'Good work behind a homepage that does not describe itself.',
    sub: 'No meta description, a generic title and eleven h1 tags mean the lines AI reads first are empty or confused. These are quick, mechanical fixes, and they are holding back everything else.',
    dims: { access: 88, entity: 46, shortlist: 38, extract: 40, authority: 40 },
    findings: [
      { title: 'The homepage does not describe itself', detail: 'There is no meta description, and the title is a generic “Home - Javelin”. The two lines AI reads first are empty or unhelpful.', cost: 'A weak first impression to every machine.' },
      { title: 'Eleven headlines at once', detail: 'Eleven h1 tags on a single page blur what the page is actually about for a parser.', cost: 'Confused machine understanding of its own homepage.' },
      { title: 'Absent, and hard to place', detail: '“Javelin” collides with the sport, the missile and the car, and the directory lists do not name it.', cost: 'Neither found nor easily identified.' },
    ],
    fixes: [
      { action: 'Write a real title and meta description', detail: 'A descriptive <title> and a meta description that states what the agency is and does.', effort: 'Low', impact: 'High' },
      { action: 'Collapse to one h1', detail: 'A single homepage h1; demote the other ten to h2/h3.', effort: 'Low', impact: 'Medium' },
      { action: 'Disambiguate the name', detail: 'Consistent “Javelin, advertising, Dublin” descriptor and sameAs links across profiles.', effort: 'Low', impact: 'Medium' },
      { action: 'Enter the directory set', detail: 'Sortlist, Clutch and Goodfirms profiles to appear in the lists assistants quote.', effort: 'Medium', impact: 'High' },
    ],
    signals: [
      { k: 'AI crawler access', v: '200 to GPTBot & PerplexityBot, no block', tone: 'ok' },
      { k: 'Render', v: 'Server-rendered (WordPress), ~51KB', tone: 'ok' },
      { k: 'Readable text', v: '~2,040 characters', tone: 'warn' },
      { k: 'Schema', v: 'Organization, WebSite, BreadcrumbList', tone: 'ok' },
      { k: 'Headings', v: '11× h1 (worst hygiene of the set)', tone: 'bad' },
      { k: 'Meta description', v: 'Missing', tone: 'bad' },
    ],
    research:
      'Homepage and robots.txt measured 14 Sep 2026. Nothing here is deep or expensive: a title, a meta description and a single h1 repair the first thing every AI reads. Not present in the six Dublin agency lists AI cites. Next step: a five-run test after the fundamentals are fixed.',
  },
  {
    slug: 'boys-and-girls',
    name: 'Boys + Girls',
    domain: 'boysandgirls.ie',
    region: 'Ireland’s most-awarded · Dublin',
    score: 50,
    verdict: 'Ireland’s most-awarded agency, and AI cannot tell it is you.',
    sub: 'The creative record is exceptional. None of it is machine-readable: there is no Organization schema, and the name is not even in the homepage title. This is the widest reputation-to-visibility gap of the seven.',
    dims: { access: 88, entity: 20, shortlist: 44, extract: 40, authority: 64 },
    findings: [
      { title: 'The most-awarded agency is invisible to a machine', detail: 'There is no Organization schema at all. The authority that wins EFFIEs sits nowhere an AI can read it.', cost: 'The record that should sell it never reaches the answer.' },
      { title: 'The name is missing from its own title', detail: 'Title and meta are both “Great Work WORKS”. The words “Boys + Girls” are not in the tag AI reads first.', cost: 'Hard to identify as itself.' },
      { title: 'Absent from the AI shortlist', detail: 'Despite the awards, the directory lists assistants cite for Dublin agencies do not name it.', cost: 'The best work in the room, and not in the answer.' },
    ],
    fixes: [
      { action: 'Add Organization schema', detail: 'A full Organization node (name, logo, sameAs, awards, address) so the entity exists for a machine.', effort: 'Low', impact: 'High' },
      { action: 'Put the name in the metadata', detail: 'A <title> and meta description that lead with “Boys + Girls”, not a tagline.', effort: 'Low', impact: 'High' },
      { action: 'Make the awards machine-readable', detail: 'A structured, server-rendered awards and credentials page the models can quote.', effort: 'Medium', impact: 'High' },
      { action: 'Claim the directory profiles', detail: 'Consistently named Sortlist, Clutch, Goodfirms and AdForum entries.', effort: 'Medium', impact: 'Medium' },
    ],
    signals: [
      { k: 'AI crawler access', v: '200 to GPTBot & PerplexityBot, no block', tone: 'ok' },
      { k: 'Render', v: 'Server-rendered, ~60KB', tone: 'ok' },
      { k: 'Readable text', v: '~1,724 characters', tone: 'warn' },
      { k: 'Schema', v: 'None (no Organization entity)', tone: 'bad' },
      { k: 'Headings', v: '6× h1', tone: 'warn' },
      { k: 'Meta description', v: '“Great Work WORKS” (name absent)', tone: 'bad' },
    ],
    research:
      'Homepage and robots.txt measured 14 Sep 2026. No agency here has more to gain: reputation is the best in the market, almost none of it machine-readable. Not present in the six Dublin agency lists AI cites. Next step: schema and metadata fixes, then a five-run test to measure the conversion of authority into visibility.',
  },
  {
    slug: 'curious-orange',
    name: 'Curious Orange',
    domain: 'curious-orange.com',
    region: 'Design & brand',
    score: 35,
    verdict: 'A beautiful site with almost nothing for AI to read.',
    sub: 'The homepage is heavy on visuals and light on text, about 555 readable characters, with no company entity defined. AI is not blocked; there is simply little to find.',
    dims: { access: 55, entity: 28, shortlist: 30, extract: 20, authority: 40 },
    findings: [
      { title: 'The homepage is nearly empty to a reader', detail: 'The page ships around 635KB, but only about 555 characters of server-rendered text. A model finds almost nothing to read or repeat.', cost: 'Nothing for an assistant to recommend it from.' },
      { title: 'No company entity for AI to grasp', detail: 'Only WebSite schema and an empty meta description. No Organization identity that tells a machine what the business is.', cost: 'AI cannot tell what it does or who it is.' },
      { title: 'Absent from the shortlist', detail: 'With little to read and no entity, the directory lists AI cites do not name it.', cost: 'Effectively invisible in the answer today.' },
    ],
    fixes: [
      { action: 'Put real, server-rendered text on the page', detail: 'Describe the work, the services and the clients in crawlable HTML, not only in visuals or client-side script.', effort: 'Medium', impact: 'High' },
      { action: 'Add an Organization entity', detail: 'Organization schema plus a meta description so a machine can identify the business.', effort: 'Low', impact: 'High' },
      { action: 'Publish quotable case studies', detail: 'Server-rendered project pages with outcomes, to give models something to cite.', effort: 'Medium', impact: 'Medium' },
    ],
    signals: [
      { k: 'AI crawler access', v: '200; standard Squarespace robots (not blocked)', tone: 'warn' },
      { k: 'Render', v: 'Squarespace, ~635KB page', tone: 'warn' },
      { k: 'Readable text', v: '~555 characters (near-empty to a reader)', tone: 'bad' },
      { k: 'Schema', v: 'WebSite only (no Organization)', tone: 'bad' },
      { k: 'Headings', v: 'Single h1', tone: 'ok' },
      { k: 'Meta description', v: 'Empty', tone: 'bad' },
    ],
    research:
      'Homepage and robots.txt measured 14 Sep 2026. Not blocked: robots.txt is the standard Squarespace file, so crawlers are allowed, there is simply little to read. Machine access is scored down because the crawler receives a near-empty shell. Not present in the six Dublin agency lists AI cites. Next step: content and schema work, then a five-run test.',
  },
]

/* ------------------------------------------------------------------ */
/*  Charts                                                             */
/* ------------------------------------------------------------------ */

function polar(cx: number, cy: number, r: number, i: number, n: number) {
  const a = (-90 + (i * 360) / n) * (Math.PI / 180)
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const
}

function Radar({ dims, compare }: { dims: Dims; compare?: Dims }) {
  const cx = 170
  const cy = 158
  const R = 108
  const n = AXES.length
  const rings = [0.25, 0.5, 0.75, 1]

  const ringPath = (f: number) =>
    AXES.map((_, i) => {
      const [x, y] = polar(cx, cy, R * f, i, n)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ') + ' Z'

  const dataPath = (d: Dims) =>
    AXES.map((ax, i) => {
      const [x, y] = polar(cx, cy, R * (d[ax.key] / 100), i, n)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ') + ' Z'

  return (
    <svg viewBox="-24 0 388 300" role="img" aria-label="Five-dimension radar chart" style={{ width: '100%', height: 'auto' }}>
      {rings.map((f) => (
        <path key={f} d={ringPath(f)} fill="none" stroke="var(--color-line)" strokeWidth={1} />
      ))}
      {AXES.map((_, i) => {
        const [x, y] = polar(cx, cy, R, i, n)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-line)" strokeWidth={1} />
      })}
      {compare && (
        <path d={dataPath(compare)} fill="var(--color-brass)" fillOpacity={0.08} stroke="var(--color-brass-soft)" strokeWidth={1.5} strokeDasharray="4 4" />
      )}
      <path d={dataPath(dims)} fill="var(--color-cognac)" fillOpacity={0.2} stroke="var(--color-cognac)" strokeWidth={2} />
      {AXES.map((ax, i) => {
        const [px, py] = polar(cx, cy, R * (dims[ax.key] / 100), i, n)
        return <circle key={ax.key} cx={px} cy={py} r={3.2} fill="var(--color-cognac-deep)" />
      })}
      {AXES.map((ax, i) => {
        const [lx, ly] = polar(cx, cy, R + 22, i, n)
        const anchor = Math.cos((-90 + (i * 360) / n) * (Math.PI / 180))
        const ta = anchor > 0.2 ? 'start' : anchor < -0.2 ? 'end' : 'middle'
        return (
          <text key={ax.key} x={lx} y={ly} textAnchor={ta} dominantBaseline="middle" fontSize={11} fontWeight={500} fill="var(--color-ink-60)" style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>
            {ax.short}
          </text>
        )
      })}
    </svg>
  )
}

function Gauge({ score }: { score: number }) {
  const L = Math.PI * 100 // semicircle length ≈ 314.16
  const off = L * (1 - score / 100)
  const band = bandOf(score)
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 140" style={{ width: '100%', maxWidth: '15rem', height: 'auto' }} role="img" aria-label={`AI Visibility Score ${score} out of 100`}>
        <defs>
          <linearGradient id="gaugegrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-cognac-deep)" />
            <stop offset="1" stopColor="var(--color-cognac-soft)" />
          </linearGradient>
        </defs>
        <path d="M20 128 A 100 100 0 0 1 220 128" fill="none" stroke="var(--color-line)" strokeWidth={14} />
        <path d="M20 128 A 100 100 0 0 1 220 128" fill="none" stroke="url(#gaugegrad)" strokeWidth={14} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={off} />
        <text x="120" y="108" textAnchor="middle" fontSize={54} fontWeight={300} fill="var(--color-ink)" style={{ fontFamily: 'var(--font-display, Jost, sans-serif)' }}>
          {score}
        </text>
        <text x="120" y="128" textAnchor="middle" fontSize={13} fill="var(--color-ink-45)" style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>
          out of 100
        </text>
      </svg>
      <p className="mt-2 font-sans text-label uppercase tracking-[0.2em] text-cognac-deep">{band.name}</p>
    </div>
  )
}

function DimBar({ label, q, value, weight }: { label: string; q: string; value: number; weight: number }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
      <div className="sm:col-span-4">
        <p className="font-sans text-caption font-medium text-ink-80">
          {label} <span className="text-ink-45">· {weight} pts</span>
        </p>
        <p className="font-sans text-label leading-snug text-ink-45">{q}</p>
      </div>
      <div className="sm:col-span-6">
        <div className="h-2.5 overflow-hidden rounded-full border border-line bg-canvas-2">
          <div
            className="h-full rounded-full"
            style={{ width: `${value}%`, background: 'linear-gradient(90deg, var(--color-cognac-soft), var(--color-cognac))' }}
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <span className="font-display tabular-nums text-ink" style={{ fontSize: '1.15rem' }}>{value}</span>
        <span className="font-sans text-label text-ink-45"> / 100</span>
      </div>
    </div>
  )
}

const toneCls: Record<NonNullable<Signal['tone']>, string> = {
  ok: 'text-brass-deep',
  warn: 'text-cognac-deep',
  bad: 'text-alert',
}
const toneDot: Record<NonNullable<Signal['tone']>, string> = {
  ok: 'var(--color-brass)',
  warn: 'var(--color-cognac)',
  bad: 'var(--color-alert)',
}

/* ------------------------------------------------------------------ */
/*  Report panel                                                       */
/* ------------------------------------------------------------------ */

function Report({ a }: { a: Agency }) {
  const band = bandOf(a.score)
  return (
    <div>
      {/* header */}
      <div className="grid gap-8 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <Eyebrow>{a.region}</Eyebrow>
          <h2 className="mt-3 font-display text-ink" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.5rem)', lineHeight: 1.08 }}>
            {a.verdict}
          </h2>
          <p className="mt-4 max-w-xl font-sans text-body leading-relaxed text-ink-60">{a.sub}</p>
          <a
            href={`https://www.${a.domain}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line mt-5 inline-flex items-center gap-1.5 font-sans text-caption"
          >
            {a.domain}
            <svg
              viewBox="0 0 12 12"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" />
            </svg>
          </a>
        </div>
        <div className="md:col-span-5">
          <div className="rounded-2xl border border-line bg-paper p-6">
            <Gauge score={a.score} />
            <p className="mt-3 text-center font-sans text-caption leading-relaxed text-ink-60">{band.body}</p>
          </div>
        </div>
      </div>

      {/* radar + dimension breakdown */}
      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <Eyebrow>The five dimensions</Eyebrow>
          <div className="mt-4 rounded-2xl border border-line bg-paper p-4">
            <Radar dims={a.dims} />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-5">
            {AXES.map((ax) => (
              <DimBar key={ax.key} label={ax.label} q={ax.q} value={a.dims[ax.key]} weight={ax.w} />
            ))}
          </div>
        </div>
      </div>

      {/* findings */}
      <div className="mt-14">
        <Eyebrow>Three findings</Eyebrow>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {a.findings.map((f, i) => (
            <div key={i} className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6">
              <span className="font-display text-brass" style={{ fontSize: '1.5rem', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-display text-ink" style={{ fontSize: '1.15rem', lineHeight: 1.2 }}>{f.title}</h3>
              <p className="mt-2 font-sans text-caption leading-relaxed text-ink-60">{f.detail}</p>
              <div className="mt-auto pt-4">
                <p className="font-sans text-label uppercase tracking-[0.16em] text-cognac-deep">What it costs</p>
                <p className="mt-1 font-sans text-caption text-ink-80">{f.cost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* fixes */}
      <div className="mt-14">
        <Eyebrow>Possible fixes, in priority order</Eyebrow>
        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          {a.fixes.map((fx, i) => (
            <div
              key={i}
              className="grid gap-3 bg-paper p-6 sm:grid-cols-12 sm:items-baseline"
              style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-line)' }}
            >
              <div className="sm:col-span-1">
                <span className="font-display text-brass" style={{ fontSize: '1.3rem' }}>{i + 1}</span>
              </div>
              <div className="sm:col-span-7">
                <h3 className="font-display text-ink" style={{ fontSize: '1.12rem' }}>{fx.action}</h3>
                <p className="mt-1 font-sans text-caption leading-relaxed text-ink-60">{fx.detail}</p>
              </div>
              <div className="sm:col-span-4 flex gap-2 sm:justify-end">
                <span className="rounded-full border border-line px-3 py-1 font-sans text-label text-ink-60">
                  Effort: <b className="font-semibold text-ink">{fx.effort}</b>
                </span>
                <span className="rounded-full border border-line px-3 py-1 font-sans text-label text-ink-60">
                  Impact: <b className="font-semibold text-cognac-deep">{fx.impact}</b>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* measured signals + research */}
      <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-6">
          <Eyebrow>Measured signals</Eyebrow>
          <div className="mt-5 flex-1 overflow-hidden rounded-2xl border border-line bg-paper">
            {a.signals.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4"
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-line)' }}
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: toneDot[s.tone ?? 'ok'] }} />
                <div className="flex-1">
                  <p className="font-sans text-label uppercase tracking-[0.1em] text-ink-45">{s.k}</p>
                  <p className={`font-sans text-caption ${toneCls[s.tone ?? 'ok']}`}>{s.v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:col-span-6">
          <Eyebrow>Research &amp; method</Eyebrow>
          <div className="mt-5 flex-1 rounded-2xl border border-line border-l-2 border-l-brass bg-paper p-6">
            <p className="font-sans text-body leading-relaxed text-ink-60">{a.research}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Overview panel                                                     */
/* ------------------------------------------------------------------ */

function Overview({ onPick }: { onPick: (slug: string) => void }) {
  const ranked = [...AGENCIES].sort((x, y) => y.score - x.score)
  const fill = (s: number) =>
    s >= 61
      ? 'linear-gradient(90deg, var(--color-brass), var(--color-brass-soft))'
      : s >= 41
        ? 'linear-gradient(90deg, var(--color-cognac-soft), var(--color-cognac))'
        : 'linear-gradient(90deg, var(--color-cognac-soft), var(--color-alert))'
  return (
    <div>
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <h2 className="font-display text-ink" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.4rem)' }}>
            Seven agencies, one measure.
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-body leading-relaxed text-ink-60">
            Every agency was scanned the same way on the same day and scored on the
            Rothenhall AI Visibility framework. The headline finding: none is blocked
            from AI, and none appears in the shortlist an assistant builds for
            &ldquo;best agency in Dublin&rdquo;. Great work is not the gap. Being
            readable and being cited is.
          </p>
        </div>
        <div className="md:col-span-4">
          <div className="rounded-2xl border border-line bg-paper p-6">
            <p className="font-display text-brass-deep" style={{ fontSize: '2.6rem', lineHeight: 1 }}>0 / 7</p>
            <p className="mt-2 font-sans text-caption leading-relaxed text-ink-60">
              named in the six Dublin agency lists AI assistants cite for that query.
            </p>
          </div>
        </div>
      </div>

      {/* league table */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-line">
        {ranked.map((a, i) => {
          const band = bandOf(a.score)
          return (
            <button
              key={a.slug}
              onClick={() => onPick(a.slug)}
              className="grid w-full grid-cols-[2rem_1fr_auto] items-center gap-4 bg-paper p-4 text-left transition-colors hover:bg-canvas-2 sm:grid-cols-[2.5rem_11rem_1fr_5rem_6rem] sm:px-6"
              style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-line)' }}
            >
              <span className="font-display text-brass tabular-nums" style={{ fontSize: '1.4rem' }}>{i + 1}</span>
              <span className="font-display text-ink" style={{ fontSize: '1.15rem' }}>
                {a.name}
                <span className="block font-sans text-label text-ink-45">{a.domain}</span>
              </span>
              <span className="col-span-3 mt-2 sm:col-span-1 sm:mt-0">
                <span className="block h-2 overflow-hidden rounded-full border border-line bg-canvas-2">
                  <span className="block h-full rounded-full" style={{ width: `${a.score}%`, background: fill(a.score) }} />
                </span>
              </span>
              <span className="hidden text-right font-display tabular-nums text-ink sm:block" style={{ fontSize: '1.4rem' }}>{a.score}</span>
              <span className="hidden text-right font-sans text-label uppercase tracking-[0.1em] text-ink-45 sm:block">{band.name}</span>
            </button>
          )
        })}
      </div>

      {/* framework */}
      <div className="mt-16">
        <Eyebrow>The framework</Eyebrow>
        <h3 className="mt-3 font-display text-ink" style={{ fontSize: '1.6rem' }}>Five weighted dimensions.</h3>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {AXES.map((d) => (
            <div key={d.key} className="bg-paper p-6">
              <p className="font-display text-brass" style={{ fontSize: '2rem', lineHeight: 1 }}>
                {d.w}<span className="ml-1 font-sans text-label text-ink-45">pts</span>
              </p>
              <h4 className="mt-3 font-sans text-body font-semibold text-ink">{d.label}</h4>
              <p className="mt-2 font-sans text-caption leading-relaxed text-ink-60">{d.q}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {BANDS.slice().reverse().map((b) => (
            <div key={b.name} className="rounded-xl border border-line bg-paper p-5">
              <p className="font-display text-ink" style={{ fontSize: '1.15rem' }}>{b.name}</p>
              <p className="mt-1 font-sans text-caption leading-relaxed text-ink-60">{b.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl font-sans text-caption leading-relaxed text-ink-45">
          Machine access, entity clarity, on-page extractability and heading hygiene
          are measured directly from each homepage and robots.txt on 14 September 2026.
          Shortlist presence and authority are assessed from the directory and press
          lists AI assistants cite for Dublin agencies, checked the same day. Sub-scores
          roll up to the composite by the weights above. AI answers are
          non-deterministic; we report tendencies and rates, never a guaranteed
          placement. A five-run test per buyer question is the standard next step to
          lock each shortlist rate.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function Diagnostics() {
  const [active, setActive] = useState<string>('overview')
  const current = AGENCIES.find((a) => a.slug === active)

  const tabs = [{ slug: 'overview', name: 'Overview' }, ...AGENCIES.map((a) => ({ slug: a.slug, name: a.name }))]

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-night text-canvas">
        <Container className="pt-20 pb-16 sm:pt-24 sm:pb-20">
          <Eyebrow className="eyebrow-light">Rothenhall × Napkin · Competitive diagnostic</Eyebrow>
          <h1 className="mt-8 font-display text-canvas" style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 300, lineHeight: 1.02, letterSpacing: '-0.02em', maxWidth: '20ch' }}>
            Where seven creative agencies stand in the answer.
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-body-lg leading-relaxed text-canvas/75">
            A comprehensive AI-visibility diagnostic, one score and five sub-scores per
            agency, on the Rothenhall framework. Switch between agencies to see each
            radar, its findings, the prioritised fixes, and the research behind the
            numbers.
          </p>
        </Container>
      </section>

      {/* Tabs */}
      <div className="sticky top-[4.75rem] z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
        <Container>
          <div className="flex gap-1 overflow-x-auto py-3" role="tablist" aria-label="Agencies">
            {tabs.map((t) => {
              const on = t.slug === active
              return (
                <button
                  key={t.slug}
                  role="tab"
                  id={`tab-${t.slug}`}
                  aria-controls={`panel-${t.slug}`}
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(t.slug)}
                  className={`shrink-0 rounded-full px-4 py-2 font-sans text-caption transition-colors ${
                    on ? 'bg-ink text-canvas' : 'text-ink-60 hover:bg-canvas-2 hover:text-ink'
                  }`}
                >
                  {t.name}
                </button>
              )
            })}
          </div>
        </Container>
      </div>

      {/* Panel */}
      <section>
        <Container className="py-16 sm:py-20">
          <div
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            tabIndex={0}
          >
            {current ? <Report a={current} /> : <Overview onPick={setActive} />}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-night text-canvas">
        <Container className="py-20 sm:py-24 text-center">
          <h2 className="mx-auto font-display text-canvas" style={{ fontSize: 'clamp(1.8rem,3.6vw,2.6rem)', fontWeight: 300, maxWidth: '22ch' }}>
            Great work is not the gap. Being readable is.
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-body leading-relaxed text-canvas/75">
            Every engagement opens with a diagnostic like this one: the score, the five
            sub-scores, and the specific, reproducible reasons behind each. The findings
            are yours to keep.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/contact" className="btn btn-light">Request a diagnostic</Link>
          </div>
        </Container>
      </section>
    </>
  )
}
