import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

// POST /api/auth/register — create a new user (Nomad, Guide, or Space Host)
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rateLimit = checkRateLimit(`register:${ip}`, { limit: 5, windowSeconds: 15 * 60 })

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: `Too many registration attempts. Please try again in ${rateLimit.resetInSeconds} seconds.` },
      { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
    )
  }

  const { name, email, password, role } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 })
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
  }

  const normalizedEmail = String(email).trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(normalizedEmail) || normalizedEmail.length > 100) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
  }

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
