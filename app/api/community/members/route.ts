import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma, WorkType } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const city = searchParams.get("city") || ""
    const workType = searchParams.get("workType") || ""
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "12", 10)
    const skip = (page - 1) * limit

    const whereClause: Prisma.NomadProfileWhereInput = {
      isPublic: true
    }

    if (city) {
      whereClause.currentCity = {
        equals: city
      }
    }

    if (workType) {
      whereClause.workType = workType as WorkType
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { country: { contains: search } },
        { bio: { contains: search } },
        { currentCity: { contains: search } }
      ]
    }

    const [members, total] = await Promise.all([
      prisma.nomadProfile.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          country: true,
          currentCity: true,
          workType: true,
          bio: true,
          avatarUrl: true,
          linkedinUrl: true,
          twitterUrl: true,
          createdAt: true
        }
      }),
      prisma.nomadProfile.count({ where: whereClause })
    ])

    return NextResponse.json({
      success: true,
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Failed to fetch community members:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export const dynamic = "force-dynamic"
