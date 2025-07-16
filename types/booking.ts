export interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration: number // in minutes
  category?: string
}

export interface User {
  id: string
  name: string
  email?: string
  phone?: string
  photo?: string
  specialization?: string
}

export interface Booking {
  id: string
  startTime: string
  endTime: string
  service: Service
  specialist: User
  client?: User
  format: string // "Онлайн" | "Офлайн" | etc.
  status?: "waiting" | "confirmed"
  paymentStatus?: "paid" | "pending" | "failed"
  clientId?: string
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export type BookingStatus = "upcoming" | "confirmed" | "completed" | "cancelled"
export type BookingFormat = "Онлайн" | "Офлайн"
export type ViewMode = "calendar" | "list"
