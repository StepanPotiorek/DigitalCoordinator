import nodemailer from "nodemailer"

const FROM = "Digital Coordinator <noreply@digicoord.cz>"

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
    console.log(`[EMAIL] To: ${to} | Subject: ${subject} (SMTP not configured)`)
    return
  }

  try {
    await transport.sendMail({ from: FROM, to, subject, html })
  } catch (error) {
    console.error(`[EMAIL] Failed to send to ${to}:`, error)
  }
}

export function sendIssueCreated(to: string, workerName: string, issueType: string, issueId: number) {
  return sendEmail(
    to,
    `New Issue Reported: ${issueType}`,
    `<p><strong>${workerName}</strong> reported a new issue:</p>
     <p><strong>Type:</strong> ${issueType}</p>
     <p><a href="${process.env.NEXTAUTH_URL}/dashboard/issues/${issueId}">View in Dashboard</a></p>`,
  )
}

export function sendIssueResolved(to: string, issueType: string) {
  return sendEmail(
    to,
    `Issue Resolved: ${issueType}`,
    `<p>An issue has been marked as resolved:</p>
     <p><strong>Type:</strong> ${issueType}</p>`,
  )
}

export function sendUrgentIssueAlert(to: string, workerName: string, issueType: string, issueId: number) {
  return sendEmail(
    to,
    `🚨 URGENT: ${workerName} - ${issueType}`,
    `<p><strong>URGENT issue reported by ${workerName}:</strong></p>
     <p><strong>Type:</strong> ${issueType}</p>
     <p><a href="${process.env.NEXTAUTH_URL}/dashboard/issues/${issueId}">View in Dashboard</a></p>`,
  )
}

export function sendNewWorkerAlert(to: string, workerName: string, workerId: number) {
  return sendEmail(
    to,
    `New Worker Registered: ${workerName}`,
    `<p>A new worker has registered:</p>
     <p><strong>Name:</strong> ${workerName}</p>
     <p><a href="${process.env.NEXTAUTH_URL}/dashboard/workers/${workerId}">View in Dashboard</a></p>`,
  )
}
