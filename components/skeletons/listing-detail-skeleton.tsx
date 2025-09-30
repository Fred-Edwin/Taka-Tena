import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ListingDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {/* Title and Status */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}