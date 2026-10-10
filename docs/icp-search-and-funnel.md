# ICP, search behaviour and funnel

Working document, 11 October 2026. It answers three questions: who is the buyer,
how do they look for us on AI platforms and on the web, and what funnel and
pricing presentation makes them more willing to pay. Figures from third parties
are marked, with the caveat that matters. Nothing here is a Rothenhall result
unless it says so.

## 1. The ICP

**Primary buyer.** A founder, CEO or head of growth at a founder-led company
with 10 to 200 people, selling B2B (SaaS, services, fintech) in India, Europe or
the US. They have no in-house AEO, go-to-market or RevOps depth, and they are
being asked "why doesn't ChatGPT mention us" or "why is growth flat" by a
board, an investor or a customer.

- Our two real clients fit this: Heapvue (bootstrapped, six SME products, about
  22 lakh annual revenue) and Faydo (consumer fintech, small social base).
- **Budget bands we can design for.** India: agency SEO retainers run about
  ₹25,000 to ₹2.5 lakh a month, and content-led SaaS retainers ₹1.5 to 2.5
  lakh. US mid-market AEO retainers are quoted at $2,000 to $8,000 a month.
  These are agency-published, so they bracket a range and are not rate cards.
- **Secondary.** Agencies that need AEO delivery for their own clients, and
  funds with portfolios (on request only).
- **Not the buyer.** Enterprise procurement teams, and anyone who wants a
  guaranteed ranking.

## 2. How they search

### On AI platforms

- **AI is where the shortlist forms.** In G2's March 2026 survey of 1,076 B2B
  decision-makers, 51% of software buyers start research in an AI chatbot, and
  54% ranked chatbots the top source shaping their shortlist. 69% changed their
  planned vendor after chatbot guidance, and a third bought from a vendor they
  had not heard of. Buyers "one-shot" the shortlist with a single prompt.
  (G2 via Demand Gen Report. Most coverage repeats this one dataset.)
- **They finish most of the evaluation before they talk to anyone.** Estimates
  put it at 70 to 80%. A Forrester finding reported in the same coverage says
  buyers who use AI are about a tenth as likely to click through to a vendor
  site. So the answer itself has to carry our name, what we do and what it costs.
- **Prompts are long and specific.** An academic comparison (arXiv 2307.01135)
  found ChatGPT users write longer queries than Google users, and Semrush
  clickstream data reports about 23 words per prompt without search against
  about 3.4 words on Google. Web-search-on prompts shrink to 4 to 5 words, so
  both forms matter. (Figures vary widely by source and vendor.)

### Prompt archetypes for our space

| Intent | Example prompts | Page that must answer it |
|---|---|---|
| Discover | "best AEO agency for a B2B SaaS startup in India", "who can help my startup get recommended by ChatGPT" | Home, Services |
| Problem | "why doesn't ChatGPT mention my company", "my competitors show up in Perplexity and I don't" | FAQ, How to show up in ChatGPT |
| How-to | "how do I get my company cited in AI Overviews" | How to show up in ChatGPT, Research |
| Compare | "AEO vs SEO", "fractional CMO vs agency vs hiring in-house", "AEO agency vs doing it ourselves" | AEO vs SEO, Pricing FAQ |
| Cost | "how much does AEO cost", "AEO agency pricing India", "fractional CMO cost" | Pricing |
| Evaluate | "is Rothenhall Partners legit", "Rothenhall Partners reviews", "AEO case studies" | Case Studies, About |
| Brand | "what is Rothenhall Partners", "who founded Rothenhall" | Home, About, structured data |

### On the web

- **Short Google queries**, about 3 to 4 words: "AEO agency India", "AEO services", "AEO pricing", "GEO consultant", "AI search optimization agency".
- **Social and referral channels** carry a lot of the trust work: founder
  communities, LinkedIn, referrals. The buying sequence practitioners describe
  is goals, shortlist, case studies and references, consultations, then price
  comparison. (Agency blogs, so practitioner opinion, not research.)
- **Pricing is the top thing buyers cannot find.** TrustRadius reports 71% of
  its respondents say visible pricing makes them more likely to buy (a vendor
  survey). One HockeyStack dataset found slightly lower bounce *without*
  pricing, so transparency is a trust choice, not a proven conversion lever.
  It also matters for AI: a page whose price an assistant cannot read is
  invisible at the cost step.

