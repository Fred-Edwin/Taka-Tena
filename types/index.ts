import { User, Listing, UserType, MaterialType, Unit, ListingStatus } from '@prisma/client'
import { DefaultSession } from 'next-auth'

// Export Prisma types
export type { User, Listing, UserType, MaterialType, Unit, ListingStatus }

// NextAuth session extensions
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string
      userType: UserType
      location: string
      verified: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name: string
    userType: UserType
    location: string
    verified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    userType: UserType
    location: string
    verified: boolean
  }
}

// Listing with user information for display
export type ListingWithUser = Listing & {
  user: Pick<User, 'id' | 'name' | 'userType' | 'location' | 'phone' | 'whatsapp' | 'email'>
}

// User profile without sensitive information
export type PublicUser = Omit<User, 'password' | 'email'> & {
  email?: string // Optional for public display
}

// Form data types
export type CreateUserInput = Pick<User, 'email' | 'password' | 'name' | 'userType' | 'location'> & {
  phone?: string
  whatsapp?: string
}

export type UpdateUserInput = Partial<Pick<User, 'name' | 'location' | 'phone' | 'whatsapp'>>

export type CreateListingInput = Pick<Listing, 'title' | 'description' | 'materialType' | 'quantity' | 'unit' | 'location'> & {
  images?: string[]
}

export type UpdateListingInput = Partial<CreateListingInput> & {
  status?: ListingStatus
}

// API response types
export type PaginatedListings = {
  listings: ListingWithUser[]
  total: number
  page: number
  totalPages: number
}

export type ListingFilters = {
  materialType?: MaterialType
  status?: ListingStatus
  location?: string
  search?: string
}

// Impact statistics
export type GlobalImpactStats = {
  totalListings: number
  totalCompleted: number
  estimatedWeight: number
  activeUsers: number
}

export type UserImpactStats = {
  totalListings: number
  completedListings: number
}