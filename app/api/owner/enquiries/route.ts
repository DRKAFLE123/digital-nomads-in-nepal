import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StoredEnquiry } from "@/app/api/work-hubs/[slug]/enquiry/route"

export const dynamic = "force-dynamic"

// Default sample enquiries to bootstrap a new host workspace so they can test the workflow
function generateBootstrapEnquiries(hub: { id: string; name: string; slug: string; city: string }): StoredEnquiry[] {
  const now = Date.now()
  return [
    {
      id: `enq_demo_1_${hub.id}`,
      hubId: hub.id,
      hubName: hub.name,
      hubSlug: hub.slug,
      city: hub.city,
      listingType: "Work",
      unitType: "Dedicated Desk",
      nomadName: "Alex Morgan",
      nomadEmail: "alex.morgan@remote.io",
      nomadPhone: "+1 (415) 890-2345",
      topic: "Dedicated desk availability & monthly rates",
      message: "Hi! Is your workspace available for a monthly stay starting next week? I need reliable fiber internet and a quiet area for evening US client calls.",
      tags: ["Monthly", "Wi-Fi inquiry", "Power Backup"],
      status: "New",
      createdAt: new Date(now - 2 * 3600 * 1000).toISOString(),
      updatedAt: new Date(now - 2 * 3600 * 1000).toISOString()
    },
    {
      id: `enq_demo_2_${hub.id}`,
      hubId: hub.id,
      hubName: hub.name,
      hubSlug: hub.slug,
      city: hub.city,
      listingType: "Work + Stay",
      unitType: "Coliving Room + Desk",
      nomadName: "Sarah Jenkins",
      nomadEmail: "sarah.j@nomadtravel.de",
      nomadPhone: "+49 170 9876543",
      topic: "Private room & ergonomic setup",
      message: "Hello! Do you have standing desks or external monitors available to borrow or rent? Planning to stay 3 weeks while working as a UX designer.",
      tags: ["Work + Stay", "Ergonomics", "Site Tour"],
      status: "New",
      createdAt: new Date(now - 7 * 3600 * 1000).toISOString(),
      updatedAt: new Date(now - 7 * 3600 * 1000).toISOString()
    },
    {
      id: `enq_demo_3_${hub.id}`,
      hubId: hub.id,
      hubName: hub.name,
      hubSlug: hub.slug,
      city: hub.city,
      listingType: "Work",
      unitType: "Private Office",
      nomadName: "David Chen",
      nomadEmail: "david@chentechnologies.com",
      topic: "Team of 3 private office rental",
      message: "We're a small software team visiting Nepal for 1 month. Can you accommodate 3 people in a private office with 24/7 keycard access?",
      tags: ["Team Booking", "Private Office", "24/7 Access"],
      status: "Replied",
      repliedAt: new Date(now - 18 * 3600 * 1000).toISOString(),
      replyText: "Hi David, yes! Our Executive Team Room has 4 desks, dual-WAN fiber, and independent backup power. I can offer you a group rate of $320/month.",
      createdAt: new Date(now - 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(now - 18 * 3600 * 1000).toISOString()
    },
    {
      id: `enq_demo_4_${hub.id}`,
      hubId: hub.id,
      hubName: hub.name,
      hubSlug: hub.slug,
      city: hub.city,
      listingType: "Work",
      unitType: "Hot Desk",
      nomadName: "Elena Rostova",
      nomadEmail: "elena.rost@digitalnomads.fr",
      topic: "Day pass check-in time",
      message: "Can I drop in on Saturday morning around 9 AM to try out the space before committing to a weekly pass?",
      tags: ["Day Pass", "Weekend Access"],
      status: "In discussion",
      repliedAt: new Date(now - 36 * 3600 * 1000).toISOString(),
      replyText: "Welcome Elena! Yes, our reception is open on Saturday from 8:30 AM. First coffee is on us!",
      createdAt: new Date(now - 48 * 3600 * 1000).toISOString(),
      updatedAt: new Date(now - 36 * 3600 * 1000).toISOString()
    },
    {
      id: `enq_demo_5_${hub.id}`,
      hubId: hub.id,
      hubName: hub.name,
      hubSlug: hub.slug,
      city: hub.city,
      listingType: "Work",
      unitType: "Dedicated Desk",
      nomadName: "Marcus Weber",
      nomadEmail: "marcus.weber@engineer.ch",
      topic: "Confirmed 1-month booking request",
      message: "Thanks for the quick answers regarding the generator switchover. Booking is submitted for Dec 1 to Dec 31.",
      tags: ["Monthly", "Converted"],
      status: "Converted",
      repliedAt: new Date(now - 60 * 3600 * 1000).toISOString(),
      replyText: "Great Marcus! We have your desk reserved right by the balcony. Looking forward to welcoming you to Kathmandu.",
      createdAt: new Date(now - 72 * 3600 * 1000).toISOString(),
      updatedAt: new Date(now - 60 * 3600 * 1000).toISOString()
    }
  ]
}

// GET all enquiries for the host's hubs
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const ownerEmail = searchParams.get("email") || session.user.email
    const sessionUserId = (session.user as { id?: string }).id
    const sessionRole = (session.user as { role?: string }).role

    if (ownerEmail.toLowerCase() !== session.user.email.toLowerCase() && sessionRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Find host's hubs
    const orConditions: Array<{ ownerId?: string; ownerEmail?: { equals: string }; contactEmail?: { equals: string } }> = [
      { ownerEmail: { equals: ownerEmail } },
      { contactEmail: { equals: ownerEmail } }
    ]
    if (sessionUserId) {
      orConditions.unshift({ ownerId: sessionUserId })
    }

    const hubs = await prisma.workHub.findMany({
      where: { OR: orConditions },
      select: { id: true, name: true, slug: true, city: true }
    })

    if (hubs.length === 0) {
      return NextResponse.json([])
    }

    let allEnquiries: StoredEnquiry[] = []

    for (const hub of hubs) {
      const storageKey = `enquiries:${hub.id}`
      const setting = await prisma.setting.findUnique({ where: { key: storageKey } })
      
      if (setting?.value) {
        try {
          const list: StoredEnquiry[] = JSON.parse(setting.value)
          allEnquiries = allEnquiries.concat(list)
        } catch {
          // ignore corrupted JSON
        }
      } else {
        // Bootstrap with realistic demo leads so new hosts can immediately see and test the workflow
        const sampleLeads = generateBootstrapEnquiries(hub)
        await prisma.setting.upsert({
          where: { key: storageKey },
          create: { key: storageKey, value: JSON.stringify(sampleLeads) },
          update: { value: JSON.stringify(sampleLeads) }
        })
        allEnquiries = allEnquiries.concat(sampleLeads)
      }
    }

    // Sort by createdAt descending
    allEnquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(allEnquiries)
  } catch (err) {
    console.error("GET /api/owner/enquiries error:", err)
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 })
  }
}

// PATCH update enquiry status or post a host reply
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { enquiryId, hubId, status, replyText } = body

    if (!enquiryId || !hubId) {
      return NextResponse.json({ error: "enquiryId and hubId are required" }, { status: 400 })
    }

    const storageKey = `enquiries:${hubId}`
    const setting = await prisma.setting.findUnique({ where: { key: storageKey } })
    if (!setting?.value) {
      return NextResponse.json({ error: "Enquiries store not found" }, { status: 404 })
    }

    let list: StoredEnquiry[] = JSON.parse(setting.value)
    let found = false

    list = list.map((item) => {
      if (item.id === enquiryId) {
        found = true
        return {
          ...item,
          status: status || (replyText ? "Replied" : item.status),
          replyText: replyText !== undefined ? replyText : item.replyText,
          repliedAt: replyText ? new Date().toISOString() : item.repliedAt,
          updatedAt: new Date().toISOString()
        }
      }
      return item
    })

    if (!found) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    await prisma.setting.update({
      where: { key: storageKey },
      data: { value: JSON.stringify(list) }
    })

    return NextResponse.json({ success: true, enquiries: list })
  } catch (err) {
    console.error("PATCH /api/owner/enquiries error:", err)
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 })
  }
}
