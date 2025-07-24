import {Education, Experience, Specialist} from "@/types/common";

export interface User {
  id: string
  email: {
    address: string
    verified: boolean
  }
  bio: string
  name: string
  location: string
  avatar?: string
  images: string[]
  timezone: string
  createdAt: Date
  preferences?: {
    language: "ru" | "en"
    notifications: boolean
    theme: "light" | "dark"
  }
  education: Education[]
  certifcates: Education[]
  experience: Experience[]
  specialistProfile?: Specialist
  isSpecialist: boolean
  hat: "master" | "adept"
  tier: "unlimited" | "premium" | "basic"
}

export interface UserStats {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  totalEarnings: number
  averageRating: number
  reviewsCount: number
}
