import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      password, // optional password field
      country,
      currentCity,
      workType,
      bio,
      linkedinUrl,
      twitterUrl,
      emailAlerts = true
    } = body

    if (!name || !email || !country || !password) {
      return NextResponse.json(
        { error: "Name, email, password, and country of origin are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if profile already exists
    const existingProfile = await prisma.nomadProfile.findUnique({
      where: { email }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "A community profile with this email already exists" },
        { status: 400 }
      )
    }

    // Check if user account already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "A user account with this email already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Create both User and NomadProfile in a transaction
    const { profile } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "NOMAD"
        }
      })

      const profile = await tx.nomadProfile.create({
        data: {
          name,
          email,
          country,
          currentCity: currentCity || null,
          workType: workType || "OTHER",
          bio: bio || null,
          linkedinUrl: linkedinUrl || null,
          twitterUrl: twitterUrl || null,
          emailAlerts: !!emailAlerts,
          passwordHash: hashedPassword
        }
      })

      return { user, profile }
    })

    // Auto-subscribe to newsletter if emailAlerts is enabled
    if (emailAlerts) {
      try {
        const subscriberExists = await prisma.subscriber.findUnique({
          where: { email }
        })
        if (!subscriberExists) {
          await prisma.subscriber.create({
            data: { email }
          })
        }

        // Brevo sync if API key exists (replicating newsletter subscription behavior)
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
              listIds: [2],
              attributes: {
                FIRSTNAME: name.split(" ")[0],
                LASTNAME: name.split(" ").slice(1).join(" ") || ""
              }
            })
          })

          if (!brevoRes.ok) {
            console.error("Brevo sync error during community join:", await brevoRes.text())
          }
        }
      } catch (subError) {
        console.error("Failed to auto-subscribe community member to subscriber list:", subError)
        // We do not fail the request if auto-sub fails, since profile creation was successful
      }
    }

    return NextResponse.json({ success: true, profile }, { status: 201 })
  } catch (error) {
    console.error("Community join error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
