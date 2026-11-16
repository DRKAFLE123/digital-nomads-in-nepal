import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET bookings for an authorized nomad email or hub ID
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to view bookings." }, { status: 401 })
    }

    const sessionEmail = session.user.email.toLowerCase()
    const sessionRole = (session.user as { role?: string }).role
    const isAdmin = sessionRole === "ADMIN"

    const { searchParams } = new URL(req.url)
    const nomadEmail = searchParams.get("email")
    const hubId = searchParams.get("hubId")
    const status = searchParams.get("status")

    // IDOR Protection: Non-admins cannot query other nomads' bookings
    if (nomadEmail && nomadEmail.toLowerCase() !== sessionEmail && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You cannot view reservations of another user." },
        { status: 403 }
      )
    }

    // IDOR Protection: If querying by hubId, verify that caller is the hub owner or an admin
    if (hubId && !isAdmin) {
      const hub = await prisma.workHub.findUnique({
        where: { id: hubId },
        select: { ownerEmail: true, contactEmail: true }
      })
      if (!hub) {
        return NextResponse.json({ error: "Hub not found." }, { status: 404 })
      }
      const isHubOwner =
        hub.ownerEmail?.toLowerCase() === sessionEmail ||
        hub.contactEmail?.toLowerCase() === sessionEmail

      if (!isHubOwner) {
        return NextResponse.json(
          { error: "Forbidden: You are not authorized to view reservations for this hub." },
          { status: 403 }
        )
      }
    }

    const where: any = {}

    // Restrict scope to user's identity unless Admin
    if (!isAdmin) {
      if (hubId) {
        where.hubId = hubId
      } else {
        // Default to current user's email if no hubId specified
        where.nomadEmail = sessionEmail
      }
    } else {
      if (nomadEmail) where.nomadEmail = nomadEmail
      if (hubId) where.hubId = hubId
    }

    if (status && status !== "ALL") {
      where.status = status
    }

    const bookings = await prisma.hubBooking.findMany({
      where,
      include: {
        hub: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            address: true,
            photoUrl: true,
            contactEmail: true,
            facilities: true,
            openingHours: true,
            ownerEmail: true,
            ownerName: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(bookings)
  } catch (err) {
    console.error("GET /api/bookings error:", err)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

// POST create a new booking
export async function POST(req: NextRequest) {
  try {
    const { checkRateLimit, getClientIp } = await import("@/lib/rate-limit")
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`bookings-post:${ip}`, { limit: 10, windowSeconds: 15 * 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many booking requests. Please try again in ${rateLimit.resetInSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      )
    }

    const session = await getServerSession(authOptions)
    const body = await req.json()
    const { hubId, nomadName, nomadEmail, startDate, endDate, notes } = body

    if (!hubId || !nomadName || !nomadEmail || !startDate || !endDate) {
      return NextResponse.json(
        { error: "hubId, nomadName, nomadEmail, startDate, and endDate are required." },
        { status: 400 }
      )
    }

    const bookingStartDate = new Date(startDate)
    const bookingEndDate = new Date(endDate)

    if (isNaN(bookingStartDate.getTime()) || isNaN(bookingEndDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format." }, { status: 400 })
    }

    if (bookingEndDate <= bookingStartDate) {
      return NextResponse.json({ error: "Check-out date must be strictly after check-in date." }, { status: 400 })
    }

    // Do not allow reservations in the past
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    now.setDate(now.getDate() - 1)
    if (bookingStartDate < now) {
      return NextResponse.json({ error: "Reservation dates cannot be in the past." }, { status: 400 })
    }

    // Verify target hub exists
    const hub = await prisma.workHub.findUnique({ where: { id: hubId } })
    if (!hub) {
      return NextResponse.json({ error: "Target hub not found." }, { status: 404 })
    }

    // If authenticated, ensure nomadEmail matches authenticated user unless Admin
    const emailToUse = session?.user?.email ? session.user.email.toLowerCase() : String(nomadEmail).trim().toLowerCase()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailToUse) || emailToUse.length > 100) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
    }

    // Double-booking prevention
    const existingConflict = await prisma.hubBooking.findFirst({
      where: {
        hubId: hub.id,
        nomadEmail: emailToUse,
        status: { in: ["PENDING", "CONFIRMED"] },
        AND: [
          { startDate: { lt: bookingEndDate } },
          { endDate: { gt: bookingStartDate } }
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
        hubId,
        nomadName: String(nomadName).trim().slice(0, 100),
        nomadEmail: emailToUse,
        startDate: bookingStartDate,
        endDate: bookingEndDate,
        notes: notes ? String(notes).trim().slice(0, 1000) : null,
        status: "PENDING"
      },
      include: {
        hub: true
      }
    })

    return NextResponse.json({ success: true, booking }, { status: 201 })
  } catch (err) {
    console.error("POST /api/bookings error:", err)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

// PATCH update status (CONFIRMED, CANCELLED, etc.) with strict RBAC & IDOR checks
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const sessionEmail = session.user.email.toLowerCase()
    const sessionRole = (session.user as { role?: string }).role
    const isAdmin = sessionRole === "ADMIN"

    const body = await req.json()
    const { bookingId, status } = body

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "bookingId and status are required." },
        { status: 400 }
      )
    }

    const ALLOWED_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"]
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid booking status." }, { status: 400 })
    }

    // Fetch booking to verify ownership
    const booking = await prisma.hubBooking.findUnique({
      where: { id: bookingId },
      include: {
        hub: {
          select: { ownerEmail: true, contactEmail: true }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 })
    }

    const isNomad = booking.nomadEmail.toLowerCase() === sessionEmail
    const isHost =
      booking.hub?.ownerEmail?.toLowerCase() === sessionEmail ||
      booking.hub?.contactEmail?.toLowerCase() === sessionEmail

    if (!isAdmin && !isNomad && !isHost) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to modify this booking." },
        { status: 403 }
      )
    }

    // Nomads can ONLY cancel their own bookings, they cannot mark their own reservation as CONFIRMED
    if (isNomad && !isHost && !isAdmin) {
      if (status !== "CANCELLED") {
        return NextResponse.json(
          { error: "Forbidden: Nomads can only cancel reservations." },
          { status: 403 }
        )
      }
    }

    const updated = await prisma.hubBooking.update({
      where: { id: bookingId },
      data: { status }
    })

    return NextResponse.json({ success: true, booking: updated })
  } catch (err) {
    console.error("PATCH /api/bookings error:", err)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
