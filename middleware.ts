import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Protect Owner Dashboard (/owner/dashboard)
  if (pathname.startsWith("/owner/dashboard")) {
    const token = await getToken({ req })
    if (!token) {
      const loginUrl = new URL("/auth/signin", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // 2. Protect Local Expert Dashboard (/guides/dashboard)
  if (pathname.startsWith("/guides/dashboard")) {
    const token = await getToken({ req })
    if (!token) {
      const loginUrl = new URL("/auth/signin", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // 3. Protect Nomad Bookings (/nomad/bookings)
  if (pathname.startsWith("/nomad/bookings")) {
    const token = await getToken({ req })
    if (!token) {
      const loginUrl = new URL("/auth/signin", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // 4. Protect /community routes
  if (pathname === "/community" || pathname.startsWith("/community/")) {
    const token = await getToken({ req })
    if (!token) {
      const loginUrl = new URL("/auth/signin", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // 5. Allow admin login page through — but redirect already-authed admins to /admin
  if (pathname === "/admin/login") {
    const token = await getToken({ req })
    if (token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return NextResponse.next()
  }

  // 6. Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req })

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Smart Role Central Dashboard (/dashboard)
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req })
    if (!token) {
      const loginUrl = new URL("/auth/signin", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin/:path*",
    "/community/:path*",
    "/community",
    "/owner/:path*",
    "/guides/dashboard/:path*",
    "/guides/dashboard",
    "/nomad/bookings/:path*",
    "/nomad/bookings"
  ],
}
