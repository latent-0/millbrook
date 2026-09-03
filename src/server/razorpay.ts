import { createServerFn } from '@tanstack/react-start'
import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Razorpay Standard Checkout, server side.
 *
 *   - createRazorpayOrder   -> POST https://api.razorpay.com/v1/orders
 *   - verifyRazorpayPayment -> HMAC-SHA256(order_id|payment_id) signature check
 *
 * The price list and the currency decision live here, on the server, so the
 * amount cannot be tampered with from the browser. The buyer's location decides
 * the currency: India is billed in INR, everyone else in USD (international
 * payments must be enabled on the Razorpay account for USD).
 *
 * Credentials come from environment variables (RAZORPAY_KEY_ID / _SECRET). The
 * KEY_ID is public and is returned to the client; the KEY_SECRET stays here.
 */

const RAZORPAY_API = 'https://api.razorpay.com/v1'

// Fixed INR conversion for India. Prices are authored in USD; Indian buyers pay
// USD x this rate, in whole rupees. Update in one place.
const USD_TO_INR = 95

// The charged amount per plan, in USD. `annual` is the full yearly total.
// This is the source of truth for pricing.
const PLANS: Record<string, { monthly: number; annual: number }> = {
  starter: { monthly: 89, annual: 828 }, // $69/mo billed annually
  growth: { monthly: 249, annual: 2388 }, // $199/mo billed annually
  scale: { monthly: 599, annual: 5988 }, // $499/mo billed annually
}

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
 * Buyer country. On Vercel the edge sets `x-vercel-ip-country`; we read it from
 * the server request. `hint` is a client-supplied fallback (e.g. derived from
 * the browser timezone) used only when the header is absent, such as in local
 * dev. Defaults to US so international pricing is the safe default.
 */
async function detectCountry(hint?: string): Promise<string> {
  try {
    const mod = (await import('@tanstack/react-start/server')) as {
      getWebRequest?: () => Request | undefined
    }
    const req = mod.getWebRequest?.()
    const c = req?.headers?.get('x-vercel-ip-country')
    if (c) return c.toUpperCase()
  } catch {
    // request accessor unavailable (e.g. some dev contexts) -> use hint
  }
  return (hint || 'US').toUpperCase()
}

/* ------------------------------------------------------------------ */
/*  Create order                                                       */
/* ------------------------------------------------------------------ */

export type CreateOrderInput = {
  planId: string
  billing: 'monthly' | 'annual'
  country?: string
}

function validateOrder(data: unknown): CreateOrderInput {
  if (!data || typeof data !== 'object') throw new Error('Invalid request.')
  const d = data as Record<string, unknown>
  const planId = String(d.planId ?? '').trim().toLowerCase()
  const billing = String(d.billing ?? '').trim() === 'monthly' ? 'monthly' : 'annual'
  const country = d.country ? String(d.country).trim().slice(0, 2) : undefined
  if (!PLANS[planId]) throw new Error('Unknown plan.')
  return { planId, billing, country }
}

export const createRazorpayOrder = createServerFn({ method: 'POST' })
  .validator(validateOrder)
  .handler(async ({ data }) => {
    const { keyId, keySecret } = creds()

    const plan = PLANS[data.planId]
    const usd = data.billing === 'annual' ? plan.annual : plan.monthly

    const country = await detectCountry(data.country)
    const isIndia = country === 'IN'
    const currency = isIndia ? 'INR' : 'USD'
    // INR charged in paise (USD x rate x 100); USD charged in cents (USD x 100).
    const amount = isIndia ? Math.round(usd * USD_TO_INR) * 100 : usd * 100

    if (amount < 100) throw new Error('Amount must be at least 100.')

    const receipt = `cailyx_${data.planId}_${data.billing}`.slice(0, 40)
    const notes = {
      plan: data.planId,
      billing: data.billing,
      country,
      currency,
    }
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

    let res: Response
    try {
      res = await fetch(`${RAZORPAY_API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
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
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // public key, safe for the client
    }
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
