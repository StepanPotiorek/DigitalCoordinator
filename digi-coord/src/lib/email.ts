import nodemailer from "nodemailer"
import { logger } from "./logger"

const FROM = "Digital Coordinator <gleestepan@gmail.com>"
const ADMIN_EMAIL = "gleestepan@gmail.com"

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

const STYLES = `
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 0 auto; padding: 24px; }
  .card { background: #1e293b; border-radius: 12px; padding: 24px; border: 1px solid #334155; }
  .header { text-align: center; margin-bottom: 24px; }
  .header h1 { color: #fff; font-size: 20px; margin: 0; }
  .header p { color: #94a3b8; font-size: 14px; margin: 4px 0 0; }
  .button { display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; margin-top: 12px; }
  .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #64748b; }
  .label { color: #94a3b8; font-size: 12px; margin-bottom: 2px; }
  .value { color: #e2e8f0; font-size: 14px; margin-bottom: 12px; }
  .divider { border: none; border-top: 1px solid #334155; margin: 20px 0; }
</style>
`

function wrap(html: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">${STYLES}</head><body><div class="wrapper"><div class="card">${html}<hr class="divider"><div class="footer"><p>Digital Coordinator — Podpora filipínských pracovníků</p></div></div></div></body></html>`
}

function getTransport() {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      secure: process.env.SMTP_SECURE === "true",
    })
  }
  return null
}

export async function sendEmail(to: string, subject: string, html: string) {
  const transport = getTransport()

  if (!transport) {
    logger.info({ to, subject }, "Email skipped (SMTP not configured)")
    return
  }

  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()

  try {
    await transport.sendMail({ from: FROM, to, subject, html, text })
  } catch (error) {
    logger.error({ err: error, to }, "Failed to send email")
  }
}

// --- Templates ---

function newIssueEmail(workerName: string, issueType: string, issueId: number): string {
  const wn = escapeHtml(workerName)
  const it = escapeHtml(issueType)
  return wrap(`
    <div class="header">
      <h1>New Issue Reported</h1>
      <p>${wn} needs assistance</p>
    </div>
    <div class="label">Worker</div>
    <div class="value">${wn}</div>
    <div class="label">Issue Type</div>
    <div class="value">${it}</div>
    <a href="${process.env.NEXTAUTH_URL}/dashboard/issues/${issueId}" class="button">View in Dashboard</a>
  `)
}

function issueResolvedEmail(issueType: string): string {
  const it = escapeHtml(issueType)
  return wrap(`
    <div class="header">
      <h1>Issue Resolved</h1>
      <p>${it}</p>
    </div>
    <p style="color:#94a3b8;font-size:14px;">The issue has been marked as resolved.</p>
  `)
}

function urgentIssueEmail(workerName: string, issueType: string, issueId: number): string {
  const wn = escapeHtml(workerName)
  const it = escapeHtml(issueType)
  return wrap(`
    <div class="header">
      <h1 style="color:#f87171;">🚨 Urgent Issue</h1>
      <p>${wn} — ${it}</p>
    </div>
    <div class="label">Worker</div>
    <div class="value">${wn}</div>
    <div class="label">Issue Type</div>
    <div class="value">${it}</div>
    <a href="${process.env.NEXTAUTH_URL}/dashboard/issues/${issueId}" class="button">View in Dashboard</a>
  `)
}

function newWorkerEmail(workerName: string, workerId: number): string {
  const wn = escapeHtml(workerName)
  return wrap(`
    <div class="header">
      <h1>New Worker Registered</h1>
      <p>${wn} has joined the platform</p>
    </div>
    <div class="label">Name</div>
    <div class="value">${wn}</div>
    <a href="${process.env.NEXTAUTH_URL}/dashboard/workers/${workerId}" class="button">View Profile</a>
  `)
}

