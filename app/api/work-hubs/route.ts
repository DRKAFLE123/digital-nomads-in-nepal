import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get("city")
    const category = searchParams.get("category")
    const facility = searchParams.get("facility")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "rating"
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : null
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null

    // Fetch all hubs
    let hubs = await prisma.workHub.findMany({
      orderBy: { rating: "desc" }
    })

    // In-memory filtering for flexible JSON & unit support
    let filtered = hubs.filter(h => {
      // City check
      if (city && city !== "All Cities" && city !== "All") {
        if (h.city.toLowerCase() !== city.toLowerCase()) return false
      }

      // Category check (Hot Desks, Dedicated Desks, Private Offices, Meeting Halls, 24/7 Access)
      if (category && category !== "All" && category !== "All Spaces") {
        const catLower = category.toLowerCase()
        const facs = Array.isArray(h.facilities) ? (h.facilities as string[]) : []
        const u = Array.isArray(h.units) ? (h.units as Array<{ type?: string; name?: string }>) : []

        if (catLower.includes("hot") || catLower.includes("flex")) {
          const hasHot = u.some(unit => (unit.type || unit.name || "").toLowerCase().includes("hot"))
          const hasHotFac = facs.some(f => f.toLowerCase().includes("hot") || f.toLowerCase().includes("flex"))
          if (!hasHot && !hasHotFac) return false
        } else if (catLower.includes("dedicated")) {
          const hasDed = u.some(unit => (unit.type || unit.name || "").toLowerCase().includes("dedicated"))
          const hasDedFac = facs.some(f => f.toLowerCase().includes("dedicated"))
          if (!hasDed && !hasDedFac) return false
        } else if (catLower.includes("private") || catLower.includes("office") || catLower.includes("room")) {
          const hasPriv = u.some(unit => (unit.type || unit.name || "").toLowerCase().includes("private") || (unit.type || unit.name || "").toLowerCase().includes("room") || (unit.type || unit.name || "").toLowerCase().includes("office"))
          const hasPrivFac = facs.some(f => f.toLowerCase().includes("private") || f.toLowerCase().includes("office") || f.toLowerCase().includes("room"))
          if (!hasPriv && !hasPrivFac) return false
        } else if (catLower.includes("meeting") || catLower.includes("hall") || catLower.includes("conference")) {
          const hasMeet = u.some(unit => (unit.type || unit.name || "").toLowerCase().includes("meeting") || (unit.type || unit.name || "").toLowerCase().includes("hall"))
          const hasMeetFac = facs.some(f => f.toLowerCase().includes("meeting") || f.toLowerCase().includes("hall") || f.toLowerCase().includes("booth"))
          if (!hasMeet && !hasMeetFac) return false
        } else if (catLower.includes("24/7") || catLower.includes("night")) {
          const is247 = (h.openingHours || "").includes("24/7") || facs.some(f => f.includes("24/7"))
          if (!is247) return false
        }
      }

      // Facility check
      if (facility && facility !== "All" && facility !== "All Amenities") {
        const facs = Array.isArray(h.facilities) ? (h.facilities as string[]) : []
        if (!facs.includes(facility)) return false
      }

      // Price check
      const effectivePrice = h.priceMonthly || (h.priceDaily ? h.priceDaily * 20 : 0)
      if (minPrice !== null && effectivePrice < minPrice) return false
      if (maxPrice !== null && effectivePrice > maxPrice) return false

      // Search check
      if (search) {
        const query = search.toLowerCase()
        const matchName = h.name.toLowerCase().includes(query)
        const matchDesc = h.description.toLowerCase().includes(query)
        const matchAddr = h.address.toLowerCase().includes(query)
        const matchOwner = (h.ownerName || "").toLowerCase().includes(query) || (h.ownerEmail || "").toLowerCase().includes(query)
        if (!matchName && !matchDesc && !matchAddr && !matchOwner) return false
      }

      return true
    })

    // Sorting
    if (sort === "price_asc") {
      filtered = filtered.sort((a, b) => (a.priceMonthly || a.priceDaily || 0) - (b.priceMonthly || b.priceDaily || 0))
    } else if (sort === "price_desc") {
      filtered = filtered.sort((a, b) => (b.priceMonthly || b.priceDaily || 0) - (a.priceMonthly || a.priceDaily || 0))
    } else if (sort === "reviews") {
      filtered = filtered.sort((a, b) => b.totalReviews - a.totalReviews)
    }

    return NextResponse.json(filtered)
  } catch (err) {
    console.error("Failed to fetch hubs:", err)
    return NextResponse.json({ error: "Failed to fetch hubs" }, { status: 500 })
  }
}
