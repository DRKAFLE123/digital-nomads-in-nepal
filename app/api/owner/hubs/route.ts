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

    const sessionUserId = (session.user as { id?: string }).id
    const sessionRole = (session.user as { role?: string }).role
    if (ownerEmail.toLowerCase() !== session.user.email.toLowerCase() && sessionRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Cannot access hubs of another owner." }, { status: 403 })
    }

    const orConditions: Array<{ ownerId?: string; ownerEmail?: { equals: string }; contactEmail?: { equals: string } }> = [
      { ownerEmail: { equals: ownerEmail } },
      { contactEmail: { equals: ownerEmail } }
    ]
    if (sessionUserId) {
      orConditions.unshift({ ownerId: sessionUserId })
    }

    const hubs = await prisma.workHub.findMany({
      where: { OR: orConditions },
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

    const sessionUserId = (session.user as { id?: string }).id
    const sessionRole = (session.user as { role?: string }).role
    const isOwner =
      (existing.ownerId && existing.ownerId === sessionUserId) ||
      existing.ownerEmail?.toLowerCase() === session.user.email.toLowerCase() ||
      existing.contactEmail?.toLowerCase() === session.user.email.toLowerCase()
    const isAdmin = sessionRole === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: You do not own this hub" }, { status: 403 })
    }

    // Whitelist only editable fields with strict type, numeric, and length validation
    const allowedUpdates: Record<string, unknown> = {}
    // Link immutable ownerId if legacy hub was unlinked
    if (!existing.ownerId && sessionUserId && isOwner) {
      allowedUpdates.ownerId = sessionUserId
    }
    if (typeof rest.name === "string" && rest.name.trim()) allowedUpdates.name = rest.name.trim().slice(0, 150)
    if (typeof rest.city === "string" && rest.city.trim()) allowedUpdates.city = rest.city.trim().slice(0, 100)
    if (typeof rest.address === "string" && rest.address.trim()) allowedUpdates.address = rest.address.trim().slice(0, 250)
    if (typeof rest.description === "string" && rest.description.trim()) allowedUpdates.description = rest.description.trim().slice(0, 10000)
    
    if (typeof rest.priceDaily === "number" && Number.isFinite(rest.priceDaily) && rest.priceDaily >= 0) {
      allowedUpdates.priceDaily = Math.round(rest.priceDaily * 100) / 100
    }
    if (typeof rest.priceMonthly === "number" && Number.isFinite(rest.priceMonthly) && rest.priceMonthly >= 0) {
      allowedUpdates.priceMonthly = Math.round(rest.priceMonthly * 100) / 100
    }
    if (typeof rest.spaceType === "string") allowedUpdates.spaceType = rest.spaceType.trim().slice(0, 50)
    if (Array.isArray(rest.facilities)) allowedUpdates.facilities = rest.facilities.slice(0, 50)
    if (typeof rest.openingHours === "string") allowedUpdates.openingHours = rest.openingHours.trim().slice(0, 100)
    
    if (typeof rest.contactEmail === "string") {
      const email = rest.contactEmail.trim().toLowerCase()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(email) && email.length <= 100) {
        allowedUpdates.contactEmail = email
      }
    }
    if (typeof rest.website === "string") allowedUpdates.website = rest.website.trim().slice(0, 300)
    if (typeof rest.photoUrl === "string") allowedUpdates.photoUrl = rest.photoUrl.trim().slice(0, 1000)
    if (typeof rest.published === "boolean") allowedUpdates.published = rest.published

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

