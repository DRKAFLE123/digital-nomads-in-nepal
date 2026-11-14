import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Verification token is required." }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 })
    }

    if (user.verifyExpires && user.verifyExpires < new Date()) {
      return NextResponse.json({ error: "This verification token has expired. Please request a new one." }, { status: 410 })
    }

    // Mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verifyToken: null,
        verifyExpires: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
      email: user.email,
    })
  } catch (error: any) {
    console.error("Verify email error:", error)
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 })
  }
}
