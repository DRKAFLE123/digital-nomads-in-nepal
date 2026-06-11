import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import fs from "fs"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    }
    const files = fs.readdirSync(UPLOAD_DIR)
    const mediaList = files
      .filter(file => !file.startsWith("."))
      .map((file) => {
        try {
          const stats = fs.statSync(path.join(UPLOAD_DIR, file))
          return {
            name: file,
            url: `/uploads/${file}`,
            size: stats.size,
            createdAt: stats.mtime.toISOString(),
          }
        } catch {
          return null
        }
      })
      .filter((item): item is NonNullable<typeof item> => !!item)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(mediaList)
  } catch (err) {
    console.error("Failed to read media directory:", err)
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = path.extname(file.name)
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "-")
    const filename = `${Date.now()}-${baseName}${ext}`
    const filepath = path.join(UPLOAD_DIR, filename)

    fs.writeFileSync(filepath, buffer)

    return NextResponse.json({
      name: filename,
      url: `/uploads/${filename}`,
    })
  } catch (err) {
    console.error("Upload handler failed:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
