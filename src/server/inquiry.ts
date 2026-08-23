import { createServerFn } from '@tanstack/react-start'

/**
 * Forwards a validated submission to the forms webhook (a Google Apps Script
 * web app that appends to a Sheet and emails office@rothenhall.com). Set the
 * URL in the FORMS_WEBHOOK_URL environment variable. Always logs server-side as
 * a fallback, and never throws, so a webhook hiccup does not break the form.
 */
async function forward(form: string, data: Record<string, unknown>) {
  const payload = { form, ...data, receivedAt: new Date().toISOString() }
  console.log(`[Rothenhall ${form}]`, payload)
  const url = process.env.FORMS_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[Rothenhall forms] webhook failed', err)
  }
}

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

export type WaitlistInput = { name: string; email: string; company: string }

function validateWaitlist(data: unknown): WaitlistInput {
  if (!data || typeof data !== 'object') throw new Error('Invalid submission.')
  const d = data as Record<string, unknown>
  const name = String(d.name ?? '').trim()
  const email = String(d.email ?? '').trim()
  const company = String(d.company ?? '').trim()
  if (name.length < 2) throw new Error('Please enter your name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  return { name, email, company }
}

/** Cailyx waitlist signup. Same wiring note as submitInquiry applies. */
export const joinWaitlist = createServerFn({ method: 'POST' })
  .validator(validateWaitlist)
  .handler(async ({ data }) => {
    await forward('cailyx-waitlist', data)
    return { ok: true as const }
  })

export type CommunityInput = {
  name: string
  email: string
  company: string
  building: string
}

function validateCommunity(data: unknown): CommunityInput {
  if (!data || typeof data !== 'object') throw new Error('Invalid submission.')
  const d = data as Record<string, unknown>
  const name = String(d.name ?? '').trim()
  const email = String(d.email ?? '').trim()
  const company = String(d.company ?? '').trim()
  const building = String(d.building ?? '').trim()
  if (name.length < 2) throw new Error('Please enter your name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  return { name, email, company, building }
}

/** Founders Circle application. Same wiring note as submitInquiry applies. */
export const joinCommunity = createServerFn({ method: 'POST' })
  .validator(validateCommunity)
  .handler(async ({ data }) => {
    await forward('community', data)
    return { ok: true as const }
  })

export const submitInquiry = createServerFn({ method: 'POST' })
  .validator(validate)
  .handler(async ({ data }) => {
    await forward('inquiry', data)
    return { ok: true as const }
  })
