import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/guides?city=Kathmandu&specialty=Trekking
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get("city")
  const specialty = searchParams.get("specialty")

  const guides = await prisma.guide.findMany({
    where: {
      ...(city ? { location: city } : {}),
    },
    orderBy: { avgRating: "desc" },
    include: { _count: { select: { reviews: true } } },
  })

  const filteredGuides = specialty 
    ? guides.filter(g => Array.isArray(g.specialties) && (g.specialties as string[]).includes(specialty))
    : guides

  return NextResponse.json(filteredGuides)
}

import { sendAdminNotificationEmail } from "@/lib/email"

// POST /api/guides — register a new guide
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, bio, location, specialties, photoUrl, contactEmail } = body

  if (!name || !bio || !location || !contactEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const guide = await prisma.guide.create({
    data: { name, bio, location, specialties: specialties ?? [], photoUrl, contactEmail },
  })

  // Auto-promote registering user role to GUIDE
  if (contactEmail) {
    await prisma.user.updateMany({
      where: { email: contactEmail },
      data: { role: "GUIDE" }
    }).catch(err => console.error("Failed to update user role to GUIDE:", err))
  }

  // Send email alert to admin
  try {
    await sendAdminNotificationEmail({
      subject: `New Local Guide Registration: ${name} (${location})`,
      title: `🏔️ Local Trekking/Expert Guide Application Submitted`,
      details: {
        "Guide Name": name,
        "Base Location": location,
        "Contact Email": contactEmail,
        "Specialties": Array.isArray(specialties) ? specialties.join(", ") : "Trekking",
      },
      actionUrl: `https://digitalnomadsinnepal.com/admin/guides`,
      actionText: "Verify Guide in Admin Panel",
    })
  } catch (e) {
    console.error("Failed to send admin guide alert:", e)
  }

  return NextResponse.json(guide, { status: 201 })
}
