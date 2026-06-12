import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// POST /api/auth/register — create a new Nomad user
export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: "Email already registered." }, { status: 409 })
  }

  const existingProfile = await prisma.nomadProfile.findUnique({ where: { email } })
  if (existingProfile) {
    return NextResponse.json({ error: "Email already registered as a community member." }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const { user } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, password: hashedPassword, role: "NOMAD" },
      select: { id: true, email: true, name: true, role: true },
    })

    await tx.nomadProfile.create({
      data: {
        name,
        email,
        country: "Worldwide 🌍",
        passwordHash: hashedPassword,
      }
    })

    return { user }
  })

  return NextResponse.json(user, { status: 201 })
}
