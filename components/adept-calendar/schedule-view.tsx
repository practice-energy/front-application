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

const SLOT_HEIGHT = 93

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
    <div className="flex-1 h-full overflow-hidden">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="flex">
          <TimeColumn slotHeight={SLOT_HEIGHT} />
          <DayColumn
            key={displayDates[0].toISOString()}
            date={displayDates[0]}
            bookings={bookings}
            slotHeight={SLOT_HEIGHT}
            isSelectedDay={true}
          />
          {displayDates.slice(1).map((date) => (
            <DayColumn
              key={date.toISOString()}
              date={date}
              bookings={bookings}
              slotHeight={SLOT_HEIGHT}
              isSelectedDay={false}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
