import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`book:${ip}`, { limit: 10, windowSeconds: 15 * 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many reservation requests. Please try again in ${rateLimit.resetInSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      )
    }

    const hub = await prisma.workHub.findUnique({
      where: { slug: params.slug }
    })

    if (!hub) {
      return NextResponse.json({ error: "Work hub not found" }, { status: 404 })
    }

    const session = await getServerSession(authOptions)
    const body = await req.json()
    const { nomadName, nomadEmail, startDate, endDate, notes } = body

    if (!nomadName || (!nomadEmail && !session?.user?.email) || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required booking fields." }, { status: 400 })
    }

    const normalizedEmail = (session?.user?.email || String(nomadEmail)).trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail) || normalizedEmail.length > 100) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
    }

    const start = new Date(startDate + "T00:00:00")
    const end = new Date(endDate + "T23:59:59")

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid start or end date format." }, { status: 400 })
    }

    if (end < start) {
      return NextResponse.json({ error: "End date must be on or after start date." }, { status: 400 })
    }

    // Do not allow reservations in the past (allow small grace buffer for timezones)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    now.setDate(now.getDate() - 1)
    if (start < now) {
      return NextResponse.json({ error: "Reservation dates cannot be in the past." }, { status: 400 })
    }

    // Double-booking prevention: Check if user already has an active overlapping reservation for this hub
    const existingConflict = await prisma.hubBooking.findFirst({
      where: {
        hubId: hub.id,
        nomadEmail: normalizedEmail,
        status: { in: ["PENDING", "CONFIRMED"] },
        AND: [
          { startDate: { lte: end } },
          { endDate: { gte: start } }
        ]
      }
    })

    if (existingConflict) {
      return NextResponse.json(
        { error: "You already have an active or pending reservation for this space overlapping these dates." },
        { status: 409 }
      )
    }

    const booking = await prisma.hubBooking.create({
      data: {
        hubId: hub.id,
        nomadName: (session?.user?.name || String(nomadName)).trim().slice(0, 100),
        nomadEmail: normalizedEmail,
        startDate: start,
        endDate: end,
        notes: notes ? String(notes).trim().slice(0, 1000) : null,
        status: "PENDING"
      }
    })

    const refCode = `DNN-${booking.id.slice(-4).toUpperCase()}`

    return NextResponse.json({ ...booking, refCode }, { status: 201 })
  } catch (err) {
    console.error("Booking request failed:", err)
    return NextResponse.json({ error: "Booking request failed" }, { status: 500 })
  }
}
