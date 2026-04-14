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
      ...(specialty ? { specialties: { has: specialty } } : {}),
    },
    orderBy: { avgRating: "desc" },
    include: { _count: { select: { reviews: true } } },
  })

  return NextResponse.json(guides)
}

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

  return NextResponse.json(guide, { status: 201 })
}
