import {Education, Experience} from "@/src/types/common";
import {Specialist} from "@/src/types/specialist";

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
    language: Language
  }
  education: Education[]
  certifcates: Education[]
  experience: Experience[]
  specialistProfile?: Specialist
  isSpecialist: boolean
  hat: Hat
  tier: Tier
  practice: number
}

export type Language = "ru" | "en"

export type Hat = "master" | "adept" | "superviser"

export type Tier = "pure" | "practice" | "pro" | "infinite"