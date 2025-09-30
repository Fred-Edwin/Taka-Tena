"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
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

const createListingSchema = z.object({
  title: z.string().min(1, "Title is required").max(MAX_TITLE_LENGTH, `Title must be less than ${MAX_TITLE_LENGTH} characters`),
  description: z.string().min(1, "Description is required").max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`),
  materialType: z.nativeEnum(MaterialType, { required_error: "Material type is required" }),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.nativeEnum(Unit, { required_error: "Unit is required" }),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string().url()).max(2, "Maximum 2 images allowed").optional().default([]),
})

type CreateListingFormData = z.infer<typeof createListingSchema>

export default function CreateListingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      location: session?.user?.location || "",
      images: [],
    },
  })

  // Watch form values for character counters
  const titleValue = watch("title") || ""
  const descriptionValue = watch("description") || ""

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

  const onSubmit = async (data: CreateListingFormData) => {
    setIsSubmitting(true)

    try {
      const listingData = {
        ...data,
        images,
      }

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create listing")
      }

      toast({
        title: "Success!",
        description: "Your listing has been published successfully.",
      })

      // Redirect to listing detail page
      router.push(`/listings/${result.listing.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create listing",
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
            Create New Listing
          </h1>
          <p className="text-stone-600">
            Share your waste materials with the TakaTena community
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
                  <Select onValueChange={(value) => setValue("unit", value as Unit)}>
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
                Add photos to help others understand your materials better
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

          {/* Submit Button */}
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
                  <span>Publishing...</span>
                </div>
              ) : (
                "Publish Listing"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}