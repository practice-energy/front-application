export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  timezone: string
  role: "client" | "specialist" | "admin"
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  bio?: string
  location?: string
  languages: string[]
  verified: boolean
  rating?: number
  reviewsCount: number
}

export interface UserStats {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  totalEarnings: number
  averageRating: number
  reviewsCount: number
}
