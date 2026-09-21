/**
 * IndexNow client.
 *
 * IndexNow is an open protocol (Microsoft Bing + partners) that lets a site
 * push newly created, updated, or removed URLs straight to search engines
 * instead of waiting for the next scheduled crawl of a sitemap. Key file is
 * hosted at the site root (public/<key>.txt) so the engine can verify ownership.
 *
 * Design notes:
 *  - Best-effort only. Publishing a blog post must NEVER fail because a search
 *    engine ping timed out or 4xx'd, so every error is swallowed and logged.
 *  - Short timeout via AbortController; serverless functions can be frozen right
 *    after the response, so we await (not fire-and-forget) but keep it quick.
 *  - The key is public by design (it lives at the site root), so it is safe to
 *    reference here; INDEXNOW_KEY env still lets you rotate without a code edit.
 */

const HOST = 'www.rothenhall.com'
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const KEY = process.env.INDEXNOW_KEY || '60bed373bbd04097b3ba237d4d6a169a'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

/**
 * Submit a batch of absolute URLs to IndexNow. Silently no-ops on empty input
 * and never throws — safe to call inline after a DB write.
 */
export async function submitToIndexNow(urls: Array<string | null | undefined>): Promise<void> {
  const urlList = [...new Set(urls.filter((u): u is string => Boolean(u)))]
  if (urlList.length === 0) return

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
        signal: controller.signal,
      })
      // 200 = accepted, 202 = received-but-not-validated, 400/403/422 = our fault.
      if (!res.ok) {
        console.warn(`[indexnow] ping returned ${res.status} for ${urlList.length} url(s)`)
      }
    } finally {
      clearTimeout(timer)
    }
  } catch (err) {
    // Network failure / abort — never surface to the caller.
    console.warn('[indexnow] ping failed', err instanceof Error ? err.message : err)
  }
}
