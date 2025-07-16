"use client"

import type React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { TimeColumn } from "./time-column"
import { DayColumn } from "./day-column"
import type { Booking } from "@/types/booking"

interface ScheduleViewProps {
  dates: Date[]
  bookings: Booking[]
  scrollAreaRef: React.RefObject<HTMLDivElement>
}

const SLOT_HEIGHT = 60

export function ScheduleView({ dates, bookings, scrollAreaRef }: ScheduleViewProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex" ref={scrollAreaRef}>
          <TimeColumn slotHeight={SLOT_HEIGHT} />
          {dates.map((date) => (
            <DayColumn key={date.toISOString()} date={date} bookings={bookings} slotHeight={SLOT_HEIGHT} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
