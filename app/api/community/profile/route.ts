import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { WorkType } from "@prisma/client"
import bcrypt from "bcryptjs"

// GET /api/community/profile?email=...
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const reqEmail = searchParams.get("email") || session.user.email

    const sessionRole = (session.user as { role?: string }).role
    if (reqEmail.toLowerCase() !== session.user.email.toLowerCase() && sessionRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Cannot view another user's private profile settings." }, { status: 403 })
    }

    const email = reqEmail.toLowerCase()

    let profile = await prisma.nomadProfile.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        country: true,
        currentCity: true,
        workType: true,
        bio: true,
        linkedinUrl: true,
        twitterUrl: true,
        emailAlerts: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!profile) {
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (user) {
        profile = await prisma.nomadProfile.create({
          data: {
            email,
            name: user.name,
            country: "Nepal",
            passwordHash: user.password
          },
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            country: true,
            currentCity: true,
            workType: true,
            bio: true,
            linkedinUrl: true,
            twitterUrl: true,
            emailAlerts: true,
            createdAt: true,
            updatedAt: true,
          }
        })
      } else {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
      }
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const body = await req.json()
    const {
      email: reqEmail,
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

    const targetEmail = reqEmail || session.user.email
    const sessionRole = (session.user as { role?: string }).role

    if (targetEmail.toLowerCase() !== session.user.email.toLowerCase() && sessionRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Cannot modify another user's profile." }, { status: 403 })
    }

    const email = targetEmail.toLowerCase()


    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 })
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

      const profile = await tx.nomadProfile.upsert({
        where: { email },
        create: {
          email,
          name: name || user.name || "Nomad User",
          avatarUrl: avatarUrl || null,
          passwordHash: hashedPassword || user.password || null,
          country: country || "Nepal",
          currentCity: currentCity || null,
          workType: workType ? (workType as WorkType) : "OTHER",
          bio: bio || null,
          linkedinUrl: linkedinUrl || null,
          twitterUrl: twitterUrl || null,
          emailAlerts: emailAlerts !== undefined ? !!emailAlerts : true
        },
        update: {
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
