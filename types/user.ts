export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: "client" | "specialist"
  timezone: string
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

export interface Specialist extends UserProfile {
  role: "specialist"
  specialties: string[]
  experience: number
  education: Education[]
  certifications: string[]
  hourlyRate: number
  availability: AvailabilitySlot[]
  portfolio: PortfolioItem[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startYear: number
  endYear?: number
}

export interface AvailabilitySlot {
  id: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  isAvailable: boolean
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  category: string
  createdAt: Date
}
