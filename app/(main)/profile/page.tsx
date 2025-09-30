"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Edit, MapPin, Calendar, Phone, MessageCircle, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import UserAvatar from "@/components/profile/user-avatar"
import ListingGrid from "@/components/listings/listing-grid"
import LoadingSpinner from "@/components/shared/loading-spinner"
import ProfileSkeleton from "@/components/skeletons/profile-skeleton"
import { useToast } from "@/hooks/use-toast"
import { USER_TYPE_LABELS } from "@/lib/constants"
import { MaterialType, Unit, ListingStatus, UserType } from "@prisma/client"

interface User {
  id: string
  name: string
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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  // State
  const [user, setUser] = useState<User | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [listingsLoading, setListingsLoading] = useState(true)

  // Fetch user data (current user's profile)
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
          description: "Failed to load profile data",
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

  // Fetch user's active listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/users/${session?.user?.id}`)
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

  // Redirect if not authenticated
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

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Profile not found</h2>
          <p className="text-stone-600">Unable to load profile data.</p>
        </div>
      </div>
    )
  }

  const memberSince = formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center space-x-6">
                <UserAvatar name={user.name} size="lg" className="w-24 h-24 text-2xl" />
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-stone-950">{user.name}</h1>
                    <Badge className="bg-forest-100 text-forest-800">
                      {USER_TYPE_LABELS[user.userType] || user.userType}
                    </Badge>
                    {user.verified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center text-stone-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{user.location}</span>
                  </div>

                  <div className="flex items-center text-stone-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link href="/profile/edit">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-900">{user.phone}</span>
                  </div>
                )}

                {user.whatsapp && (
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-4 h-4 text-stone-500" />
                    <span className="text-stone-900">{user.whatsapp}</span>
                  </div>
                )}

                {!user.phone && !user.whatsapp && (
                  <p className="text-stone-500 text-sm">
                    No contact information provided.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Total Listings</span>
                  <span className="font-semibold text-forest-600">
                    {user.stats.totalListings}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {user.stats.completedListings}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Active</span>
                  <span className="font-semibold text-blue-600">
                    {user.stats.totalListings - user.stats.completedListings}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-stone-950 mb-2">
                Active Listings
              </h2>
              <p className="text-stone-600">
                Materials currently available from {user.name}
              </p>
            </div>

            <ListingGrid
              listings={listings}
              loading={listingsLoading}
              emptyMessage="No active listings"
              emptyDescription="This user doesn't have any active listings at the moment."
            />
          </div>
        </div>
      </div>
    </div>
  )
}