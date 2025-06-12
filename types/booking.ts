export interface Booking {
  id: string
  serviceId: string
  specialist: {
    id: string
    name: string
    photo: string
  }
  service: {
    id: string
    name: string
    price: number
  }
  date: Date
  duration: number // minutes
  format: "video" | "in-person"
  status: "upcoming" | "completed" | "cancelled"
  requiresConfirmation: boolean
}

export type BookingStatus = "upcoming" | "completed" | "cancelled"
export type BookingFormat = "video" | "in-person"
export type ViewMode = "calendar" | "list"
