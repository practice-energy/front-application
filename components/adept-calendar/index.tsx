"use client"

import { useState, useEffect, useRef } from "react"
import { CalendarSidebar } from "./calendar-sidebar"
import { ScheduleView } from "./schedule-view"
import type { Booking } from "@/types/booking"

interface AdeptCalendarProps {
  bookings: Booking[]
  timezone?: string
}

export function AdeptCalendar({ bookings, timezone = "GMT+3" }: AdeptCalendarProps) {
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
      const scrollTo = 7 * 60 // 7 AM * 60px slot height
      scrollAreaRef.current.scrollTop = scrollTo
    }
  }, [selectedDate])

  return (
    <div className="h-screen flex">
      <CalendarSidebar selectedDate={selectedDate} onDateSelect={setSelectedDate} timezone={timezone} />
      <ScheduleView dates={displayDates} bookings={bookings} scrollAreaRef={scrollAreaRef} />
    </div>
  )
}
