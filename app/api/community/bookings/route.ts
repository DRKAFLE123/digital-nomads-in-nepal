import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/community/bookings?email=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    const bookings = await prisma.hubBooking.findMany({
      where: { nomadEmail: email },
      include: {
        hub: {
          select: {
            id: true,
            name: true,
            city: true,
            slug: true,
            photoUrl: true,
            priceDaily: true,
            priceMonthly: true,
            contactEmail: true,
            website: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ success: true, bookings })
  } catch (error) {
    console.error("Bookings fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
