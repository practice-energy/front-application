import type { Booking } from "@/types/booking"

// Mock booking data
export const mockBookings: Booking[] = [
  {
    id: "1",
    specialist: {
      id: "spec-1",
      name: "Dr. Sarah Johnson",
      photo: "/placeholder.svg?height=40&width=40",
    },
    service: {
      id: "service-1",
      name: "Therapy Session",
      price: 120,
    },
    date: new Date(2025, 0, 15, 14, 0), // Jan 15, 2025, 2:00 PM
    duration: 60,
    format: "video",
    status: "upcoming",
    requiresConfirmation: true,
  },
  {
    id: "2",
    specialist: {
      id: "spec-2",
      name: "Dr. Michael Chen",
      photo: "/placeholder.svg?height=40&width=40",
    },
    service: {
      id: "service-2",
      name: "Consultation",
      price: 80,
    },
    date: new Date(2025, 0, 18, 10, 30), // Jan 18, 2025, 10:30 AM
    duration: 45,
    format: "in-person",
    status: "upcoming",
    requiresConfirmation: false,
  },
  {
    id: "3",
    specialist: {
      id: "spec-3",
      name: "Dr. Emily Rodriguez",
      photo: "/placeholder.svg?height=40&width=40",
    },
    service: {
      id: "service-3",
      name: "Follow-up Session",
      price: 100,
    },
    date: new Date(2024, 11, 20, 16, 0), // Dec 20, 2024, 4:00 PM
    duration: 50,
    format: "video",
    status: "completed",
    requiresConfirmation: false,
  },
  {
    id: "4",
    specialist: {
      id: "spec-4",
      name: "Dr. James Wilson",
      photo: "/placeholder.svg?height=40&width=40",
    },
    service: {
      id: "service-4",
      name: "Assessment",
      price: 150,
    },
    date: new Date(2024, 11, 10, 9, 0), // Dec 10, 2024, 9:00 AM
    duration: 90,
    format: "in-person",
    status: "cancelled",
    requiresConfirmation: false,
  },
  {
    id: "5",
    specialist: {
      id: "spec-5",
      name: "Dr. Lisa Thompson",
      photo: "/placeholder.svg?height=40&width=40",
    },
    service: {
      id: "service-5",
      name: "Group Therapy",
      price: 60,
    },
    date: new Date(2025, 0, 22, 18, 0), // Jan 22, 2025, 6:00 PM
    duration: 75,
    format: "video",
    status: "upcoming",
    requiresConfirmation: false,
  },
]

export const getBookingsByStatus = (status: string) => {
  if (status === "all") return mockBookings
  return mockBookings.filter((booking) => booking.status === status)
}

export const getBookingsForDate = (date: Date) => {
  return mockBookings.filter((booking) => {
    const bookingDate = new Date(booking.date)
    return bookingDate.toDateString() === date.toDateString()
  })
}
