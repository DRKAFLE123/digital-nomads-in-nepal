import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

/**
 * ONE-TIME setup endpoint to create the initial admin user.
 * Protected by a setup token so it cannot be abused.
 *
 * DELETE THIS FILE after first use.
 *
 * Usage:
 *   POST /api/setup-admin
 *   Body: { "setupToken": "nepal-admin-setup-2026" }
 */
export async function POST(req: NextRequest) {
  const { setupToken } = await req.json()

  // Simple hardcoded gate — prevents random people from calling this
  if (setupToken !== "nepal-admin-setup-2026") {
    return NextResponse.json({ error: "Invalid setup token." }, { status: 403 })
  }

  const email = "admin@gmail.com"
  const password = "admin123"
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
    data: { name: "Admin", email, password: hashed, role: "ADMIN" },
    select: { id: true, email: true, role: true },
  })

  return NextResponse.json({ message: "Admin user created", user }, { status: 201 })
}
