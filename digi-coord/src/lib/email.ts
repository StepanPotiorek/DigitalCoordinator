import nodemailer from "nodemailer"
import { logger } from "./logger"
import * as emailTemplates from "./email-templates"

const FROM = "Digital Coordinator <stepan.potiorek@seznam.cz>"

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

  try {
    await transport.sendMail({ from: FROM, to, subject, html })
  } catch (error) {
    logger.error({ err: error, to }, "Failed to send email")
  }
}

export function sendIssueCreated(to: string, workerName: string, issueType: string, issueId: number) {
  return sendEmail(to, `New Issue Reported: ${issueType}`, emailTemplates.newIssueEmail(workerName, issueType, issueId))
}

export function sendIssueResolved(to: string, issueType: string) {
  return sendEmail(to, `Issue Resolved: ${issueType}`, emailTemplates.issueResolvedEmail(issueType))
}

export function sendUrgentIssueAlert(to: string, workerName: string, issueType: string, issueId: number) {
  return sendEmail(to, `🚨 URGENT: ${workerName} - ${issueType}`, emailTemplates.urgentIssueEmail(workerName, issueType, issueId))
}

export function sendRegistrationConfirmation(to: string, name: string) {
  return sendEmail(to, "Registration Received — Digital Coordinator", emailTemplates.registrationConfirmationEmail(name))
}

export function sendWorkerApproved(to: string, name: string) {
  return sendEmail(to, "Account Approved — Digital Coordinator", emailTemplates.workerApprovedEmail(name, `${process.env.NEXTAUTH_URL}/login`))
}

export function sendNewWorkerAlert(to: string, workerName: string, workerId: number) {
  return sendEmail(to, `New Worker Registered: ${workerName}`, emailTemplates.newWorkerEmail(workerName, workerId))
}

export function sendPasswordReset(to: string, resetUrl: string) {
  return sendEmail(to, "Password Reset — Digital Coordinator", emailTemplates.passwordResetEmail(resetUrl))
}
