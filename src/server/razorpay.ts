import { createServerFn } from '@tanstack/react-start'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { SERVICE_BY_ID, TERMS, isTerm, priceCart, type Cart, type Currency, type TermKey } from '../lib/catalog'
import { regionForCountry } from './geo'

/**
 * Razorpay Standard Checkout, server side.
 *
 *   - createEngagementOrder -> POST https://api.razorpay.com/v1/orders
 *   - verifyRazorpayPayment -> HMAC-SHA256(order_id|payment_id) signature check
 *
 * Every order is priced here, on the server, from the catalogue in
 * src/lib/catalog.ts, so the amount cannot be tampered with from the browser.
 * The buyer's location decides the currency: Europe is billed in EUR and
 * everywhere else, India included, in USD (international payments must be
 * enabled on the Razorpay account).
 *
 * Credentials come from environment variables (RAZORPAY_KEY_ID / _SECRET). The
 * KEY_ID is public and is returned to the client; the KEY_SECRET stays here.
 */

const RAZORPAY_API = 'https://api.razorpay.com/v1'

function creds() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new Error(
      'Payments are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
    )
  }
  return { keyId, keySecret }
}

/**
 * Buyer country. On Vercel the edge sets `x-vercel-ip-country`. `hint` is a
 * client fallback used only when the header is absent (local development).
 * Defaults to the US, so dollars are the safe default.
 */
async function detectCountry(hint?: string): Promise<string> {
  try {
    const mod = (await import('@tanstack/react-start/server')) as {
      getWebRequest?: () => Request | undefined
    }
    const c = mod.getWebRequest?.()?.headers?.get('x-vercel-ip-country')
    if (c) return c.toUpperCase()
  } catch {
    // request accessor unavailable (some dev contexts) -> use the hint
  }
  return (hint || 'US').toUpperCase()
}

/* ------------------------------------------------------------------ */
/*  Create an engagement order                                         */
/* ------------------------------------------------------------------ */

export type EngagementOrderInput = {
  term: TermKey
  items: { id: string; qty: number }[]
  founding: boolean
  name: string
  email: string
  company: string
  website: string
  country?: string
}

function validateEngagement(data: unknown): EngagementOrderInput {
  if (!data || typeof data !== 'object') throw new Error('Invalid request.')
  const d = data as Record<string, unknown>
  if (!isTerm(d.term)) throw new Error('Choose an engagement length.')
  const rawItems = Array.isArray(d.items) ? d.items.slice(0, 60) : []
  const items: { id: string; qty: number }[] = []
  for (const it of rawItems) {
    const r = it as Record<string, unknown>
    const id = String(r?.id ?? '')
    const svc = SERVICE_BY_ID.get(id)
    if (!svc) throw new Error('One of the services is no longer available.')
    const qty = Math.floor(Number(r?.qty) || 0)
    if (qty < 1 || qty > (svc.per?.max ?? 1)) throw new Error('Invalid quantity.')
    items.push({ id, qty })
  }
  if (!items.length) throw new Error('Add at least one service.')
  const name = String(d.name ?? '').trim()
  const email = String(d.email ?? '').trim()
  if (name.length < 2) throw new Error('Please enter your name.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.')
  return {
    term: d.term,
    items,
    founding: d.founding === true,
    name: name.slice(0, 120),
    email: email.slice(0, 160),
    company: String(d.company ?? '').trim().slice(0, 120),
    website: String(d.website ?? '').trim().slice(0, 200),
    country: d.country ? String(d.country).trim().slice(0, 2) : undefined,
  }
}

export const createEngagementOrder = createServerFn({ method: 'POST' })
  .validator(validateEngagement)
  .handler(async ({ data }) => {
    const { keyId, keySecret } = creds()

    const country = await detectCountry(data.country)
    const currency: Currency = regionForCountry(country) === 'EU' ? 'EUR' : 'USD'
    const cart: Cart = {}
    for (const it of data.items) cart[it.id] = it.qty
    const priced = priceCart(cart, data.term, currency, data.founding)
    if (priced.isEmpty || priced.dueToday < 1) throw new Error('Add at least one service.')

    // Minor units: cents for USD and EUR.
    const amount = Math.round(priced.dueToday * 100)
    const term = TERMS.find((t) => t.key === data.term)!
    const receipt = `eng_${data.term}_${Date.now()}`.slice(0, 40)
    const notes = {
      term: data.term,
      months: String(term.months),
      founding: data.founding ? 'yes' : 'no',
      services: data.items.map((i) => `${i.id}${i.qty > 1 ? 'x' + i.qty : ''}`).join(',').slice(0, 250),
      due_today: String(priced.dueToday),
      term_total: String(priced.termTotal),
      currency,
      country,
      name: data.name,
      email: data.email,
      company: data.company,
      website: data.website,
    }
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

    let res: Response
    try {
      res = await fetch(`${RAZORPAY_API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
        body: JSON.stringify({ amount, currency, receipt, notes, payment_capture: 1 }),
      })
    } catch (err) {
      console.error('[razorpay] network error creating order', err)
      throw new Error('Could not reach the payment provider. Please try again.')
    }
    if (res.status === 401) {
      console.error('[razorpay] authentication failed (401)')
      throw new Error('Payment provider authentication failed.')
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[razorpay] order create failed', res.status, text)
      throw new Error('Could not create the payment order. Please try again.')
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string }
    return { orderId: order.id, amount: order.amount, currency: order.currency, keyId }
  })

/* ------------------------------------------------------------------ */
/*  Verify payment signature                                           */
/* ------------------------------------------------------------------ */

export type VerifyInput = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

function validateVerify(data: unknown): VerifyInput {
  if (!data || typeof data !== 'object') throw new Error('Invalid request.')
  const d = data as Record<string, unknown>
  const razorpay_order_id = String(d.razorpay_order_id ?? '').trim()
  const razorpay_payment_id = String(d.razorpay_payment_id ?? '').trim()
  const razorpay_signature = String(d.razorpay_signature ?? '').trim()
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error('Missing payment fields.')
  }
  return { razorpay_order_id, razorpay_payment_id, razorpay_signature }
}

export const verifyRazorpayPayment = createServerFn({ method: 'POST' })
  .validator(validateVerify)
  .handler(async ({ data }) => {
    const { keySecret } = creds()
    const expected = createHmac('sha256', keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest('hex')

    const a = Buffer.from(expected)
    const b = Buffer.from(data.razorpay_signature)
    const verified = a.length === b.length && timingSafeEqual(a, b)

    if (!verified) {
      console.warn('[razorpay] signature mismatch for order', data.razorpay_order_id)
      return { verified: false as const }
    }

    console.log('[razorpay] payment verified', {
      orderId: data.razorpay_order_id,
      paymentId: data.razorpay_payment_id,
    })
    return { verified: true as const, paymentId: data.razorpay_payment_id }
  })
