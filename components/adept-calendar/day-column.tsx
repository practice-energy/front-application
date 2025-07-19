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
  // Create 48 half-hour slots (30 minutes each)
  const halfHourSlots = Array.from({ length: 48 }, (_, i) => i)

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

  // Get booking for specific half-hour slot
  const getBookingForSlot = (slotIndex: number) => {
    const dayBookings = getBookingsForDate(date)
    return dayBookings.find((booking) => {
      const bookingDate = new Date(booking.date)
      const bookingHour = bookingDate.getHours()
      const bookingMinutes = bookingDate.getMinutes()

      // Convert booking time to half-hour slot index
      const bookingSlotIndex = bookingHour * 2 + (bookingMinutes >= 30 ? 1 : 0)

      return bookingSlotIndex === slotIndex
    })
  }

  // Check if slot is continuation of multi-slot booking
  const isBookingContinuation = (slotIndex: number) => {
    const dayBookings = getBookingsForDate(date)
    return dayBookings.some((booking) => {
      const bookingDate = new Date(booking.date)
      const bookingHour = bookingDate.getHours()
      const bookingMinutes = bookingDate.getMinutes()

      // Convert booking time to half-hour slot index
      const bookingSlotIndex = bookingHour * 2 + (bookingMinutes >= 30 ? 1 : 0)

      return slotIndex > bookingSlotIndex && slotIndex < bookingSlotIndex + booking.slots
    })
  }

  return (
    <div className="flex-1 flex-shrink-1">
      {/* Day header */}
      <div className="fixed top-24 bg-white border-r border-l border-b border-gray-100 p-3 text-center z-20 w-[calc(100%/5)]">
        <div className="text-sm font-medium text-gray-900">{formatDate(date)}</div>
      </div>

      {/* Time slots */}
      <div className="relative bg-white border-r border-t mt-11">
        {halfHourSlots.map((slotIndex) => {
          const booking = getBookingForSlot(slotIndex)
          const isContinuation = isBookingContinuation(slotIndex)

          // Calculate hour for TimeSlot component (only show on even slots - full hours)
          const hour = Math.floor(slotIndex / 2)
          const isFullHour = slotIndex % 2 === 0

          return (
            <div key={slotIndex} className="relative" style={{ height: `${slotHeight / 2}px` }}>
              {!isContinuation && isFullHour && <TimeSlot hour={hour} slotHeight={slotHeight / 2} />}
              {!isContinuation && !isFullHour && <div className="absolute inset-0 border-t border-gray-100" />}

              {booking && (
                <div className="absolute inset-0 z-10">
                  <BookingCard booking={booking} slotHeight={(slotHeight / 2) * booking.slots} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
