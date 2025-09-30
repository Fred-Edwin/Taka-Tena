"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Check, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/shared/loading-spinner"
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
  updatedAt: Date
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

interface OwnerActionsProps {
  listing: Listing
}

export default function OwnerActions({ listing }: OwnerActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleMarkAsCompleted = async () => {
    if (listing.status === ListingStatus.COMPLETED) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: ListingStatus.COMPLETED
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update listing")
      }

      toast({
        title: "Success!",
        description: "Listing marked as completed.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update listing",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete listing")
      }

      toast({
        title: "Success!",
        description: "Listing deleted successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete listing",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Manage Listing</CardTitle>
        <p className="text-sm text-stone-600">
          Edit, complete, or remove your listing
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Edit Button */}
        <Button
          asChild
          className="w-full"
          size="lg"
        >
          <a href={`/listings/${listing.id}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Listing
          </a>
        </Button>

        {/* Mark as Completed */}
        {listing.status === ListingStatus.AVAILABLE && (
          <Button
            onClick={handleMarkAsCompleted}
            disabled={isUpdating}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {isUpdating ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Updating...</span>
              </div>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Mark as Completed
              </>
            )}
          </Button>
        )}

        {/* Status Display */}
        {listing.status === ListingStatus.COMPLETED && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                This listing is marked as completed
              </span>
            </div>
          </div>
        )}

        {/* Delete Button */}
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="destructive"
          className="w-full"
          size="lg"
        >
          {isDeleting ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Deleting...</span>
            </div>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Listing
            </>
          )}
        </Button>

        {/* Stats */}
        <div className="mt-6 pt-4 border-t border-stone-200">
          <h4 className="font-medium text-stone-900 mb-2">Listing Stats</h4>
          <div className="space-y-1 text-sm text-stone-600">
            <p>Views: {listing.views}</p>
            <p>Status: {listing.status === ListingStatus.AVAILABLE ? "Available" : "Completed"}</p>
            <p>Created: {new Date(listing.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(listing.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Mark your listing as completed when the materials have been picked up to help keep the platform organized.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}