export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

export interface Specialist {
  id: string
  name: string
  photo?: string
  rating: number
  reviewsCount: number
  specialties: string[]
}

export interface Booking {
  id: string
  service: Service
  specialist: Specialist
  date: string
  duration: number
  slots: number
  format: "video" | "in-person"
  status: "upcoming" | "confirmed" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded"
  clientId: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}
