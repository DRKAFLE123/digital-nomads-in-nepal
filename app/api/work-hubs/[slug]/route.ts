import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const hub = await prisma.workHub.findUnique({
      where: { slug: params.slug }
    })

    if (!hub) {
      return NextResponse.json({ error: "Work hub not found" }, { status: 404 })
    }

    return NextResponse.json(hub)
  } catch (err) {
    console.error("Failed to fetch hub details:", err)
    return NextResponse.json({ error: "Failed to fetch hub details" }, { status: 500 })
  }
}
