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
  preferences?: {
    language: "ru" | "en"
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    theme: "light" | "dark" | "system"
  }
  profile?: {
    bio?: string
    location?: string
    website?: string
    socialLinks?: {
      instagram?: string
      telegram?: string
      whatsapp?: string
    }
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
