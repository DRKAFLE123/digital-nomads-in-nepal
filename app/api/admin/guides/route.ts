import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const guides = await prisma.guide.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reviews: true } } },
  })

  return NextResponse.json(guides)
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id, isVerified } = await req.json()
  const guide = await prisma.guide.update({
    where: { id },
    data: { isVerified },
    include: { _count: { select: { reviews: true } } },
  })

  return NextResponse.json(guide)
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await req.json()
  await prisma.guide.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
