const DEFAULT_TO = 'office@rothenhall.com'

/**
 * Build a Gmail web-compose URL that opens a pre-filled new-message screen.
 *
 * Unlike `mailto:`, which hands off to whatever the OS/browser registers as the
 * default mail app (and silently does nothing, or drops the subject, when Gmail
 * is not that handler), this always opens Gmail's compose view with the
 * recipient and subject already filled in.
 */
export function gmailCompose(
  subject: string,
  opts: { to?: string; body?: string } = {},
): string {
  const to = opts.to ?? DEFAULT_TO
  let url =
    'https://mail.google.com/mail/?view=cm&fs=1&to=' +
    encodeURIComponent(to) +
    '&su=' +
    encodeURIComponent(subject)
  if (opts.body) url += '&body=' + encodeURIComponent(opts.body)
  return url
}
