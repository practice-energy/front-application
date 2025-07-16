"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Video, MapPin } from "lucide-react"
import { mockBookings } from "@/services/mock-bookings"
import { CustomCalendar } from "@/components/custom-calendar"
import type { Booking } from "@/types/booking"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const SLOT_HEIGHT = 60 // pixels per hour slot

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
      className="bg-violet-600 hover:bg-violet-50 hover:border-violet-600 border border-violet-600 rounded-sm p-2 flex flex-col gap-2 transition-colors cursor-pointer group w-full"
      style={{ height: `${booking.slots * SLOT_HEIGHT - 4}px` }}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={booking.specialist.photo || "/placeholder.svg"} alt={booking.specialist.name} />
          <AvatarFallback className="text-xs">{booking.specialist.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-white group-hover:text-violet-600 font-medium text-xs truncate">
            {booking.service.name}
          </div>
          <div className="text-violet-200 group-hover:text-violet-500 text-xs">{booking.specialist.name}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className="bg-white/20 text-white group-hover:bg-violet-100 group-hover:text-violet-600 text-xs px-1 py-0"
        >
          <FormatIcon className="h-3 w-3 mr-1" />
          {booking.format === "video" ? "Видео" : "Очно"}
        </Badge>
        {booking.paymentStatus === "paid" && (
          <div className="text-xs text-violet-200 group-hover:text-violet-500">100%</div>
        )}
        {booking.paymentStatus === "pending" && (
          <div className="text-xs text-violet-200 group-hover:text-violet-500">0%</div>
        )}
      </div>
    </div>
  )
}

const TimeSlot = ({ hour, booking, isHidden }: { hour: number; booking?: Booking; isHidden?: boolean }) => {
  if (isHidden) {
    return (
      <div style={{ height: `${SLOT_HEIGHT}px` }} className="border-b border-gray-100">
        {/* Empty slot that's part of a multi-hour booking */}
      </div>
    )
  }

  return (
    <div className="border-b border-gray-100" style={{ height: `${SLOT_HEIGHT}px` }}>
      <div className="h-full p-1">{booking && <BookingCard booking={booking} />}</div>
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

const TimeColumn = () => {
  return (
    <div className="w-16 flex-shrink-0 border-r border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 text-center z-10">
        <div className="text-sm font-medium text-transparent">Time</div>
      </div>
      <div>
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="border-b border-gray-100 px-2 py-4 text-xs text-gray-500 text-right"
            style={{ height: `${SLOT_HEIGHT}px` }}
          >
            {formatTime(hour)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Calculate display dates: selected day + 2 following days
  const getDisplayDates = (baseDate: Date) => {
    const dates = []
    for (let i = 0; i < 3; i++) {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const displayDates = getDisplayDates(selectedDate)

  // Scroll to 7 AM on mount and when date changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollTo = 7 * SLOT_HEIGHT // 7 AM
      scrollAreaRef.current.scrollTop = scrollTo
    }
  }, [selectedDate])

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
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="flex">
            <TimeColumn />
            {displayDates.map((date, index) => (
              <DayColumn key={date.toISOString()} date={date} bookings={mockBookings} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
