import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/guides/[id]/reviews
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const reviews = await prisma.review.findMany({
    where: { guideId: params.id },
    include: { user: { select: { name: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(reviews)
}

// POST /api/guides/[id]/reviews — nomad must be signed in
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any)?.role !== "NOMAD") {
    return NextResponse.json({ error: "Sign in as a Nomad to leave a review." }, { status: 401 })
  }

  const { rating, comment } = await req.json()
  if (!rating || rating < 1 || rating > 5 || !comment?.trim()) {
    return NextResponse.json({ error: "Rating (1-5) and comment are required." }, { status: 400 })
  }

  const userId = (session.user as any).id

  // Check if guide exists
  const guide = await prisma.guide.findUnique({ where: { id: params.id } })
  if (!guide) return NextResponse.json({ error: "Guide not found." }, { status: 404 })

  try {
    const review = await prisma.review.create({
      data: { rating, comment, guideId: params.id, userId },
    })

    // Recalculate average rating
    const agg = await prisma.review.aggregate({
      where: { guideId: params.id },
      _avg: { rating: true },
      _count: true,
    })

    await prisma.guide.update({
      where: { id: params.id },
      data: { avgRating: agg._avg.rating ?? 0, totalReviews: agg._count },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "You have already reviewed this guide." }, { status: 409 })
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
