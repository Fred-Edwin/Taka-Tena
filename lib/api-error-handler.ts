import { NextResponse } from "next/server"
import { z } from "zod"
import { Prisma } from "@prisma/client"

export interface ApiError extends Error {
  statusCode?: number
  code?: string
}

export class AppError extends Error implements ApiError {
  statusCode: number
  code?: string

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = "AppError"
  }
}

export function handleApiError(error: unknown, context?: string): NextResponse {
  // Log the error for debugging
  console.error(`API Error${context ? ` in ${context}` : ""}:`, error)

  // Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.errors.map(err => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code
        }))
      },
      { status: 400 }
    )
  }

  // Custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code
      },
      { status: error.statusCode }
    )
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          { error: "A record with this information already exists" },
          { status: 409 }
        )
      case "P2025":
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        )
      case "P2003":
        return NextResponse.json(
          { error: "Invalid reference to related record" },
          { status: 400 }
        )
      default:
        return NextResponse.json(
          { error: "Database operation failed" },
          { status: 500 }
        )
    }
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      { error: "Invalid data provided" },
      { status: 400 }
    )
  }

  // JSON parsing errors
  if (error instanceof SyntaxError && error.message.includes("JSON")) {
    return NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    )
  }

  // Generic error fallback
  return NextResponse.json(
    {
      error: context
        ? `Failed to ${context.toLowerCase()}. Please try again.`
        : "An unexpected error occurred. Please try again."
    },
    { status: 500 }
  )
}

export function createUnauthorizedResponse(message: string = "Authentication required") {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

export function createForbiddenResponse(message: string = "Insufficient permissions") {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  )
}

export function createNotFoundResponse(resource: string = "Resource") {
  return NextResponse.json(
    { error: `${resource} not found` },
    { status: 404 }
  )
}

export function createValidationErrorResponse(message: string, details?: any) {
  return NextResponse.json(
    {
      error: message,
      details
    },
    { status: 400 }
  )
}