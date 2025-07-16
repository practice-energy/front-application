export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: "client" | "specialist"
  timezone: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  bio?: string
  location?: string
  languages: string[]
  rating?: number
  reviewsCount: number
  completedBookings: number
}

export interface Specialist extends UserProfile {
  role: "specialist"
  specialties: string[]
  experience: number
  hourlyRate: number
  availability: AvailabilitySlot[]
  education: Education[]
  certifications: Certification[]
  portfolio: PortfolioItem[]
}

export interface AvailabilitySlot {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:mm format
  endTime: string // HH:mm format
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startYear: number
  endYear?: number
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  category: string
  createdAt: Date
}
