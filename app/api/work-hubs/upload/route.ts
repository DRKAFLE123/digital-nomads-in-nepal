import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
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

function isValidImageSignature(buffer: Buffer): boolean {
  if (buffer.length < 12) return false

  // JPEG (FF D8 FF)
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true

  // PNG (89 50 4E 47)
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true

  // WebP (RIFF .... WEBP)
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return true

  // AVIF (.... ftypavif)
  const ftyp = buffer.toString("ascii", 4, 8)
  const brand = buffer.toString("ascii", 8, 12)
  if (ftyp === "ftyp" && (brand === "avif" || brand === "avis" || brand === "mif1")) return true

  return false
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to upload images." }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
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

    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB size limit." },
        { status: 400 }
      )
    }

    const safeExt = ALLOWED_MIME_TYPES[file.type]
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Deep inspection: verify magic bytes to prevent spoofed MIME types
    if (!isValidImageSignature(buffer)) {
      return NextResponse.json({ error: "Corrupted or invalid image file content." }, { status: 400 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    let imageUrl = ""

    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.round(new Date().getTime() / 1000).toString()
      const folder = "digital_nomads_hubs"
      
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
        console.error("Cloudinary workspace upload failed:", errText)
        throw new Error(`Cloudinary upload failed: ${errText}`)
      }

      const cloudData = await cloudRes.json()
      imageUrl = cloudData.secure_url
    } else {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true })
      }
      
      const uniqueFilename = `hub-${Date.now()}-${crypto.randomUUID()}${safeExt}`
      const filepath = path.join(UPLOAD_DIR, uniqueFilename)

      fs.writeFileSync(filepath, buffer)
      imageUrl = `/uploads/${uniqueFilename}`
    }

    return NextResponse.json({ url: imageUrl }, { status: 200 })
  } catch (err) {
    console.error("Workspace image upload failed:", err)
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 })
  }
}
