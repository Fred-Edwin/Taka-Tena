import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES, MAX_IMAGE_WIDTH } from "@/lib/constants"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Helper function to compress image using canvas
async function compressImage(file: File, maxWidth: number = MAX_IMAGE_WIDTH): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      const { width, height } = img
      const aspectRatio = height / width
      const newWidth = Math.min(width, maxWidth)
      const newHeight = newWidth * aspectRatio

      // Set canvas dimensions
      canvas.width = newWidth
      canvas.height = newHeight

      // Draw and compress
      ctx?.drawImage(img, 0, 0, newWidth, newHeight)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        0.8 // 80% quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

// Server-side image processing using sharp (alternative for server environment)
async function processImageServer(buffer: ArrayBuffer, mimeType: string): Promise<Buffer> {
  // For now, we'll return the original buffer
  // In production, you might want to use sharp here
  return Buffer.from(buffer)
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPG, PNG, or WebP images." },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.` },
        { status: 400 }
      )
    }

    // Process image
    const arrayBuffer = await file.arrayBuffer()
    const processedBuffer = await processImageServer(arrayBuffer, file.type)

    // Generate filename
    const filename = `listing-${Date.now()}-${Math.random().toString(36).substring(7)}.${file.type.split('/')[1]}`

    // Upload to Vercel Blob
    const blob = await put(filename, processedBuffer, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json({
      url: blob.url
    })

  } catch (error) {
    console.error("Upload error:", error)

    return NextResponse.json(
      { error: "Failed to upload image. Please try again." },
      { status: 500 }
    )
  }
}