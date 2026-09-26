import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendAdminNotificationEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to register a workspace." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { 
      name, 
      city, 
      description, 
      address, 
      facilities, 
      priceDaily, 
      priceMonthly, 
      contactEmail, 
      website, 
      photoUrl,
      ownerEmail,
      ownerName,
      spaceType,
      units,
      openingHours
    } = body

    if (!name || !city || !description || !address || !contactEmail) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    // Check if slug exists, if so append random characters
    let slug = baseSlug
    const conflict = await prisma.workHub.findUnique({ where: { slug } })
    if (conflict) {
      slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`
    }

    const finalOwnerEmail = session.user?.email || ownerEmail || contactEmail
    const finalOwnerName = ownerName || session.user?.name || "Workspace Partner"

    const hub = await prisma.workHub.create({
      data: {
        name,
        slug,
        city,
        description,
        address,
        contactEmail,
        website: website || null,
        photoUrl: photoUrl || null,
        ownerEmail: finalOwnerEmail,
        ownerName: finalOwnerName,
        spaceType: spaceType || "Coworking Hub",
        units: units ?? [],
        openingHours: openingHours || "24/7 Access",
        isVerified: false, // Must be verified by super admin
        isPartner: false,  // Must be partnered by super admin
        facilities: facilities ?? [],
        priceDaily: priceDaily ? parseFloat(priceDaily) : null,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) : null,
      }
    })

    // Auto-promote registering user role to OWNER
    if (finalOwnerEmail) {
      await prisma.user.updateMany({
        where: { email: finalOwnerEmail },
        data: { role: "OWNER" }
      }).catch(err => console.error("Failed to update user role to OWNER:", err))
    }

    // Send email alert to super admin
    try {
      await sendAdminNotificationEmail({
        subject: `New Workspace Application: ${name} (${city})`,
        title: `🏢 Workspace Partner Application Submitted`,
        details: {
          "Workspace Name": name,
          "City Location": city,
          "Space Category": spaceType || "Coworking Hub",
          "Owner Name": finalOwnerName,
          "Owner Email": finalOwnerEmail,
          "Public Contact": contactEmail,
        },
        actionUrl: `https://digitalnomadsinnepal.com/admin`,
        actionText: "Review & Approve Workspace in Admin",
      })
    } catch (e) {
      console.error("Failed to send admin workspace registration alert:", e)
    }

    return NextResponse.json(hub, { status: 201 })
  } catch (err) {
    console.error("Partner registration failed:", err)
    return NextResponse.json({ error: "Partner registration failed" }, { status: 500 })
  }
}
