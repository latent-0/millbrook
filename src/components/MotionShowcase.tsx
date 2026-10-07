import { useContext, useEffect, useState, type ReactNode } from 'react'
import { Eyebrow, G, LiveCtx, Meter, Pin, Spark, Tile, useInView, useReducedMotion } from './CailyxShowcase'
import { joinMotionWaitlist, type WaitlistInput } from '../server/inquiry'

/* ------------------------------------------------------------------ */
/*  Motion: the product screens rebuilt in code, plus the launch pass. */
/*  Mirrors the real Motion studio: same navigation, same tiles, same  */
/*  Graphite surfaces and status colours. The sample account is the    */
/*  Rothenhall feed; every figure is illustrative.                     */
/* ------------------------------------------------------------------ */

const M = { good: '#2f7a52', goodBg: '#e8f1ec', warn: '#9a5b0b', warnBg: '#f6eddf', bad: '#b3261e', badBg: '#f8e8e7', navy: '#26282b' }

const PHOTO = {
  desk: '/images/story-absent.jpg',
  mic: '/images/story-ask.jpg',
  door: '/images/story-recommend.jpg',
  studio: '/images/story-studio.jpg',
  team: '/images/story-team.jpg',
  hall: '/images/reveal-hall.jpg',
}

function Photo({ src, ratio = '1 / 1', className = '' }: { src: string; ratio?: string; className?: string }) {
  return (
    <span className={`relative block overflow-hidden ${className}`} style={{ aspectRatio: ratio, background: G.lineStrong }}>
      <img src={src} alt="" loading="lazy" className="size-full object-cover" />
    </span>
  )
}

export function MotionWordmark({ size = 24, dark }: { size?: number; dark?: boolean }) {
  return (
    <span className="inline-flex items-center" style={{ gap: size * 0.42 }}>
      <img src={dark ? '/brand/motion-mark-white.png' : '/brand/motion-mark.png'} alt="" style={{ height: size * 0.95, width: 'auto' }} />
      <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 725, letterSpacing: '-.05em', fontSize: size, lineHeight: 1, color: dark ? '#fbf9f3' : G.ink }}>Motion</span>
    </span>
  )
}

/* ------------------------------ chrome ----------------------------- */

const NAV = [
  { section: 'Studio', items: ['Overview', 'Planner', 'Content Lab', 'Pre-flight check'] },
  { section: 'Engage', items: ['Inbox', 'Automations'] },
  { section: 'Measure', items: ['Analytics', 'Connections'] },
]

function MotionSidebar({ active }: { active: string }) {
  return (
    <aside className="hidden shrink-0 flex-col @3xl:flex" style={{ width: 172, borderRight: `1px solid ${G.line}`, background: '#f9f9f9', padding: '14px 10px' }}>
      <div className="px-2 pb-4">
        <MotionWordmark size={19} />
      </div>
      {NAV.map((s) => (
        <div key={s.section} className="mb-2.5">
          <p className="px-2 pb-1" style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: G.muted, fontWeight: 625 }}>{s.section}</p>
          {s.items.map((i) => {
            const on = i === active
            return (
              <div key={i} className="flex items-center gap-2 rounded-md px-2 py-1" style={{ fontSize: 11.5, color: on ? G.ink : G.soft, fontWeight: on ? 625 : 425, background: on ? 'rgba(49,51,55,.08)' : 'transparent' }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: on ? G.ink : G.lineStrong }} />
                {i}
              </div>
            )
          })}
        </div>
      ))}
      <div className="mt-auto flex items-center gap-2 rounded-lg px-2 py-2" style={{ background: G.surface, boxShadow: `0 0 0 1px ${G.line}` }}>
        <img src="/brand/rothenhall-monogram.png" alt="" className="size-6 rounded-full" style={{ background: '#f7f3ea', padding: 2 }} />
        <span style={{ fontSize: 10.5, lineHeight: 1.25 }}>
          <b style={{ fontWeight: 625 }}>Rothenhall</b>
          <br />
          <span style={{ color: G.muted }}>3 channels</span>
        </span>
      </div>
    </aside>
  )
}

function Head({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <header className="mb-3.5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h4 className="mt-1" style={{ fontSize: 24, fontWeight: 725, color: G.ink, letterSpacing: '-.04em', lineHeight: 1.1 }}>{title}</h4>
      {sub && <p className="mt-1" style={{ fontSize: 12, color: G.soft }}>{sub}</p>}
    </header>
  )
}

function Chip({ tone = 'neutral', children }: { tone?: 'good' | 'warn' | 'bad' | 'neutral'; children: ReactNode }) {
  const map = { good: [M.good, M.goodBg], warn: [M.warn, M.warnBg], bad: [M.bad, M.badBg], neutral: [G.soft, '#f1f1f2'] } as const
  const [fg, bg] = map[tone]
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full" style={{ padding: '2px 8px', fontSize: 10.5, fontWeight: 625, color: fg, background: bg }}>{children}</span>
  )
}

