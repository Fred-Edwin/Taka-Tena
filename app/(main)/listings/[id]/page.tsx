import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/profile/user-avatar"
import ImageViewer from "@/components/listings/image-viewer"
import ContactSection from "@/components/listings/contact-section"
import OwnerActions from "@/components/listings/owner-actions"
import { MATERIAL_TYPE_OPTIONS, UNIT_OPTIONS, USER_TYPE_LABELS } from "@/lib/constants"
import { MapPin, Eye, Calendar, Package } from "lucide-react"
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

interface PageProps {
  params: { id: string }
}

async function getListingData(id: string): Promise<Listing | null> {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            userType: true,
            location: true,
            phone: true,
            whatsapp: true,
            email: true,
          }
        }
      }
    })

    if (!listing) return null

    // Increment view count
    await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    return listing
  } catch (error) {
    console.error("Error fetching listing:", error)
    return null
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const listing = await getListingData(params.id)
  const session = await getServerSession(authOptions)

  if (!listing) {
    notFound()
  }

  const materialOption = MATERIAL_TYPE_OPTIONS.find(
    option => option.value === listing.materialType
  )
  const unitOption = UNIT_OPTIONS.find(
    option => option.value === listing.unit
  )

  const MaterialIcon = materialOption?.icon
  const timeAgo = formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })
  const isOwner = session?.user?.id === listing.user.id

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Viewer */}
            <div className="relative">
              <ImageViewer images={listing.images} title={listing.title} />

              {/* Overlays */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                {/* Material Badge */}
                <Badge className="bg-white/90 backdrop-blur-sm text-stone-700 font-medium shadow-sm">
                  {MaterialIcon && (
                    <MaterialIcon className="w-3 h-3 mr-1" />
                  )}
                  {materialOption?.label}
                </Badge>

                {/* Status Badge */}
                <Badge
                  variant={listing.status === ListingStatus.AVAILABLE ? "default" : "secondary"}
                  className={
                    listing.status === ListingStatus.AVAILABLE
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-stone-500 hover:bg-stone-600"
                  }
                >
                  {listing.status === ListingStatus.AVAILABLE ? "Available" : "Completed"}
                </Badge>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Title and Description */}
              <div>
                <h1 className="text-3xl font-bold text-stone-950 mb-4">
                  {listing.title}
                </h1>
                <p className="text-lg text-stone-700 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Quantity */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-forest-600" />
                      </div>
                      <div>
                        <p className="text-sm text-stone-600">Quantity</p>
                        <p className="text-xl font-bold text-stone-900">
                          {listing.quantity} {unitOption?.label || listing.unit}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-forest-600" />
                      </div>
                      <div>
                        <p className="text-sm text-stone-600">Location</p>
                        <p className="text-lg font-semibold text-stone-900">
                          {listing.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Views */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                        <Eye className="w-5 h-5 text-forest-600" />
                      </div>
                      <div>
                        <p className="text-sm text-stone-600">Views</p>
                        <p className="text-lg font-semibold text-stone-900">
                          {listing.views}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posted Date */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-forest-600" />
                      </div>
                      <div>
                        <p className="text-sm text-stone-600">Posted</p>
                        <p className="text-lg font-semibold text-stone-900">
                          {timeAgo}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Posted By Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4">
                    Posted by
                  </h3>
                  <div className="flex items-center space-x-4">
                    <UserAvatar name={listing.user.name} size="lg" />
                    <div>
                      <h4 className="text-xl font-semibold text-stone-900">
                        {listing.user.name}
                      </h4>
                      <p className="text-stone-600 capitalize">
                        {USER_TYPE_LABELS[listing.user.userType] || listing.user.userType}
                      </p>
                      <div className="flex items-center text-stone-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{listing.user.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isOwner ? (
              <OwnerActions listing={listing} />
            ) : (
              <ContactSection
                listing={listing}
                user={listing.user}
                disabled={listing.status === ListingStatus.COMPLETED}
              />
            )}

            {/* Related Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-stone-900 mb-4">
                  Safety Tips
                </h3>
                <div className="space-y-3 text-sm text-stone-600">
                  <p>• Meet in a public place for exchanges</p>
                  <p>• Verify the quality of materials before pickup</p>
                  <p>• Bring proper transportation for the materials</p>
                  <p>• Agree on pickup times in advance</p>
                  <p>• Report any suspicious activity</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}