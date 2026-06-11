import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const totalMembers = await prisma.nomadProfile.count()

    const countriesGroup = await prisma.nomadProfile.groupBy({
      by: ["country"]
    })
    const totalCountries = countriesGroup.length

    const activeCheckIns = await prisma.hubCheckIn.count({
      where: {
        checkOutAt: null
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalMembers,
        totalCountries,
        activeCheckIns
      }
    })
  } catch (error) {
    console.error("Failed to fetch community stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export const dynamic = "force-dynamic"
