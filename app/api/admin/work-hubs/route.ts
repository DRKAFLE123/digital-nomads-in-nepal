import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const hubs = await prisma.workHub.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(hubs)
  } catch (err) {
    console.error("Admin fetch hubs failed:", err)
    return NextResponse.json({ error: "Failed to fetch hubs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const { 
      name, 
      city, 
      description, 
      address, 
      facilities, 
      priceDaily, 
      priceMonthly, 
      contactEmail, 
      website, 
      photoUrl, 
      isVerified, 
      isPartner,
      ownerEmail,
      ownerName,
      spaceType,
      units,
      openingHours,
      rating,
      totalReviews
    } = body

    if (!name || !city || !description || !address || !contactEmail) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    let slug = baseSlug
    const conflict = await prisma.workHub.findUnique({ where: { slug } })
    if (conflict) {
      slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`
    }

    const hub = await prisma.workHub.create({
      data: {
        name,
        slug,
        city,
        description,
        address,
        contactEmail,
        website: website || null,
        photoUrl: photoUrl || null,
        ownerEmail: ownerEmail || contactEmail,
        ownerName: ownerName || null,
        spaceType: spaceType || "Coworking Hub",
        units: units ?? [],
        openingHours: openingHours || "24/7 Access",
        isVerified: !!isVerified,
        isPartner: !!isPartner,
        rating: rating !== undefined ? parseFloat(rating) : 4.5,
        totalReviews: totalReviews !== undefined ? parseInt(totalReviews) : 0,
        facilities: facilities ?? [],
        priceDaily: priceDaily ? parseFloat(priceDaily) : null,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) : null,
      }
    })

    return NextResponse.json(hub, { status: 201 })
  } catch (err) {
    console.error("Admin create hub failed:", err)
    return NextResponse.json({ error: "Failed to create hub" }, { status: 500 })
  }
}
