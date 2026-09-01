# Rothenhall GEO Punch-List

Owner: Kunal. Started: September 2026. Status: living document.

The goal: close the gap the diagnostic found on our own site. Our AEO (technical, on-site) is near-exemplary. Our GEO (off-site presence, entity, authority) is near zero because the brand is new. Everything below is a first-time build, not a repair. Ordered by leverage.

Baseline from our own audit (Sept 2026):
- Crawlers open (200), robots.txt welcoming, homepage fully server-rendered (7,506 chars), ProfessionalService + WebSite schema. Technical foundation: strong.
- "Rothenhall Partners" returns nothing in search or the assistants. Absent from every "best AEO/GEO agency 2026" list competitors sit on. Mild collision with "Roth Capital Partners". No reviews, backlinks, or branded search yet.
- Rough score on our own rubric: ~63/100, inflated by technical perfection.

---

## Phase 0 — Instrument first, so we can prove movement (SOP-1, SOP-2)
- [ ] Build our own defined query set: 100–300 buyer prompts for our ICP, tagged by persona and funnel stage. Include "Rothenhall" in the most-aware cluster and 3+ named competitor agencies in the product-aware cluster.
- [ ] Run the baseline: n≥5 per prompt, ≥2 geographies (include India and US), across ChatGPT, Claude, Perplexity, Google AI Overviews. Record mention rate, citation rate, share of voice, characterization.
- [ ] Add "How did you hear about us?" with AI-assistant options to the contact form. Without self-reported attribution we cannot prove our own value.
- [ ] Turn on branded-search tracking (Google Search Console) and AI-crawler log monitoring by URL.

## Phase 1 — Entity (SOP-4). Highest leverage for a brand nobody knows yet
- [ ] Lock one canonical name and one canonical one-line descriptor. Use it verbatim everywhere (site, LinkedIn, directories, bios, press).
- [x] Add `Organization` and `Person` (founder) JSON-LD with `sameAs` (done Sept 2026): org node is now `["Organization","ProfessionalService"]` linking a Person node for Kunal Achintya Reddy (sameAs LinkedIn + Google Scholar, worksFor the org). Still to add when the URLs exist: Crunchbase, G2/Clutch profiles to the `sameAs` arrays.
- [x] Disambiguate from similarly named financial firms in the schema (done): org `disambiguatingDescription` now states it is distinct from any similarly named financial, capital, or investment firm.
- [ ] Claim and standardise profiles: LinkedIn company page, Crunchbase, Google Business Profile, and one vendor directory (Clutch or G2) with the identical descriptor.
- [ ] Assess Wikidata eligibility against the real criteria. Do not fabricate notability. Create the item only if it qualifies.

## Phase 2 — Off-site corpus and lists (SOP-7). This is what the models quote
- [ ] Map every "best AEO / GEO / AI-search agency 2026" list and "X vs Y" page in our space. Pitch for inclusion, list by list. (Seen already: LinkedIn roundups, oakpool, bootstrapcreative, growthvibe.)
- [ ] Get listed on the agency directories assistants read: Clutch, DesignRush, The Manifest, G2 category page.
- [ ] Review generation starts now (longest lead time). Ask Napkin, DayOne, and BetterWaves for a short Clutch or G2 review. Aim for 3–5 in 90 days.
- [ ] A Product Hunt or launch moment for the diagnostic tool (ties to the Beacon PRD).
- [ ] Genuine community contribution (Reddit r/SEO, r/marketing, indiehackers, relevant Slack/Discord). Substance only, never link-spam.
- [ ] Two to three podcast or guest-post appearances in the AEO/GEO/GTM conversation.

## Phase 3 — Original data and named frameworks (SOP-8, SOP-9). The compounding assets
- [ ] Repackage /research as a citable asset: headline stat, visible methodology, comparison tables, sourced numbers. Distribute it (LinkedIn, PR, Reddit, podcasts).
- [ ] Brand-name our own framework at creation: define and publish "the Rothenhall AI Visibility Score" and its five dimensions as a named, owned concept, so models attribute it to us rather than absorbing it generically.
- [ ] Commit to one original data study per quarter (survey n≥200, or analysis of our own diagnostic corpus). One good study produces citable facts for roughly two years.

## Phase 4 — On-page extractability (SOP-6). Already strong; keep it sharp
- [ ] Confirm top commercial pages open answer-first (BLUF, 40–60 words), use question-shaped H2s, atomic sections, and at least one extractable claim (number + noun + time + source) per section.
- [x] Ship llms.txt (done, published at /llms.txt, framed honestly as a non-lever).
- [x] robots.txt welcomes all major AI crawlers and lists sitemaps (done, expanded Sept 2026).

## Cadence and honesty
- [ ] Re-run the measurement fortnightly. Report citation rate by cluster and surface, share of voice vs named competitors, branded-search trend, and self-reported attribution. If a number drops, it goes in the headline.
- Hold the claims discipline we sell: distributions not rankings, every number sourced and caveated, never promise placement. If it works for us it is because we earned the corpus, not because of a robots.txt trick.

## Explicitly not on this list (because they do not work)
- llms.txt as a ranking lever. Published, but not billed or expected to move citations.
- FAQ schema as a citation hack. Entity schema resolves ambiguity; it does not lift citation rate.
- Any cloaking or robots.txt "trick." There is no legitimate one, and it would backfire.
