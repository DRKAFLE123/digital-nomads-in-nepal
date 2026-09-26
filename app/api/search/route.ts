import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Static curated nomad guides to supplement database search
const STATIC_GUIDES = [
  {
    title: "Nepal Digital Nomad Visa (2026 Guide)",
    excerpt: "Everything you need to know about remote working in Nepal: visa options, requirements, extensions, and process.",
    url: "/blog/nepal-digital-nomad-visa-guide-2026",
    category: "Visa & Legal",
    type: "post" as const,
  },
  {
    title: "SIM Cards & Mobile Internet (NTC vs Ncell vs eSIM)",
    excerpt: "Best mobile data plans, 5G/4G coverage in Kathmandu, Pokhara, and trekking trails with eSIM options.",
    url: "/resources/sim-cards",
    category: "Connectivity",
    type: "post" as const,
  },
  {
    title: "Cost of Living in Nepal: Nomad Budget Breakdown",
    excerpt: "Monthly expenses breakdown for living in Kathmandu and Pokhara: rent, coworking, food, and transport.",
    url: "/blog/cost-of-living-nepal-2026-nomad-budget",
    category: "Cost of Living",
    type: "post" as const,
  },
  {
    title: "Nomad Coliving & Extended Stays in Nepal",
    excerpt: "Curated work-friendly apartments, homestays, and nomad villas in Pokhara Lakeside and Kathmandu.",
    url: "/stay",
    category: "Coliving & Stays",
    type: "post" as const,
  },
]

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = (searchParams.get("q") || "").trim()
    const filter = (searchParams.get("type") || "all").toLowerCase()

    if (!query) {
      return NextResponse.json({
        workHubs: [],
        guides: [],
        destinations: [],
        posts: [],
        total: 0,
      })
    }

    const searchQueries: Promise<any>[] = []

    // 1. Work Hubs
    if (filter === "all" || filter === "workspaces" || filter === "coworking") {
      searchQueries.push(
        prisma.workHub.findMany({
          where: {
            OR: [
              { name: { contains: query } },
              { city: { contains: query } },
              { address: { contains: query } },
              { description: { contains: query } },
              { spaceType: { contains: query } },
            ],
          },
          take: 6,
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            address: true,
            spaceType: true,
            rating: true,
            priceDaily: true,
            photoUrl: true,
            isVerified: true,
            facilities: true,
          },
        })
      )
    } else {
      searchQueries.push(Promise.resolve([]))
    }

    // 2. Guides
    if (filter === "all" || filter === "guides") {
      searchQueries.push(
        prisma.guide.findMany({
          where: {
            OR: [
              { name: { contains: query } },
              { bio: { contains: query } },
              { location: { contains: query } },
            ],
          },
          take: 6,
          select: {
            id: true,
            name: true,
            location: true,
            bio: true,
            specialties: true,
            photoUrl: true,
            avgRating: true,
            totalReviews: true,
            isVerified: true,
          },
        })
      )
    } else {
      searchQueries.push(Promise.resolve([]))
    }

    // 3. Destinations
    if (filter === "all" || filter === "destinations") {
      searchQueries.push(
        prisma.destination.findMany({
          where: {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
            ],
          },
          take: 5,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
          },
        })
      )
    } else {
      searchQueries.push(Promise.resolve([]))
    }

    // 4. Blog Posts & Guides
    if (filter === "all" || filter === "posts" || filter === "articles") {
      searchQueries.push(
        prisma.post.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: query } },
              { excerpt: { contains: query } },
              { category: { contains: query } },
            ],
          },
          take: 6,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            category: true,
            coverImage: true,
            readTime: true,
          },
        })
      )
    } else {
      searchQueries.push(Promise.resolve([]))
    }

    const [workHubsRes, guidesRes, destinationsRes, postsRes] = await Promise.allSettled(searchQueries)

    const workHubs = workHubsRes.status === "fulfilled" ? workHubsRes.value : []
    const guides = guidesRes.status === "fulfilled" ? guidesRes.value : []
    const destinations = destinationsRes.status === "fulfilled" ? destinationsRes.value : []
    const posts = postsRes.status === "fulfilled" ? postsRes.value : []

    // Also match static curated guides
    const lowerQ = query.toLowerCase()
    const matchedStatic = STATIC_GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(lowerQ) ||
        g.excerpt.toLowerCase().includes(lowerQ) ||
        g.category.toLowerCase().includes(lowerQ)
    )

    // Merge static if not already present
    matchedStatic.forEach((st) => {
      if (!posts.some((p: any) => p.slug === st.url.replace("/blog/", ""))) {
        posts.push({
          id: `static-${st.url}`,
          title: st.title,
          slug: st.url.startsWith("/blog/") ? st.url.replace("/blog/", "") : st.url,
          customUrl: st.url.startsWith("/blog/") ? undefined : st.url,
          excerpt: st.excerpt,
          category: st.category,
          coverImage: "/nepal-nomad-visa-banner.png",
          readTime: "5 min read",
        })
      }
    })

    const total = workHubs.length + guides.length + destinations.length + posts.length

    return NextResponse.json({
      workHubs,
      guides,
      destinations,
      posts,
      total,
    })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}
