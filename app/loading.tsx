import LoadingSpinner from "@/components/shared/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <h1 className="text-4xl font-bold text-forest-900 mb-8">
          TakaTena
        </h1>

        {/* Loading spinner */}
        <LoadingSpinner size="lg" />

        {/* Loading text */}
        <p className="text-stone-600 mt-4">
          Loading...
        </p>
      </div>
    </div>
  )
}