import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"
import { BookingStatus } from "@prisma/client"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const bookings = await prisma.hubBooking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        hub: {
          select: {
            name: true,
            city: true
          }
        }
      }
    })
    return NextResponse.json(bookings)
  } catch (err) {
    console.error("Admin fetch bookings failed:", err)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Booking ID and status are required." }, { status: 400 })
    }

    if (!Object.values(BookingStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid booking status value." }, { status: 400 })
    }

    const updated = await prisma.hubBooking.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error("Admin update booking failed:", err)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
