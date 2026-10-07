import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import fs from "fs"
import path from "path"
import crypto from "crypto"

export const dynamic = "force-dynamic"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif"
}

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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate type strictly
    if (!ALLOWED_MIME_TYPES[file.type]) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WebP, and AVIF images are allowed." }, { status: 400 })
    }

    // Validate size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds the 5MB limit." }, { status: 400 })
    }

    const safeExt = ALLOWED_MIME_TYPES[file.type]
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    let imageUrl = ""

    // 1. Attempt Cloudinary upload if credentials exist
    if (cloudName && apiKey && apiSecret) {
      try {
        const timestamp = Math.round(new Date().getTime() / 1000).toString()
        const folder = "digital_nomads_nepal_guides"
        
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

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json()
          imageUrl = cloudData.secure_url
        } else {
          const errText = await cloudRes.text()
          console.warn("Cloudinary guide upload failed, using local fallback:", errText)
        }
      } catch (cloudErr) {
        console.warn("Cloudinary connection error, using local fallback:", cloudErr)
      }
    }

    // 2. Local disk fallback if Cloudinary is not configured or failed
    if (!imageUrl) {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true })
      }
      
      const baseName = path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9]/g, "-").slice(0, 50)
      const uniqueFilename = `guide-${Date.now()}-${baseName || "photo"}${safeExt}`
      const filepath = path.join(UPLOAD_DIR, uniqueFilename)

      fs.writeFileSync(filepath, buffer)
      imageUrl = `/uploads/${uniqueFilename}`
    }

    return NextResponse.json({ url: imageUrl })
  } catch (err) {
    console.error("Guide photo upload failed:", err)
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 500 })
  }
}
