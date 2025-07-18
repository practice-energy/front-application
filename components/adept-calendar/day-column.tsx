"use client"

import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Booking } from "@/types/booking"
import { BookingCard } from "./booking-card"

interface DayColumnProps {
  date: Date
  bookings: Booking[]
  slotHeight: number
  isSelectedDay?: boolean
}

export function DayColumn({ date, bookings, slotHeight, isSelectedDay = false }: DayColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Filter bookings for this day
  const dayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)
    return bookingDate.toDateString() === date.toDateString()
  })

  const formatDate = (date: Date) => {
    return format(date, "dd MMM", { locale: ru })
  }

  const formatDayName = (date: Date) => {
    return format(date, "EEE", { locale: ru })
  }

  return (
    <div className="flex-1 min-w-0 border-r border-gray-200 relative">
      {/* Sticky header */}
      <div
        className={cn(
          "sticky top-0 bg-white border-b border-gray-200 p-3 text-center z-20",
          isSelectedDay && "bg-blue-50",
        )}
      >
        <div className="text-sm font-medium text-gray-900">{formatDayName(date)}</div>
        <div className={cn("text-xs text-gray-500", isSelectedDay && "text-blue-600 font-medium")}>
          {formatDate(date)}
        </div>
      </div>

      {/* Time slots */}
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="border-b border-gray-100 relative" style={{ height: `${slotHeight}px` }}>
            {/* Hour grid lines */}
            <div className="absolute inset-0 border-r border-gray-50" />
          </div>
        ))}

        {/* Bookings */}
        {dayBookings.map((booking) => {
          const startTime = new Date(`2000-01-01T${booking.startTime}`)
          const endTime = new Date(`2000-01-01T${booking.endTime}`)
          const startHour = startTime.getHours()
          const startMinutes = startTime.getMinutes()
          const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60) // duration in minutes

          const top = startHour * slotHeight + (startMinutes * slotHeight) / 60
          const height = (duration * slotHeight) / 60

          return (
            <BookingCard
              key={booking.id}
              booking={booking}
              style={{
                position: "absolute",
                top: `${top}px`,
                height: `${height}px`,
                left: "4px",
                right: "4px",
                zIndex: 10,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
