"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const successMessage = searchParams.get("message")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setSubmitError("Invalid email or password")
      } else if (result?.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      setSubmitError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sage-100 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-stone-950">
            Welcome back
          </h2>
          <p className="mt-2 text-stone-600">
            Sign in to your TakaTena account
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                Email Address
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
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                {...register("rememberMe")}
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-stone-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-stone-700">
                Remember me
              </label>
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
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-forest-700 hover:text-forest-500 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}