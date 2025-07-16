"use client"

import { TimeSlot } from "./time-slot"
import type { Booking } from "@/types/booking"

interface DayColumnProps {
  date: Date
  bookings: Booking[]
}

export function DayColumn({ date, bookings }: DayColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex-1 border-r">
      {hours.map((hour) => {
        const slotBookings = bookings.filter((booking) => {
          const bookingHour = new Date(booking.startTime).getHours()
          return bookingHour === hour
        })

        return <TimeSlot key={hour} hour={hour} date={date} bookings={slotBookings} />
      })}
    </div>
  )
}
