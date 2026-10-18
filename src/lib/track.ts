/**
 * Funnel events. Sends a named event to Google Analytics when it is loaded, and
 * does nothing otherwise, so it can be called anywhere without a guard. The
 * event names match the funnel table in docs/icp-search-and-funnel.md.
 */
export type FunnelEvent =
  | 'cta_free_score'
  | 'diagnostic_select'
  | 'diagnostic_click'
  | 'tier_select'
  | 'addon_add'
  | 'estimate_request'
  | 'region_change'

export function track(event: FunnelEvent, params: Record<string, string | number | boolean> = {}) {
  try {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void }
    w.gtag?.('event', event, params)
  } catch {
    /* analytics must never break the page */
  }
}

/** Meta Pixel (dataset "Rothenhall Pixel" in the Rothenhall business). Public by design. */
export const META_PIXEL_ID = '1997864257575385'

/** Meta standard events this site sends. */
export type MetaEvent = 'PageView' | 'Lead'

/**
 * Sends a standard event to the Meta Pixel when it is loaded, and does nothing
 * otherwise. `eventId` lets a later Conversions API call deduplicate against it.
 */
export function metaTrack(
  event: MetaEvent,
  params: Record<string, string | number> = {},
  eventId?: string,
) {
  try {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void }
    if (eventId) w.fbq?.('track', event, params, { eventID: eventId })
    else w.fbq?.('track', event, params)
  } catch {
    /* analytics must never break the page */
  }
}
