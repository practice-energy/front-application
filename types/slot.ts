export interface Slot {
  id: string
  client: {
    id: string
    name: string
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
  location?: string
}
