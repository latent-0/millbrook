import { createServerFn } from '@tanstack/react-start'

/**
 * Forwards a validated submission to a Google Apps Script web app that appends
 * to a Sheet and emails office@rothenhall.com. Most forms go to
 * FORMS_WEBHOOK_URL; pass `urlEnv` to route a form to a different webhook (e.g.
 * the diagnostic/newsletter script at NEWSLETTER_WEBHOOK_URL). Always logs
 * server-side as a fallback, and never throws, so a webhook hiccup does not
 * break the form.
 */
async function forward(
  form: string,
  data: Record<string, unknown>,
  urlEnv: 'FORMS_WEBHOOK_URL' | 'NEWSLETTER_WEBHOOK_URL' = 'FORMS_WEBHOOK_URL',
) {
  const payload = { form, ...data, receivedAt: new Date().toISOString() }
  console.log(`[Rothenhall ${form}]`, payload)
  // Fall back to the general webhook if the specific one is not set yet.
  const url = process.env[urlEnv] || process.env.FORMS_WEBHOOK_URL
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

/**
 * "How did you hear about us?" options. AI assistants are broken out on purpose:
 * self-reported attribution is the single best signal for AI-driven discovery.
 */
export const SOURCE_OPTIONS = [
  'ChatGPT',
  'Claude',
  'Perplexity',
  'Google AI Overviews or Gemini',
  'Microsoft Copilot',
  'Google search',
  'LinkedIn',
  'X (Twitter)',
  'A referral or word of mouth',
  'A podcast, event, or talk',
  'Other',
] as const

export type InquiryInput = {
  name: string
  email: string
  company: string
  type: string
  message: string
  source: string
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
  const source = String(d.source ?? '').trim()

  if (name.length < 2) throw new Error('Please enter your name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  if (message.length < 10) {
    throw new Error('Please tell us a little more about what you need.')
  }
  return { name, email, company, type, message, source }
}

export type WaitlistInput = { name: string; email: string; company: string; source: string }

function validateWaitlist(data: unknown): WaitlistInput {
  if (!data || typeof data !== 'object') throw new Error('Invalid submission.')
  const d = data as Record<string, unknown>
  const name = String(d.name ?? '').trim()
  const email = String(d.email ?? '').trim()
  const company = String(d.company ?? '').trim()
  const source = String(d.source ?? '').trim()
  if (name.length < 2) throw new Error('Please enter your name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  return { name, email, company, source }
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
  source: string
}

function validateCommunity(data: unknown): CommunityInput {
  if (!data || typeof data !== 'object') throw new Error('Invalid submission.')
  const d = data as Record<string, unknown>
  const name = String(d.name ?? '').trim()
  const email = String(d.email ?? '').trim()
  const company = String(d.company ?? '').trim()
  const building = String(d.building ?? '').trim()
  const source = String(d.source ?? '').trim()
  if (name.length < 2) throw new Error('Please enter your name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  return { name, email, company, building, source }
}

/** Founders Circle application. Same wiring note as submitInquiry applies. */
export const joinCommunity = createServerFn({ method: 'POST' })
  .validator(validateCommunity)
  .handler(async ({ data }) => {
    await forward('community', data)
    return { ok: true as const }
  })

export type DiagnosticInput = {
  phone: string
  email: string
  company: string
  website: string
  description: string
  acceptTerms: boolean
  newsletter: boolean
  source: string
}

const truthy = (v: unknown) => v === true || v === 'true' || v === 'on' || v === 1

function validateDiagnostic(data: unknown): DiagnosticInput {
  if (!data || typeof data !== 'object') throw new Error('Invalid submission.')
  const d = data as Record<string, unknown>
  const phone = String(d.phone ?? '').trim()
  const email = String(d.email ?? '').trim()
  const company = String(d.company ?? '').trim()
  const website = String(d.website ?? '').trim()
  const description = String(d.description ?? '').trim()
  const acceptTerms = truthy(d.acceptTerms)
  const newsletter = truthy(d.newsletter)
  const source = String(d.source ?? '').trim()

  if (phone.replace(/\D/g, '').length < 7) {
    throw new Error('Please enter a valid phone number.')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  if (company.length < 2) throw new Error('Please enter your company name.')
  const host = website.replace(/^https?:\/\//i, '').replace(/\/+$/, '')
  if (!/^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(host)) {
    throw new Error('Please enter a valid website URL.')
  }
  if (!acceptTerms) throw new Error('Please accept the terms to continue.')
  return { phone, email, company, website, description, acceptTerms, newsletter, source }
}

/**
 * Founders Circle free AEO + GTM diagnostic claim. Routed to the dedicated
 * newsletter/diagnostic Apps Script (NEWSLETTER_WEBHOOK_URL) so it can capture
 * the email + newsletter opt-in and manage subscribers, without touching the
 * main forms webhook. Falls back to FORMS_WEBHOOK_URL if that env is unset.
 */
export const claimDiagnostic = createServerFn({ method: 'POST' })
  .validator(validateDiagnostic)
  .handler(async ({ data }) => {
    await forward('diagnostic', data, 'NEWSLETTER_WEBHOOK_URL')
    return { ok: true as const }
  })

export const submitInquiry = createServerFn({ method: 'POST' })
  .validator(validate)
  .handler(async ({ data }) => {
    await forward('inquiry', data)
    return { ok: true as const }
  })
