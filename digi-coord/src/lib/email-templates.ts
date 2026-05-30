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

export function newIssueEmail(workerName: string, issueType: string, issueId: number): string {
  return wrap(`
    <div class="header">
      <h1>New Issue Reported</h1>
      <p>${workerName} needs assistance</p>
    </div>
    <div class="label">Worker</div>
    <div class="value">${workerName}</div>
    <div class="label">Issue Type</div>
    <div class="value">${issueType}</div>
    <a href="${process.env.NEXTAUTH_URL}/dashboard/issues/${issueId}" class="button">View in Dashboard</a>
  `)
}

export function issueResolvedEmail(issueType: string): string {
  return wrap(`
    <div class="header">
      <h1>Issue Resolved</h1>
      <p>${issueType}</p>
    </div>
    <p style="color:#94a3b8;font-size:14px;">The issue has been marked as resolved.</p>
  `)
}

export function urgentIssueEmail(workerName: string, issueType: string, issueId: number): string {
  return wrap(`
    <div class="header">
      <h1 style="color:#f87171;">🚨 Urgent Issue</h1>
      <p>${workerName} — ${issueType}</p>
    </div>
    <div class="label">Worker</div>
    <div class="value">${workerName}</div>
    <div class="label">Issue Type</div>
    <div class="value">${issueType}</div>
    <a href="${process.env.NEXTAUTH_URL}/dashboard/issues/${issueId}" class="button">View in Dashboard</a>
  `)
}

export function newWorkerEmail(workerName: string, workerId: number): string {
  return wrap(`
    <div class="header">
      <h1>New Worker Registered</h1>
      <p>${workerName} has joined the platform</p>
    </div>
    <div class="label">Name</div>
    <div class="value">${workerName}</div>
    <a href="${process.env.NEXTAUTH_URL}/dashboard/workers/${workerId}" class="button">View Profile</a>
  `)
}

export function workerApprovedEmail(name: string, loginUrl: string): string {
  return wrap(`
    <div class="header">
      <h1>Account Approved</h1>
      <p>Welcome to Digital Coordinator, ${name}!</p>
    </div>
    <p style="color:#94a3b8;font-size:14px;">Your account has been approved. You can now sign in and start using the platform.</p>
    <a href="${loginUrl}" class="button">Sign In</a>
  `)
}

export function passwordResetEmail(resetUrl: string): string {
  return wrap(`
    <div class="header">
      <h1>Password Reset</h1>
      <p>Click the button below to reset your password</p>
    </div>
    <p style="color:#94a3b8;font-size:14px;">This link expires in 1 hour.</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
  `)
}
