import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`newsletter:${ip}`, { limit: 5, windowSeconds: 10 * 60 })

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many subscription attempts. Please try again in ${rateLimit.resetInSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      )
    }

    const { email } = await req.json()
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail) || normalizedEmail.length > 100) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    try {
      await prisma.subscriber.create({
        data: { email: normalizedEmail }
      })
    } catch (dbError: unknown) {
      // If already subscribed, return friendly success
      if (dbError && typeof dbError === "object" && "code" in dbError && dbError.code === "P2002") {
        return NextResponse.json({ success: true, message: "You are already subscribed!" }, { status: 200 })
      }
      console.error("Database save error:", dbError)
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY
    if (BREVO_API_KEY) {
      const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY
        },
        body: JSON.stringify({
          email: normalizedEmail,
          listIds: [2]
        })
      })

      if (!brevoRes.ok) {
        console.error("Brevo API Error", await brevoRes.text())
      }
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
