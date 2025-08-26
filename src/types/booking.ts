import {ActivityStatus, Format} from "@/types/common";

export interface Booking {
  id: string
  service: {
    id: string
    title: string
    description: string
    duration: number
  }
  specialist: {
    id: string
    name: string
    avatar?: string
  }
  client: {
    id: string
    name: string
    avatar?: string
  }
  date: Date
  duration: number
  slots: number // количество часовых слотов (1 слот = 1 час)
  format: Format
  status?: ActivityStatus
  createdAt: Date
  updatedAt: Date
  isRepeat?: boolean
  price: number
  chatId?: string
}

export interface BookingSlot {
  date: Date
  slots: number // количество часовых слотов (1 слот = 1 час)
}
