/**
 * Rothenhall newsletter + forms webhook (Google Apps Script)
 * --------------------------------------------------------------
 * One script that:
 *   1. Receives every website form POST (doPost) and appends it to a
 *      per-form tab, with dynamic columns, so new fields are never dropped.
 *   2. Emails you a notification for each submission.
 *   3. On a `newsletter: true` opt-in, adds the email to a Subscribers tab
 *      (single opt-in) and sends a branded welcome with an unsubscribe link.
 *   4. Broadcasts an issue to all active subscribers from newsletter@rothenhall.com.
 *   5. Handles one-click unsubscribe (doGet) via the deployed web-app URL.
 *
 * See SETUP.md for the exact deploy steps.
 */

const CONFIG = {
  notifyEmail: 'office@rothenhall.com', // where new submissions are emailed
  newsletterFrom: 'newsletter@rothenhall.com', // sender for the newsletter
  fromName: 'Rothenhall Partners',
  siteUrl: 'https://www.rothenhall.com',
  // Shown in the newsletter footer (CAN-SPAM / good practice: a real postal address).
  postalAddress:
    'Rothenhall Partners, 2nd Floor, HAL 2nd Stage, Vimanapura, Bengaluru, Karnataka 560017, India',
}

const SUBS = 'Subscribers'
const SUB_HEADERS = [
  'email', 'name', 'source', 'status', 'token',
  'subscribedAt', 'unsubscribedAt', 'lastSentAt',
]
const COMPOSE = 'Compose' // tab where you write an issue: B1 = subject, B2 = body

/* ------------------------------------------------------------------ */
/*  Web endpoints                                                     */
/* ------------------------------------------------------------------ */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents) // { form, ...fields, receivedAt }
    appendSubmission_(data)
    if (truthy_(data.newsletter) && data.email) {
      subscribe_(String(data.email).trim().toLowerCase(), data.company || '', data.form || 'form')
    }
    notify_(data)
    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

function doGet(e) {
  const token = e && e.parameter && e.parameter.u
  if (token) return unsubscribeByToken_(token)
  return HtmlService.createHtmlOutput('Rothenhall newsletter service.')
}

/* ------------------------------------------------------------------ */
/*  Submissions                                                       */
/* ------------------------------------------------------------------ */

function appendSubmission_(data) {
  const sh = sheet_('form_' + (data.form || 'form'))
  let headers = sh.getLastRow() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : []
  let changed = false
  Object.keys(data).forEach((k) => {
    if (headers.indexOf(k) === -1) { headers.push(k); changed = true }
  })
  if (sh.getLastRow() === 0) sh.appendRow(headers)
  else if (changed) sh.getRange(1, 1, 1, headers.length).setValues([headers])
  sh.appendRow(headers.map((h) => (data[h] !== undefined ? data[h] : '')))
}

function notify_(data) {
  const lines = Object.keys(data).map((k) => k + ': ' + data[k]).join('\n')
  MailApp.sendEmail(CONFIG.notifyEmail, 'New ' + (data.form || 'form') + ' submission', lines)
}

/* ------------------------------------------------------------------ */
/*  Subscribers                                                       */
/* ------------------------------------------------------------------ */

function subscribe_(email, name, source) {
  const sh = sheet_(SUBS, SUB_HEADERS)
  const rows = sh.getDataRange().getValues()
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === email) {
      if (rows[i][3] !== 'active') {
        sh.getRange(i + 1, 4).setValue('active')
        sh.getRange(i + 1, 7).setValue('')
      }
      return rows[i][4]
    }
  }
  const token = Utilities.getUuid()
  sh.appendRow([email, name || '', source || '', 'active', token, new Date(), '', ''])
  try { sendWelcome_(email, token) } catch (err) {}
  return token
}

function unsubscribeByToken_(token) {
  const sh = sheet_(SUBS, SUB_HEADERS)
  const rows = sh.getDataRange().getValues()
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][4]) === token) {
      sh.getRange(i + 1, 4).setValue('unsubscribed')
      sh.getRange(i + 1, 7).setValue(new Date())
      return page_('You are unsubscribed',
        'You will no longer receive the Rothenhall newsletter. You can re-subscribe any time at rothenhall.com/founders.')
    }
  }
  return page_('Link not found', 'We could not find that subscription. It may already be removed.')
}

/* ------------------------------------------------------------------ */
/*  Sending                                                           */
/* ------------------------------------------------------------------ */

/** Compose an issue in the "Compose" tab (B1 subject, B2 body) then run this. */
function sendComposeSheet() {
  const sh = sheet_(COMPOSE, ['field', 'value'])
  if (sh.getLastRow() < 2) {
    sh.getRange('A1:B2').setValues([['subject', ''], ['body', '']])
    throw new Error('Fill Compose!B1 (subject) and Compose!B2 (body), then run again.')
  }
  const subject = String(sh.getRange('B1').getValue()).trim()
  const body = String(sh.getRange('B2').getValue()).trim()
  if (!subject || !body) throw new Error('Compose!B1 (subject) and Compose!B2 (body) are required.')
  const n = sendIssue(subject, body)
  SpreadsheetApp.getActive().toast('Sent to ' + n + ' subscribers.')
  return n
}

