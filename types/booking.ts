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
  slots: number // количество часовых слотов (1 слот = 1 час)
  format: "video" | "in-person"
  status: "confirmed" | "pending" | "cancelled" | "completed"
  paymentStatus: "paid" | "pending" | "failed"
  clientId: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}
