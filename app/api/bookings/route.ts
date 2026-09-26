import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET bookings for a nomad email or hub ID
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const nomadEmail = searchParams.get("email")
    const hubId = searchParams.get("hubId")
    const status = searchParams.get("status")

    const where: any = {}

    if (nomadEmail) {
      where.nomadEmail = nomadEmail
    }
    if (hubId) {
      where.hubId = hubId
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
    const body = await req.json()
    const { hubId, nomadName, nomadEmail, startDate, endDate, notes } = body

    if (!hubId || !nomadName || !nomadEmail || !startDate || !endDate) {
      return NextResponse.json(
        { error: "hubId, nomadName, nomadEmail, startDate, and endDate are required." },
        { status: 400 }
      )
    }

    const booking = await prisma.hubBooking.create({
      data: {
        hubId,
        nomadName,
        nomadEmail,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes: notes || null,
        status: "PENDING"
      },
      include: {
        hub: true
      }
    })

    return NextResponse.json({ success: true, booking })
  } catch (err) {
    console.error("POST /api/bookings error:", err)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

// PATCH update status (CONFIRMED, CANCELLED, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookingId, status } = body

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "bookingId and status are required." },
        { status: 400 }
      )
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
