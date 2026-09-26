import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"
import crypto from "crypto"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

function generateSignature(params: Record<string, string>, apiSecret: string) {
  const sortedKeys = Object.keys(params).sort()
  const paramString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join("&")
  
  return crypto
    .createHash("sha1")
    .update(paramString + apiSecret)
    .digest("hex")
}

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const dbMedia = await prisma.media.findMany({
      orderBy: { createdAt: "desc" }
    })
    
    return NextResponse.json(dbMedia)
  } catch (err) {
    console.error("Failed to read media from database:", err)
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const alt = formData.get("alt") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const ALLOWED_MIME_TYPES: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/avif": ".avif"
    }

    if (!ALLOWED_MIME_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and AVIF images are allowed." },
        { status: 400 }
      )
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB size limit." },
        { status: 400 }
      )
    }

    const safeExt = ALLOWED_MIME_TYPES[file.type]
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    let imageUrl = ""
    let filename = file.name

    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.round(new Date().getTime() / 1000).toString()
      const folder = "digital_nomads_nepal"
      
      const sigParams = { folder, timestamp }
      const signature = generateSignature(sigParams, apiSecret)

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

      const uploadData = new FormData()
      const fileBlob = new Blob([buffer], { type: file.type })
      uploadData.append("file", fileBlob, file.name)
      uploadData.append("api_key", apiKey)
      uploadData.append("timestamp", timestamp)
      uploadData.append("folder", folder)
      uploadData.append("signature", signature)

      const cloudRes = await fetch(cloudinaryUrl, {
        method: "POST",
        body: uploadData,
      })

      if (!cloudRes.ok) {
        const errText = await cloudRes.text()
        console.error("Cloudinary upload failed:", errText)
        throw new Error(`Cloudinary upload failed: ${errText}`)
      }

      const cloudData = await cloudRes.json()
      imageUrl = cloudData.secure_url
      filename = cloudData.original_filename || file.name
    } else {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true })
      }
      
      const baseName = path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9]/g, "-").slice(0, 50)
      const uniqueFilename = `${Date.now()}-${baseName}${safeExt}`
      const filepath = path.join(UPLOAD_DIR, uniqueFilename)

      fs.writeFileSync(filepath, buffer)
      imageUrl = `/uploads/${uniqueFilename}`
      filename = uniqueFilename
    }

    const mediaRecord = await prisma.media.create({
      data: {
        name: filename,
        url: imageUrl,
        size: file.size,
        alt: alt || null,
      }
    })

    return NextResponse.json(mediaRecord)
  } catch (err) {
    console.error("Upload handler failed:", err)
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 500 })
  }
}
