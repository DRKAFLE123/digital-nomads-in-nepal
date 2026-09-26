import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const unverifiedHubs = await prisma.workHub.findMany({
      where: { isVerified: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        city: true,
        ownerName: true,
        ownerEmail: true,
        createdAt: true,
        spaceType: true,
      },
    })

    const unverifiedGuides = await prisma.guide.findMany({
      where: { isVerified: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        location: true,
        contactEmail: true,
        createdAt: true,
      },
    })

    const notifications = [
      ...unverifiedHubs.map((h) => ({
        id: `hub-${h.id}`,
        type: "HUB_REGISTRATION",
        title: `Workspace Registration: ${h.name}`,
        subtitle: `${h.city} • By ${h.ownerName || h.ownerEmail}`,
        date: h.createdAt,
        href: `/admin`,
        entityId: h.id,
      })),
      ...unverifiedGuides.map((g) => ({
        id: `guide-${g.id}`,
        type: "GUIDE_REGISTRATION",
        title: `Guide Registration: ${g.name}`,
        subtitle: `${g.location} • ${g.contactEmail}`,
        date: g.createdAt,
        href: `/admin/guides`,
        entityId: g.id,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({
      totalCount: notifications.length,
      notifications,
    })
  } catch (err) {
    console.error("Failed to fetch admin notifications:", err)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}
