import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"

/**
 * ONE-TIME bootstrap endpoint to initialize the first admin user in development or initial setup.
 * Protected by ADMIN_SETUP_SECRET from environment variables.
 * Permanently disabled once an admin exists or when running in production without initial setup.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_SETUP_SECRET
  if (!secret || secret.trim().length < 16) {
    return NextResponse.json(
      { error: "Admin setup is disabled. A strong ADMIN_SETUP_SECRET (min 16 chars) must be configured." },
      { status: 403 }
    )
  }

  try {
    const { setupToken, email: reqEmail, password: reqPassword } = await req.json()

    if (!setupToken || typeof setupToken !== "string") {
      return NextResponse.json({ error: "Invalid setup token." }, { status: 403 })
    }

    // Timing-safe secret comparison to prevent side-channel timing attacks
    const secretBuf = Buffer.from(secret)
    const tokenBuf = Buffer.from(setupToken)
    if (secretBuf.length !== tokenBuf.length || !crypto.timingSafeEqual(secretBuf, tokenBuf)) {
      return NextResponse.json({ error: "Invalid setup token." }, { status: 403 })
    }

    // Permanently block if any admin already exists — prevent remote takeover/overwrite
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists. Initial setup endpoint is permanently locked." },
        { status: 403 }
      )
    }

    const email = (reqEmail && typeof reqEmail === "string" ? reqEmail : "admin@digitalnomadsinnepal.com").toLowerCase().trim()
    const password = reqPassword && typeof reqPassword === "string" && reqPassword.length >= 12 ? reqPassword : null

    if (!password) {
      return NextResponse.json(
        { error: "A secure password of at least 12 characters is required." },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(password, 12)

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      const updated = await prisma.user.update({
        where: { email },
        data: { role: "ADMIN", password: hashed },
        select: { id: true, email: true, role: true },
      })
      return NextResponse.json({ message: "Existing user promoted to initial ADMIN", user: updated })
    }

    const user = await prisma.user.create({
      data: { name: "System Admin", email, password: hashed, role: "ADMIN" },
      select: { id: true, email: true, role: true },
    })

    return NextResponse.json({ message: "Initial Admin user created successfully", user }, { status: 201 })
  } catch (err) {
    console.error("Admin setup error:", err)
    return NextResponse.json({ error: "Failed to process admin setup request." }, { status: 500 })
  }
}

