import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow, Reveal } from '../components/site'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/terms')({
  head: () =>
    seo({
      path: '/terms',
      title: 'Terms and Conditions · Rothenhall Partners',
      description:
        'The terms for working with Rothenhall Partners: engagements and Statements of Work, fees and tax, the Founding Partner Programme, data protection and liability, plus the terms for the free diagnostic.',
    }),
  component: Terms,
})

type Section = { h: string; body: React.ReactNode }

const mail = (
  <a href="mailto:office@rothenhall.com" className="text-ink underline underline-offset-2 hover:text-cognac">
    office@rothenhall.com
  </a>
)

/* Part A: the commercial terms for paid engagements. The pricing page shows
   the same terms in plain words; keep the two in step. */
const SERVICES: Section[] = [
  {
    h: '1. What these terms cover',
    body: 'These terms apply when you buy a Diagnostic, an operating tier (Foundation, Growth or Operating Partner), an add-on module or a one-off project from Rothenhall Partners. They sit alongside a Master Services Agreement and a Statement of Work for each engagement. If a Statement of Work says something different, the Statement of Work applies to that engagement.',
  },
  {
    h: '2. Engagements and Statements of Work',
    body: 'Each engagement is set out in a Statement of Work that names the tier, the add-ons, the deliverables, who owns each action, the start date and the fees. Anything outside it is a change request, which we quote before any work starts.',
  },
  {
    h: '3. The Diagnostic and its credit',
    body: 'The Diagnostic is a one-time, paid piece of work priced by scope. If you sign an operating tier within 30 days of receiving the Diagnostic, its fee is credited in full against the first months of that tier. If you do not, the fee is not refundable once the work has started.',
  },
  {
    h: '4. Operating tiers and add-ons',
    body: 'Operating tiers are billed monthly and have a three-month minimum term. After the first three months you can move between tiers, or stop, at the end of any month with 30 days written notice. Add-on modules are billed per unit, monthly or once, as stated in the Statement of Work. Paid media spend, where it applies, is billed at cost and separately.',
  },
  {
    h: '5. The Founding Partner Programme',
    body: 'Founding Partners receive 50% off the monthly fees of their tier for the first three months. One-off items are not discounted. In return, Rothenhall may document the work as a before-and-after case study with a testimonial from you. We will show you the case study and the testimonial before they are published, and we will not name you or your figures without your written approval. Places are limited and we may close the programme at any time for new clients.',
  },
  {
    h: '6. Fees, invoicing and tax',
    body: 'Fees are set in US dollars, euros or Indian rupees according to the price book for your region, and are stated in your Statement of Work. We invoice monthly in advance and payment is due within 30 days. Prices exclude VAT, GST and any sales or use tax, which we add where the law requires it. Where the EU reverse-charge applies to a cross-border business customer, we invoice accordingly. If an invoice is paid late we may charge interest as the applicable law allows. Annual prepayment earns a 10% discount. We review prices once a year and give 30 days notice of any change.',
  },
  {
    h: '7. Your responsibilities',
    body: 'You name one point of contact and one person who approves work, and you agree a turnaround time for approvals. You give us accurate facts about your business, and you confirm that we may use any customer names and figures you give us. You give us access to your website, analytics and social accounts through each platform’s own permissions. We never ask for shared passwords, and you should not send them. Delays caused by missing information or approvals can move the dates in the Statement of Work.',
  },
  {
    h: '8. Deliverables, acceptance and results',
    body: 'Every deliverable has a written definition of done. A deliverable is accepted when it meets that definition, or ten working days after we deliver it if you have not raised a written objection. AI answer engines vary by engine, region and day, and we do not control them. We therefore report results as rates across repeated runs, never as a single position, and we do not promise any ranking, placement or outcome in any individual AI answer.',
  },
  {
    h: '9. Intellectual property',
    body: 'Once you have paid for them, you own the deliverables we create for you. Rothenhall keeps everything it owned before the engagement and everything it builds for general use, including Cailyx, our methods, templates and playbooks. We give you a licence to use any of those that are embedded in a deliverable, for as long as you use the deliverable for your own business.',
  },
  {
    h: '10. Confidentiality',
    body: 'Each side keeps the other’s non-public information confidential, uses it only for the engagement, and shares it only with people who need it and are bound to the same standard. This does not apply to information that is public, already known to the receiving side, or required to be disclosed by law.',
  },
  {
    h: '11. Data protection',
    body: 'We process personal data only to deliver the engagement and in line with applicable data protection law, including the GDPR where it applies and India’s Digital Personal Data Protection Act. Where we process personal data on your behalf we will sign a data processing agreement on request, and we will give you the list of sub-processors we use. We use reasonable security measures and will tell you without undue delay if we learn of a breach affecting your data.',
  },
  {
    h: '12. Term and termination',
    body: 'An engagement runs for the term in its Statement of Work. Either side may end it at the end of the minimum term, or later at month end, with 30 days written notice. Either side may end it immediately if the other commits a material breach and does not fix it within 14 days of written notice. On any ending, you pay for work done and fees due up to that date, and each side returns or deletes the other’s confidential information on request.',
  },
  {
    h: '13. Liability',
    body: 'Nothing here limits liability that cannot be limited by law. Otherwise, each side’s total liability for claims arising from an engagement is limited to the fees paid or payable for that engagement in the 12 months before the claim, and neither side is liable for indirect or consequential loss, or loss of profit or revenue. We are not responsible for changes made by third-party platforms, such as search engines, AI engines and social networks.',
  },
  {
    h: '14. Governing law and disputes',
    body: 'These terms are governed by the laws of India, and the courts at Bengaluru have jurisdiction, unless your Statement of Work says otherwise. Before starting any formal process, both sides will first try to settle a dispute in good faith.',
  },
  {
    h: '15. Changes to these terms',
    body: 'We may update these terms from time to time. The current version is always on this page. A change does not alter a Statement of Work that has already been signed unless both sides agree in writing.',
  },
]