## 3. What this means for the site

1. **Say it where the AI will quote it.** Every key fact (who we serve, what we
   do, what it costs, how long it takes) is in server-rendered HTML and in
   structured data, in plain sentences.
2. **Answer the cost and compare prompts directly.** These are the prompts most
   likely to reach a buyer who is already comparing.
3. **Prove specificity, not size.** Small buyers check case studies, references
   and whether the vendor describes their problem accurately. We lead with the
   method, the research (about 90,000 AI answers across 15+ industries) and
   documented before-and-after work. We do not claim social proof we do not have.

## 4. Behavioural principles, and where each is used

| Principle | Evidence | Used for |
|---|---|---|
| Anchoring | Strong in theory, vendor anecdotes in B2B | Market price ranges shown before our tiers, so the tiers read as reasonable |
| Compromise and decoy effect | Classic (Ariely, Simonson), B2B tests thin | Three tiers, the middle labelled Recommended, not "Most chosen" |
| Default option | Thin in B2B | Growth preselected in the estimator, to be tested |
| Risk reversal | Standard practice, little B2B data | Diagnostic credited in full, 30-day notice after month three, Founding Partner Programme |
| Commitment ladder | Foot-in-the-door pattern | Free score, then Diagnostic, then a tier |
| Loss aversion | Established | "Buyers are already asking AI who to trust" |
| Uncertainty reduction | Practitioner consensus | "What happens next" steps, written definitions of done |
| Effort reduction | Practitioner consensus | The estimate carries into the contact form |

Rules we keep: no invented social proof, no fake original prices, and no more
than the four or five cues that fit. The B2B pricing-psychology evidence is
mostly vendor blogs, so each lever is an experiment, not a fact.

## 5. The funnel

| Stage | Visitor's question | Page and action | Event to track |
|---|---|---|---|
| Find | "Who can fix this?" | AI answer or Google result, then Home | landing page, source |
| Understand | "Are they for someone like us?" | Home, Services | `cta_free_score` |
| Verify | "Can I trust them?" | Case Studies, Research, About | `view_proof` |
| Try small | "What is the cheapest way to find out?" | Free score, then Diagnostic | `diagnostic_select`, `diagnostic_click` |
| Price | "Is it worth it, and can I afford it?" | Pricing, estimator | `tier_select`, `addon_add`, `estimate_request` |
| Ask | "What happens if I contact them?" | Contact, prefilled with the estimate | `form_submit` |

Review the funnel monthly: drop-off between each pair of stages, the share of
visitors who reach Pricing from an AI referral, and the Diagnostic to tier
conversion within 30 days.

## 6. Tests to run, in order

1. Growth preselected against no preselection.
2. Market ranges shown above or below the tiers.
3. Free score as the primary hero button against the Diagnostic.

## Sources

- G2 survey, via [Demand Gen Report](https://demandgenreport.com/industry-news/news-brief/half-of-b2b-software-buyers-now-start-their-research-with-ai-chatbots-g2/52737)
- [ChatGPT vs Google study, arXiv](https://arxiv.org/pdf/2307.01135)
- Semrush prompt-length data, via [Blog du Modérateur](https://www.blogdumoderateur.com/etude-chatgpt-search-semrush/)
- [upGrowth, SEO services cost in India](https://upgrowth.in/seo-services-cost-in-india/)
- [upGrowth, fractional CMO pricing India 2026](https://upgrowth.in/fractional-cmo-pricing-india-2026/)
- [310 Creative, AEO agency pricing](https://www.310creative.com/blog/aeo-agency-pricing)
- [TrustRadius on pricing transparency](https://solutions.trustradius.com/vendor-blog/tech-buyers-demand-honest-and-up-front-pricing-info/)
- [HockeyStack, state of pricing pages](https://hockeystack.com/lab-blog-posts/state-of-pricing-demo-case-study-pages)
- [Atticus Li, decoy effect on pricing pages](https://www.atticusli.com/blog/posts/how-decoy-effect-pricing-changes-choice-on-pricing-pages/)
