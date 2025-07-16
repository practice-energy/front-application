"use client"

import { BookingCard } from "./booking-card"
import { TimeSlot } from "./time-slot"
import type { Booking } from "@/types/booking"

interface DayColumnProps {
  date: Date
  bookings: Booking[]
  slotHeight: number
}

export function DayColumn({ date, bookings, slotHeight }: DayColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Format day header
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  // Get bookings for this date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date)
      return (
        bookingDate.getFullYear() === date.getFullYear() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getDate() === date.getDate()
      )
    })
  }

  // Get booking for specific hour
  const getBookingForHour = (hour: number) => {
    const dayBookings = getBookingsForDate(date)
    return dayBookings.find((booking) => {
      const bookingHour = new Date(booking.date).getHours()
      return bookingHour === hour
    })
  }

  // Check if hour is continuation of multi-slot booking
  const isBookingContinuation = (hour: number) => {
    const dayBookings = getBookingsForDate(date)
    return dayBookings.some((booking) => {
      const bookingHour = new Date(booking.date).getHours()
      return hour > bookingHour && hour < bookingHour + booking.slots
    })
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Sticky day header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 text-center z-20">
        <div className="text-sm font-medium text-gray-900">{formatDate(date)}</div>
      </div>

      {/* Time slots */}
      <div className="relative">
        {hours.map((hour) => {
          const booking = getBookingForHour(hour)
          const isContinuation = isBookingContinuation(hour)

          return (
            <div key={hour} className="relative" style={{ height: `${slotHeight}px` }}>
              {!isContinuation && <TimeSlot hour={hour} slotHeight={slotHeight} />}

              {booking && (
                <div className="absolute inset-x-2 inset-y-1 z-10">
                  <BookingCard booking={booking} slotHeight={slotHeight} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
