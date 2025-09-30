"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "./loading-spinner"
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES, MAX_IMAGES_PER_LISTING } from "@/lib/constants"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = MAX_IMAGES_PER_LISTING
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string>("")

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Upload failed")
    }

    const result = await response.json()
    return result.url
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadError("")

    // Check if we're at the limit
    if (images.length + acceptedFiles.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`)
      return
    }

    // Validate files
    for (const file of acceptedFiles) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setUploadError("Please upload JPG, PNG, or WebP images only")
        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setUploadError(`File "${file.name}" is too large. Maximum size is 2MB`)
        return
      }
    }

    // Upload files
    const fileIds = acceptedFiles.map(file => file.name + Date.now())
    setUploading(fileIds)

    try {
      const uploadPromises = acceptedFiles.map(uploadImage)
      const uploadedUrls = await Promise.all(uploadPromises)

      onImagesChange([...images, ...uploadedUrls])
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading([])
    }
  }, [images, onImagesChange, maxImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages
  })

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
            ${isDragActive
              ? 'border-forest-500 bg-forest-50'
              : 'border-stone-300 hover:border-forest-400 hover:bg-stone-50'
            }
            ${uploading.length > 0 ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />

          {uploading.length > 0 ? (
            <div className="flex flex-col items-center space-y-2">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-stone-600">Uploading images...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-stone-400" />
              </div>

              <div>
                <p className="text-lg font-medium text-stone-900">
                  {isDragActive ? "Drop images here" : "Upload images"}
                </p>
                <p className="text-sm text-stone-600">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  JPG, PNG, or WebP • Max 2MB • Up to {maxImages} images
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
          {uploadError}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-stone-100 rounded-xl overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Counter */}
      <div className="text-xs text-stone-500 text-center">
        {images.length} of {maxImages} images uploaded
      </div>
    </div>
  )
}