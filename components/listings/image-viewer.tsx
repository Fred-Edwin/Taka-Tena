"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageViewerProps {
  images: string[]
  title: string
}

export default function ImageViewer({ images, title }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const hasImages = images.length > 0
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!hasImages) {
    return (
      <div className="aspect-[4/3] bg-stone-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="w-16 h-16 text-stone-400 mx-auto mb-4" />
          <p className="text-stone-500">No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-[4/3] bg-stone-100 rounded-xl overflow-hidden group">
      <Image
        src={images[currentIndex]}
        alt={`${title} - Image ${currentIndex + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
        priority
      />

      {/* Navigation Buttons */}
      {hasMultipleImages && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevImage}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextImage}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Dots Navigation */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}