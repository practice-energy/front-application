import {Education, Experience} from "@/types/common";
import {Specialist} from "@/types/specialist";

export interface User {
  id: string
  email: {
    address: string
  }
  bio: string
  name: string
  location: string
  avatar?: string
  timezone: string
  createdAt: Date
  preferences?: {
    language: "ru" | "en"
  }
  education: Education[]
  certifcates: Education[]
  experience: Experience[]
  specialistProfile?: Specialist
  isSpecialist: boolean
  hat: "master" | "adept" | "superviser"
  tier: "unlimited" | "premium" | "basic"
  practice: number
}

export interface UserStats {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  totalEarnings: number
  averageRating: number
  reviewsCount: number
}
