export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  timezone: string
  role: "client" | "specialist" | "admin"
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  preferences?: {
    language: "ru" | "en"
    notifications: boolean
    theme: "light" | "dark"
  }
  specialistProfile: any
  isSpecialist: boolean
  hat: "master" | "adept"
}

export interface UserStats {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  totalEarnings: number
  averageRating: number
  reviewsCount: number
}
