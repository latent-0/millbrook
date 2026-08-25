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
const COMPOSE = 'Compose' // tab where you write a one-off issue: B1 = subject, B2 = body
const QUEUE = 'Queue' // tab where you schedule issues, one per row
const QUEUE_HEADERS = ['sendOn', 'subject', 'body', 'status', 'sentAt', 'sentCount']

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

/* ------------------------------------------------------------------ */
/*  Scheduled sending (the Queue tab + a daily trigger)               */
/* ------------------------------------------------------------------ */

/**
 * Runs automatically once a day (see installDailyTrigger). Sends any Queue row
 * whose `sendOn` date has arrived and is not yet marked "sent". Put one issue
 * per row: sendOn (a date), subject, body. Leave status blank until it sends.
 */
function sendDueIssues() {
  const sh = sheet_(QUEUE, QUEUE_HEADERS)
  const rows = sh.getDataRange().getValues()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 1; i < rows.length; i++) {
    const sendOn = rows[i][0], subject = rows[i][1], body = rows[i][2], status = rows[i][3]
    if (String(status).toLowerCase() === 'sent') continue
    if (!subject || !body || !sendOn) continue
    const d = sendOn instanceof Date ? new Date(sendOn) : new Date(String(sendOn))
    if (isNaN(d.getTime())) continue
    d.setHours(0, 0, 0, 0)
    if (d.getTime() > today.getTime()) continue // not due yet
    const n = sendIssue(String(subject), String(body))
    sh.getRange(i + 1, 4).setValue('sent')
    sh.getRange(i + 1, 5).setValue(new Date())
    sh.getRange(i + 1, 6).setValue(n)
  }
}

/** Run this once to turn on automatic daily sending (fires around 8am). */
function installDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach((t) => {
    if (t.getHandlerFunction() === 'sendDueIssues') ScriptApp.deleteTrigger(t)
  })
  ScriptApp.newTrigger('sendDueIssues').timeBased().everyDays(1).atHour(8).create()
  const sh = sheet_(QUEUE, QUEUE_HEADERS) // make sure the tab exists
  if (sh.getLastRow() === 0) sh.appendRow(QUEUE_HEADERS)
  return 'Daily auto-send is on (about 8am). Add rows to the Queue tab.'
}

/* ------------------------------------------------------------------ */
/*  Auto news: pull fresh AI + GTM headlines, write a crisp issue      */
/*  with Gemini, send it. Set GEMINI_API_KEY in Script Properties.     */
/* ------------------------------------------------------------------ */

// A small, fast, cheap model to stay well under rate limits.
const GEMINI_MODEL = 'gemini-flash-latest'

// Google News RSS is free and current. Tune the queries to taste.
const NEWS_FEEDS = [
  'https://news.google.com/rss/search?q=' +
    encodeURIComponent('(artificial intelligence OR LLM OR "AI agents" OR OpenAI OR Anthropic) when:2d') +
    '&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=' +
    encodeURIComponent('("go-to-market" OR "B2B marketing" OR "AI search" OR "answer engine optimization") when:3d') +
    '&hl=en-US&gl=US&ceid=US:en',
]

function fetchNews_() {
  const items = []
  NEWS_FEEDS.forEach(function (u) {
    try {
      const xml = UrlFetchApp.fetch(u, { muteHttpExceptions: true }).getContentText()
      const channel = XmlService.parse(xml).getRootElement().getChild('channel')
      channel.getChildren('item').slice(0, 7).forEach(function (it) {
        items.push({ title: it.getChildText('title'), link: it.getChildText('link') })
      })
    } catch (e) {}
  })
  return items
}

function geminiCompose_(items) {
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY')
  if (!key) throw new Error('Set GEMINI_API_KEY in Project Settings > Script properties.')
  const headlines = items.map(function (i) { return '- ' + i.title + ' (' + i.link + ')' }).join('\n')
  const prompt =
    'You are the editor of the Rothenhall Partners newsletter for startup founders and operators. ' +
    'Using ONLY the news headlines below from the last couple of days, write one short, high-signal issue on AI and go-to-market.\n\n' +
    'Rules:\n' +
    '- Never use em dashes. Use commas, periods, or short sentences instead.\n' +
    '- Be compelling and concrete. Every point carries a specific insight or a clear "so what" for a founder, no filler.\n' +
    '- Keep it short: a one line intro, then 4 to 6 points, each 1 to 2 sentences, then a one line sign off.\n' +
    '- No hype words, no cliches, no "in today\'s fast-paced world".\n' +
    '- Where a point maps to a headline, link the key phrase to its source URL.\n\n' +
    'Return JSON { "subject": "...", "body": "..." } where body is simple HTML: <p> for the intro and sign off, and a <ul><li> list for the points, with the lead of each point wrapped in <strong>.\n\n' +
    'Headlines:\n' + headlines
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: { subject: { type: 'STRING' }, body: { type: 'STRING' } },
        required: ['subject', 'body'],
      },
    },
  }
  const res = UrlFetchApp.fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent',
    {
      method: 'post',
      contentType: 'application/json',
      headers: { 'X-goog-api-key': key },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    },
  )
  const data = JSON.parse(res.getContentText())
  if (!data.candidates || !data.candidates[0]) {
    throw new Error('Gemini returned no content: ' + res.getContentText().slice(0, 300))
  }
  return JSON.parse(data.candidates[0].content.parts[0].text)
}

/** mode: 'test' (to you), 'queue' (Queue tab, today), or 'all' (subscribers). */
function autoNewsIssue(mode) {
  const items = fetchNews_()
  if (!items.length) throw new Error('No news fetched, try again shortly.')
  const issue = geminiCompose_(items)
  if (mode === 'test') {
    sendOne_(Session.getEffectiveUser().getEmail(), '[Preview] ' + issue.subject, issue.body, 'PREVIEW')
    return 'Preview sent to you.'
  }
  if (mode === 'queue') {
    sheet_(QUEUE, QUEUE_HEADERS).appendRow([new Date(), issue.subject, issue.body, '', '', ''])
    return 'Queued for today.'
  }
  return sendIssue(issue.subject, issue.body)
}

/** Trigger handler for daily auto-news. */
function sendDailyNews() { return autoNewsIssue('all') }

/** Preview today's auto-issue in your own inbox first. */
function previewNewsIssue() { return autoNewsIssue('test') }

/** Run once to turn on daily auto-news (fires around 8am). */
function installNewsAutoSend() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sendDailyNews') ScriptApp.deleteTrigger(t)
  })
  ScriptApp.newTrigger('sendDailyNews').timeBased().everyDays(1).atHour(8).create()
  return 'Daily auto-news is on (about 8am).'
}

/** Optional: a menu in the Sheet for one-click actions. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Rothenhall Newsletter')
    .addItem('Preview today’s news issue (to me)', 'previewNewsIssue')
    .addItem('Send today’s news issue now', 'sendDailyNews')
    .addItem('Turn on daily auto-news', 'installNewsAutoSend')
    .addSeparator()
    .addItem('Send test to me', 'sendTest')
    .addItem('Send issue from Compose tab', 'sendComposeSheet')
    .addItem('Turn on scheduled Queue send', 'installDailyTrigger')
    .addItem('Send due queued issues now', 'sendDueIssues')
    .addToUi()
}
