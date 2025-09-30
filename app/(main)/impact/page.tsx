"use client"

import { useState, useEffect } from "react"
import { Package, Users, Weight, CheckCircle, Trash2, TreePine, Hammer, Cpu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import LoadingSpinner from "@/components/shared/loading-spinner"
import { useToast } from "@/hooks/use-toast"

interface ImpactStats {
  totalListings: number
  completedListings: number
  estimatedWeight: number
  activeUsers: number
}

interface MaterialData {
  type: string
  name: string
  count: number
  percentage: number
  color: string
}

interface ImpactData {
  stats: ImpactStats
  materials: MaterialData[]
}

const materialIcons: Record<string, any> = {
  PLASTIC: Trash2,
  ORGANIC: TreePine,
  CONSTRUCTION: Hammer,
  EWASTE: Cpu,
}

const materialColors: Record<string, string> = {
  blue: "text-blue-600 bg-blue-100",
  green: "text-green-600 bg-green-100",
  amber: "text-amber-600 bg-amber-100",
  red: "text-red-600 bg-red-100",
}

export default function ImpactPage() {
  const [data, setData] = useState<ImpactData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const response = await fetch("/api/impact/global")
        if (!response.ok) throw new Error("Failed to fetch impact data")

        const impactData = await response.json()
        setData(impactData)
      } catch (error) {
        console.error("Error fetching impact data:", error)
        toast({
          title: "Error",
          description: "Failed to load impact data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchImpactData()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Unable to load impact data</h2>
          <p className="text-stone-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  const { stats, materials } = data

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-forest-900 to-forest-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Our Collective Impact
          </h1>
          <p className="text-lg sm:text-xl text-forest-100 max-w-2xl mx-auto">
            Together, we're transforming waste into opportunity and building a more sustainable Kenya
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-br from-forest-900 to-forest-700 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-10">
            {/* Total Listings */}
            <Card className="bg-forest-800 border-forest-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{stats.totalListings.toLocaleString()}</div>
                <p className="text-forest-200">Total Listings Posted</p>
              </CardContent>
            </Card>

            {/* Total Completed */}
            <Card className="bg-forest-800 border-forest-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{stats.completedListings.toLocaleString()}</div>
                <p className="text-forest-200">Completed Exchanges</p>
              </CardContent>
            </Card>

            {/* Estimated Weight */}
            <Card className="bg-forest-800 border-forest-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Weight className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{stats.estimatedWeight.toLocaleString()}</div>
                <p className="text-forest-200">Kg Waste Diverted</p>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card className="bg-forest-800 border-forest-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{stats.activeUsers.toLocaleString()}</div>
                <p className="text-forest-200">Active Users</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Material Breakdown Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-950 mb-4">
              Material Distribution
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              See how different types of waste materials are being shared and recycled across our platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {materials.map((material) => {
              const Icon = materialIcons[material.type]
              const colorClass = materialColors[material.color]

              return (
                <Card key={material.type} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colorClass}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">
                      {material.name}
                    </h3>
                    <div className="text-3xl font-bold text-stone-800 mb-1">
                      {material.count.toLocaleString()}
                    </div>
                    <p className="text-stone-600 text-sm">
                      {material.percentage}% of all listings
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Simple Chart */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-stone-900 mb-6">
                Listings by Material Type
              </h3>
              <div className="space-y-4">
                {materials.map((material) => {
                  const Icon = materialIcons[material.type]
                  const maxCount = Math.max(...materials.map(m => m.count))
                  const barWidth = maxCount > 0 ? (material.count / maxCount) * 100 : 0

                  return (
                    <div key={material.type} className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 w-32 flex-shrink-0">
                        <Icon className={`w-4 h-4 ${material.color === 'blue' ? 'text-blue-600' :
                          material.color === 'green' ? 'text-green-600' :
                          material.color === 'amber' ? 'text-amber-600' : 'text-red-600'}`} />
                        <span className="text-sm font-medium text-stone-700">
                          {material.name}
                        </span>
                      </div>
                      <div className="flex-1 bg-stone-100 rounded-full h-6 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            material.color === 'blue' ? 'bg-blue-500' :
                            material.color === 'green' ? 'bg-green-500' :
                            material.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-stone-700">
                          {material.count} listings
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-sage-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-stone-950 mb-4">
            Join the Movement
          </h2>
          <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
            Every listing you post makes a difference. Help us build a circular economy where waste becomes a valuable resource.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/listings/create"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-forest-600 hover:bg-forest-700 transition-colors"
            >
              Post Your First Listing
            </a>
            <a
              href="/browse"
              className="inline-flex items-center justify-center px-6 py-3 border border-forest-600 text-base font-medium rounded-xl text-forest-600 bg-white hover:bg-forest-50 transition-colors"
            >
              Browse Materials
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}