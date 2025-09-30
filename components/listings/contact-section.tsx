"use client"

import { Phone, MessageCircle, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
}

interface User {
  id: string
  name: string
  userType: UserType
  location: string
  phone?: string | null
  whatsapp?: string | null
  email: string
}

interface ContactSectionProps {
  listing: Listing
  user: User
  disabled?: boolean
}

export default function ContactSection({ listing, user, disabled = false }: ContactSectionProps) {
  const generateWhatsAppMessage = () => {
    const message = `Hi ${user.name}! I'm interested in your listing "${listing.title}" on TakaTena. Could you please provide more details about the ${listing.materialType.toLowerCase()} materials?`
    return encodeURIComponent(message)
  }

  const generateEmailSubject = () => {
    return encodeURIComponent(`Inquiry about: ${listing.title}`)
  }

  const generateEmailBody = () => {
    const body = `Hi ${user.name},

I'm interested in your listing "${listing.title}" on TakaTena.

Listing Details:
- Material: ${listing.materialType}
- Quantity: ${listing.quantity}
- Location: ${listing.location}

Could you please provide more details about the materials and availability?

Thank you!`
    return encodeURIComponent(body)
  }

  if (disabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-stone-500 mb-4">This listing is no longer available</p>
            <div className="text-sm text-stone-400">
              The owner has marked this listing as completed
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contact {user.name}</CardTitle>
        <p className="text-sm text-stone-600">
          Get in touch to arrange pickup or ask questions
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Phone */}
        {user.phone && (
          <Button
            asChild
            className="w-full"
            size="lg"
          >
            <a href={`tel:${user.phone}`}>
              <Phone className="w-4 h-4 mr-2" />
              Call {user.phone}
            </a>
          </Button>
        )}

        {/* WhatsApp */}
        {user.whatsapp && (
          <Button
            asChild
            variant="outline"
            className="w-full"
            size="lg"
          >
            <a
              href={`https://wa.me/${user.whatsapp.replace(/[^0-9]/g, "")}?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        )}

        {/* Email */}
        <Button
          asChild
          variant="outline"
          className="w-full"
          size="lg"
        >
          <a
            href={`mailto:${user.email}?subject=${generateEmailSubject()}&body=${generateEmailBody()}`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </a>
        </Button>

        {/* Contact Info */}
        <div className="mt-6 pt-4 border-t border-stone-200">
          <h4 className="font-medium text-stone-900 mb-2">Contact Information</h4>
          <div className="space-y-1 text-sm text-stone-600">
            <p>Email: {user.email}</p>
            {user.phone && <p>Phone: {user.phone}</p>}
            {user.whatsapp && <p>WhatsApp: {user.whatsapp}</p>}
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Safety First:</strong> Always meet in public places and verify materials before pickup.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}