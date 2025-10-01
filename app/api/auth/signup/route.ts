import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/utils"
import { UserType } from "@prisma/client"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  userType: z.nativeEnum(UserType, { required_error: "Please select a user type" }),
  location: z.string().min(1, "Location is required"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the input
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email.toLowerCase()
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        name: validatedData.name,
        userType: validatedData.userType,
        location: validatedData.location,
        phone: validatedData.phone || null,
        whatsapp: validatedData.whatsapp || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        location: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      {
        message: "Account created successfully",
        user
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Signup error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}