function registrationConfirmationEmail(name: string): string {
  const n = escapeHtml(name)
  return wrap(`
    <div class="header">
      <h1>Registration Received</h1>
      <p>Welcome to Digital Coordinator, ${n}!</p>
    </div>
    <p style="color:#94a3b8;font-size:14px;">Your registration has been received. An admin will review your account and you will be notified once approved.</p>
    <p style="color:#94a3b8;font-size:14px;">If you have any questions, please contact support.</p>
  `)
}

function workerApprovedEmail(name: string, loginUrl: string): string {
  const n = escapeHtml(name)
  return wrap(`
    <div class="header">
      <h1>Account Approved</h1>
      <p>Welcome to Digital Coordinator, ${n}!</p>
    </div>
    <p style="color:#94a3b8;font-size:14px;">Your account has been approved. You can now sign in and start using the platform.</p>
    <a href="${loginUrl}" class="button">Sign In</a>
  `)
}

function workerMessageEmail(workerName: string, message: string, workerId: number): string {
  const wn = escapeHtml(workerName)
  const msg = escapeHtml(message)
  return wrap(`
    <div class="header">
      <h1>📩 Message from ${wn}</h1>
      <p>A worker has sent you a message</p>
    </div>
    <div class="label">Worker</div>
    <div class="value">${wn}</div>
    <div class="label">Message</div>
    <div class="value" style="background:#0f172a;padding:12px;border-radius:8px;white-space:pre-wrap;">${msg}</div>
    <a href="${process.env.NEXTAUTH_URL}/dashboard/workers/${workerId}" class="button">View in Dashboard</a>
  `)
}

// --- Send helpers ---

function sendIssueCreated(to: string, workerName: string, issueType: string, issueId: number) {
  return sendEmail(to, `New Issue Reported: ${issueType}`, newIssueEmail(workerName, issueType, issueId))
}

function sendIssueResolved(to: string, issueType: string) {
  return sendEmail(to, `Issue Resolved: ${issueType}`, issueResolvedEmail(issueType))
}

function sendUrgentIssueAlert(to: string, workerName: string, issueType: string, issueId: number) {
  return sendEmail(to, `🚨 URGENT: ${workerName} - ${issueType}`, urgentIssueEmail(workerName, issueType, issueId))
}

function sendRegistrationConfirmation(to: string, name: string) {
  return sendEmail(to, "Registration Received — Digital Coordinator", registrationConfirmationEmail(name))
}

function sendWorkerApproved(to: string, name: string) {
  return sendEmail(to, "Account Approved — Digital Coordinator", workerApprovedEmail(name, `${process.env.NEXTAUTH_URL}/login`))
}

function sendNewWorkerAlert(to: string, workerName: string, workerId: number) {
  return sendEmail(to, `New Worker Registered: ${workerName}`, newWorkerEmail(workerName, workerId))
}

// --- Public notify functions ---

export async function notifyAdminsOfIssue(workerName: string, issueType: string, issueId: number, priority: string) {
  if (priority === "URGENT") {
    await sendUrgentIssueAlert(ADMIN_EMAIL, workerName, issueType, issueId)
  } else {
    await sendIssueCreated(ADMIN_EMAIL, workerName, issueType, issueId)
  }
}

export async function notifyWorkerOfResolution(workerEmail: string, issueType: string) {
  if (workerEmail) await sendIssueResolved(workerEmail, issueType)
}

export async function notifyWorkerOfApproval(email: string, name: string) {
  if (email) await sendWorkerApproved(email, name)
}

export async function notifyWorkerOfRegistration(email: string, name: string) {
  if (email) await sendRegistrationConfirmation(email, name)
}

export async function notifyAdminsOfNewWorker(workerName: string, workerId: number) {
  await sendNewWorkerAlert(ADMIN_EMAIL, workerName, workerId)
}

// --- Public send function (used directly by other modules) ---

export function sendWorkerMessageAlert(to: string, workerName: string, message: string, workerId: number) {
  return sendEmail(to, `📩 Message from ${workerName}`, workerMessageEmail(workerName, message, workerId))
}
