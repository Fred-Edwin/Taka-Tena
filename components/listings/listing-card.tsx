"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { MapPin, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import UserAvatar from "@/components/profile/user-avatar"
import { MATERIAL_TYPE_OPTIONS, UNIT_OPTIONS } from "@/lib/constants"
import { MaterialType, Unit, ListingStatus, UserType } from "@prisma/client"

interface Listing {
  id: string
  title: string
  description: string
  materialType: MaterialType
  quantity: number
  unit: Unit
  location: string
  images: string[]
  status: ListingStatus
  views: number
  createdAt: Date
  user: {
    id: string
    name: string
    userType: UserType
    location: string
    phone?: string | null
    whatsapp?: string | null
    email: string
  }
}

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const materialOption = MATERIAL_TYPE_OPTIONS.find(
    option => option.value === listing.materialType
  )
  const unitOption = UNIT_OPTIONS.find(
    option => option.value === listing.unit
  )

  const MaterialIcon = materialOption?.icon
  const timeAgo = formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })

  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 rounded-lg"
      aria-label={`View ${listing.title} - ${listing.quantity} ${unitOption?.label || listing.unit} of ${materialOption?.label} in ${listing.location}`}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
        <div className="relative">
          {/* Image */}
          <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
            {listing.images.length > 0 ? (
              <Image
                src={listing.images[0]}
                alt={`${listing.title} - ${materialOption?.label || listing.materialType} waste material`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                role="img"
                aria-label="No image available for this listing"
              >
                <ImageIcon className="w-12 h-12 text-stone-400" />
              </div>
            )}
          </div>

          {/* Material Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm text-stone-700 font-medium shadow-sm"
            >
              {MaterialIcon && (
                <MaterialIcon className="w-3 h-3 mr-1" />
              )}
              {materialOption?.label}
            </Badge>
          </div>

          {/* Status Badge */}
          {listing.status === ListingStatus.COMPLETED && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive" className="bg-red-500/90 backdrop-blur-sm">
                Completed
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-stone-900 group-hover:text-forest-700 transition-colors line-clamp-1">
            {truncateText(listing.title, 50)}
          </h3>

          {/* Description */}
          <p className="text-sm text-stone-600 line-clamp-2">
            {truncateText(listing.description, 100)}
          </p>

          {/* Quantity and Unit */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-forest-600">
              {listing.quantity}
            </span>
            <span className="text-sm text-stone-500">
              {unitOption?.label || listing.unit}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-stone-500">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <UserAvatar name={listing.user.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-stone-900 truncate">
                  {listing.user.name}
                </p>
                <p className="text-xs text-stone-500">
                  {listing.user.userType.toLowerCase()}
                </p>
              </div>
            </div>

            {/* Posted Time */}
            <div className="text-xs text-stone-400 flex-shrink-0">
              {timeAgo}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}