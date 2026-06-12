import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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

    const updated = await prisma.communityDiscussion.update({
      where: { id: discussionId },
      data: {
        likes: { increment: 1 }
      }
    })

    return NextResponse.json({ success: true, likes: updated.likes })
  } catch (error) {
    console.error("Like discussion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
