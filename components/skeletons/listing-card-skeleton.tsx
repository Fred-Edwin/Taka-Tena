import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}