import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const whereClause: { category?: string } = {}
    if (category && category !== "All") {
      whereClause.category = category
    }

    const [discussions, total] = await Promise.all([
      prisma.communityDiscussion.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              country: true,
              avatarUrl: true,
              workType: true,
            }
          },
          _count: {
            select: { replies: true }
          }
        }
      }),
      prisma.communityDiscussion.count({ where: whereClause })
    ])

    return NextResponse.json({
      success: true,
      discussions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Fetch discussions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const profile = await prisma.nomadProfile.findUnique({
      where: { email: session.user.email }
    })

    if (!profile) {
      return NextResponse.json({ error: "Nomad profile not found. Please join community first." }, { status: 404 })
    }

    const { title, content, category } = await req.json()
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 })
    }

    const discussion = await prisma.communityDiscussion.create({
      data: {
        title,
        content,
        category: category || "General",
        authorId: profile.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            country: true,
            avatarUrl: true,
            workType: true,
          }
        },
        _count: {
          select: { replies: true }
        }
      }
    })

    return NextResponse.json({ success: true, discussion })
  } catch (error) {
    console.error("Create discussion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
