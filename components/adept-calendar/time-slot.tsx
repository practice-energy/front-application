"use client"

import { BookingCard } from "./booking-card"
import type { Booking } from "@/types/booking"

interface TimeSlotProps {
  hour: number
  date: Date
  bookings: Booking[]
}

export function TimeSlot({ hour, date, bookings }: TimeSlotProps) {
  return (
    <div className="h-[60px] border-b relative">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}
