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
    const { getServerSession } = await import("next-auth")
    const { authOptions } = await import("@/lib/auth")
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to edit your profile." }, { status: 401 })
    }

    const sessionEmail = session.user.email.toLowerCase()
    const sessionUserId = (session.user as { id?: string }).id
    const sessionRole = (session.user as { role?: string }).role
    const isAdmin = sessionRole === "ADMIN"

    const existing = await prisma.guide.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: "Guide profile not found" }, { status: 404 })
    }

    // IDOR check: only the guide owner or Admin can mutate this profile
    const isOwner =
      (existing.userId && existing.userId === sessionUserId) ||
      existing.contactEmail?.toLowerCase() === sessionEmail

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to edit this guide profile." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { 
      name, 
      tagline,
      bio, 
      location, 
      specialties, 
      photoUrl, 
      contactEmail, 
      phone,
      whatsapp,
      website,
      languages,
      experienceYears,
      licensedSince,
      licenseNumber,
      certifications,
      guidingAreas,
      profileStatus,
      galleryPhotos
    } = body

    const updateData: any = {
      ...(typeof name === "string" ? { name: name.trim().slice(0, 100) } : {}),
      ...(tagline !== undefined ? { tagline: typeof tagline === "string" ? tagline.trim().slice(0, 150) : null } : {}),
      ...(typeof bio === "string" ? { bio: bio.trim().slice(0, 5000) } : {}),
      ...(typeof location === "string" ? { location: location.trim().slice(0, 100) } : {}),
      ...(Array.isArray(specialties) ? { specialties } : {}),
      ...(photoUrl !== undefined ? { photoUrl: typeof photoUrl === "string" ? photoUrl.trim() : null } : {}),
      ...(typeof contactEmail === "string" ? { contactEmail: contactEmail.trim().toLowerCase() } : {}),
      ...(phone !== undefined ? { phone: typeof phone === "string" ? phone.trim().slice(0, 30) : null } : {}),
      ...(whatsapp !== undefined ? { whatsapp: typeof whatsapp === "string" ? whatsapp.trim().slice(0, 30) : null } : {}),
      ...(website !== undefined ? { website: typeof website === "string" ? website.trim() : null } : {}),
      ...(Array.isArray(languages) ? { languages } : {}),
      ...(experienceYears !== undefined ? { experienceYears: Math.max(0, Math.min(50, Number(experienceYears) || 0)) } : {}),
      ...(licensedSince !== undefined ? { licensedSince: licensedSince ? Number(licensedSince) : null } : {}),
      ...(licenseNumber !== undefined ? { licenseNumber: typeof licenseNumber === "string" ? licenseNumber.trim().slice(0, 50) : null } : {}),
      ...(Array.isArray(certifications) ? { certifications } : {}),
      ...(Array.isArray(guidingAreas) ? { guidingAreas } : {}),
      ...(typeof profileStatus === "string" ? { profileStatus: profileStatus === "PUBLISHED" ? "PUBLISHED" : "DRAFT" } : {}),
      ...(Array.isArray(galleryPhotos) ? { galleryPhotos } : {}),
    }

    const updated = await prisma.guide.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ success: true, guide: updated })
  } catch (err) {
    console.error("PATCH /api/guides/[id] error:", err)
    return NextResponse.json({ error: "Failed to update guide profile" }, { status: 500 })
  }
}
