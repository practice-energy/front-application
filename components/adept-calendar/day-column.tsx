"use client"

import { BookingCard } from "./booking-card"
import { TimeSlot } from "./time-slot"
import type { Booking } from "@/types/booking"
import { cn } from "@/lib/utils"

interface DayColumnProps {
  date: Date
  bookings: Booking[]
  slotHeight: number
  isSelectedDay: boolean
}

export function DayColumn({ date, bookings, slotHeight, isSelectedDay }: DayColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Format day header
  function formatDate(date: Date) {
    const formatted = date
      .toLocaleDateString("ru-RU", {
        weekday: "short",
        day: "numeric",
      })
      .replace(",", "")

    const [weekday, day] = formatted.split(" ")

    return (
      <>
        <span className={cn("px-1 py-0.5 mr-1", isSelectedDay && "bg-violet-600 text-white rounded-sm aspect-square")}>
          {weekday.replace(/^./, (letter) => letter.toUpperCase())}
        </span>
        {day}
      </>
    )
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
      <div className="fixed top-0 bg-white border-b border-r border-gray-200 p-3 text-center z-20">
        <div className="text-sm font-medium text-gray-900">{formatDate(date)}</div>
      </div>

      {/* Time slots */}
      <div className="relative bg-white border-r">
        {hours.map((hour) => {
          const booking = getBookingForHour(hour)
          const isContinuation = isBookingContinuation(hour)

          return (
            <div key={hour} className="relative" style={{ height: `${slotHeight}px` }}>
              {!isContinuation && <TimeSlot hour={hour} slotHeight={slotHeight} />}

              {booking && (
                <div className="absolute inset-0 z-10 p-1">
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
