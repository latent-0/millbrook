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
