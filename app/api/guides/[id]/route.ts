import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET guide by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guide = await prisma.guide.findUnique({
      where: { id: params.id },
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!guide) {
      return NextResponse.json({ error: "Guide profile not found" }, { status: 404 })
    }

    return NextResponse.json(guide)
  } catch (err) {
    console.error("GET /api/guides/[id] error:", err)
    return NextResponse.json({ error: "Failed to fetch guide" }, { status: 500 })
  }
}

// PATCH update guide profile (bio, location, specialties, photoUrl, contactEmail, etc.)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { name, bio, location, specialties, photoUrl, contactEmail, website } = body

    const existing = await prisma.guide.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: "Guide profile not found" }, { status: 404 })
    }

    const updated = await prisma.guide.update({
      where: { id: params.id },
      data: {
        ...(name ? { name } : {}),
        ...(bio ? { bio } : {}),
        ...(location ? { location } : {}),
        ...(specialties ? { specialties } : {}),
        ...(photoUrl !== undefined ? { photoUrl } : {}),
        ...(contactEmail ? { contactEmail } : {}),
        ...(website !== undefined ? { website: website || null } : {})
      }
    })

    return NextResponse.json({ success: true, guide: updated })
  } catch (err) {
    console.error("PATCH /api/guides/[id] error:", err)
    return NextResponse.json({ error: "Failed to update guide profile" }, { status: 500 })
  }
}
