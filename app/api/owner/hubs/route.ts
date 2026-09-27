import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET hubs owned by specific owner email
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const ownerEmail = searchParams.get("email") || session.user.email

    const sessionRole = (session.user as { role?: string }).role
    if (ownerEmail.toLowerCase() !== session.user.email.toLowerCase() && sessionRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Cannot access hubs of another owner." }, { status: 403 })
    }

    const hubs = await prisma.workHub.findMany({
      where: {
        OR: [
          { ownerEmail: { equals: ownerEmail } },
          { contactEmail: { equals: ownerEmail } }
        ]
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

// PATCH update hub properties with strict whitelist
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { hubId, ...rest } = body

    if (!hubId) {
      return NextResponse.json({ error: "hubId is required" }, { status: 400 })
    }

    // Verify ownership
    const existing = await prisma.workHub.findUnique({ where: { id: hubId } })
    if (!existing) {
      return NextResponse.json({ error: "Hub not found" }, { status: 404 })
    }

    const sessionRole = (session.user as { role?: string }).role
    const isOwner =
      existing.ownerEmail?.toLowerCase() === session.user.email.toLowerCase() ||
      existing.contactEmail?.toLowerCase() === session.user.email.toLowerCase()
    const isAdmin = sessionRole === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: You do not own this hub" }, { status: 403 })
    }

    // Whitelist only editable fields to prevent mass assignment
    const allowedUpdates: Record<string, unknown> = {}
    if (typeof rest.name === "string") allowedUpdates.name = rest.name.trim()
    if (typeof rest.city === "string") allowedUpdates.city = rest.city.trim()
    if (typeof rest.address === "string") allowedUpdates.address = rest.address.trim()
    if (typeof rest.description === "string") allowedUpdates.description = rest.description.trim()
    if (typeof rest.priceDaily === "number") allowedUpdates.priceDaily = rest.priceDaily
    if (typeof rest.priceMonthly === "number") allowedUpdates.priceMonthly = rest.priceMonthly
    if (typeof rest.spaceType === "string") allowedUpdates.spaceType = rest.spaceType
    if (Array.isArray(rest.facilities)) allowedUpdates.facilities = rest.facilities
    if (typeof rest.units === "number") allowedUpdates.units = rest.units
    if (typeof rest.openingHours === "string") allowedUpdates.openingHours = rest.openingHours
    if (typeof rest.contactEmail === "string") allowedUpdates.contactEmail = rest.contactEmail.trim().toLowerCase()
    if (typeof rest.contactPhone === "string") allowedUpdates.contactPhone = rest.contactPhone.trim()
    if (typeof rest.website === "string") allowedUpdates.website = rest.website.trim()
    if (typeof rest.photoUrl === "string") allowedUpdates.photoUrl = rest.photoUrl.trim()

    const updated = await prisma.workHub.update({
      where: { id: hubId },
      data: allowedUpdates
    })

    return NextResponse.json({ success: true, hub: updated })
  } catch (err) {
    console.error("PATCH /api/owner/hubs error:", err)
    return NextResponse.json({ error: "Failed to update hub" }, { status: 500 })
  }
}

