"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ListingGrid from "@/components/listings/listing-grid"
import LoadingSpinner from "@/components/shared/loading-spinner"
import BrowsePageSkeleton from "@/components/skeletons/browse-page-skeleton"
import { MATERIAL_TYPE_OPTIONS } from "@/lib/constants"
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

interface ListingsResponse {
  listings: Listing[]
  total: number
  page: number
  totalPages: number
}

export default function BrowseListingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Filter state
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [materialType, setMaterialType] = useState(searchParams.get("materialType") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (materialType) params.set("materialType", materialType)
      if (location) params.set("location", location)
      if (status) params.set("status", status)
      params.set("page", page.toString())
      params.set("limit", "20")

      const response = await fetch(`/api/listings?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch listings")
      }

      const data: ListingsResponse = await response.json()
      setListings(data.listings)
      setTotalPages(data.totalPages)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch listings")
    } finally {
      setLoading(false)
    }
  }, [search, materialType, location, status, page])

  // Update URL with current filters
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (materialType) params.set("materialType", materialType)
    if (location) params.set("location", location)
    if (status) params.set("status", status)
    if (page > 1) params.set("page", page.toString())

    const queryString = params.toString()
    const newURL = queryString ? `?${queryString}` : window.location.pathname

    router.replace(newURL, { scroll: false })
  }, [search, materialType, location, status, page, router])

  // Effects
  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  useEffect(() => {
    updateURL()
  }, [updateURL])

  // Filter handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchListings()
  }

  const clearFilters = () => {
    setSearch("")
    setMaterialType("")
    setLocation("")
    setStatus("")
    setPage(1)
  }

  const hasActiveFilters = search || materialType || location || status

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 space-y-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters */}
          <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-stone-600 hover:text-stone-900"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                    <Input
                      placeholder="Search listings..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>

                {/* Material Type */}
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">
                    Material Type
                  </label>
                  <Select value={materialType} onValueChange={setMaterialType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All materials" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All materials</SelectItem>
                      {MATERIAL_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">
                    Location
                  </label>
                  <Input
                    placeholder="Enter location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">
                    Status
                  </label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Apply Filters Button */}
                <Button
                  onClick={() => {
                    setPage(1)
                    fetchListings()
                  }}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </CardContent>
            </Card>

            {/* Active Filters */}
            {hasActiveFilters && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Active Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {search && (
                      <Badge variant="secondary" className="text-xs">
                        Search: {search}
                        <button
                          onClick={() => setSearch("")}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {materialType && (
                      <Badge variant="secondary" className="text-xs">
                        Material: {MATERIAL_TYPE_OPTIONS.find(o => o.value === materialType)?.label}
                        <button
                          onClick={() => setMaterialType("")}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {location && (
                      <Badge variant="secondary" className="text-xs">
                        Location: {location}
                        <button
                          onClick={() => setLocation("")}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {status && (
                      <Badge variant="secondary" className="text-xs">
                        Status: {status}
                        <button
                          onClick={() => setStatus("")}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              {search ? (
                <>
                  <h1 className="text-3xl font-bold text-stone-950">
                    Search Results for: "{search}"
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-stone-600">
                      Found materials matching your search
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearch("")
                        setPage(1)
                      }}
                      className="text-stone-500 hover:text-stone-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear search
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-stone-950">Browse Listings</h1>
                  <p className="text-stone-600 mt-1">
                    Discover waste materials available in your area
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="text-sm text-stone-600">
              {listings.length > 0 ? (
                search ? (
                  <>Found {listings.length} result{listings.length !== 1 ? 's' : ''} for "{search}"</>
                ) : (
                  <>Showing {listings.length} listings</>
                )
              ) : (
                search ? (
                  <>No results found for "{search}"</>
                ) : (
                  "No listings found"
                )
              )}
            </div>
          )}

          {/* Listings Grid */}
          <ListingGrid
            listings={listings}
            loading={loading}
            error={error}
            emptyMessage="No listings found"
            emptyDescription="Try adjusting your search or filters to find what you're looking for."
          />

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-8">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-stone-400">...</span>
                    <Button
                      variant={page === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}