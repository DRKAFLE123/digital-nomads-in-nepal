import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to check in." }, { status: 401 })
    }

    const { email: reqEmail, hubId, action = "checkin" } = await req.json()
    const targetEmail = reqEmail || session.user.email

    const sessionRole = (session.user as { role?: string }).role
    if (targetEmail.toLowerCase() !== session.user.email.toLowerCase() && sessionRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Cannot check-in for another user." }, { status: 403 })
    }

    const email = targetEmail.toLowerCase()


    const profile = await prisma.nomadProfile.findUnique({
      where: { email }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found. Please join the community first!" }, { status: 404 })
    }

    if (action === "checkout") {
      // Checkout of any active hubs
      await prisma.hubCheckIn.updateMany({
        where: {
          profileId: profile.id,
          checkOutAt: null
        },
        data: {
          checkOutAt: new Date()
        }
      })

      return NextResponse.json({ success: true, message: "Checked out successfully" })
    }

    // Default action: checkin
    if (!hubId) {
      return NextResponse.json({ error: "Hub ID is required for checking in" }, { status: 400 })
    }

    const hub = await prisma.workHub.findUnique({
      where: { id: hubId }
    })

    if (!hub) {
      return NextResponse.json({ error: "Work Hub not found" }, { status: 404 })
    }

    // 1. Checkout of any other hubs first
    await prisma.hubCheckIn.updateMany({
      where: {
        profileId: profile.id,
        checkOutAt: null
      },
      data: {
        checkOutAt: new Date()
      }
    })

    // 2. Create new check-in
    const checkIn = await prisma.hubCheckIn.create({
      data: {
        profileId: profile.id,
        hubId: hub.id
      },
      include: {
        hub: true
      }
    })

    return NextResponse.json({
      success: true,
      message: `Checked in to ${hub.name} successfully`,
      checkIn
    })
  } catch (error) {
    console.error("Check-in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const checkIns = await prisma.hubCheckIn.findMany({
      where: {
        checkOutAt: null
      },
      include: {
        hub: {
          select: {
            id: true,
            name: true,
            city: true
          }
        },
        profile: {
          select: {
            id: true,
            name: true,
            country: true,
            workType: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        checkInAt: "desc"
      }
    })

    return NextResponse.json({ success: true, checkIns })
  } catch (error) {
    console.error("Failed to fetch active checkins:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"

