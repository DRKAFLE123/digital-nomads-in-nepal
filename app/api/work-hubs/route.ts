import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get("city")
    const facility = searchParams.get("facility")
    const search = searchParams.get("search")

    // Fetch all hubs
    const hubs = await prisma.workHub.findMany({
      orderBy: { rating: "desc" }
    })

    // Filter them in memory or via prisma query.
    // Given JSON fields, in-memory filtering is clean and consistent across databases.
    const filtered = hubs.filter(h => {
      // City check
      if (city && city !== "All Cities") {
        if (h.city.toLowerCase() !== city.toLowerCase()) return false
      }

      // Facility check
      if (facility && facility !== "All") {
        const facs = Array.isArray(h.facilities) ? (h.facilities as string[]) : []
        if (!facs.includes(facility)) return false
      }

      // Search check
      if (search) {
        const query = search.toLowerCase()
        const matchName = h.name.toLowerCase().includes(query)
        const matchDesc = h.description.toLowerCase().includes(query)
        const matchAddr = h.address.toLowerCase().includes(query)
        if (!matchName && !matchDesc && !matchAddr) return false
      }

      return true
    })

    return NextResponse.json(filtered)
  } catch (err) {
    console.error("Failed to fetch hubs:", err)
    return NextResponse.json({ error: "Failed to fetch hubs" }, { status: 500 })
  }
}
