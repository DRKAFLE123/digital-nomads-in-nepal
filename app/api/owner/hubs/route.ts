import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET hubs owned by specific owner email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ownerEmail = searchParams.get("email")

    if (!ownerEmail) {
      return NextResponse.json({ error: "Owner email is required" }, { status: 400 })
    }

    const hubs = await prisma.workHub.findMany({
      where: {
        ownerEmail: {
          equals: ownerEmail,
        }
      },
      include: {
        bookings: {
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(hubs)
  } catch (err) {
    console.error("GET /api/owner/hubs error:", err)
    return NextResponse.json({ error: "Failed to fetch owner hubs" }, { status: 500 })
  }
}

// PATCH update hub properties (priceDaily, priceMonthly, spaceType, facilities, address, units, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { hubId, ownerEmail, ...updateFields } = body

    if (!hubId) {
      return NextResponse.json({ error: "hubId is required" }, { status: 400 })
    }

    // Verify ownership
    const existing = await prisma.workHub.findUnique({ where: { id: hubId } })
    if (!existing) {
      return NextResponse.json({ error: "Hub not found" }, { status: 404 })
    }

    if (ownerEmail && existing.ownerEmail && existing.ownerEmail !== ownerEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updated = await prisma.workHub.update({
      where: { id: hubId },
      data: {
        ...updateFields
      }
    })

    return NextResponse.json({ success: true, hub: updated })
  } catch (err) {
    console.error("PATCH /api/owner/hubs error:", err)
    return NextResponse.json({ error: "Failed to update hub" }, { status: 500 })
  }
}