/* Part B: the terms for the free diagnostic offered through the Founders
   Circle and the website. */
const DIAGNOSTIC: Section[] = [
  {
    h: 'A. The free diagnostic',
    body: 'The AEO + GTM diagnostic offered to Founders Circle members is free, at no cost and no obligation. It is a senior review of where you stand in AI answers and where your go-to-market may be leaking. We may decline or delay a request at our discretion. It is separate from the paid Diagnostic described above.',
  },
  {
    h: 'B. Permission to crawl your website',
    body: 'By accepting these terms, you allow Rothenhall Partners to fetch and read the publicly available pages of the website you provide, so we can assess how AI answer engines see your brand and prepare the diagnostic. We access only public pages. We do not attempt to reach private, gated, or password-protected areas, and we do not alter your site.',
  },
  {
    h: 'C. The information you give us',
    body: 'We store the phone number, email, company name, website, and any description you enter, and we use them only to contact you about the diagnostic. We do not sell your information or share it with third parties for their own marketing.',
  },
  {
    h: 'D. Newsletter (optional)',
    body: 'The newsletter is a separate opt-in. If you tick it, we add your email to our GTM and AI news list. Every issue includes a one-click unsubscribe, and opting out of the newsletter has no effect on your diagnostic.',
  },
  {
    h: 'E. Deleting your data',
    body: (
      <>
        You can ask us to remove your details, or unsubscribe, at any time by emailing {mail}.
      </>
    ),
  },
]

function SectionList({ items }: { items: Section[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((s, i) => (
        <Reveal key={s.h} delay={Math.min(i, 6) * 30}>
          <div className="py-8">
            <h3 className="font-display text-ink text-lead">{s.h}</h3>
            <p className="mt-3 font-sans text-body leading-relaxed text-ink-80">{s.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function Terms() {
  return (
    <div className="bg-canvas text-ink">
      <section className="border-b border-line">
        <Container width="narrow" className="pt-20 pb-16 sm:pt-28 sm:pb-20">
          <Reveal>
            <Eyebrow>Terms</Eyebrow>
            <h1 className="text-display-lg mt-8">Terms and Conditions</h1>
            <p className="mt-6 font-sans text-body leading-relaxed text-ink-60">
              How we work together, in two parts: the terms for paid engagements,
              and the terms for the free diagnostic. The pricing page shows the
              same commercial terms in plain words.
            </p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-sans text-caption">
              <a href="#services" className="link-line text-ink-80">
                Part A. Paid engagements
              </a>
              <a href="#diagnostic" className="link-line text-ink-80">
                Part B. The free diagnostic
              </a>
              <Link to="/pricing" className="link-line text-ink-80">
                Pricing
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>

      <section id="services" className="scroll-mt-24">
        <Container width="narrow" className="pt-16 sm:pt-20">
          <Reveal>
            <Eyebrow>Part A</Eyebrow>
            <h2 className="text-display-md mt-6">Paid engagements</h2>
          </Reveal>
          <div className="mt-8">
            <SectionList items={SERVICES} />
          </div>
        </Container>
      </section>

      <section id="diagnostic" className="scroll-mt-24">
        <Container width="narrow" className="py-16 sm:py-20">
          <Reveal>
            <Eyebrow>Part B</Eyebrow>
            <h2 className="text-display-md mt-6">The free diagnostic</h2>
          </Reveal>
          <div className="mt-8">
            <SectionList items={DIAGNOSTIC} />
          </div>

          <p className="mt-10 font-sans text-caption text-ink-45">
            Last updated 11 October 2026. Questions? Email {mail}.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <Link to="/founders" className="link-line font-sans text-body">
              ← Back to the diagnostic
            </Link>
            <Link to="/pricing" className="link-line font-sans text-body">
              See pricing →
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
