"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-stone-900 mb-4">
            Something went wrong
          </h1>

          <p className="text-stone-600 mb-6">
            We encountered an unexpected error. This could be a temporary issue.
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-stone-500 mb-2">
                Error details (development only)
              </summary>
              <pre className="text-xs bg-stone-100 p-3 rounded overflow-auto text-red-600">
                {error.message}
              </pre>
            </details>
          )}

          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full"
              size="lg"
            >
              <a href="/">Go to homepage</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}