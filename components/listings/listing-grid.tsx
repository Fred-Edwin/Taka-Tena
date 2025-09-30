"use client"

import { MaterialType, Unit, ListingStatus, UserType } from "@prisma/client"
import ListingCard from "./listing-card"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import EmptyState from "@/components/shared/empty-state"
import { Package } from "lucide-react"

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

interface ListingGridProps {
  listings?: Listing[]
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  emptyDescription?: string
}

// Loading card skeleton component
function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-stone-100">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function ListingGrid({
  listings = [],
  loading = false,
  error = null,
  emptyMessage = "No listings found",
  emptyDescription = "Try adjusting your search or filters to find what you're looking for."
}: ListingGridProps) {
  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl max-w-md mx-auto">
          <p className="font-medium">Error loading listings</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ListingCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Empty state
  if (listings.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={Package}
          title={emptyMessage}
          description={emptyDescription}
        />
      </div>
    )
  }

  // Listings grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}