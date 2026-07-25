import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const hub = await prisma.workHub.update({
      where: { id: params.id },
      data: {
        name,
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
        rating: rating !== undefined ? parseFloat(rating) : undefined,
        totalReviews: totalReviews !== undefined ? parseInt(totalReviews) : undefined,
        facilities: facilities ?? [],
        priceDaily: priceDaily ? parseFloat(priceDaily) : null,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) : null,
      }
    })

    return NextResponse.json(hub)
  } catch (err) {
    console.error("Admin update hub failed:", err)
    return NextResponse.json({ error: "Failed to update hub" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await prisma.workHub.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Admin delete hub failed:", err)
    return NextResponse.json({ error: "Failed to delete hub" }, { status: 500 })
  }
}
