import { BookingCard } from "./booking-card"
import type { Booking } from "@/types/booking"

interface DayColumnProps {
  date: Date
  bookings: Booking[]
  slotHeight: number
  isSelectedDay?: boolean
}

export function DayColumn({ date, bookings, slotHeight, isSelectedDay = false }: DayColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  // Filter bookings for this day
  const dayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.startTime)
    return bookingDate.toDateString() === date.toDateString()
  })

  return (
    <div className="flex-1 min-w-0 border-r border-gray-200 relative">
      {/* Sticky header */}
      <div
        className={`sticky top-0 z-30 bg-white border-b border-gray-200 h-12 flex items-center justify-center text-sm font-medium ${
          isSelectedDay ? "text-blue-600 bg-blue-50" : "text-gray-900"
        }`}
      >
        {formatDate(date)}
      </div>

      {/* Time slots */}
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="border-b border-gray-100 relative" style={{ height: slotHeight }}>
            {/* Hour grid lines */}
            <div className="absolute inset-0 border-r border-gray-100" />
          </div>
        ))}

        {/* Bookings overlay */}
        {dayBookings.map((booking) => {
          const startTime = new Date(booking.startTime)
          const endTime = new Date(booking.endTime)
          const startHour = startTime.getHours()
          const startMinutes = startTime.getMinutes()
          const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) // hours

          const top = (startHour + startMinutes / 60) * slotHeight
          const height = duration * slotHeight

          return (
            <div
              key={booking.id}
              className="absolute left-1 right-1 z-10"
              style={{
                top: `${top}px`,
                height: `${height}px`,
              }}
            >
              <BookingCard booking={booking} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
