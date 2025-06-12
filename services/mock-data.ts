import type { User, ProfileStats, SavedSpecialist, CalendarEvent } from "@/types/profile"

// Mock User Data
export const mockUser: User = {
  id: "1",
  first_name: "Ivan",
  last_name: "Ivanov",
  email: {
    address: "ivan.ivanov@example.com",
    verified: true,
  },
  photo_url: "/placeholder.svg?height=120&width=120",
  created_at: "2023-01-15T00:00:00Z",
  account_balance: 125.5,
  tier: "Pro",
  isSpecialist: false,
}

// Mock Stats
export const mockStats: ProfileStats = {
  completedSessions: 18,
  activeBookings: 2,
  totalSaved: 12,
  unreadMessages: 3,
}

// Mock Saved Specialists
export const mockSavedSpecialists: SavedSpecialist[] = [
  {
    id: "s1",
    name: "Dr. Anna Smith",
    photo: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Psychology", "Therapy"],
    hourlyRate: 85,
    isOnline: true,
    savedDate: new Date(2023, 5, 15),
  },
  {
    id: "s2",
    name: "Michael Johnson",
    photo: "/placeholder.svg?height=80&width=80",
    rating: 4.8,
    reviewCount: 89,
    specialties: ["Life Coaching", "Career"],
    hourlyRate: 65,
    isOnline: false,
    savedDate: new Date(2023, 5, 10),
  },
  {
    id: "s3",
    name: "Sarah Williams",
    photo: "/placeholder.svg?height=80&width=80",
    rating: 4.7,
    reviewCount: 156,
    specialties: ["Nutrition", "Wellness"],
    hourlyRate: 75,
    isOnline: true,
    savedDate: new Date(2023, 5, 5),
  },
  {
    id: "s4",
    name: "Robert Brown",
    photo: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Fitness", "Personal Training"],
    hourlyRate: 55,
    isOnline: true,
    savedDate: new Date(2023, 4, 28),
  },
]

// Mock Calendar Events
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "e1",
    specialist: {
      name: "Dr. Anna Smith",
      photo: "/placeholder.svg?height=40&width=40",
    },
    date: new Date(2023, 6, 25, 14, 0),
    duration: 60,
    type: "video",
    status: "upcoming",
    title: "Therapy Session",
    price: 85,
  },
  {
    id: "e2",
    specialist: {
      name: "Michael Johnson",
      photo: "/placeholder.svg?height=40&width=40",
    },
    date: new Date(2023, 6, 27, 10, 30),
    duration: 45,
    type: "voice",
    status: "upcoming",
    title: "Career Coaching",
    price: 65,
  },
  {
    id: "e3",
    specialist: {
      name: "Sarah Williams",
      photo: "/placeholder.svg?height=40&width=40",
    },
    date: new Date(2023, 6, 15, 16, 0),
    duration: 60,
    type: "video",
    status: "completed",
    title: "Nutrition Consultation",
    price: 75,
  },
  {
    id: "e4",
    specialist: {
      name: "Robert Brown",
      photo: "/placeholder.svg?height=40&width=40",
    },
    date: new Date(2023, 6, 10, 11, 0),
    duration: 30,
    type: "voice",
    status: "completed",
    title: "Fitness Assessment",
    price: 55,
  },
]

// Mock Services
export const calendarService = {
  getEvents: async (): Promise<CalendarEvent[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockCalendarEvents
  },
}

export const savedService = {
  clearAll: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
}

export const securityService = {
  updatePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (data.currentPassword === "wrong") {
      throw new Error("Current password is incorrect")
    }
  },
  updateEmail: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
  sendPasswordRecovery: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log(`Password recovery email sent to: ${email}`)
  },
  sendEmailVerification: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Email verification sent to: ${email}`)
  },
}
