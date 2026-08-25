import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Eyebrow } from '../components/site'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms and Conditions · Rothenhall Partners' },
      {
        name: 'description',
        content:
          'Terms for the Rothenhall Founders Circle free AEO + GTM diagnostic: crawl permission, how we handle your data, and the optional newsletter.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: Terms,
})

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: '1. The diagnostic',
    body: 'The AEO + GTM diagnostic is offered free to members of the Rothenhall Founders Circle, with no cost and no obligation. It is a senior review of where you stand in AI answers and where your go-to-market may be leaking. We may decline or delay a request at our discretion.',
  },
  {
    h: '2. Permission to crawl your website',
    body: 'By accepting these terms, you allow Rothenhall Partners to fetch and read the publicly available pages of the website you provide, so we can assess how AI answer engines see your brand and prepare the diagnostic. We access only public pages. We do not attempt to reach private, gated, or password-protected areas, and we do not alter your site.',
  },
  {
    h: '3. The information you give us',
    body: 'We store the phone number, email, company name, website, and any description you enter, and we use them only to contact you about the diagnostic. We do not sell your information or share it with third parties for their own marketing.',
  },
  {
    h: '4. Newsletter (optional)',
    body: 'The newsletter is a separate opt-in. If you tick it, we add your email to our GTM and AI news list. Every issue includes a one-click unsubscribe, and opting out of the newsletter has no effect on your diagnostic.',
  },
  {
    h: '5. Deleting your data',
    body: (
      <>
        You can ask us to remove your details, or unsubscribe, at any time by
        emailing{' '}
        <a href="mailto:office@rothenhall.com" className="text-ink underline underline-offset-2 hover:text-cognac">
          office@rothenhall.com
        </a>
        .
      </>
    ),
  },
  {
    h: '6. Changes',
    body: 'We may update these terms from time to time. The current version always lives on this page.',
  },
]

function Terms() {
  return (
    <section className="bg-canvas">
      <Container width="narrow" className="pt-24 pb-28 sm:pt-32">
        <Eyebrow>Founders Circle</Eyebrow>
        <h1 className="text-display-lg mt-8">Terms and Conditions</h1>
        <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-ink-60">
          These terms cover the free AEO + GTM diagnostic offered to members of the
          Rothenhall Founders Circle.
        </p>

        <div className="mt-14 divide-y divide-line border-y border-line">
          {SECTIONS.map((s) => (
            <div key={s.h} className="py-8">
              <h2 className="font-display text-ink" style={{ fontSize: '1.35rem' }}>
                {s.h}
              </h2>
              <p className="mt-3 font-sans text-[1rem] leading-relaxed text-ink-80">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 font-sans text-[0.85rem] text-ink-45">
          Last updated 25 August 2026. Questions? Email office@rothenhall.com.
        </p>

        <div className="mt-10">
          <Link to="/founders" className="link-line font-sans text-[0.95rem]">
            ← Back to the diagnostic
          </Link>
        </div>
      </Container>
    </section>
  )
}
