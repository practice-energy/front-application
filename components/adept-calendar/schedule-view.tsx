"use client"

import { useEffect, useRef } from "react"
import { TimeColumn } from "./time-column"
import { DayColumn } from "./day-column"
import type { Booking } from "@/types/booking"

interface ScheduleViewProps {
  selectedDate: Date
  bookings: Booking[]
}

export function ScheduleView({ selectedDate, bookings }: ScheduleViewProps) {
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
      const scrollTo = 7 * 60 // 7 AM * 60px slot height
      scrollAreaRef.current.scrollTop = scrollTo
    }
  }, [selectedDate])

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header with day names */}
      <div className="flex border-b bg-white sticky top-0 z-10">
        <div className="w-16 border-r"></div>
        {displayDates.map((date, index) => (
          <div key={index} className="flex-1 p-2 text-center border-r">
            <div className="font-medium">{date.toLocaleDateString("ru-RU", { weekday: "short" })}</div>
            <div className="text-sm text-gray-500">{date.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Scrollable schedule content */}
      <div ref={scrollAreaRef} className="flex-1 flex overflow-y-auto">
        <TimeColumn />
        {displayDates.map((date, index) => (
          <DayColumn
            key={index}
            date={date}
            bookings={bookings.filter((booking) => {
              const bookingDate = new Date(booking.startTime)
              return bookingDate.toDateString() === date.toDateString()
            })}
          />
        ))}
      </div>
    </div>
  )
}
