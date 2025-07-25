"use client"

import { useState } from "react"
import { CalendarSidebar } from "./calendar-sidebar"
import { ScheduleView } from "./schedule-view"
import { CalendarWidget } from "./calendar-widget"
import { BackButton } from "@/components/ui/button-back"
import type { Booking } from "@/types/booking"
import { useIsMobile } from "@/hooks/use-mobile"

interface AdeptCalendarProps {
  bookings: Booking[]
  timezone?: string
}

export function AdeptCalendar({ bookings, timezone }: AdeptCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const isMobile = useIsMobile()

  // Calculate display dates for mobile: selected day only
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

  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Back Button and Calendar Widget */}
        <div className="flex-shrink-0">
          <div className="flex flex-col px-4 items-start justify-between">
            <BackButton />
            <div className="flex-1 w-full">
              <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </div>
          </div>
        </div>

        {/* Mobile Schedule */}
        <div className="flex-1 overflow-auto border-t border-gray-200">
          <div className="flex">
            <ScheduleView selectedDate={selectedDate} bookings={bookings} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex h-full mt-24">
        <CalendarSidebar selectedDate={selectedDate} onDateSelect={setSelectedDate} timezone={timezone} />
        <ScheduleView selectedDate={selectedDate} bookings={bookings} />
      </div>
    </div>
  )
}
