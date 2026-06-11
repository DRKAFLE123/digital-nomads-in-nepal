import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, city, description, address, facilities, priceDaily, priceMonthly, contactEmail, website, photoUrl } = body

    if (!name || !city || !description || !address || !contactEmail) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    // Check if slug exists, if so append random characters
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
        isVerified: false, // Must be verified by admin
        isPartner: false,  // Must be partnered by admin
        facilities: facilities ?? [],
        priceDaily: priceDaily ? parseFloat(priceDaily) : null,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) : null,
      }
    })

    return NextResponse.json(hub, { status: 201 })
  } catch (err) {
    console.error("Partner registration failed:", err)
    return NextResponse.json({ error: "Partner registration failed" }, { status: 500 })
  }
}
