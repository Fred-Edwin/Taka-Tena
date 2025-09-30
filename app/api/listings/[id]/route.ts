import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleApiError, createUnauthorizedResponse, createNotFoundResponse, createForbiddenResponse } from "@/lib/api-error-handler"
import { MaterialType, Unit, ListingStatus } from "@prisma/client"

const updateListingSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters").optional(),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
  materialType: z.nativeEnum(MaterialType).optional(),
  quantity: z.number().positive("Quantity must be positive").optional(),
  unit: z.nativeEnum(Unit).optional(),
  location: z.string().min(1, "Location is required").optional(),
  images: z.array(z.string().url()).max(2, "Maximum 2 images allowed").optional(),
  status: z.nativeEnum(ListingStatus).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
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
      }
    })

    if (!listing) {
      return createNotFoundResponse("Listing")
    }

    // Increment view count
    await prisma.listing.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({ listing })

  } catch (error) {
    console.error("Get listing error:", error)
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if listing exists and user is owner
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id }
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    if (existingListing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own listings" },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate the input
    const validatedData = updateListingSchema.parse(body)

    // Update the listing
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date()
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
      }
    })

    return NextResponse.json({
      message: "Listing updated successfully",
      listing: updatedListing
    })

  } catch (error) {
    console.error("Update listing error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if listing exists and user is owner
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id }
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    if (existingListing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own listings" },
        { status: 403 }
      )
    }

    // Delete the listing
    await prisma.listing.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: "Listing deleted successfully"
    })

  } catch (error) {
    console.error("Delete listing error:", error)
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    )
  }
}