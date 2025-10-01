import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { handleApiError, createUnauthorizedResponse } from "@/lib/api-error-handler"
import { MaterialType, Unit } from "@prisma/client"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 60 // Cache GET requests for 60 seconds

const createListingSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  materialType: z.nativeEnum(MaterialType, { required_error: "Material type is required" }),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.nativeEnum(Unit, { required_error: "Unit is required" }),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string().url()).max(2, "Maximum 2 images allowed").optional().default([]),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return createUnauthorizedResponse()
    }

    const body = await request.json()

    // Validate the input
    const validatedData = createListingSchema.parse(body)

    // Create the listing
    const listing = await prisma.listing.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        materialType: validatedData.materialType,
        quantity: validatedData.quantity,
        unit: validatedData.unit,
        location: validatedData.location,
        images: validatedData.images,
        userId: session.user.id,
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

    return NextResponse.json(
      {
        message: "Listing created successfully",
        listing
      },
      { status: 201 }
    )

  } catch (error) {
    return handleApiError(error, "create listing")
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const materialType = searchParams.get("materialType")
    const status = searchParams.get("status")
    const location = searchParams.get("location")
    const search = searchParams.get("search")
    const userId = searchParams.get("userId")

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (materialType) {
      where.materialType = materialType
    }

    if (status) {
      where.status = status
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      }
    }

    if (userId) {
      where.userId = userId
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Get listings with pagination
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
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
        skip,
        take: limit,
      }),
      prisma.listing.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      listings,
      total,
      page,
      totalPages,
    })

  } catch (error) {
    return handleApiError(error, "fetch listings")
  }
}