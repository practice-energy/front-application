export interface User {
  id: string
  email?: string
  name: string
  avatar?: string
  phone?: string
  timezone: string
  role: "client" | "specialist" | "admin"
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  preferences?: {
    language: string
    notifications: boolean
    theme: "light" | "dark"
  }
  photo?: string
  specialization?: string
}

export interface UserProfile extends User {
  bio?: string
  specialties?: string[]
  rating?: number
  reviewsCount?: number
  location?: string
  languages?: string[]
  experience?: number
  education?: string[]
  certifications?: string[]
  socialLinks?: {
    instagram?: string
    telegram?: string
    website?: string
  }
  preferences: {
    notifications: boolean
    emailUpdates: boolean
    language: "ru" | "en"
  }
}

export interface UserStats {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  totalEarnings: number
  averageRating: number
  reviewsCount: number
}