function useLive() {
  return useContext(LiveCtx)
}

/* ------------------------------ screens ---------------------------- */

function AreaChart() {
  const live = useLive()
  const views = 'M0,70 C20,64 34,52 52,50 S86,58 104,42 S138,30 156,34 S190,16 220,10'
  const eng = 'M0,78 C20,74 34,68 52,66 S86,70 104,60 S138,54 156,56 S190,44 220,38'
  return (
    <svg viewBox="0 0 220 84" preserveAspectRatio="none" className="w-full" style={{ height: 96 }}>
      {[20, 42, 64].map((y) => (
        <line key={y} x1="0" x2="220" y1={y} y2={y} stroke="rgba(255,255,255,.08)" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={`${views} L220,84 L0,84 Z`} fill="#fff" opacity={live ? 0.08 : 0} style={{ transition: 'opacity 1s ease .6s' }} />
      <path d={views} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={live ? 0 : 1} style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(.23,1,.32,1) .2s' }} />
      <path d={eng} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" opacity={live ? 1 : 0} style={{ transition: 'opacity 1s ease 1s' }} />
    </svg>
  )
}

const DAYS = [
  { d: 'Mon', n: 12, today: false, posts: [{ t: '9:00 am', img: PHOTO.studio }] },
  { d: 'Tue', n: 13, today: true, posts: [{ t: '12:30 pm', img: PHOTO.mic }, { t: '6:00 pm', img: PHOTO.desk }] },
  { d: 'Wed', n: 14, today: false, posts: [] as { t: string; img: string }[] },
  { d: 'Thu', n: 15, today: false, posts: [{ t: '8:30 am', img: PHOTO.door }] },
  { d: 'Fri', n: 16, today: false, posts: [{ t: '1:00 pm', img: PHOTO.team }] },
  { d: 'Sat', n: 17, today: false, posts: [] as { t: string; img: string }[] },
  { d: 'Sun', n: 18, today: false, posts: [{ t: '10:00 am', img: PHOTO.hall }] },
]

function OverviewScreen() {
  const live = useLive()
  return (
    <>
      <Head eyebrow="Tuesday, 13 October" title="Good morning" sub="Here’s what’s moving across your social channels." />
      <div className="mb-3 flex items-start gap-2.5 rounded-xl px-3 py-2.5" style={{ background: '#f1f1f2', fontSize: 11.5, lineHeight: 1.5, color: G.ink }}>
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: G.ink }} />
        <span>
          Reels are earning 2.4x the views of photos. Wednesday and Saturday have nothing scheduled.
          <b style={{ fontWeight: 625, marginLeft: 8 }}>Plan Wednesday</b>
        </span>
      </div>
      <div className="grid gap-3 @2xl:grid-cols-4">
        <div className="relative rounded-[14px] p-4 @2xl:col-span-2" style={{ background: M.navy, color: '#fff' }}>
          <Pin n={1} />
          <p style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 525, color: 'rgba(255,255,255,.6)' }}>Views · last 30 days</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <strong style={{ fontSize: 38, fontWeight: 725, letterSpacing: '-.05em', lineHeight: 1 }}>48.2K</strong>
            <span style={{ fontSize: 11.5, fontWeight: 625, color: '#86d4a8' }}>+18%</span>
          </div>
          <p className="mt-1" style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>2.3K engagements · dashed line shows engagements</p>
          <div className="mt-2">
            <AreaChart />
          </div>
        </div>
        <Tile className="@2xl:row-span-2 !p-3">
          <Pin n={2} />
          <div className="flex items-center justify-between pr-6">
            <Eyebrow>Up next</Eyebrow>
          </div>
          <div className="mt-2 overflow-hidden rounded-lg" style={{ boxShadow: `0 0 0 1px ${G.line}` }}>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <img src="/brand/rothenhall-monogram.png" alt="" className="size-5 rounded-full" style={{ background: '#f7f3ea', padding: 1.5 }} />
              <span style={{ fontSize: 10.5, fontWeight: 625 }}>rothenhall</span>
              <span className="ml-auto" style={{ fontSize: 9, color: G.muted }}>Instagram</span>
            </div>
            <Photo src={PHOTO.mic} />
            <p className="px-2 py-1.5" style={{ fontSize: 10, lineHeight: 1.4 }}>
              <b style={{ fontWeight: 625 }}>rothenhall</b> Why a screenshot of one answer is not a measurement.
            </p>
          </div>
          <p className="mt-2" style={{ fontSize: 10.5, color: G.soft }}>
            <b style={{ fontWeight: 625, color: G.ink }}>Today, 12:30 pm</b> · Reel
          </p>
        </Tile>
        <div className="flex flex-col gap-3">
          <Tile className="!p-3">
            <Eyebrow>Engagement rate</Eyebrow>
            <p className="mt-1" style={{ fontSize: 24, fontWeight: 725, letterSpacing: '-.05em', lineHeight: 1.1 }}>4.7%</p>
            <Spark pts={[3.8, 4.1, 3.9, 4.4, 4.2, 4.6, 4.7]} height={22} tone="neutral" />
          </Tile>
          <Tile className="!p-3">
            <Pin n={3} />
            <Eyebrow>Queue</Eyebrow>
            <p className="mt-1" style={{ fontSize: 24, fontWeight: 725, letterSpacing: '-.05em', lineHeight: 1.1 }}>
              7<small style={{ fontSize: 11, fontWeight: 425, color: G.muted, letterSpacing: 0, marginLeft: 4 }}>scheduled</small>
            </p>
            <div className="mt-2 flex gap-1">
              {DAYS.map((d) => (
                <i key={d.d} style={{ flex: 1, height: 5, borderRadius: 3, background: d.posts.length ? G.ink : G.line }} />
              ))}
            </div>
          </Tile>
        </div>
        <Tile className="@2xl:col-span-4 !p-3">
          <Eyebrow>This week</Eyebrow>
          <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
            {DAYS.map((d, c) => (
              <div key={d.d} className="rounded-lg p-1.5" style={{ background: d.today ? '#fff' : '#f9f9f9', boxShadow: `0 0 0 1px ${d.today ? G.ink : G.line}`, minHeight: 92 }}>
                <p className="flex justify-between" style={{ fontSize: 9.5, color: G.muted }}>
                  <span>{d.d}</span>
                  <b style={{ color: G.ink, fontWeight: 625 }}>{d.n}</b>
                </p>
                <div className="mt-1 space-y-1">
                  {d.posts.map((p, i) => (
                    <div key={i} className="overflow-hidden rounded" style={{ opacity: live ? 1 : 0, transform: live ? 'none' : 'translateY(6px)', transition: `all .5s cubic-bezier(.23,1,.32,1) ${c * 80 + i * 100}ms` }}>
                      <Photo src={p.img} ratio="16 / 10" />
                      <span style={{ fontSize: 8.5, color: G.soft }}>{p.t}</span>
                    </div>
                  ))}
                  {!d.posts.length && (
                    <span className="grid place-items-center rounded" style={{ height: 40, border: `1px dashed ${G.lineStrong}`, color: G.muted, fontSize: 14 }}>+</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Tile>
      </div>
    </>
  )
}

const PARTS = ['Morning', 'Midday', 'Afternoon', 'Evening', 'Late']
const PLAN: Record<string, { img: string; t: string; f: string } | undefined> = {
  '0-0': { img: PHOTO.studio, t: '9:00 am', f: 'Carousel' },
  '1-1': { img: PHOTO.mic, t: '12:30 pm', f: 'Reel' },
  '1-3': { img: PHOTO.desk, t: '6:00 pm', f: 'Text' },
  '3-0': { img: PHOTO.door, t: '8:30 am', f: 'Photo' },
  '4-1': { img: PHOTO.team, t: '1:00 pm', f: 'Reel' },
  '6-0': { img: PHOTO.hall, t: '10:00 am', f: 'Photo' },
}
const BEST = new Set(['2-3', '4-3'])

function PlannerScreen() {
  const live = useLive()
  return (
    <>
      <Head eyebrow="Studio" title="Planner" />
      <div className="mb-3 flex flex-wrap items-center gap-2" style={{ fontSize: 11 }}>
        <span className="flex overflow-hidden rounded-lg" style={{ boxShadow: `0 0 0 1px ${G.lineStrong}` }}>
          <span className="px-3 py-1.5" style={{ background: G.ink, color: '#fff', fontWeight: 625 }}>Week</span>
          <span className="px-3 py-1.5" style={{ color: G.soft }}>Month</span>
        </span>
        <span className="rounded-lg px-3 py-1.5" style={{ boxShadow: `0 0 0 1px ${G.lineStrong}`, color: G.ink }}>All channels ▾</span>
        <span className="ml-auto" style={{ color: G.soft }}>12 – 18 October</span>
      </div>
      <Tile className="overflow-x-auto !p-2">
        <Pin n={1} />
        <div style={{ minWidth: 560 }}>
          <div className="grid" style={{ gridTemplateColumns: '58px repeat(7, 1fr)', gap: 4 }}>
            <span />
            {DAYS.map((d) => (
              <span key={d.d} className="text-center" style={{ fontSize: 10, color: G.muted, padding: '2px 0' }}>
                {d.d} <b style={{ color: G.ink, fontWeight: 625 }}>{d.n}</b>
              </span>
            ))}
            {PARTS.map((part, r) => (
              <div key={part} className="contents">
                <span style={{ fontSize: 9.5, color: G.muted, paddingTop: 6 }}>{part}</span>
                {DAYS.map((_, c) => {
                  const post = PLAN[`${c}-${r}`]
                  const best = BEST.has(`${c}-${r}`)
                  return (
                    <div key={c} className="rounded-md p-1" style={{ minHeight: 46, background: best ? 'rgba(47,122,82,.07)' : '#f9f9f9', boxShadow: `0 0 0 1px ${best ? 'rgba(47,122,82,.35)' : G.line}` }}>
                      {post ? (
                        <div className="flex items-center gap-1.5" style={{ opacity: live ? 1 : 0, transform: live ? 'none' : 'translateY(6px)', transition: `all .5s cubic-bezier(.23,1,.32,1) ${(c + r) * 90}ms` }}>
                          <Photo src={post.img} className="w-7 shrink-0 rounded" />
                          <span style={{ fontSize: 8.5, lineHeight: 1.3, color: G.soft }}>
                            <b style={{ color: G.ink, fontWeight: 625 }}>{post.f}</b>
                            <br />
                            {post.t}
                          </span>
                        </div>
                      ) : best ? (
                        <span style={{ fontSize: 8.5, color: M.good, fontWeight: 625 }}>Best time</span>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </Tile>
      <div className="mt-3 flex flex-wrap items-center gap-3" style={{ fontSize: 11 }}>
        <span className="relative inline-flex items-center gap-3 rounded-lg py-2 pl-3 pr-9" style={{ background: G.ink, color: '#fff', opacity: live ? 1 : 0, transform: live ? 'none' : 'translateY(8px)', transition: 'all .5s ease 1.6s' }}>
          Moved to Tuesday, 6:00 pm
          <b style={{ fontWeight: 625, textDecoration: 'underline' }}>Undo</b>
          <Pin n={2} />
        </span>
        <span style={{ color: G.muted }}>Best times are shaded once your posts have insights.</span>
      </div>
    </>
  )
}

const SCORES: [string, number, 'good' | 'warn' | 'bad'][] = [
  ['Hook', 82, 'good'],
  ['Hold', 54, 'warn'],
  ['Ending', 38, 'bad'],
  ['Human pull', 76, 'good'],
  ['Emotional pull', 61, 'warn'],
]
const LANES: [string, number[][]][] = [
  ['Faces', [[0, 24], [40, 58], [78, 92]]],
  ['Speech', [[6, 50], [60, 96]]],
  ['On-screen text', [[26, 44], [70, 82]]],
  ['Sound', [[0, 100]]],
]

function PreflightScreen() {
  const live = useLive()
  return (
    <>
      <Head eyebrow="Studio" title="Pre-flight check" sub="Reel · 0:27 · checked 2 minutes ago" />
      <div className="grid gap-3 @2xl:grid-cols-5">
        <Tile className="@2xl:col-span-2 !p-3">
          <Pin n={1} />
          <div className="grid gap-3" style={{ gridTemplateColumns: '92px 1fr' }}>
            <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '9/16' }}>
              <img src={PHOTO.mic} alt="" className="size-full object-cover" />
              <span className="absolute inset-x-1.5 bottom-5 rounded px-1 py-0.5 text-center" style={{ background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 8 }}>5 mistakes in your reels</span>
              <span className="absolute inset-x-1.5 bottom-2 h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,.35)' }}>
                <span className="absolute inset-y-0 left-0 rounded-full" style={{ background: '#fff', width: live ? '34%' : '0%', transition: 'width 4s linear .4s' }} />
              </span>
            </div>
            <div className="pr-5">
              <Chip tone="warn">OK overall</Chip>
              <p className="mt-2" style={{ fontSize: 12.5, fontWeight: 625, lineHeight: 1.35 }}>Strong hook, weak middle. Cut the title card and open on the face.</p>
              <p className="mt-2" style={{ fontSize: 10.5, color: G.muted }}>An estimate, not a guarantee.</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-1">
            {[PHOTO.mic, PHOTO.desk, PHOTO.mic, PHOTO.studio, PHOTO.team].map((s, i) => (
              <Photo key={i} src={s} ratio="9 / 12" className="rounded" />
            ))}
          </div>
        </Tile>
        <div className="space-y-3 @2xl:col-span-3">
          <Tile className="!p-3">
            <Pin n={2} />
            <Eyebrow>Scores</Eyebrow>
            <div className="mt-2 space-y-2">
              {SCORES.map(([k, v, t], i) => (
                <div key={k} className="grid items-center gap-2" style={{ gridTemplateColumns: '92px 1fr 30px', fontSize: 11 }}>
                  <span style={{ color: G.soft }}>{k}</span>
                  <Meter value={v} color={t === 'good' ? M.good : t === 'warn' ? M.warn : M.bad} delay={i * 90} />
                  <span className="text-right tabular-nums" style={{ fontWeight: 625 }}>{v}</span>
                </div>
              ))}
            </div>
          </Tile>
          <Tile className="!p-3">
            <Pin n={3} />
            <Eyebrow>Timeline</Eyebrow>
            <div className="relative mt-2 space-y-1.5">
              {LANES.map(([lane, spans]) => (
                <div key={lane} className="grid items-center gap-2" style={{ gridTemplateColumns: '84px 1fr', fontSize: 9.5, color: G.muted }}>
                  <span>{lane}</span>
                  <span className="relative block rounded-sm" style={{ height: 9, background: '#f1f1f2' }}>
                    {spans.map(([a, b], i) => (
                      <i key={i} className="absolute inset-y-0 rounded-sm" style={{ left: `${a}%`, width: live ? `${b - a}%` : '0%', background: '#9a9da1', transition: `width .9s cubic-bezier(.23,1,.32,1) ${i * 150 + 200}ms` }} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2" style={{ fontSize: 11, color: G.soft }}>
              <b style={{ color: M.bad, fontWeight: 625 }}>0:09 drop-off risk.</b> Text overload: shorten the on-screen line.
            </p>
          </Tile>
        </div>
      </div>
    </>
  )
}

function AutomationsScreen() {
  const live = useLive()
  const field = (label: string, value: string) => (
    <div>
      <p style={{ fontSize: 10, color: G.muted, fontWeight: 625 }}>{label}</p>
      <div className="mt-0.5 rounded-md px-2.5 py-1.5" style={{ boxShadow: `0 0 0 1px ${G.lineStrong}`, background: G.surface, fontSize: 11.5 }}>{value}</div>
    </div>
  )
  const bubble = (side: 'l' | 'r', text: string, delay: number) => (
    <div className="max-w-[88%] rounded-2xl px-3 py-1.5" style={{ alignSelf: side === 'r' ? 'flex-end' : 'flex-start', background: side === 'r' ? G.ink : '#f1f1f2', color: side === 'r' ? '#fff' : G.ink, fontSize: 11, lineHeight: 1.4, opacity: live ? 1 : 0, transform: live ? 'none' : 'translateY(6px)', transition: `all .5s ease ${delay}ms` }}>
      {text}
    </div>
  )
  const rules: [string, string, boolean][] = [
    ['Send the guide', 'guide, link, send', true],
    ['Booking link', 'book, call', true],
    ['Price list', 'price, cost', false],
  ]
  return (
    <>
      <Head eyebrow="Engage" title="Automations" sub="Reply to keyword comments with a DM." />
      <div className="grid gap-3 @2xl:grid-cols-5">
        <div className="space-y-3 @2xl:col-span-3">
          <Tile className="space-y-2.5 !p-3.5">
            <Pin n={1} />
            <Eyebrow>Build a rule</Eyebrow>
            {field('Name', 'Send the guide')}
            {field('When a comment contains', 'guide, link, send')}
            {field('Reply publicly', 'Thanks for asking, check your messages')}
            {field('Then send this DM', 'Here is the guide you asked for…')}
            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-2" style={{ fontSize: 11, color: G.soft }}>
                <span className="relative inline-block h-4 w-7 rounded-full" style={{ background: M.good }}>
                  <span className="absolute right-0.5 top-0.5 size-3 rounded-full bg-white" />
                </span>
                Active
              </span>
              <span className="rounded-md px-3 py-1.5" style={{ background: G.ink, color: '#fff', fontSize: 11, fontWeight: 625 }}>Save rule</span>
            </div>
          </Tile>
          <Tile className="!p-3">
            <Eyebrow>Your rules</Eyebrow>
            <div className="mt-1">
              {rules.map(([n, k, on]) => (
                <div key={n} className="flex items-center gap-3 border-t py-2" style={{ borderColor: G.line, fontSize: 11 }}>
                  <b style={{ fontWeight: 625 }}>{n}</b>
                  <span style={{ color: G.muted }}>{k}</span>
                  <span className="ml-auto">
                    <Chip tone={on ? 'good' : 'neutral'}>{on ? 'Live' : 'Paused'}</Chip>
                  </span>
                </div>
              ))}
            </div>
          </Tile>
        </div>
        <Tile className="@2xl:col-span-2 !p-3.5">
          <Pin n={2} />
          <Eyebrow>What your audience sees</Eyebrow>
          <div className="mt-2.5 flex flex-col gap-1.5 rounded-xl p-2.5" style={{ background: G.surface, boxShadow: `0 0 0 1px ${G.line}` }}>
            <p style={{ fontSize: 9.5, color: G.muted }}>Comment on your reel</p>
            {bubble('l', 'guide please, thanks!', 200)}
            {bubble('r', 'Thanks for asking, check your messages', 900)}
            <p className="mt-1" style={{ fontSize: 9.5, color: G.muted }}>In their DMs</p>
            {bubble('r', 'Here is the guide you asked for…', 1700)}
          </div>
        </Tile>
      </div>
    </>
  )
}

/* ------------------------------ frame ------------------------------ */

export type MotionScreen = 'overview' | 'planner' | 'preflight' | 'automations'

const SCREENS: Record<MotionScreen, { nav: string; url: string; node: () => ReactNode }> = {
  overview: { nav: 'Overview', url: 'app.motion.rothenhall.com', node: () => <OverviewScreen /> },
  planner: { nav: 'Planner', url: 'app.motion.rothenhall.com/planner', node: () => <PlannerScreen /> },
  preflight: { nav: 'Pre-flight check', url: 'app.motion.rothenhall.com/preflight', node: () => <PreflightScreen /> },
  automations: { nav: 'Automations', url: 'app.motion.rothenhall.com/automations', node: () => <AutomationsScreen /> },
}

export function MotionFrame({ screen, label }: { screen: MotionScreen; label: string }) {
  const [ref, seen] = useInView<HTMLDivElement>('0px 0px -5% 0px')
  const s = SCREENS[screen]
  return (
    <div ref={ref} className="@container">
      <figure className="cx-app m-0" role="img" aria-label={label}>
        <div className="overflow-hidden rounded-2xl" style={{ background: G.surface, border: '1px solid rgba(255,255,255,.14)', boxShadow: '0 40px 90px -30px rgba(0,0,0,.55)' }} aria-hidden>
          <div className="flex items-center gap-3 px-3.5 py-2.5" style={{ background: '#f1f1f2', borderBottom: `1px solid ${G.line}` }}>
            <span className="flex gap-1.5">
              {['#ee6a5f', '#f5bd4f', '#62c655'].map((c) => (
                <i key={c} style={{ width: 9, height: 9, borderRadius: 99, background: c, opacity: 0.85 }} />
              ))}
            </span>
            <span className="min-w-0 flex-1 truncate rounded-md px-3 py-1 text-center" style={{ background: '#fff', border: `1px solid ${G.line}`, fontSize: 10.5, color: G.muted }}>{s.url}</span>
            <span style={{ width: 40 }} className="hidden sm:block" />
          </div>
          <div className="flex" style={{ minHeight: 420, textAlign: 'left' }}>
            <MotionSidebar active={s.nav} />
            <LiveCtx.Provider value={seen}>
              <div key={screen} className="min-w-0 flex-1 p-4 @3xl:p-5" style={{ background: G.surface }}>{s.node()}</div>
            </LiveCtx.Provider>
          </div>
        </div>
      </figure>
    </div>
  )
}

const TOUR: { key: MotionScreen; kicker: string; title: string; body: string; notes: string[] }[] = [
  {
    key: 'overview',
    kicker: 'See',
    title: 'Your whole week, at a glance',
    body: 'Views and engagement, what is posting next, how full the queue is, and which days are still empty. Opens the same way every morning.',
    notes: ['Views for the last 30 days, with the trend', 'The next post, shown exactly as it will appear', 'How many posts are scheduled, and which days are covered'],
  },
  {
    key: 'planner',
    kicker: 'Plan',
    title: 'A planner that thinks like an editor',
    body: 'Posts sit in the part of the day they publish. Drag one to a new slot and it moves, with Undo. Best times shade in once your own posts have enough data.',
    notes: ['Week view by part of the day, with thumbnails', 'Drag to reschedule, and Undo if you slip'],
  },
  {
    key: 'preflight',
    kicker: 'Pre-flight',
    title: 'Know how a post lands before it goes out',
    body: 'Upload a reel, image, carousel or text post. Motion returns a one-line verdict, scores for hook, hold and ending, and timestamped fixes you can act on.',
    notes: ['The reel, with a one-line verdict', 'Scores out of 100 for the parts that decide a reel', 'A timeline that marks where attention drops, and why'],
  },
  {
    key: 'automations',
    kicker: 'Engage',
    title: 'Comment to DM, on autopilot',
    body: 'Someone comments a keyword on your post. Motion replies in public and sends the direct message you wrote, every time.',
    notes: ['Set the keyword, the public reply and the DM once', 'Preview exactly what your audience will see'],
  },
]

export function MotionTour() {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hover, setHover] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!auto || hover || reduced) return
    const t = setTimeout(() => setI((n) => (n + 1) % TOUR.length), 9000)
    return () => clearTimeout(t)
  }, [i, auto, hover, reduced])
  const cur = TOUR[i]
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <ul role="tablist" aria-label="Motion product screens" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
            {TOUR.map((t, n) => {
              const on = n === i
              return (
                <li key={t.key} className="shrink-0 lg:shrink">
                  <button
                    role="tab"
                    aria-selected={on}
                    id={`mtour-${t.key}`}
                    aria-controls="mtour-panel"
                    onClick={() => {
                      setAuto(false)
                      setI(n)
                    }}
                    className="relative w-full rounded-xl px-4 py-3 text-left transition-colors lg:rounded-none lg:rounded-r-xl lg:border-l-2 lg:py-4"
                    style={{ borderColor: on ? 'var(--color-cognac-soft)' : 'var(--color-night-line)', background: on ? 'rgba(255,255,255,.05)' : 'transparent' }}
                  >
                    <span className="eyebrow eyebrow-light block" style={{ color: on ? 'var(--color-cognac-soft)' : undefined }}>
                      {String(n + 1).padStart(2, '0')} · {t.kicker}
                    </span>
                    <span className="mt-1 block font-display text-canvas" style={{ fontSize: '1.15rem', lineHeight: 1.15 }}>{t.title}</span>
                    <span className="hidden overflow-hidden font-sans text-caption leading-relaxed text-canvas/60 lg:block" style={{ maxHeight: on ? 140 : 0, opacity: on ? 1 : 0, marginTop: on ? 8 : 0, transition: 'all .35s ease' }}>
                      {t.body}
                    </span>
                    {on && auto && !hover && !reduced && <span aria-hidden key={`${i}-p`} className="cx-progress absolute bottom-0 left-0 h-[2px] w-full origin-left" style={{ animationDuration: '9s' }} />}
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 font-sans text-caption leading-relaxed text-canvas/60 lg:hidden">{cur.body}</p>
        </div>
        <div className="lg:col-span-8" role="tabpanel" id="mtour-panel" aria-labelledby={`mtour-${cur.key}`}>
          <MotionFrame screen={cur.key} label={`${cur.title}. ${cur.body}`} />
          <ol className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {cur.notes.map((n, k) => (
              <li key={n} className="flex items-start gap-3 font-sans text-caption leading-snug text-canvas/80">
                <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-cognac text-[0.68rem] font-semibold text-white">{k + 1}</span>
                {n}
              </li>
            ))}
          </ol>
          <p className="mt-5 font-sans text-label text-canvas/40">The Motion studio, shown with a sample brand. Figures and posts are illustrative.</p>
        </div>
      </div>
    </div>
  )
}

/* --------------------------- launch pass --------------------------- */

const CHECKLIST = ['Planner and feed preview', 'Content Lab and hook library', 'Pre-flight check', 'Inbox and comment-to-DM automations', 'Analytics and best times']

export function BoardingPass() {
  const [ref, seen] = useInView<HTMLDivElement>('0px 0px -10% 0px')
  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="relative lg:col-span-7">
        <div
          className="relative overflow-hidden rounded-[1.6rem] text-ink"
          style={{ background: '#f7f3ea', boxShadow: '0 50px 90px -40px rgba(0,0,0,.8)', transform: seen ? 'rotate(-1.2deg)' : 'rotate(-4deg) translateY(30px)', opacity: seen ? 1 : 0, transition: 'all 1s cubic-bezier(.23,1,.32,1)' }}
        >
          <div className="grid sm:grid-cols-[1fr_auto]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <MotionWordmark size={26} />
                <span className="eyebrow">Boarding pass</span>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div>
                  <p className="font-sans text-label text-ink-45">FROM</p>
                  <p className="font-display" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', lineHeight: 1, letterSpacing: '-.02em' }}>Idea</p>
                </div>
                <svg viewBox="0 0 120 20" className="h-5 flex-1" aria-hidden>
                  <path d="M0 10h108" stroke="#9a7a4a" strokeWidth="1.5" strokeDasharray="3 5" />
                  <path d="M104 4l12 6-12 6z" fill="#1a1712" />
                </svg>
                <div className="text-right">
                  <p className="font-sans text-label text-ink-45">TO</p>
                  <p className="font-display" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', lineHeight: 1, letterSpacing: '-.02em' }}>Published</p>
                </div>
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line-strong pt-5 font-sans text-caption">
                <div>
                  <dt className="text-ink-45">Status</dt>
                  <dd className="mt-0.5 flex items-center gap-2 font-medium text-ink">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full rounded-full bg-cognac opacity-70 motion-safe:animate-ping" />
                      <span className="relative inline-flex size-2 rounded-full bg-cognac" />
                    </span>
                    Boarding soon
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-45">Access</dt>
                  <dd className="mt-0.5 font-medium text-ink">Early access list</dd>
                </div>
                <div>
                  <dt className="text-ink-45">Channels</dt>
                  <dd className="mt-0.5 font-medium text-ink">Instagram · Facebook · Threads</dd>
                </div>
                <div>
                  <dt className="text-ink-45">Built for</dt>
                  <dd className="mt-0.5 font-medium text-ink">Founders, creators, brand teams</dd>
                </div>
              </dl>
            </div>
            <div className="relative flex flex-row items-center justify-between gap-4 border-t border-dashed border-line-strong p-6 sm:w-44 sm:flex-col sm:border-l sm:border-t-0 sm:p-7">
              <div className="flex h-14 items-stretch gap-[2px] sm:h-24" aria-hidden>
                {[3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1].map((w, i) => (
                  <i key={i} style={{ width: w, background: '#1a1712' }} />
                ))}
              </div>
              <a href="#motion-waitlist" className="btn btn-primary !px-4 !py-2.5 text-label">Join the list</a>
            </div>
          </div>
          <span aria-hidden className="absolute hidden size-6 rounded-full bg-night sm:block" style={{ right: 'calc(11rem - 12px)', top: -12 }} />
          <span aria-hidden className="absolute hidden size-6 rounded-full bg-night sm:block" style={{ right: 'calc(11rem - 12px)', bottom: -12 }} />
        </div>
      </div>

      <div className="lg:col-span-5">
        <p className="eyebrow eyebrow-light">Pre-launch checklist</p>
        <ul className="mt-5 space-y-3">
          {CHECKLIST.map((c, i) => (
            <li key={c} className="flex items-center gap-3 font-sans text-body text-canvas/85" style={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateX(-10px)', transition: `all .6s cubic-bezier(.23,1,.32,1) ${400 + i * 260}ms` }}>
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-canvas/90 text-[0.7rem] text-night">✓</span>
              {c}
            </li>
          ))}
          <li className="flex items-center gap-3 font-sans text-body text-canvas" style={{ opacity: seen ? 1 : 0, transition: `opacity .6s ease ${400 + CHECKLIST.length * 260}ms` }}>
            <span className="relative grid size-6 shrink-0 place-items-center">
              <span className="absolute inline-flex size-full rounded-full bg-cognac-soft opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-3 rounded-full bg-cognac-soft" />
            </span>
            <span>
              Public launch <span className="text-cognac-soft">· boarding soon</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

/* ---------------------------- waitlist form ------------------------ */

const empty: WaitlistInput = { name: '', email: '', company: '', source: '' }
const labelCls = 'block font-sans text-label tracking-wide text-canvas/60'
const inputCls = 'w-full rounded-lg border border-night-line bg-night-2 px-4 py-3 font-sans text-body text-canvas placeholder:text-canvas/35 transition-colors focus:border-cognac-soft'

export function MotionWaitlist() {
  const [form, setForm] = useState<WaitlistInput>(empty)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const set = (k: keyof WaitlistInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await joinMotionWaitlist({ data: form })
      setStatus('success')
      setForm(empty)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success')
    return (
      <div className="rounded-2xl border border-night-line bg-night-2 p-8 text-center">
        <p className="font-display text-2xl text-canvas">You’re on the boarding list.</p>
        <p className="mt-3 font-sans text-body leading-relaxed text-canvas/60">We will email you when Motion early access opens.</p>
      </div>
    )

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="m-name" className={labelCls}>Name</label>
          <input id="m-name" required value={form.name} onChange={set('name')} className={inputCls} placeholder="Jane Doe" autoComplete="name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="m-company" className={labelCls}>Brand <span className="text-canvas/35">(optional)</span></label>
          <input id="m-company" value={form.company} onChange={set('company')} className={inputCls} placeholder="Acme Inc." autoComplete="organization" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="m-email" className={labelCls}>Email</label>
        <input id="m-email" type="email" required value={form.email} onChange={set('email')} className={inputCls} placeholder="you@acme.com" autoComplete="email" />
      </div>
      <div className="space-y-2">
        <label htmlFor="m-src" className={labelCls}>Where do you post most?</label>
        <select id="m-src" value={form.source} onChange={set('source')} className={`${inputCls} appearance-none`}>
          <option value="">Select one</option>
          {['Instagram', 'Facebook', 'Threads', 'All of them'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      {status === 'error' && <p role="alert" className="font-sans text-caption text-cognac-soft">{error}</p>}
      <button type="submit" disabled={status === 'submitting'} className="btn btn-cognac mt-2 w-full disabled:opacity-60">
        {status === 'submitting' ? 'Joining…' : 'Get on the boarding list'}
      </button>
      <p className="text-center font-sans text-label text-canvas/40">We will only email you about Motion early access.</p>
    </form>
  )
}
