"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Booking } from "@/types/booking"

interface BookingCalendarProps {
  bookings: Booking[]
  onDateSelect?: (date: Date) => void
}

export function BookingCalendar({ bookings, onDateSelect }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  // Get month name and year
  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Helper functions
  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    )
  }

  const getBookingsForDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date)
      return bookingDate.toDateString() === date.toDateString()
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-orange-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  // Create calendar grid
  const renderCalendarDays = () => {
    const days = []
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    // Add weekday headers
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="text-center text-xs font-medium text-gray-500 py-3">
          {weekdays[i]}
        </div>,
      )
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = getBookingsForDay(day)
      const hasBookings = dayBookings.length > 0

      days.push(
        <div key={`day-${day}`} className="p-1">
          {hasBookings ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "w-full h-12 rounded-lg flex flex-col items-center justify-center text-sm transition-colors relative",
                    isSelected(day) ? "bg-purple-500 text-white" : "hover:bg-gray-100",
                    isToday(day) && !isSelected(day) ? "border-2 border-purple-500 text-purple-700" : "",
                  )}
                >
                  <span className="font-medium">{day}</span>
                  <div className="flex gap-1 mt-1">
                    {dayBookings.slice(0, 3).map((booking, index) => (
                      <div key={index} className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(booking.status))} />
                    ))}
                    {dayBookings.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="p-4">
                  <h4 className="font-semibold mb-3">
                    {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h4>
                  <div className="space-y-3">
                    {dayBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={booking.specialist.photo || "/placeholder.svg"} />
                          <AvatarFallback>
                            {booking.specialist.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{booking.service.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(booking.date)} • {booking.duration}min
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "text-xs",
                            booking.status === "upcoming" && "bg-orange-100 text-orange-700",
                            booking.status === "completed" && "bg-green-100 text-green-700",
                            booking.status === "cancelled" && "bg-gray-100 text-gray-700",
                          )}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <button
              onClick={() => handleDateClick(day)}
              className={cn(
                "w-full h-12 rounded-lg flex items-center justify-center text-sm transition-colors",
                isSelected(day) ? "bg-purple-500 text-white" : "hover:bg-gray-100",
                isToday(day) && !isSelected(day) ? "border-2 border-purple-500 text-purple-700" : "",
              )}
            >
              {day}
            </button>
          )}
        </div>,
      )
    }

    return days
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {monthName} {year}
          </h3>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-purple-50"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-purple-50"
              onClick={goToNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-600">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-xs text-gray-600">Cancelled</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
