import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-stone-200">
          <div className="flex space-x-8">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* My Listings Tab Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-28" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>

            {/* Listings List */}
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="w-20 h-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex space-x-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}