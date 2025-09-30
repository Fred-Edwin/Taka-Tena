import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ListingCardSkeleton from "./listing-card-skeleton"

export default function BrowsePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar Skeleton */}
        <div className="lg:w-80 space-y-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Filters Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>

          {/* Results Count */}
          <Skeleton className="h-4 w-32" />

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 pt-8">
            <Skeleton className="h-10 w-20" />
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
            <Skeleton className="h-10 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}