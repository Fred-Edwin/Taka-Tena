import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/browse",
    "/impact",
    "/login",
    "/signup",
  ]

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow access to listing detail pages (public)
  if (pathname.match(/^\/listings\/[^\/]+$/)) {
    return NextResponse.next()
  }

  // Check if it's a protected route
  const protectedRoutes = [
    "/dashboard",
    "/listings/create",
    "/profile/edit",
  ]

  // Check if it's an edit listing route or protected route
  const isProtected = pathname.match(/^\/listings\/[^\/]+\/edit$/) ||
                      protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      const url = new URL("/login", req.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
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