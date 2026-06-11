import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

// GET /api/admin/community - List all nomad profiles
export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const profiles = await prisma.nomadProfile.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        checkIns: {
          orderBy: { checkInAt: "desc" },
          take: 5,
          include: {
            hub: {
              select: { name: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ success: true, profiles })
  } catch (err) {
    console.error("Admin list community error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/admin/community - Delete a profile
export async function DELETE(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await prisma.nomadProfile.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: "Profile deleted successfully" })
  } catch (err) {
    console.error("Admin delete community profile error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/admin/community - Send bulk email blast
export async function POST(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { subject, body, type = "event" } = await req.json()

    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 })
    }

    // Find all subscribers with emailAlerts enabled
    const subscribers = await prisma.nomadProfile.findMany({
      where: { emailAlerts: true },
      select: { email: true, name: true }
    })

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No community members are currently subscribed to email alerts."
      })
    }

    const emails = subscribers.map(s => s.email)
    console.log(`Sending email blast [${type}] to ${emails.length} subscribers:`, emails)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)

    // If BREVO_API_KEY exists, we can use Brevo SMTP/Transactional Email API
    const BREVO_API_KEY = process.env.BREVO_API_KEY
    if (BREVO_API_KEY) {
      // Loop over subscribers or send via a bulk template
      // For simplicity and reliability in transactional APIs, send to each user
      for (const subscriber of subscribers) {
        try {
          const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "api-key": BREVO_API_KEY
            },
            body: JSON.stringify({
              sender: { name: "Digital Nomads Nepal", email: "info@digitalnomadsnepal.com" }, // fallbacks
              to: [{ email: subscriber.email, name: subscriber.name }],
              subject: subject,
              htmlContent: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                  <h2>Hello ${subscriber.name},</h2>
                  <p>${body.replace(/\n/g, "<br/>")}</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #777;">
                    You received this email because you joined the Digital Nomads in Nepal community.
                    If you wish to opt out, you can update your profile preferences.
                  </p>
                </div>
              `
            })
          })

          if (!emailRes.ok) {
            console.error(`Brevo SMTP failed for ${subscriber.email}:`, await emailRes.text())
          }
        } catch (sendErr) {
          console.error(`Failed to send email to ${subscriber.email}:`, sendErr)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully sent "${subject}" to ${emails.length} community member(s) (simulated/sent).`
    })
  } catch (err) {
    console.error("Admin send bulk email error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
