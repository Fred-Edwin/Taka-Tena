"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserType } from "@prisma/client"

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  userType: z.nativeEnum(UserType, { required_error: "Please select a user type" }),
  location: z.string().min(1, "Location is required"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

const userTypeOptions = [
  { value: UserType.INDIVIDUAL, label: "Individual" },
  { value: UserType.BUSINESS, label: "Business" },
  { value: UserType.RECYCLER, label: "Recycler" },
  { value: UserType.ARTISAN, label: "Artisan" },
  { value: UserType.MANUFACTURER, label: "Manufacturer" },
]

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create account")
      }

      // Redirect to login with success message
      router.push("/login?message=Account created successfully! Please sign in.")
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to create account")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sage-100 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-stone-950">
            Join TakaTena
          </h2>
          <p className="mt-2 text-stone-600">
            Start turning waste into value today
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                Email Address *
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
                Password *
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="At least 8 characters"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1">
                Confirm Password *
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="Repeat your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                Full Name *
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* User Type */}
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-stone-700 mb-1">
                User Type *
              </label>
              <select
                {...register("userType")}
                id="userType"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              >
                <option value="">Select your type</option>
                {userTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.userType && (
                <p className="text-red-500 text-sm mt-1">{errors.userType.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-stone-700 mb-1">
                Location *
              </label>
              <input
                {...register("location")}
                type="text"
                id="location"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="e.g., Westlands, Nairobi"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                {...register("phone")}
                type="tel"
                id="phone"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="e.g., +254712345678"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* WhatsApp (Optional) */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-stone-700 mb-1">
                WhatsApp Number
              </label>
              <input
                {...register("whatsapp")}
                type="tel"
                id="whatsapp"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="e.g., +254712345678"
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
              )}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">
                {submitError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-forest-900 hover:bg-forest-700 disabled:bg-stone-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 mt-6"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-forest-700 hover:text-forest-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}