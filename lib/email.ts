interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || "Digital Nomads in Nepal <noreply@digitalnomadsinnepal.com>"
  const recipients = Array.isArray(to) ? to : [to]

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: recipients,
          subject,
          html,
          text: text || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        return { success: true, id: data.id }
      } else {
        console.error("Resend API error:", data)
        return { success: false, error: data.message || "Failed to send email via Resend" }
      }
    } catch (err: any) {
      console.error("Resend network error:", err)
      return { success: false, error: err?.message || "Resend connection error" }
    }
  }

  // Fallback: Simulation in local/dev
  console.log(`[SIMULATED EMAIL to: ${recipients.join(", ")}] Subject: ${subject}`)
  return { success: true, id: "simulated-" + Date.now() }
}

/**
 * Sends a high-trust, responsive email verification email to a newly registered Guide or Host.
 */
export async function sendVerificationEmail({
  to,
  name,
  verifyUrl,
}: {
  to: string
  name: string
  verifyUrl: string
}) {
  const subject = "Verify your email — Digital Nomads in Nepal"
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
              
              <!-- Brand Header -->
              <tr>
                <td style="background-color: #023629; padding: 36px 32px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                    Digital Nomads <span style="color: #FB923C;">in Nepal</span>
                  </h1>
                  <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0; text-transform: uppercase; letter-spacing: 1px;">
                    Verified Community & Local Expert Network
                  </p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 36px 32px 28px;">
                  <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0 0 16px;">
                    Welcome, ${name}! 👋
                  </h2>
                  <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                    Thank you for joining <strong>Digital Nomads in Nepal</strong> as a partner. Please verify your email address to activate your partner profile and complete your dashboard onboarding.
                  </p>

                  <!-- Verification CTA Button -->
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${verifyUrl}" target="_blank" style="display: inline-block; background-color: #023629; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 36px; border-radius: 10px; box-shadow: 0 4px 12px rgba(2, 54, 41, 0.25);">
                      Verify Email Address →
                    </a>
                  </div>

                  <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 28px 0 0;">
                    This link will expire in 24 hours. If the button above doesn't work, copy and paste this link into your browser:
                  </p>
                  <p style="margin: 8px 0 0; word-break: break-all;">
                    <a href="${verifyUrl}" style="color: #2563eb; font-size: 12px; text-decoration: underline;">
                      ${verifyUrl}
                    </a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f1f5f9; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
                    Digital Nomads in Nepal • Kathmandu & Pokhara, Nepal<br/>
                    If you did not request this registration, you can safely ignore this email.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return sendEmail({
    to,
    subject,
    html,
    text: `Welcome ${name}! Please verify your email by opening this link: ${verifyUrl}`,
  })
}

interface AdminEmailParams {
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
}: AdminEmailParams) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@digitalnomadsinnepal.com"

  const detailsList = Object.entries(details)
    .map(
      ([key, val]) =>
        `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 12px; font-weight: bold; color: #444; width: 140px;">${key}:</td><td style="padding: 8px 12px; color: #111;">${val}</td></tr>`
    )
    .join("")

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #023629; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">Digital Nomads in Nepal</h1>
        <p style="color: #FB923C; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; font-weight: 700;">Admin System Alert</p>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 18px; font-weight: 700;">${title}</h2>
        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">A new registration or inquiry request requires review:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
          ${detailsList}
        </table>

        <div style="margin-top: 28px; text-align: center;">
          <a href="${actionUrl}" style="display: inline-block; background-color: #023629; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px;">${actionText}</a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        Digital Nomads in Nepal • Automated Admin Notification System
      </div>
    </div>
  `

  return sendEmail({
    to: adminEmail,
    subject: `[Admin Alert] ${subject}`,
    html,
  })
}
