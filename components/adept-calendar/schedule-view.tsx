"use client"

import { TimeColumn } from "./time-column"
import { DayColumn } from "./day-column"
import type { Booking } from "@/types/booking"
import { useIsMobile } from "@/hooks/use-mobile"

interface ScheduleViewProps {
  selectedDate: Date
  bookings: Booking[]
}

export function ScheduleView({ selectedDate, bookings }: ScheduleViewProps) {
  const isMobile = useIsMobile()
  const slotHeight = 52

  // Calculate display dates
  const getDisplayDates = (baseDate: Date) => {
    if (isMobile) {
      // Mobile: show only selected day
      return [baseDate]
    } else {
      // Desktop: show 5 days starting from selected date
      const dates = []
      for (let i = 0; i < 3; i++) {
        const date = new Date(baseDate)
        date.setDate(baseDate.getDate() + i)
        dates.push(date)
      }
      return dates
    }
  }

  const displayDates = getDisplayDates(selectedDate)

  return (
    <div className="flex-1 flex overflow-auto">
      <TimeColumn slotHeight={slotHeight} />
      {displayDates.map((date, index) => (
        <DayColumn
          key={date.toISOString()}
          date={date}
          bookings={bookings}
          slotHeight={slotHeight}
          isSelectedDay={index === 0}
        />
      ))}
    </div>
  )
}
