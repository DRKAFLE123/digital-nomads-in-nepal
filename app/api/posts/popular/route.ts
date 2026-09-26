import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        coverImage: true,
        readTime: true,
        featured: true,
        createdAt: true,
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" }
      ],
      take: 6,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Failed to fetch popular posts:", error)
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 })
  }
}
