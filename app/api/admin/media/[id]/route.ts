import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"
import crypto from "crypto"

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { alt } = await req.json()
    const updatedMedia = await prisma.media.update({
      where: { id: params.id },
      data: { alt: alt || null }
    })

    return NextResponse.json(updatedMedia)
  } catch (err) {
    console.error("Failed to update media alt text:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update media" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const media = await prisma.media.findUnique({
      where: { id: params.id }
    })

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    const { url } = media

    // 1. Delete from storage (Cloudinary or local filesystem)
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (cloudName && apiKey && apiSecret && url.includes("cloudinary.com")) {
      try {
        // Extract public_id from URL: e.g. "https://res.cloudinary.com/cloudName/image/upload/v1234/folder/filename.jpg"
        // public_id would be "folder/filename"
        const match = url.match(/\/upload\/(?:v\d+\/)?([^.]+)/)
        if (match && match[1]) {
          const publicId = decodeURIComponent(match[1])
          const timestamp = Math.round(new Date().getTime() / 1000).toString()
          
          const sigParams = { public_id: publicId, timestamp }
          const signature = generateSignature(sigParams, apiSecret)
          
          const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`
          
          const destroyData = new FormData()
          destroyData.append("public_id", publicId)
          destroyData.append("api_key", apiKey)
          destroyData.append("timestamp", timestamp)
          destroyData.append("signature", signature)
          
          const destroyRes = await fetch(cloudinaryUrl, {
            method: "POST",
            body: destroyData
          })
          
          if (!destroyRes.ok) {
            console.error("Failed to destroy image on Cloudinary:", await destroyRes.text())
          }
        }
      } catch (cloudErr) {
        console.error("Error deleting from Cloudinary:", cloudErr)
      }
    } else {
      // Local file deletion
      if (url.startsWith("/uploads/")) {
        const localPath = path.join(process.cwd(), "public", url)
        if (fs.existsSync(localPath)) {
          try {
            fs.unlinkSync(localPath)
          } catch (fsErr) {
            console.error("Failed to delete local file from disk:", fsErr)
          }
        }
      }
    }

    // 2. Delete from database
    await prisma.media.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Failed to delete media:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete media" },
      { status: 500 }
    )
  }
}
