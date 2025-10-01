import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 30 // Cache search results for 30 seconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: ""
      })
    }

    const trimmedQuery = query.trim()

    // Search across listings with relevance scoring
    // Exact matches first, then partial matches
    const [exactMatches, partialMatches] = await Promise.all([
      // Exact title matches
      prisma.listing.findMany({
        where: {
          status: "AVAILABLE", // Only show available listings
          title: {
            equals: trimmedQuery,
            mode: 'insensitive'
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              userType: true,
              location: true,
              phone: true,
              whatsapp: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      }),

      // Partial matches in title, description, and location
      prisma.listing.findMany({
        where: {
          status: "AVAILABLE",
          OR: [
            {
              title: {
                contains: trimmedQuery,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: trimmedQuery,
                mode: 'insensitive'
              }
            },
            {
              location: {
                contains: trimmedQuery,
                mode: 'insensitive'
              }
            }
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              userType: true,
              location: true,
              phone: true,
              whatsapp: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 15
      })
    ])

    // Combine results with exact matches first
    const allResults = [...exactMatches, ...partialMatches]

    // Remove duplicates (in case exact match also appears in partial)
    const uniqueResults = allResults.filter((listing, index, array) =>
      array.findIndex(l => l.id === listing.id) === index
    )

    // Limit to 20 total results
    const results = uniqueResults.slice(0, 20)

    return NextResponse.json({
      results,
      total: results.length,
      query: trimmedQuery
    })

  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}