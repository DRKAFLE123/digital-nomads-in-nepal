import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, hubId, action = "checkin" } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

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

