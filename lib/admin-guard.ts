import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { NextResponse } from "next/server"

type GuardResult =
  | { error: NextResponse; session: null }
  | { error: null; session: NonNullable<Awaited<ReturnType<typeof getServerSession>>> }

/**
 * Call at the top of any admin API route handler.
 * Returns { error } if unauthenticated/forbidden, or { session } on success.
 */
export async function requireAdmin(): Promise<GuardResult> {
  const session = await getServerSession(authOptions)

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthenticated" }, { status: 401 }),
      session: null,
    }
  }

  const role = (session.user as { role?: string }).role
  if (role !== "ADMIN") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    }
  }

  return { error: null, session }
}
