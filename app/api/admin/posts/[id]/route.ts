import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error

  const post = await prisma.post.findUnique({
    where: { id: params.id }
  })
  
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })

  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const data = await req.json()
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        category: data.category,
        tags: data.tags,
        readTime: data.readTime,
        affiliates: data.affiliates,
        featured: data.featured,
        author: data.author,
        published: data.published,
      },
    })
    return NextResponse.json(post)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "An error occurred" }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await prisma.post.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "An error occurred" }, { status: 400 })
  }
}
