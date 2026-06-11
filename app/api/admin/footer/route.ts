import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "footer" }
    })
    
    if (!setting) {
      return NextResponse.json({ error: "Footer settings not found" }, { status: 404 })
    }
    
    return NextResponse.json(JSON.parse(setting.value))
  } catch (err) {
    console.error("Failed to read footer settings:", err)
    return NextResponse.json({ error: "Failed to read footer settings" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const payload = await req.json()
    
    // Basic verification of required fields
    if (!payload.bio || !payload.basecamp) {
      return NextResponse.json({ error: "Bio and basecamp fields are required." }, { status: 400 })
    }

    const setting = await prisma.setting.upsert({
      where: { key: "footer" },
      update: { value: JSON.stringify(payload) },
      create: { key: "footer", value: JSON.stringify(payload) }
    })
    
    return NextResponse.json(JSON.parse(setting.value))
  } catch (err) {
    console.error("Failed to update footer settings:", err)
    return NextResponse.json({ error: "Failed to update footer settings" }, { status: 500 })
  }
}
