import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { WorkType } from "@prisma/client"
import bcrypt from "bcryptjs"

// GET /api/community/profile?email=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const profile = await prisma.nomadProfile.findUnique({
      where: { email }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/community/profile
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const {
      email,
      name,
      avatarUrl,
      password,
      country,
      currentCity,
      workType,
      bio,
      linkedinUrl,
      twitterUrl,
      emailAlerts
    } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required to update profile" }, { status: 400 })
    }

    const existing = await prisma.nomadProfile.findUnique({
      where: { email }
    })

    if (!existing) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    let hashedPassword = undefined
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
      }
      hashedPassword = await bcrypt.hash(password, 12)
    }

    // Run updates in a transaction to keep User and NomadProfile synced
    const updated = await prisma.$transaction(async (tx) => {
      if (hashedPassword) {
        // Update credentials user password
        await tx.user.updateMany({
          where: { email },
          data: { password: hashedPassword }
        })
      }

      const profile = await tx.nomadProfile.update({
        where: { email },
        data: {
          name: name !== undefined ? name : undefined,
          avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
          passwordHash: hashedPassword !== undefined ? hashedPassword : undefined,
          country: country !== undefined ? country : undefined,
          currentCity: currentCity !== undefined ? currentCity : undefined,
          workType: workType !== undefined ? (workType as WorkType) : undefined,
          bio: bio !== undefined ? bio : undefined,
          linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : undefined,
          twitterUrl: twitterUrl !== undefined ? twitterUrl : undefined,
          emailAlerts: emailAlerts !== undefined ? !!emailAlerts : undefined
        }
      })
      return profile
    })

    // Sync newsletter status in Subscriber model if emailAlerts flag changed
    if (emailAlerts !== undefined) {
      try {
        if (emailAlerts) {
          const subExists = await prisma.subscriber.findUnique({ where: { email } })
          if (!subExists) {
            await prisma.subscriber.create({ data: { email } })
          }
        } else {
          // If they opted out, we delete them from subscriber table
          await prisma.subscriber.deleteMany({ where: { email } })
        }
      } catch (subErr) {
        console.error("Failed to sync Subscriber model on profile update:", subErr)
      }
    }

    return NextResponse.json({ success: true, profile: updated })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
