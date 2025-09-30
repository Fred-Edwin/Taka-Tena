"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { MaterialType, Unit } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/shared/image-upload"
import LoadingSpinner from "@/components/shared/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { MATERIAL_TYPE_OPTIONS, UNIT_OPTIONS, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from "@/lib/constants"

const editListingSchema = z.object({
  title: z.string().min(1, "Title is required").max(MAX_TITLE_LENGTH, `Title must be less than ${MAX_TITLE_LENGTH} characters`),
  description: z.string().min(1, "Description is required").max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`),
  materialType: z.nativeEnum(MaterialType, { required_error: "Material type is required" }),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.nativeEnum(Unit, { required_error: "Unit is required" }),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string().url()).max(2, "Maximum 2 images allowed").optional().default([]),
})

type EditListingFormData = z.infer<typeof editListingSchema>

interface Listing {
  id: string
  title: string
  description: string
  materialType: MaterialType
  quantity: number
  unit: Unit
  location: string
  images: string[]
  userId: string
}

interface PageProps {
  params: { id: string }
}

export default function EditListingPage({ params }: PageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<EditListingFormData>({
    resolver: zodResolver(editListingSchema),
  })

  // Watch form values for character counters
  const titleValue = watch("title") || ""
  const descriptionValue = watch("description") || ""

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`)

        if (response.status === 404) {
          notFound()
        }

        if (!response.ok) {
          throw new Error("Failed to fetch listing")
        }

        const data = await response.json()
        const fetchedListing = data.listing

        // Check if user is owner
        if (session?.user?.id !== fetchedListing.userId) {
          router.push(`/listings/${params.id}`)
          return
        }

        setListing(fetchedListing)
        setImages(fetchedListing.images || [])

        // Pre-fill form
        reset({
          title: fetchedListing.title,
          description: fetchedListing.description,
          materialType: fetchedListing.materialType,
          quantity: fetchedListing.quantity,
          unit: fetchedListing.unit,
          location: fetchedListing.location,
          images: fetchedListing.images || [],
        })
      } catch (error) {
        console.error("Error fetching listing:", error)
        toast({
          title: "Error",
          description: "Failed to load listing data",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchListing()
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [params.id, session, status, router, reset, toast])

  // Redirect if not authenticated
  if (status === "loading" || loading) {
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

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Listing not found</h2>
          <p className="text-stone-600 mb-4">The listing you're looking for doesn't exist or you don't have permission to edit it.</p>
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: EditListingFormData) => {
    setIsSubmitting(true)

    try {
      const listingData = {
        ...data,
        images,
      }

      const response = await fetch(`/api/listings/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update listing")
      }

      toast({
        title: "Success!",
        description: "Your listing has been updated successfully.",
      })

      // Redirect to listing detail page
      router.push(`/listings/${params.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update listing",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-950 mb-2">
            Edit Listing
          </h1>
          <p className="text-stone-600">
            Update your listing information
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Material Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Material Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MATERIAL_TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <label
                      key={option.value}
                      className={`
                        flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors
                        hover:border-forest-300 hover:bg-forest-50
                        ${watch("materialType") === option.value
                          ? "border-forest-500 bg-forest-50"
                          : "border-stone-200"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register("materialType")}
                        className="sr-only"
                      />
                      <Icon className="w-6 h-6 text-forest-600 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-stone-900">{option.label}</div>
                        <div className="text-sm text-stone-600">{option.description}</div>
                      </div>
                    </label>
                  )
                })}
              </div>
              {errors.materialType && (
                <p className="text-red-500 text-sm mt-2">{errors.materialType.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g., Plastic bottles and containers"
                  className="mt-1"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  )}
                  <p className="text-xs text-stone-500 ml-auto">
                    {titleValue.length}/{MAX_TITLE_LENGTH}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe your waste materials, condition, and any specific requirements..."
                  rows={4}
                  className="mt-1"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                  <p className="text-xs text-stone-500 ml-auto">
                    {descriptionValue.length}/{MAX_DESCRIPTION_LENGTH}
                  </p>
                </div>
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    min="0"
                    {...register("quantity", { valueAsNumber: true })}
                    placeholder="0"
                    className="mt-1"
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select
                    value={watch("unit") || ""}
                    onValueChange={(value) => setValue("unit", value as Unit)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g., Westlands, Nairobi"
                  className="mt-1"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Images</CardTitle>
              <p className="text-sm text-stone-600">
                Update photos to help others understand your materials better
              </p>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={images}
                onImagesChange={(newImages) => {
                  setImages(newImages)
                  setValue("images", newImages)
                }}
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}