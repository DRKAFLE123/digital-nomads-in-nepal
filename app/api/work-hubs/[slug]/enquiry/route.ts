import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export interface StoredEnquiry {
  id: string
  hubId: string
  hubName: string
  hubSlug: string
  city: string
  listingType: "Work" | "Stay" | "Work + Stay"
  unitType: string
  nomadName: string
  nomadEmail: string
  nomadPhone?: string
  topic: string
  message: string
  tags: string[]
  status: "New" | "Replied" | "In discussion" | "Booking requested" | "Converted" | "Closed"
  repliedAt?: string | null
  replyText?: string | null
  createdAt: string
  updatedAt: string
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`enquiry:${ip}`, { limit: 12, windowSeconds: 15 * 60 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many enquiries sent. Please try again in ${rateLimit.resetInSeconds} seconds.` },
        { status: 429 }
      )
    }

    const hub = await prisma.workHub.findUnique({
      where: { slug: params.slug },
      select: { id: true, name: true, slug: true, city: true, spaceType: true, ownerEmail: true, contactEmail: true }
    })

    if (!hub) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    const body = await req.json()
    const { nomadName, nomadEmail, nomadPhone, topic, message, unitType } = body

    if (!nomadName?.trim() || !nomadEmail?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const cleanEmail = String(nomadEmail).trim().toLowerCase()
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
    }

    // Determine tags from topic and message
    const tags: string[] = []
    const lowerMsg = (message + " " + (topic || "")).toLowerCase()
    if (lowerMsg.includes("monthly") || lowerMsg.includes("month") || lowerMsg.includes("long-term")) tags.push("Monthly")
    if (lowerMsg.includes("wifi") || lowerMsg.includes("wi-fi") || lowerMsg.includes("speed") || lowerMsg.includes("internet")) tags.push("Wi-Fi inquiry")
    if (lowerMsg.includes("backup") || lowerMsg.includes("generator") || lowerMsg.includes("power")) tags.push("Power Backup")
    if (lowerMsg.includes("desk") || lowerMsg.includes("seat") || lowerMsg.includes("office")) tags.push("Desk/Office")
    if (lowerMsg.includes("tour") || lowerMsg.includes("visit")) tags.push("Site Tour")
    if (tags.length === 0) tags.push("General Inquiry")

    const newEnquiry: StoredEnquiry = {
      id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      hubId: hub.id,
      hubName: hub.name,
      hubSlug: hub.slug,
      city: hub.city,
      listingType: (hub.spaceType?.toLowerCase().includes("coliving") || hub.spaceType?.toLowerCase().includes("stay")) ? "Work + Stay" : "Work",
      unitType: unitType || "Dedicated Desk",
      nomadName: String(nomadName).trim().slice(0, 100),
      nomadEmail: cleanEmail,
      nomadPhone: nomadPhone ? String(nomadPhone).trim().slice(0, 30) : undefined,
      topic: String(topic || "General question").trim().slice(0, 150),
      message: String(message).trim().slice(0, 2000),
      tags,
      status: "New",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Read current host enquiries from Setting
    const storageKey = `enquiries:${hub.id}`
    let existingList: StoredEnquiry[] = []
    try {
      const setting = await prisma.setting.findUnique({ where: { key: storageKey } })
      if (setting?.value) {
        existingList = JSON.parse(setting.value)
      }
    } catch {
      existingList = []
    }

    existingList.unshift(newEnquiry)
    // Keep max 100 recent enquiries per hub
    const trimmed = existingList.slice(0, 100)

    await prisma.setting.upsert({
      where: { key: storageKey },
      create: { key: storageKey, value: JSON.stringify(trimmed) },
      update: { value: JSON.stringify(trimmed) }
    })

    return NextResponse.json({ success: true, enquiry: newEnquiry }, { status: 201 })
  } catch (err) {
    console.error("POST /api/work-hubs/[slug]/enquiry error:", err)
    return NextResponse.json({ error: "Failed to send enquiry" }, { status: 500 })
  }
}
