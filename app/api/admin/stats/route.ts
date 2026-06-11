import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const [users, guides, subscribers, reviews, posts] = await Promise.all([
    prisma.user.count(),
    prisma.guide.count(),
    prisma.subscriber.count(),
    prisma.review.count(),
    prisma.post.count(),
  ])

  return NextResponse.json({ users, guides, subscribers, reviews, posts })
}
