export interface Booking {
  id: string
  service: {
    id: string
    title: string
    description: string
    price: number
    duration: number
    avatar?: string
  }
  specialist: {
    id: string
    name: string
    avatar?: string
    practiceCount: number
  }
  date: Date
  duration: number
  slots: number // количество часовых слотов (1 слот = 1 час)
  format: "video" | "in-person"
  status?: "waiting" | "confirmed" | "request"
  createdAt: Date
  updatedAt: Date
  isRepeat?: boolean
}


export interface BookingSlot {
  date: Date
  slots: number // количество часовых слотов (1 слот = 1 час)
}
