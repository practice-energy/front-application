export interface Booking {
  id: string
  clientId: string
  specialistId: string
  serviceId: string
  date: Date
  duration: number // minutes
  slots: number // number of hour slots this booking occupies
  status: "upcoming" | "confirmed" | "completed" | "cancelled"
  format: "video" | "offline"
  paymentStatus: "pending" | "paid" | "refunded"
  totalAmount: number
  notes?: string
  service: {
    id: string
    name: string
    description: string
    price: number
    duration: number
    category: string
  }
  specialist: {
    id: string
    name: string
    photo: string
    rating: number
    reviewsCount: number
  }
  client: {
    id: string
    name: string
    photo: string
  }
}

export type BookingStatus = "upcoming" | "confirmed" | "completed" | "cancelled"
export type BookingFormat = "video" | "offline"
export type ViewMode = "calendar" | "list"
