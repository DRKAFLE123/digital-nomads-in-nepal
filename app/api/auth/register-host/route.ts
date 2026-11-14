import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendVerificationEmail, sendAdminNotificationEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ownerName, email, password, spaceName, city, spaceType, phone } = body

    if (!ownerName || !email || !password || !spaceName || !city) {
      return NextResponse.json(
        { error: "Please provide your name, email, password, space name, and city." },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in to list your space." },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate secure 24-hour verification token
    const verifyToken = crypto.randomBytes(32).toString("hex")
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Generate unique slug for the space
    const baseSlug = spaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    let slug = baseSlug
    const conflict = await prisma.workHub.findUnique({ where: { slug } })
    if (conflict) {
      slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`
    }

    const defaultType = spaceType || "Coliving & Coworking Hub"

    // Create User (OWNER) and initial WorkHub record transactionally
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: ownerName.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: "OWNER",
          emailVerified: null,
          verifyToken,
          verifyExpires,
        },
      })

      const hub = await tx.workHub.create({
        data: {
          name: spaceName.trim(),
          slug,
          city: city.trim(),
          address: `${city.trim()}, Nepal`,
          description: `${spaceName.trim()} is a dedicated ${defaultType.toLowerCase()} located in ${city.trim()}, Nepal, welcoming digital nomads, remote workers, and traveling creatives.`,
          contactEmail: normalizedEmail,
          ownerEmail: normalizedEmail,
          ownerName: ownerName.trim(),
          spaceType: defaultType,
          facilities: [
            "High-Speed Fiber (100+ Mbps)",
            "Backup Power Generator (24/7)",
            "Ergonomic Workstations",
            "24/7 Access",
          ],
          isVerified: false,
          isPartner: false,
          published: true,
          priceDaily: 5,
          priceMonthly: 85,
        },
      })

      return { user, hub }
    })

    // Construct verification URL
    const baseUrl = process.env.NEXTAUTH_URL || "https://digitalnomadsinnepal.com"
    const verifyUrl = `${baseUrl}/auth/verify?token=${verifyToken}`

    // Send verification email via Resend
    sendVerificationEmail({
      to: normalizedEmail,
      name: ownerName.trim(),
      verifyUrl,
    }).catch((err) => console.error("Send verification email error:", err))

    // Send admin notification email
    sendAdminNotificationEmail({
      subject: `New Property Host Registration: ${spaceName.trim()} (${city.trim()})`,
      title: "New Property Host Registered",
      details: {
        "Space Name": spaceName.trim(),
        "City": city.trim(),
        "Space Type": defaultType,
        "Owner Name": ownerName.trim(),
        "Owner Email": normalizedEmail,
        "Phone / WhatsApp": phone || "Not provided",
        "Status": "Initial Draft Created — Verification Pending",
      },
      actionUrl: `${baseUrl}/admin`,
      actionText: "Open Admin Dashboard",
    }).catch((err) => console.error("Admin notification error:", err))

    return NextResponse.json({
      success: true,
      message: "Host account and space registered successfully.",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      hub: {
        id: result.hub.id,
        slug: result.hub.slug,
        name: result.hub.name,
      },
    })
  } catch (error: any) {
    console.error("Register host error:", error)
    return NextResponse.json(
      { error: error?.message || "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
