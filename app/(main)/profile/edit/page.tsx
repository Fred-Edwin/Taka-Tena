"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UserAvatar from "@/components/profile/user-avatar"
import LoadingSpinner from "@/components/shared/loading-spinner"
import ProfileSkeleton from "@/components/skeletons/profile-skeleton"
import { useToast } from "@/hooks/use-toast"
import { USER_TYPE_LABELS } from "@/lib/constants"
import { UserType } from "@prisma/client"

const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  location: z.string().min(1, "Location is required").max(100, "Location must be less than 100 characters"),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional().nullable(),
  whatsapp: z.string().max(20, "WhatsApp must be less than 20 characters").optional().nullable(),
})

type EditProfileFormData = z.infer<typeof editProfileSchema>

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
}

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
  })

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/me")
        if (!response.ok) throw new Error("Failed to fetch user data")

        const data = await response.json()
        const fetchedUser = data.user

        setUser(fetchedUser)

        // Pre-fill form
        reset({
          name: fetchedUser.name,
          location: fetchedUser.location,
          phone: fetchedUser.phone || "",
          whatsapp: fetchedUser.whatsapp || "",
        })
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
  }, [session, reset, toast])

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

  const onSubmit = async (data: EditProfileFormData) => {
    setIsSubmitting(true)

    try {
      // Convert empty strings to null for optional fields
      const profileData = {
        ...data,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
      }

      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile")
      }

      toast({
        title: "Success!",
        description: "Your profile has been updated successfully.",
      })

      // Redirect to profile page
      router.push("/profile")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-950 mb-2">
            Edit Profile
          </h1>
          <p className="text-stone-600">
            Update your personal information and contact details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <UserAvatar name={user.name} size="lg" />
                <div>
                  <h3 className="text-xl font-semibold text-stone-900">{user.name}</h3>
                  <p className="text-stone-600 capitalize">
                    {USER_TYPE_LABELS[user.userType] || user.userType}
                  </p>
                  <p className="text-stone-500 text-sm">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
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

              {/* Email (Read-only) */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="mt-1 bg-stone-50"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Email address cannot be changed
                </p>
              </div>

              {/* User Type (Read-only) */}
              <div>
                <Label htmlFor="userType">User Type</Label>
                <Input
                  id="userType"
                  value={USER_TYPE_LABELS[user.userType] || user.userType}
                  disabled
                  className="mt-1 bg-stone-50"
                />
                <p className="text-xs text-stone-500 mt-1">
                  User type cannot be changed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <p className="text-sm text-stone-600">
                Optional contact details to help others reach you
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="e.g., +254 712 345 678"
                  className="mt-1"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
                <p className="text-xs text-stone-500 mt-1">
                  This will be visible to users interested in your listings
                </p>
              </div>

              {/* WhatsApp */}
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  {...register("whatsapp")}
                  placeholder="e.g., +254 712 345 678"
                  className="mt-1"
                />
                {errors.whatsapp && (
                  <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
                )}
                <p className="text-xs text-stone-500 mt-1">
                  Others can contact you directly via WhatsApp
                </p>
              </div>
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