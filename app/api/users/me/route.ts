import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleApiError, createUnauthorizedResponse, createNotFoundResponse } from "@/lib/api-error-handler"

export const dynamic = 'force-dynamic'

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
  location: z.string().min(1, "Location is required").max(100, "Location must be less than 100 characters").optional(),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional().nullable(),
  whatsapp: z.string().max(20, "WhatsApp must be less than 20 characters").optional().nullable(),
})

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return createUnauthorizedResponse()
    }

    // Get user data with listing counts
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        location: true,
        phone: true,
        whatsapp: true,
        verified: true,
        createdAt: true,
        _count: {
          select: {
            listings: true
          }
        }
      }
    })

    if (!user) {
      return createNotFoundResponse("User")
    }

    // Get separate counts for listings
    const [totalListings, completedListings] = await Promise.all([
      prisma.listing.count({
        where: { userId: session.user.id }
      }),
      prisma.listing.count({
        where: {
          userId: session.user.id,
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
      }
    })

  } catch (error) {
    return handleApiError(error, "fetch user data")
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return createUnauthorizedResponse()
    }

    const body = await request.json()

    // Validate the input
    const validatedData = updateUserSchema.parse(body)

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        location: true,
        phone: true,
        whatsapp: true,
        verified: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    })

  } catch (error) {
    return handleApiError(error, "update profile")
  }
}