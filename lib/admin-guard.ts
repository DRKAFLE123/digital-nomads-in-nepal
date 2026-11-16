import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { NextResponse } from "next/server"
import { prisma } from "./prisma"

type GuardResult =
  | { error: NextResponse; session: null }
  | { error: null; session: NonNullable<Awaited<ReturnType<typeof getServerSession>>> }

/**
 * Call at the top of any admin API route handler.
 * Verifies both session and live database user role (mitigating stale JWTs).
 * Returns { error } if unauthenticated/forbidden, or { session } on success.
 */
export async function requireAdmin(): Promise<GuardResult> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Unauthenticated" }, { status: 401 }),
      session: null,
    }
  }

  const userId = (session.user as { id?: string }).id
  const userEmail = session.user.email

  // If no identifier available, reject
  if (!userId && !userEmail) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    }
  }

  // Live DB query prevents stale JWT privilege retention if role was revoked
  const dbUser = await prisma.user.findFirst({
    where: userId ? { id: userId } : { email: userEmail! },
    select: { id: true, role: true }
  })

  if (!dbUser || dbUser.role !== "ADMIN") {
    return {
      error: NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 }),
      session: null,
    }
  }

  return { error: null, session }
}
