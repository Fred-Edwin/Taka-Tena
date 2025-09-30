"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Plus, Eye, Edit, Check, Trash2, Package, Calendar, MapPin, ImageIcon, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import UserAvatar from "@/components/profile/user-avatar"
import LoadingSpinner from "@/components/shared/loading-spinner"
import EmptyState from "@/components/shared/empty-state"
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton"
import { useToast } from "@/hooks/use-toast"
import { MATERIAL_TYPE_OPTIONS, UNIT_OPTIONS, USER_TYPE_LABELS } from "@/lib/constants"
import { MaterialType, Unit, ListingStatus, UserType } from "@prisma/client"

interface User {
  id: string
  name: string
  email: string
  userType: UserType
  location: string
  phone?: string | null
  whatsapp?: string | null
  verified: boolean
  createdAt: Date
  stats: {
    totalListings: number
    completedListings: number
  }
}

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
}

type StatusFilter = "all" | "AVAILABLE" | "COMPLETED"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  // State
  const [user, setUser] = useState<User | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [listingsLoading, setListingsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/me")
        if (!response.ok) throw new Error("Failed to fetch user data")

        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchUser()
    }
  }, [session, toast])

  // Fetch user's listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/listings?userId=${session?.user?.id}`)
        if (!response.ok) throw new Error("Failed to fetch listings")

        const data = await response.json()
        setListings(data.listings)
      } catch (error) {
        console.error("Error fetching listings:", error)
        toast({
          title: "Error",
          description: "Failed to load listings",
          variant: "destructive",
        })
      } finally {
        setListingsLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchListings()
    }
  }, [session, toast])

  // Filter listings
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredListings(listings)
    } else {
      setFilteredListings(listings.filter(listing => listing.status === statusFilter))
    }
  }, [listings, statusFilter])

  // Handle mark as completed
  const handleMarkCompleted = async (listingId: string) => {
    setUpdatingId(listingId)
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: ListingStatus.COMPLETED }),
      })

      if (!response.ok) throw new Error("Failed to update listing")

      setListings(prev =>
        prev.map(listing =>
          listing.id === listingId
            ? { ...listing, status: ListingStatus.COMPLETED }
            : listing
        )
      )

      toast({
        title: "Success!",
        description: "Listing marked as completed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  // Handle delete
  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return

    setDeletingId(listingId)
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete listing")

      setListings(prev => prev.filter(listing => listing.id !== listingId))

      toast({
        title: "Success!",
        description: "Listing deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const ListingRow = ({ listing }: { listing: Listing }) => {
    const materialOption = MATERIAL_TYPE_OPTIONS.find(
      option => option.value === listing.materialType
    )
    const unitOption = UNIT_OPTIONS.find(
      option => option.value === listing.unit
    )

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Thumbnail */}
            <div className="w-16 h-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
              {listing.images.length > 0 ? (
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-stone-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="text-lg font-semibold text-stone-900 hover:text-forest-700 transition-colors"
                  >
                    {listing.title}
                  </Link>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-stone-600">
                    <span className="flex items-center">
                      <Package className="w-4 h-4 mr-1" />
                      {listing.quantity} {unitOption?.label || listing.unit}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {listing.views} views
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Badge */}
                  <Badge
                    variant={listing.status === ListingStatus.AVAILABLE ? "default" : "secondary"}
                    className={
                      listing.status === ListingStatus.AVAILABLE
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-stone-500"
                    }
                  >
                    {listing.status === ListingStatus.AVAILABLE ? "Available" : "Completed"}
                  </Badge>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <Link href={`/listings/${listing.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>

                    {listing.status === ListingStatus.AVAILABLE && (
                      <Button
                        onClick={() => handleMarkCompleted(listing.id)}
                        disabled={updatingId === listing.id}
                        variant="outline"
                        size="sm"
                      >
                        {updatingId === listing.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                    )}

                    <Button
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === listing.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">User not found</h2>
          <p className="text-stone-600">Unable to load user data.</p>
        </div>
      </div>
    )
  }

  // Handle authentication states
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-950 mb-2">
            Dashboard
          </h1>
          <p className="text-stone-600">
            Manage your listings and account
          </p>
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/listings/create">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Listing
                </Link>
              </Button>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-stone-500" />
                <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {listingsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-1/3" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="w-8 h-8" />
                          <Skeleton className="w-8 h-8" />
                          <Skeleton className="w-8 h-8" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No listings found"
                description={
                  statusFilter === "all"
                    ? "You haven't posted any materials yet. Start sharing your waste with the community!"
                    : `No ${statusFilter.toLowerCase()} listings found.`
                }
                action={
                  statusFilter === "all" ? (
                    <Button asChild>
                      <Link href="/listings/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Listing
                      </Link>
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div>
                <div className="text-sm text-stone-600 mb-4">
                  Showing {filteredListings.length} of {listings.length} listings
                </div>
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <ListingRow key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Info */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <UserAvatar name={user.name} size="lg" />
                      <div>
                        <h3 className="text-xl font-semibold text-stone-900">{user.name}</h3>
                        <p className="text-stone-600 capitalize">
                          {USER_TYPE_LABELS[user.userType] || user.userType}
                        </p>
                        <div className="flex items-center text-stone-500 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{user.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium text-stone-700">Email</label>
                        <p className="text-stone-900">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-700">Location</label>
                        <p className="text-stone-900">{user.location}</p>
                      </div>
                      {user.phone && (
                        <div>
                          <label className="text-sm font-medium text-stone-700">Phone</label>
                          <p className="text-stone-900">{user.phone}</p>
                        </div>
                      )}
                      {user.whatsapp && (
                        <div>
                          <label className="text-sm font-medium text-stone-700">WhatsApp</label>
                          <p className="text-stone-900">{user.whatsapp}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <Button asChild>
                        <Link href="/profile/edit">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-forest-600 mb-1">
                        {user.stats.totalListings}
                      </div>
                      <p className="text-sm text-stone-600">Total Listings</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {user.stats.completedListings}
                      </div>
                      <p className="text-sm text-stone-600">Completed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {user.stats.totalListings - user.stats.completedListings}
                      </div>
                      <p className="text-sm text-stone-600">Active</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}