import nodemailer from "nodemailer"

interface EmailParams {
  subject: string
  title: string
  details: Record<string, string>
  actionUrl?: string
  actionText?: string
}

export async function sendAdminNotificationEmail({
  subject,
  title,
  details,
  actionUrl = "https://digitalnomadsinnepal.com/admin",
  actionText = "Open Admin Dashboard",
}: EmailParams) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@digitalnomadsinnepal.com"

  const detailsList = Object.entries(details)
    .map(
      ([key, val]) =>
        `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 12px; font-weight: bold; color: #444; width: 140px;">${key}:</td><td style="padding: 8px 12px; color: #111;">${val}</td></tr>`
    )
    .join("")

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #090d16; padding: 24px; text-align: center;">
        <h1 style="color: #FFD700; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">Digital Nomads in Nepal</h1>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; tracking: 1px;">Admin System Alert</p>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 18px; font-weight: 700;">${title}</h2>
        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">A new registration request requires admin review and verification:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
          ${detailsList}
        </table>

        <div style="margin-top: 28px; text-align: center;">
          <a href="${actionUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">${actionText}</a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        Digital Nomads in Nepal • Automated Admin Notification System
      </div>
    </div>
  `

  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      })

      await transporter.sendMail({
        from: `"Digital Nomads Nepal" <${user}>`,
        to: adminEmail,
        subject: `[Admin Alert] ${subject}`,
        html: htmlContent,
      })
      console.log(`Email alert successfully sent to ${adminEmail}`)
    } catch (err) {
      console.error("Nodemailer send email error:", err)
    }
  } else {
    console.log(`[SIMULATED EMAIL ALERT TO ${adminEmail}] Subject: ${subject}`)
  }
}
