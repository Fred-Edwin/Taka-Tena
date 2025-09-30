import Link from "next/link"
import { AlertTriangle, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>

          <h1 className="text-2xl font-bold text-stone-900 mb-4">
            Page Not Found
          </h1>

          <p className="text-stone-600 mb-6">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full" size="lg">
              <Link href="/browse">
                <Search className="w-4 h-4 mr-2" />
                Browse Listings
              </Link>
            </Button>
          </div>

          <p className="text-xs text-stone-500 mt-6">
            If you believe this is an error, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}