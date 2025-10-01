import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if it's a protected route first
  const protectedRoutes = [
    "/dashboard",
    "/listings/create",
    "/profile/edit",
  ]

  // Check if it's an edit listing route or protected route
  const isProtected = pathname.match(/^\/listings\/[^\/]+\/edit$/) ||
                      protectedRoutes.some(route => pathname.startsWith(route))

  // Only run auth check for protected routes
  if (!isProtected) {
    return NextResponse.next()
  }

  // Check for NextAuth session cookie (Edge Runtime compatible)
  const sessionCookie = process.env.NODE_ENV === "production"
    ? req.cookies.get("__Secure-next-auth.session-token")
    : req.cookies.get("next-auth.session-token")

  if (!sessionCookie) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - Files with extensions (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}