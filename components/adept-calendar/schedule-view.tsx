"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TimeColumn } from "./time-column"
import { DayColumn } from "./day-column"
import type { Booking } from "@/types/booking"

interface ScheduleViewProps {
  selectedDate: Date
  bookings: Booking[]
}

const SLOT_HEIGHT = 60 // pixels per hour slot

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
      const scrollTo = 7 * SLOT_HEIGHT // 7 AM
      scrollAreaRef.current.scrollTop = scrollTo
    }
  }, [selectedDate])

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="flex">
          <TimeColumn slotHeight={SLOT_HEIGHT} />
          {displayDates.map((date, index) => (
            <DayColumn key={date.toISOString()} date={date} bookings={bookings} slotHeight={SLOT_HEIGHT} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
