import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const data = await req.json()
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        category: data.category,
        tags: data.tags || [],
        readTime: data.readTime,
        affiliates: data.affiliates || false,
        featured: data.featured || false,
        author: data.author,
        published: data.published ?? true,
      },
    })
    return NextResponse.json(post)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "An error occurred" }, { status: 400 })
  }
}
