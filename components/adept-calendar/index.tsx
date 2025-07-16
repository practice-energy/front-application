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
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex h-2/3">
        <CalendarSidebar selectedDate={selectedDate} onDateSelect={setSelectedDate} timezone={timezone} />
        <ScheduleView selectedDate={selectedDate} bookings={bookings} />
      </div>

      {/* Bottom content */}
      <div className="h-1/3 bg-gray-50 p-4">
        <div className="h-full flex items-center justify-center text-gray-500">Bottom content area</div>
      </div>
    </div>
  )
}
