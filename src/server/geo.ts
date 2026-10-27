import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

/**
 * Which currency a visitor sees. Two regions: Europe (EUR) and everywhere else,
 * including India, in US dollars (USD). There are no rupee prices.
 */
export type PriceRegion = 'US' | 'EU'

// EU member states, the EEA and the wider European countries we price in euro.
const EUROPE = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
  'SE', // EU 27
  'NO', 'IS', 'LI', // EEA
  'GB', 'CH', // UK and Switzerland
  'AD', 'AL', 'BA', 'MC', 'MD', 'ME', 'MK', 'RS', 'SM', 'UA', 'VA', 'XK',
])

export function regionForCountry(country: string): PriceRegion {
  return EUROPE.has(country.toUpperCase()) ? 'EU' : 'US'
}

/**
 * Reads the visitor's region on the server, so the right prices are in the
 * first paint. There is no manual override: the region always follows the
 * visitor's location. Order of precedence:
 *   1. the country from the edge (`x-vercel-ip-country` on Vercel,
 *      `cf-ipcountry` on Cloudflare),
 *   2. United States prices, with `detected: false`, so the page can fall back
 *      to the browser time zone (local development has no edge header).
 */
export const getPriceRegion = createServerFn({ method: 'GET' }).handler(
  async () => {
    const raw =
      getRequestHeader('x-vercel-ip-country') ||
      getRequestHeader('cf-ipcountry') ||
      ''
    const country = raw.trim().toUpperCase().slice(0, 2)
    const valid = /^[A-Z]{2}$/.test(country) && country !== 'XX' && country !== 'T1'
    return {
      detected: valid,
      country: valid ? country : '',
      region: valid ? regionForCountry(country) : ('US' as PriceRegion),
      source: valid ? ('location' as const) : ('default' as const),
    }
  },
)
