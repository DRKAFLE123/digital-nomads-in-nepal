import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    try {
      await prisma.subscriber.create({
        data: { email }
      })
    } catch (dbError) {
      console.error("Database save error. If running without DB, ignoring this for Brevo push.", dbError)
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
          email: email,
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
