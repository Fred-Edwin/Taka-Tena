import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { MaterialType } from "@prisma/client"

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    // Get basic counts
    const [totalListings, completedListings, activeUsers] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({
        where: { status: "COMPLETED" }
      }),
      prisma.user.count({
        where: {
          listings: {
            some: {}
          }
        }
      })
    ])

    // Calculate estimated weight (completed listings × 25kg average)
    const estimatedWeight = completedListings * 25

    // Get material breakdown
    const materialBreakdown = await Promise.all([
      prisma.listing.count({
        where: { materialType: MaterialType.PLASTIC }
      }),
      prisma.listing.count({
        where: { materialType: MaterialType.ORGANIC }
      }),
      prisma.listing.count({
        where: { materialType: MaterialType.CONSTRUCTION }
      }),
      prisma.listing.count({
        where: { materialType: MaterialType.EWASTE }
      })
    ])

    const [plasticCount, organicCount, constructionCount, ewasteCount] = materialBreakdown

    // Calculate percentages
    const total = totalListings || 1 // Avoid division by zero
    const materials = [
      {
        type: MaterialType.PLASTIC,
        name: "Plastic",
        count: plasticCount,
        percentage: Math.round((plasticCount / total) * 100),
        color: "blue"
      },
      {
        type: MaterialType.ORGANIC,
        name: "Organic",
        count: organicCount,
        percentage: Math.round((organicCount / total) * 100),
        color: "green"
      },
      {
        type: MaterialType.CONSTRUCTION,
        name: "Construction",
        count: constructionCount,
        percentage: Math.round((constructionCount / total) * 100),
        color: "amber"
      },
      {
        type: MaterialType.EWASTE,
        name: "E-waste",
        count: ewasteCount,
        percentage: Math.round((ewasteCount / total) * 100),
        color: "red"
      }
    ]

    return NextResponse.json({
      stats: {
        totalListings,
        completedListings,
        estimatedWeight,
        activeUsers
      },
      materials
    })

  } catch (error) {
    console.error("Get global impact error:", error)
    return NextResponse.json(
      { error: "Failed to fetch impact data" },
      { status: 500 }
    )
  }
}