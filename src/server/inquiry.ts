import { createServerFn } from '@tanstack/react-start'

export type InquiryInput = {
  name: string
  email: string
  company: string
  type: string
  message: string
}

/** Runs on the client and the server; throws with a user-facing message. */
function validate(data: unknown): InquiryInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid submission.')
  }
  const d = data as Record<string, unknown>
  const name = String(d.name ?? '').trim()
  const email = String(d.email ?? '').trim()
  const company = String(d.company ?? '').trim()
  const type = String(d.type ?? '').trim()
  const message = String(d.message ?? '').trim()

  if (name.length < 2) throw new Error('Please enter your name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  if (message.length < 10) {
    throw new Error('Please tell us a little more about what you need.')
  }
  return { name, email, company, type, message }
}

export const submitInquiry = createServerFn({ method: 'POST' })
  .validator(validate)
  .handler(async ({ data }) => {
    /*
     * Inquiry received and validated on the server.
     *
     * TODO: wire this to a destination. Any of:
     *   • Email:  await resend.emails.send({ to: 'office@rothenhall.com', ... })
     *   • CRM:    POST to HubSpot / Attio / your RevOps stack (eat your own cooking)
     *   • Store:  append to a database or Google Sheet
     *
     * Until then, the submission is logged server-side so nothing is lost.
     */
    console.log('[Rothenhall inquiry]', {
      ...data,
      receivedAt: new Date().toISOString(),
    })

    return { ok: true as const }
  })
