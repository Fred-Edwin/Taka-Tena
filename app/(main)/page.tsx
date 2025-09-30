"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Recycle, Users, TrendingUp, Package, TreePine, Hammer, Cpu, Search, Plus, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ImpactStats {
  totalListings: number
  completedListings: number
  estimatedWeight: number
  activeUsers: number
}

const materialCategories = [
  {
    type: "PLASTIC",
    name: "Plastic Waste",
    icon: Recycle,
    color: "bg-blue-500",
    description: "Bottles, containers, packaging materials"
  },
  {
    type: "ORGANIC",
    name: "Organic Matter",
    icon: TreePine,
    color: "bg-green-500",
    description: "Food waste, garden trimmings, biomass"
  },
  {
    type: "CONSTRUCTION",
    name: "Construction",
    icon: Hammer,
    color: "bg-amber-500",
    description: "Concrete, wood, metal, building materials"
  },
  {
    type: "EWASTE",
    name: "Electronics",
    icon: Cpu,
    color: "bg-red-500",
    description: "Computers, phones, electronic components"
  }
]

const steps = [
  {
    icon: Plus,
    title: "Post Your Material",
    description: "List your waste materials with photos and details"
  },
  {
    icon: Search,
    title: "Find Matches",
    description: "Connect with recyclers and processors in your area"
  },
  {
    icon: CheckCircle,
    title: "Complete Exchange",
    description: "Arrange pickup and transform waste into value"
  }
]

export default function HomePage() {
  const [stats, setStats] = useState<ImpactStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/impact/global")
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-100 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-950 leading-tight mb-6">
              Turn Waste Into{" "}
              <span className="text-forest-500">Value</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-stone-600 leading-relaxed max-w-3xl mx-auto mb-8">
              Connect with recyclers and processors in Kenya. Transform waste materials into opportunities while building a sustainable future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-forest-900 hover:bg-forest-700 text-lg px-8 py-4">
                <Link href="/listings/create">
                  Post Material
                  <Plus className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                <Link href="/browse">
                  Browse Materials
                  <Search className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-forest-900 mb-2">
                  {stats.totalListings.toLocaleString()}
                </div>
                <p className="text-stone-600 text-sm sm:text-base">Materials Listed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-forest-900 mb-2">
                  {stats.completedListings.toLocaleString()}
                </div>
                <p className="text-stone-600 text-sm sm:text-base">Successful Exchanges</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-forest-900 mb-2">
                  {stats.estimatedWeight.toLocaleString()}kg
                </div>
                <p className="text-stone-600 text-sm sm:text-base">Waste Diverted</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-forest-900 mb-2">
                  {stats.activeUsers.toLocaleString()}
                </div>
                <p className="text-stone-600 text-sm sm:text-base">Active Users</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="bg-stone-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-950 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Join Kenya's circular economy in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-forest-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-stone-600">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Material Categories Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-950 mb-4">
              Browse by Material Type
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Find specific waste materials in your area
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materialCategories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.type}
                  href={`/browse?materialType=${category.type}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-stone-900 mb-2 group-hover:text-forest-700 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-stone-600 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-center text-forest-600 text-sm font-medium">
                        Browse {category.name}
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-forest-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Join the Movement?
          </h2>
          <p className="text-lg text-forest-100 max-w-2xl mx-auto mb-8">
            Start transforming waste into value today. Join thousands of Kenyans building a sustainable future together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-forest-300 text-forest-100 hover:bg-forest-800">
              <Link href="/impact">
                View Our Impact
                <TrendingUp className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}