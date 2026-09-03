import { createRazorpayOrder, verifyRazorpayPayment } from '../server/razorpay'

/**
 * Client side of Razorpay Standard Checkout.
 *
 * startCheckout() creates an order on the server, opens the Razorpay modal with
 * the returned order_id, and on success sends the three fields back to the
 * server for signature verification. KEY_SECRET is never touched here; the
 * public KEY_ID comes back from createRazorpayOrder.
 */

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

type RazorpayResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type RazorpayInstance = {
  open: () => void
  on: (event: string, cb: (resp: { error?: { description?: string } }) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance
  }
}

let scriptPromise: Promise<boolean> | null = null

/** Injects checkout.js once; resolves false if it cannot load. */
export function loadRazorpay(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<boolean>((resolve) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.onload = () => resolve(true)
    s.onerror = () => {
      scriptPromise = null
      resolve(false)
    }
    document.body.appendChild(s)
  })
  return scriptPromise
}

export type CheckoutArgs = {
  planId: string
  billing: 'monthly' | 'annual'
  country?: string // optional client hint; server geo header is authoritative
  name?: string
  description?: string
  prefill?: { name?: string; email?: string; contact?: string }
  onSuccess?: (result: { paymentId: string }) => void
  onError?: (message: string) => void
  onDismiss?: () => void
}

export async function startCheckout(args: CheckoutArgs): Promise<void> {
  const ok = await loadRazorpay()
  if (!ok || !window.Razorpay) {
    args.onError?.('Could not load the payment window. Check your connection and retry.')
    return
  }

  let order: Awaited<ReturnType<typeof createRazorpayOrder>>
  try {
    order = await createRazorpayOrder({
      data: {
        planId: args.planId,
        billing: args.billing,
        country: args.country,
      },
    })
  } catch (err) {
    args.onError?.(err instanceof Error ? err.message : 'Could not start checkout.')
    return
  }

  const rzp = new window.Razorpay({
    key: order.keyId,
    order_id: order.orderId,
    amount: order.amount,
    currency: order.currency,
    name: args.name ?? 'Rothenhall Partners',
    description: args.description,
    prefill: args.prefill,
    theme: { color: '#a85c30' },
    modal: {
      ondismiss: () => args.onDismiss?.(),
    },
    handler: async (resp: RazorpayResponse) => {
      try {
        const result = await verifyRazorpayPayment({
          data: {
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          },
        })
        if (result.verified) {
          args.onSuccess?.({ paymentId: resp.razorpay_payment_id })
        } else {
          args.onError?.(
            'Payment could not be verified. If any amount was deducted, contact us and we will resolve it.',
          )
        }
      } catch {
        args.onError?.(
          'We could not verify the payment. If any amount was deducted, contact us and we will resolve it.',
        )
      }
    },
  })

  rzp.on('payment.failed', (resp) => {
    args.onError?.(resp?.error?.description || 'The payment failed. Please try again.')
  })

  rzp.open()
}
