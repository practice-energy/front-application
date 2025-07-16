"use client"

import { TimeSlot } from "./time-slot"
import type { Booking } from "@/types/booking"

interface DayColumnProps {
  date: Date
  bookings: Booking[]
  slotHeight: number
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

const formatDate = (date: Date) => {
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

const getBookingsForDate = (date: Date, bookings: Booking[]) => {
  return bookings.filter((booking) => {
    const bookingDate = booking.date
    return (
      bookingDate.getFullYear() === date.getFullYear() &&
      bookingDate.getMonth() === date.getMonth() &&
      bookingDate.getDate() === date.getDate()
    )
  })
}

const getBookingAtTime = (hour: number, bookings: Booking[]) => {
  return bookings.find((booking) => {
    const bookingHour = booking.date.getHours()
    return bookingHour === hour
  })
}

const isBookingContinuation = (hour: number, bookings: Booking[]) => {
  return bookings.some((booking) => {
    const bookingHour = booking.date.getHours()
    return hour > bookingHour && hour < bookingHour + booking.slots
  })
}

export function DayColumn({ date, bookings, slotHeight }: DayColumnProps) {
  const dayBookings = getBookingsForDate(date, bookings)

  return (
    <div className="flex-1 min-w-0">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 text-center z-10">
        <div className="text-sm font-medium text-gray-900">{formatDate(date)}</div>
      </div>
      <div>
        {HOURS.map((hour) => {
          const booking = getBookingAtTime(hour, dayBookings)
          const isContinuation = isBookingContinuation(hour, dayBookings)

          return <TimeSlot key={hour} hour={hour} booking={booking} isHidden={isContinuation} slotHeight={slotHeight} />
        })}
      </div>
    </div>
  )
}
