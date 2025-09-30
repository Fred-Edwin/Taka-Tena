import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user data (public profile)
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        userType: true,
        location: true,
        phone: true,
        whatsapp: true,
        verified: true,
        createdAt: true,
        // Don't include email for privacy
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get user's active listings
    const listings = await prisma.listing.findMany({
      where: {
        userId: params.id,
        status: "AVAILABLE" // Only show available listings on public profile
      },
      select: {
        id: true,
        title: true,
        description: true,
        materialType: true,
        quantity: true,
        unit: true,
        location: true,
        images: true,
        status: true,
        views: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 12 // Limit to latest 12 listings
    })

    // Get listing stats
    const [totalListings, completedListings] = await Promise.all([
      prisma.listing.count({
        where: { userId: params.id }
      }),
      prisma.listing.count({
        where: {
          userId: params.id,
          status: "COMPLETED"
        }
      })
    ])

    return NextResponse.json({
      user: {
        ...user,
        stats: {
          totalListings,
          completedListings
        }
      },
      listings
    })

  } catch (error) {
    console.error("Get user profile error:", error)
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}