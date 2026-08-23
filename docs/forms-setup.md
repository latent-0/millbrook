# Forms setup, Google Sheet + email (no Gmail redirect)

All three forms (Contact, Cailyx waitlist, Founders Circle) submit through a
TanStack server function, which forwards the data to a webhook. The recommended
webhook is a **Google Apps Script web app** bound to a Google Sheet that (1)
appends every submission as a row and (2) emails **office@rothenhall.com**
automatically. No mailto, no Gmail redirect, no third-party email service, and no
CORS issues (the POST is server-to-server).

Until `FORMS_WEBHOOK_URL` is set, submissions are still captured in the server
logs, so nothing is lost.

## Step 1, create the Sheet + script

1. Create a new Google Sheet (ideally under the office@rothenhall.com account, so
   the notification emails come from that account).
2. Extensions -> Apps Script. Delete the sample and paste:

```js
const RECIPIENT = 'office@rothenhall.com'

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName('Submissions') || ss.insertSheet('Submissions')
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received', 'Form', 'Name', 'Email', 'Company', 'Type / Building', 'Message'])
    }
    sheet.appendRow([
      data.receivedAt || new Date().toISOString(),
      data.form || '',
      data.name || '',
      data.email || '',
      data.company || '',
      data.type || data.building || '',
      data.message || '',
    ])
    MailApp.sendEmail({
      to: RECIPIENT,
      replyTo: data.email || RECIPIENT,
      subject: 'New ' + (data.form || 'form') + ' submission from ' + (data.name || 'someone'),
      body: Object.keys(data).map(function (k) { return k + ': ' + data[k] }).join('\n'),
    })
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
```

3. Save.

## Step 2, deploy as a web app

1. Deploy -> New deployment -> type: Web app.
2. Execute as: **Me**. Who has access: **Anyone**.
3. Authorize when prompted. Copy the **Web app URL** (ends in `/exec`).

The URL is a write-only webhook (it only appends and emails). Keep it in an env
var, not in the repo.

## Step 3, point the site at it

Set the environment variable `FORMS_WEBHOOK_URL` to the web app URL.

- Local dev: create `.env` (copy from `.env.example`) with
  `FORMS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec`
- Production (Vercel): Project Settings -> Environment Variables -> add
  `FORMS_WEBHOOK_URL`, then redeploy.

## Step 4, test

Submit any form. You should see a new row in the Sheet and an email at
office@rothenhall.com within a few seconds.

## Later upgrade (optional)

When the domain is live and DNS is set, swap or add a transactional email
service (Resend, Postmark) inside `forward()` in `src/server/inquiry.ts` for
branded, from-domain email. The Sheet can stay as the durable record.
