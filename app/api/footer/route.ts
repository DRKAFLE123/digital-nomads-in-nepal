import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
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
