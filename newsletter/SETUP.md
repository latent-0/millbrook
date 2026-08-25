# Rothenhall newsletter setup

This wires the `/founders` form to a Google Sheet and runs a newsletter loop
that sends to opted-in emails **from newsletter@rothenhall.com**, with one-click
unsubscribe. It replaces the old forms webhook with a more capable one, so all
your other forms keep working (they still append to the Sheet and email you).

## What you get

- Every form submission is appended to a tab named `form_<name>` (e.g.
  `form_diagnostic`), and emailed to `office@rothenhall.com`.
- Anyone who ticks **"Also send me GTM + AI news"** is added to a `Subscribers`
  tab and gets a branded welcome email.
- You write an issue in a `Compose` tab and send it to all active subscribers.
- Every email carries an unsubscribe link that works with one click.

## One-time setup (about 15 minutes)

### 1. Use the newsletter@ account (simplest path for the sender)

Log in to Google as **newsletter@rothenhall.com** (a Google Workspace mailbox on
your domain). Do the next steps while signed in as that account, so the newsletter
sends from it automatically with no alias juggling.

> Alternative: if you would rather run this from another account, add
> `newsletter@rothenhall.com` as a verified alias under Gmail → Settings →
> Accounts → "Send mail as". The script auto-detects the alias and uses it.

### 2. Create the Sheet + script

1. Create a new Google Sheet (e.g. "Rothenhall Forms & Newsletter").
2. **Extensions → Apps Script.**
3. Delete the default code, paste the contents of [`Code.gs`](./Code.gs).
4. Check the `CONFIG` block at the top (emails, address) and Save.

### 3. Deploy as a web app

1. In Apps Script: **Deploy → New deployment → Web app.**
2. **Execute as:** Me (newsletter@rothenhall.com).
3. **Who has access:** Anyone.
4. Deploy, authorize when prompted, and **copy the `/exec` Web app URL.**

### 4. Point the site at it

This script only handles the `/founders` diagnostic + newsletter. Your existing
`FORMS_WEBHOOK_URL` (all your other forms) stays exactly as it is. Add a **new,
separate** variable in Vercel → your project → Settings → Environment Variables:

```
NEWSLETTER_WEBHOOK_URL = <the /exec URL from step 3>
```

Redeploy the site. The diagnostic form now posts to this script (it captures the
email + newsletter opt-in and manages subscribers); everything else keeps using
`FORMS_WEBHOOK_URL` untouched. (If `NEWSLETTER_WEBHOOK_URL` is ever unset, the
diagnostic quietly falls back to `FORMS_WEBHOOK_URL`, so nothing breaks.)

### 5. Deliverability (so it lands in inboxes, not spam)

In Google Workspace Admin for rothenhall.com:

- **SPF**: DNS TXT record includes `include:_spf.google.com`.
- **DKIM**: Admin → Apps → Google Workspace → Gmail → Authenticate email →
  generate and publish the DKIM record, then turn it on.
- **DMARC**: a TXT record at `_dmarc.rothenhall.com`, e.g.
  `v=DMARC1; p=none; rua=mailto:office@rothenhall.com`.

Most Workspace domains already have SPF/DKIM. Confirm before your first send.

## Sending an issue

1. Open the Sheet. Use the **Compose** tab (created on first run):
   - `B1` = subject line
   - `B2` = the body (plain text is fine, blank lines become paragraphs; HTML also works)
2. First, **Rothenhall Newsletter → Send test to me** (menu appears after a reload).
3. Happy with it? **Rothenhall Newsletter → Send issue from Compose tab.**

You can also run `sendTest('you@domain.com')` or `sendIssue('Subject','Body')`
directly from the Apps Script editor.

## Notes & limits

- **Volume:** Workspace accounts can send ~1,500–2,000 emails/day via Apps Script.
  Fine for the Founders Circle. If the list grows into the thousands, move to a
  dedicated ESP (Resend, Buttondown, ConvertKit) and keep the same opt-in field.
- **Opt-in model:** this is single opt-in with a clear unsubscribe, which is
  standard for a B2B list people explicitly ticked. If you want double opt-in
  (a "confirm your subscription" click before they receive anything), say so and
  it is a small addition to `Code.gs`.
- **Records:** the `acceptTerms` column in `form_diagnostic` is your audit trail
  that each person granted crawl permission, with a timestamp.
