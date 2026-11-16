import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendVerificationEmail, sendAdminNotificationEmail } from "@/lib/email"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`register-guide:${ip}`, { limit: 5, windowSeconds: 15 * 60 })

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${rateLimit.resetInSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      )
    }

    const body = await req.json()
    const { name, email, password, location, primarySpecialty, phone } = body

    if (!name || !email || !password || !location) {
      return NextResponse.json(
        { error: "Please provide your name, email, password, and location." },
        { status: 400 }
      )
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail) || normalizedEmail.length > 100) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in instead." },
        { status: 409 }
      )
    }

    // Hash password with 12 rounds
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate secure 24-hour verification token
    const verifyToken = crypto.randomBytes(32).toString("hex")
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Create User & Guide transactionally
    const specialtiesList = primarySpecialty ? [primarySpecialty] : ["Trekking & Culture"]
    
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: "GUIDE",
          emailVerified: null,
          verifyToken,
          verifyExpires,
        },
      })

      const guide = await tx.guide.create({
        data: {
          userId: user.id,
          name: name.trim(),
          tagline: `Local Guide & Explorer based in ${location}`,
          bio: `Hello! I am ${name.trim()}, a passionate local guide based in ${location}, Nepal. Welcome to my profile!`,
          location: location.trim(),
          contactEmail: normalizedEmail,
          phone: phone ? phone.trim() : null,
          specialties: specialtiesList,
          languages: ["Nepali", "English"],
          experienceYears: 3,
          profileStatus: "DRAFT",
          isVerified: false,
        },
      })

      return { user, guide }
    })

    // Construct verification URL
    const baseUrl = process.env.NEXTAUTH_URL || "https://digitalnomadsinnepal.com"
    const verifyUrl = `${baseUrl}/auth/verify?token=${verifyToken}`

    // Trigger verification email asynchronously (non-blocking)
    sendVerificationEmail({
      to: normalizedEmail,
      name: name.trim(),
      verifyUrl,
    }).catch((err) => console.error("Send verification email error:", err))

    // Send admin notification
    sendAdminNotificationEmail({
      subject: `New Local Guide Registration: ${name.trim()}`,
      title: "New Local Guide Registered",
      details: {
        Name: name.trim(),
        Email: normalizedEmail,
        Location: location.trim(),
        Specialty: primarySpecialty || "General",
        Phone: phone || "Not provided",
        Status: "Draft Profile Created",
      },
      actionUrl: `${baseUrl}/admin/guides`,
      actionText: "Review in Admin Console",
    }).catch((err) => console.error("Admin notification error:", err))

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    })
  } catch (error: any) {
    console.error("Register guide error:", error)
    return NextResponse.json(
      { error: error?.message || "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
