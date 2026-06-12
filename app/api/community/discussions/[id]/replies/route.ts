import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discussionId = params.id
    const replies = await prisma.communityReply.findMany({
      where: { discussionId },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            country: true,
            avatarUrl: true,
            workType: true,
          }
        }
      }
    })

    return NextResponse.json({ success: true, replies })
  } catch (error) {
    console.error("Fetch replies error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discussionId = params.id
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

    const { content } = await req.json()
    if (!content) {
      return NextResponse.json({ error: "Reply content is required." }, { status: 400 })
    }

    const reply = await prisma.communityReply.create({
      data: {
        content,
        discussionId,
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
        }
      }
    })

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error("Create reply error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
