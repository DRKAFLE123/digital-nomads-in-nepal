import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/community/bookings?email=...
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const reqEmail = searchParams.get("email") || session.user.email

    const sessionRole = (session.user as { role?: string }).role
    if (reqEmail.toLowerCase() !== session.user.email.toLowerCase() && sessionRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Cannot view another user's bookings." }, { status: 403 })
    }

    const email = reqEmail.toLowerCase()


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
