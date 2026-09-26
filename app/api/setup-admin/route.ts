import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

/**
 * ONE-TIME setup endpoint to create the initial admin user.
 * Protected by ADMIN_SETUP_SECRET from environment variables.
 *
 * In production, this route is disabled unless ADMIN_SETUP_SECRET is configured.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_SETUP_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: "Admin setup is disabled. Set ADMIN_SETUP_SECRET in your environment variables to enable." },
      { status: 403 }
    )
  }

  try {
    const { setupToken, email: reqEmail, password: reqPassword, allowOverwrite } = await req.json()

    if (!setupToken || setupToken !== secret) {
      return NextResponse.json({ error: "Invalid setup token." }, { status: 403 })
    }

    const email = (reqEmail && typeof reqEmail === "string" ? reqEmail : "admin@digitalnomadsinnepal.com").toLowerCase().trim()
    const password = reqPassword && typeof reqPassword === "string" && reqPassword.length >= 8 ? reqPassword : null

    if (!password) {
      return NextResponse.json(
        { error: "A secure password of at least 8 characters is required." },
        { status: 400 }
      )
    }

    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (existingAdmin && !allowOverwrite) {
      return NextResponse.json(
        { error: "An admin user already exists. Setup cannot be rerun without explicit allowOverwrite flag." },
        { status: 409 }
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
      return NextResponse.json({ message: "User promoted to ADMIN", user: updated })
    }

    const user = await prisma.user.create({
      data: { name: "System Admin", email, password: hashed, role: "ADMIN" },
      select: { id: true, email: true, role: true },
    })

    return NextResponse.json({ message: "Admin user created successfully", user }, { status: 201 })
  } catch (err) {
    console.error("Admin setup error:", err)
    return NextResponse.json({ error: "Failed to process admin setup request." }, { status: 500 })
  }
}