/** Send a plain string test to yourself before broadcasting. */
function sendTest(toEmail) {
  const to = toEmail || Session.getActiveUser().getEmail()
  sendOne_(to, '[Test] Rothenhall newsletter',
    '<p>This is a test of the Rothenhall newsletter.</p><p>GTM + AI news, coming to your inbox.</p>',
    'TEST-TOKEN')
  return 'sent test to ' + to
}

/** Broadcast to every active subscriber. body may be HTML or plain text. */
function sendIssue(subject, body) {
  const sh = sheet_(SUBS, SUB_HEADERS)
  const rows = sh.getDataRange().getValues()
  let sent = 0
  for (let i = 1; i < rows.length; i++) {
    const email = rows[i][0], name = rows[i][1], status = rows[i][3], token = rows[i][4]
    if (status !== 'active' || !email) continue
    sendOne_(email, subject, body, token, name)
    sh.getRange(i + 1, 8).setValue(new Date())
    sent++
    Utilities.sleep(150) // gentle pacing
  }
  return sent
}

function sendOne_(email, subject, body, token, name) {
  const unsub = webUrl_() + '?u=' + encodeURIComponent(token)
  const html = wrap_(isHtml_(body) ? body : textToHtml_(body), unsub)
  const opts = {
    name: CONFIG.fromName,
    htmlBody: html,
    replyTo: CONFIG.newsletterFrom,
  }
  // Use `from: newsletter@` only if it is a verified send-as alias on this account.
  // If the script itself runs *as* newsletter@rothenhall.com, leave it off.
  if (GmailApp.getAliases().indexOf(CONFIG.newsletterFrom) !== -1) {
    opts.from = CONFIG.newsletterFrom
  }
  GmailApp.sendEmail(email, subject, stripHtml_(html) + '\n\nUnsubscribe: ' + unsub, opts)
}

function sendWelcome_(email, token) {
  sendOne_(
    email,
    'You are on the list',
    '<p>Thanks for subscribing. You will get occasional GTM and AI news from Rothenhall Partners, no noise.</p>' +
      '<p>See where you stand in AI answers any time at <a href="' + CONFIG.siteUrl + '/founders">rothenhall.com/founders</a>.</p>',
    token,
  )
}

/* ------------------------------------------------------------------ */
/*  Branded email template                                            */
/* ------------------------------------------------------------------ */

function wrap_(inner, unsubUrl) {
  return (
    '<div style="margin:0;padding:0;background:#f7f3ea;">' +
    '<div style="max-width:600px;margin:0 auto;padding:40px 28px;font-family:Helvetica,Arial,sans-serif;color:#3a352c;">' +
    '<div style="font-family:Georgia,\'Times New Roman\',serif;font-size:22px;letter-spacing:1px;color:#1a1712;">ROTHENHALL</div>' +
    '<div style="height:1px;background:#ddd5c4;margin:20px 0 28px;"></div>' +
    '<div style="font-size:16px;line-height:1.6;">' + inner + '</div>' +
    '<div style="height:1px;background:#ddd5c4;margin:32px 0 16px;"></div>' +
    '<div style="font-size:12px;line-height:1.6;color:#857d6c;">' +
    CONFIG.postalAddress + '<br>' +
    'You are receiving this because you opted in at rothenhall.com/founders.<br>' +
    '<a href="' + unsubUrl + '" style="color:#a85c30;">Unsubscribe</a>' +
    '</div>' +
    '</div></div>'
  )
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sh = ss.getSheetByName(name)
  if (!sh) { sh = ss.insertSheet(name); if (headers) sh.appendRow(headers) }
  return sh
}
function webUrl_() { return ScriptApp.getService().getUrl() }
function truthy_(v) { return v === true || v === 'true' || v === 'on' || v === 1 }
function isHtml_(s) { return /<[a-z][\s\S]*>/i.test(s) }
function textToHtml_(s) {
  return s.split(/\n{2,}/).map((p) => '<p>' + p.replace(/\n/g, '<br>') + '</p>').join('')
}
function stripHtml_(s) { return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
function page_(title, body) {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:60px auto;padding:0 24px;color:#3a352c;">' +
    '<h1 style="font-family:Georgia,serif;color:#1a1712;">' + title + '</h1>' +
    '<p style="font-size:16px;line-height:1.6;">' + body + '</p></div>',
  ).setTitle(title)
}

/** Optional: a menu in the Sheet for one-click sending. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Rothenhall Newsletter')
    .addItem('Send test to me', 'sendTest')
    .addItem('Send issue from Compose tab', 'sendComposeSheet')
    .addToUi()
}
