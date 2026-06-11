import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const hub = await prisma.workHub.findUnique({
      where: { slug: params.slug }
    })

    if (!hub) {
      return NextResponse.json({ error: "Work hub not found" }, { status: 404 })
    }

    const body = await req.json()
    const { nomadName, nomadEmail, startDate, endDate, notes } = body

    if (!nomadName || !nomadEmail || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required booking fields." }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid start or end date." }, { status: 400 })
    }

    if (start >= end) {
      return NextResponse.json({ error: "Start date must be before end date." }, { status: 400 })
    }

    const booking = await prisma.hubBooking.create({
      data: {
        hubId: hub.id,
        nomadName,
        nomadEmail,
        startDate: start,
        endDate: end,
        notes: notes || null
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (err) {
    console.error("Booking request failed:", err)
    return NextResponse.json({ error: "Booking request failed" }, { status: 500 })
  }
}
