import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(destinations)
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { name, slug, description, image, tags } = await req.json()
  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
  }

  const destination = await prisma.destination.create({
    data: { 
      name, 
      slug, 
      description: description ?? null, 
      image: image ?? null,
      tags: tags ?? null
    },
  })

  return NextResponse.json(destination, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id, name, slug, description, image, tags } = await req.json()
  const destination = await prisma.destination.update({
    where: { id },
    data: { 
      name, 
      slug, 
      description: description ?? null, 
      image: image ?? null,
      tags: tags ?? null
    },
  })

  return NextResponse.json(destination)
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await req.json()
  await prisma.destination.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
