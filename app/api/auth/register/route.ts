import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// POST /api/auth/register — create a new user (Nomad, Guide, or Space Host)
export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (existingUser) {
    return NextResponse.json({ error: "Email already registered." }, { status: 409 })
  }

  // Sanitize role: NOMAD | GUIDE | OWNER
  let assignedRole: "NOMAD" | "GUIDE" | "OWNER" = "NOMAD"
  if (role === "GUIDE") assignedRole = "GUIDE"
  if (role === "OWNER") assignedRole = "OWNER"

  const hashedPassword = await bcrypt.hash(password, 12)

  const { user } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: assignedRole
      },
      select: { id: true, email: true, name: true, role: true },
    })

    if (assignedRole === "GUIDE") {
      // Auto-create initial Guide profile record linked to user
      await tx.guide.create({
        data: {
          userId: user.id,
          name: name.trim(),
          contactEmail: normalizedEmail,
          bio: "Licensed local trekking and cultural guide in Nepal. Passionate about sharing the Himalayas with travelers.",
          location: "Kathmandu / Pokhara, Nepal",
          specialties: ["Trekking", "Cultural Tours"],
          languages: ["English", "Nepali"],
          profileStatus: "DRAFT"
        }
      })
    } else if (assignedRole === "NOMAD") {
      await tx.nomadProfile.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          country: "Worldwide 🌍",
          passwordHash: hashedPassword,
        }
      })
    }

    return { user }
  })

  return NextResponse.json(user, { status: 201 })
}
