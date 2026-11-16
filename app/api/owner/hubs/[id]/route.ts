import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Missing hub ID" }, { status: 400 })
    }

    const hub = await prisma.workHub.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    })

    if (!hub) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const sessionUserId = (session.user as { id?: string }).id
    const sessionRole = (session.user as { role?: string }).role
    const isOwner =
      (hub.ownerId && hub.ownerId === sessionUserId) ||
      hub.ownerEmail?.toLowerCase() === session.user.email.toLowerCase() ||
      hub.contactEmail?.toLowerCase() === session.user.email.toLowerCase()
    const isAdmin = sessionRole === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to view this property" }, { status: 403 })
    }

    return NextResponse.json(hub)
  } catch (err) {
    console.error("GET /api/owner/hubs/[id] error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
