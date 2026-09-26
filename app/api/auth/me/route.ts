import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({
        isLoggedIn: false,
        role: "NOMAD",
        isOwner: false,
        isGuide: false,
        ownerHubsCount: 0,
        guideId: null,
        pendingOwnerBookings: 0,
        pendingGuideInquiries: 0
      })
    }

    // 1. Check User table
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // 2. Check WorkHub ownership by email
    const ownedHubs = await prisma.workHub.findMany({
      where: {
        OR: [
          { ownerEmail: email },
          { contactEmail: email }
        ]
      },
      include: {
        bookings: {
          where: { status: "PENDING" }
        }
      }
    })

    const isOwner = ownedHubs.length > 0 || user?.role === "OWNER"
    const pendingOwnerBookings = ownedHubs.reduce((acc, h) => acc + (h.bookings ? h.bookings.length : 0), 0)

    // 3. Check Guide profile by contactEmail
    const guideProfile = await prisma.guide.findFirst({
      where: { contactEmail: email }
    })

    const isGuide = !!guideProfile || user?.role === "GUIDE"

    // If user's role in DB is NOMAD but they registered property/guide, auto update User role in DB
    if (user && user.role === "NOMAD") {
      if (isOwner) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "OWNER" }
        })
      } else if (isGuide) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "GUIDE" }
        })
      }
    }

    return NextResponse.json({
      isLoggedIn: true,
      user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null,
      role: isOwner ? "OWNER" : isGuide ? "GUIDE" : user?.role || "NOMAD",
      isOwner,
      isGuide,
      ownerHubsCount: ownedHubs.length,
      guideId: guideProfile?.id || null,
      pendingOwnerBookings,
      pendingGuideInquiries: 1 // sample pending inquiry count for demonstration
    })
  } catch (err) {
    console.error("GET /api/auth/me error:", err)
    return NextResponse.json({ error: "Failed to fetch user status" }, { status: 500 })
  }
}
