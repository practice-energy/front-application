"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Video, MapPin } from "lucide-react"
import { mockBookings } from "@/services/mock-bookings"
import { CustomCalendar } from "@/components/custom-calendar"
import type { Booking } from "@/types/booking"

const HOURS = Array.from({ length: 24 }, (_, i) => i)

const formatTime = (hour: number) => {
  return `${hour.toString().padStart(2, "0")}:00`
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

const getBookingsForDate = (date: Date, bookings: Booking[]) => {
  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)
    return bookingDate.toDateString() === date.toDateString()
  })
}

const getBookingAtTime = (hour: number, bookings: Booking[]) => {
  return bookings.find((booking) => {
    const bookingHour = new Date(booking.date).getHours()
    return bookingHour === hour
  })
}

const isBookingContinuation = (hour: number, bookings: Booking[]) => {
  return bookings.some((booking) => {
    const bookingHour = new Date(booking.date).getHours()
    return hour > bookingHour && hour < bookingHour + booking.slots
  })
}

const BookingCard = ({ booking }: { booking: Booking }) => {
  const formatIcon = booking.format === "video" ? Video : MapPin
  const FormatIcon = formatIcon

  return (
    <div
      className="bg-violet-600 hover:bg-violet-50 hover:border-violet-600 border border-violet-600 rounded-sm p-3 flex items-center gap-3 transition-colors cursor-pointer group w-full"
      style={{ height: `${booking.slots * 60 - 8}px` }} // 60px per slot minus gap
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={booking.specialist.photo || "/placeholder.svg"} alt={booking.specialist.name} />
        <AvatarFallback>{booking.specialist.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="text-white group-hover:text-violet-600 font-medium text-sm truncate">
          {booking.service.name}
        </div>
        <div className="text-violet-200 group-hover:text-violet-500 text-xs">{booking.specialist.name}</div>
        <div className="text-violet-200 group-hover:text-violet-500 text-xs mt-1">{booking.duration} мин</div>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <Badge
          variant="secondary"
          className="bg-white/20 text-white group-hover:bg-violet-100 group-hover:text-violet-600 text-xs"
        >
          <FormatIcon className="h-3 w-3 mr-1" />
          {booking.format === "video" ? "Видео" : "Очно"}
        </Badge>
        {booking.paymentStatus === "paid" && (
          <div className="text-xs text-violet-200 group-hover:text-violet-500">Оплачено 100%</div>
        )}
        {booking.paymentStatus === "pending" && (
          <div className="text-xs text-violet-200 group-hover:text-violet-500">Оплачено 0%</div>
        )}
      </div>
    </div>
  )
}

const TimeSlot = ({ hour, booking, isHidden }: { hour: number; booking?: Booking; isHidden?: boolean }) => {
  if (isHidden) {
    return null // Don't render slots that are part of multi-hour bookings
  }

  return (
    <div className="flex border-b border-gray-100" style={{ minHeight: "60px" }}>
      <div className="w-16 py-4 px-2 text-xs text-gray-500 border-r border-gray-100 flex-shrink-0">
        {formatTime(hour)}
      </div>
      <div className="flex-1 p-2 relative">{booking && <BookingCard booking={booking} />}</div>
    </div>
  )
}

const DayColumn = ({ date, bookings }: { date: Date; bookings: Booking[] }) => {
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

          return <TimeSlot key={hour} hour={hour} booking={booking} isHidden={isContinuation} />
        })}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  const displayDates = [selectedDate, tomorrow, dayAfterTomorrow]

  return (
    <div className="h-screen flex">
      {/* Left Calendar Section */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Calendar at the top */}
        <div className="p-6 border-b border-gray-200">
          <div className="w-full aspect-square">
            <CustomCalendar selected={selectedDate} onSelect={setSelectedDate} className="w-full h-full" />
          </div>
        </div>

        {/* Timezone at the bottom */}
        <div className="mt-auto p-6">
          <div className="text-xs text-gray-500">GMT+3</div>
        </div>
      </div>

      {/* Right Schedule Section */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex">
            {displayDates.map((date, index) => (
              <DayColumn key={date.toISOString()} date={date} bookings={mockBookings} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
