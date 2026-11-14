import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      // Return ok to prevent email enumeration
      return NextResponse.json({ success: true, message: "If your account exists, a new verification link was sent." })
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: "Your email is already verified." })
    }

    // Generate new token
    const verifyToken = crypto.randomBytes(32).toString("hex")
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verifyToken,
        verifyExpires,
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || "https://digitalnomadsinnepal.com"
    const verifyUrl = `${baseUrl}/auth/verify?token=${verifyToken}`

    await sendVerificationEmail({
      to: normalizedEmail,
      name: user.name,
      verifyUrl,
    })

    return NextResponse.json({
      success: true,
      message: "A fresh verification link was sent to your email.",
    })
  } catch (error: any) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Failed to resend verification link." }, { status: 500 })
  }
}
