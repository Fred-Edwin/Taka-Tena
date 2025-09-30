import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow the request to continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/browse",
          "/impact",
          "/login",
          "/signup",
          "/api/auth/signup",
        ]

        // API routes that don't require authentication
        const publicApiRoutes = [
          "/api/auth/signin",
          "/api/auth/signup",
          "/api/auth/providers",
          "/api/auth/session",
          "/api/auth/csrf",
        ]

        // Check if it's a public route
        if (publicRoutes.includes(pathname)) {
          return true
        }

        // Check if it's a public API route
        if (publicApiRoutes.some(route => pathname.startsWith(route))) {
          return true
        }

        // Allow access to listing detail pages (public)
        if (pathname.match(/^\/listings\/[^\/]+$/)) {
          return true
        }

        // Check if it's a protected route
        const protectedRoutes = [
          "/dashboard",
          "/listings/create",
          "/profile/edit",
        ]

        // Check if it's an edit listing route
        if (pathname.match(/^\/listings\/[^\/]+\/edit$/)) {
          return !!token
        }

        // If it's a protected route, require authentication
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          return !!token
        }

        // For all other routes, allow access
        return true
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}