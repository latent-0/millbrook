import { createServerFn } from '@tanstack/react-start'
import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Razorpay Standard Checkout, server side.
 *
 * Two server functions (TanStack Start's equivalent of API routes):
 *   - createRazorpayOrder  -> POST https://api.razorpay.com/v1/orders
 *   - verifyRazorpayPayment -> HMAC-SHA256(order_id|payment_id) signature check
 *
 * The handler bodies run only on the server, so RAZORPAY_KEY_SECRET never
 * reaches the client bundle. Credentials come from environment variables:
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 * The KEY_ID is public and is returned to the client for the checkout modal;
 * the KEY_SECRET is used only here.
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

/* ------------------------------------------------------------------ */
/*  Create order                                                       */
/* ------------------------------------------------------------------ */

export type CreateOrderInput = {
  amount: number // in the smallest currency unit (paise for INR)
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

function validateOrder(data: unknown): Required<Omit<CreateOrderInput, 'notes'>> & {
  notes?: Record<string, string>
} {
  if (!data || typeof data !== 'object') throw new Error('Invalid request.')
  const d = data as Record<string, unknown>
  const amount = Math.round(Number(d.amount))
  if (!Number.isFinite(amount) || amount < 100) {
    // Razorpay minimum is 100 paise (INR 1.00).
    throw new Error('Amount must be at least 100 paise.')
  }
  const currency = (String(d.currency ?? 'INR').trim().toUpperCase() || 'INR').slice(0, 3)
  const receipt = (d.receipt ? String(d.receipt) : `rcpt_${Date.now()}`).slice(0, 40)
  const notes =
    d.notes && typeof d.notes === 'object'
      ? (Object.fromEntries(
          Object.entries(d.notes as Record<string, unknown>).map(([k, v]) => [
            k,
            String(v).slice(0, 256),
          ]),
        ) as Record<string, string>)
      : undefined
  return { amount, currency, receipt, notes }
}

export const createRazorpayOrder = createServerFn({ method: 'POST' })
  .validator(validateOrder)
  .handler(async ({ data }) => {
    const { keyId, keySecret } = creds()
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

    let res: Response
    try {
      res = await fetch(`${RAZORPAY_API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          receipt: data.receipt,
          notes: data.notes,
          payment_capture: 1,
        }),
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

    const order = (await res.json()) as {
      id: string
      amount: number
      currency: string
    }
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

    // Constant-time comparison; guard length first (timingSafeEqual throws on
    // mismatched lengths).
    const a = Buffer.from(expected)
    const b = Buffer.from(data.razorpay_signature)
    const verified = a.length === b.length && timingSafeEqual(a, b)

    if (!verified) {
      console.warn('[razorpay] signature mismatch for order', data.razorpay_order_id)
      // Do NOT treat this as paid.
      return { verified: false as const }
    }

    // Signature valid. This is where you would mark the order paid and fulfil
    // it if the project had an orders table. It does not, so we only log.
    console.log('[razorpay] payment verified', {
      orderId: data.razorpay_order_id,
      paymentId: data.razorpay_payment_id,
    })
    return { verified: true as const, paymentId: data.razorpay_payment_id }
  })
