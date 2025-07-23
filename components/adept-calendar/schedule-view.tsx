"use client"

import { useEffect, useRef } from "react"
import { TimeColumn } from "./time-column"
import { DayColumn } from "./day-column"
import type { Booking } from "@/types/booking"

interface ScheduleViewProps {
  selectedDate: Date
  bookings: Booking[]
}

const SLOT_HEIGHT = 60

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
      scrollAreaRef.current.scrollTop = 7 * SLOT_HEIGHT
    }
  }, [selectedDate])

  return (
    <div className="flex-1 h-full">
        <div className="flex">
          <TimeColumn slotHeight={SLOT_HEIGHT} />
          {displayDates.map((date, index) => (
              <DayColumn
                  key={date.toISOString()}
                  date={date}
                  bookings={bookings}
                  slotHeight={SLOT_HEIGHT}
                  isSelectedDay={index === 0}
              />
          ))}
        </div>
    </div>
  )
}
