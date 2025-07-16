"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Video, MapPin } from "lucide-react"
import { mockBookings } from "@/services/mock-bookings"
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

const BookingCard = ({ booking }: { booking: Booking }) => {
  const formatIcon = booking.format === "video" ? Video : MapPin
  const FormatIcon = formatIcon

  return (
    <div className="bg-violet-600 hover:bg-violet-50 hover:border-violet-600 border border-violet-600 rounded-sm p-3 flex items-center gap-3 transition-colors cursor-pointer">
      <Avatar className="h-8 w-8">
        <AvatarImage src={booking.specialist.photo || "/placeholder.svg"} alt={booking.specialist.name} />
        <AvatarFallback>{booking.specialist.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="text-white hover:text-violet-600 font-medium text-sm truncate">{booking.service.name}</div>
        <div className="text-violet-200 hover:text-violet-500 text-xs">{booking.specialist.name}</div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-white/20 text-white hover:bg-violet-100 hover:text-violet-600 text-xs">
          <FormatIcon className="h-3 w-3 mr-1" />
          {booking.format === "video" ? "Видео" : "Очно"}
        </Badge>
        {booking.status === "confirmed" && (
          <div className="text-xs text-violet-200 hover:text-violet-500">Оплачено 100%</div>
        )}
        {booking.status === "upcoming" && (
          <div className="text-xs text-violet-200 hover:text-violet-500">Оплачено 0%</div>
        )}
      </div>
    </div>
  )
}

const TimeSlot = ({ hour, booking }: { hour: number; booking?: Booking }) => {
  return (
    <div className="flex border-b border-gray-100">
      <div className="w-16 py-4 px-2 text-xs text-gray-500 border-r border-gray-100">{formatTime(hour)}</div>
      <div className="flex-1 p-2">{booking && <BookingCard booking={booking} />}</div>
    </div>
  )
}

const DayColumn = ({ date, bookings }: { date: Date; bookings: Booking[] }) => {
  const dayBookings = getBookingsForDate(date, bookings)

  return (
    <div className="flex-1 min-w-0">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 text-center">
        <div className="text-sm font-medium text-gray-900">{formatDate(date)}</div>
      </div>
      <div>
        {HOURS.map((hour) => {
          const booking = getBookingAtTime(hour, dayBookings)
          return <TimeSlot key={hour} hour={hour} booking={booking} />
        })}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  const displayDates = [selectedDate, tomorrow, dayAfterTomorrow]

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const monthYear = currentMonth.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="h-screen flex flex-col">
      {/* Calendar Section */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start gap-8">
          <div className="w-80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold capitalize">{monthYear}</h2>
              <div className="flex items-center gap-1">
                <button onClick={handlePreviousMonth} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full"
            />

            <div className="mt-4 text-xs text-gray-500">GMT+3</div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
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
