"use client"

import { useState } from "react"
import { CalendarSidebar } from "./calendar-sidebar"
import { ScheduleView } from "./schedule-view"
import type { Booking } from "@/types/booking"

interface AdeptCalendarProps {
  bookings: Booking[]
  timezone?: string
}

export function AdeptCalendar({ bookings, timezone }: AdeptCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <div className="h-screen flex">
      <CalendarSidebar selectedDate={selectedDate} onDateSelect={setSelectedDate} timezone={timezone} />
      <ScheduleView selectedDate={selectedDate} bookings={bookings} />
    </div>
  )
}

// Export all components for individual use if needed
export { CalendarWidget } from "./calendar-widget"
export { CalendarSidebar } from "./calendar-sidebar"
export { ScheduleView } from "./schedule-view"
export { BookingCard } from "./booking-card"
export { DayColumn } from "./day-column"
export { TimeColumn } from "./time-column"
export { TimeSlot } from "./time-slot"
export { BookingDetailsModal } from "./booking-details-modal"
