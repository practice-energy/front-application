"use client"

import { TimeColumnHeader, TimeColumnContent } from "./time-column"
import { DayColumnHeader, DayColumnContent } from "./day-column"
import type { Booking } from "@/types/booking"
import { useIsMobile } from "@/hooks/use-mobile"
import {ScrollArea} from "@/components/ui/scroll-area";

interface ScheduleViewProps {
  selectedDate: Date
  bookings: Booking[]
}

export function ScheduleView({ selectedDate, bookings }: ScheduleViewProps) {
  const isMobile = useIsMobile()
  const slotHeight = 52

  // Calculate display dates
  const getDisplayDates = (baseDate: Date) => {
    // Desktop: show 3 days starting from selected date
    const dates = []
    for (let i = 0; i < 3; i++) {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const displayDates = getDisplayDates(selectedDate)

  return (
    <div className="flex-1 flex flex-col md:pr-[30px]">
      {/* Фиксированные заголовки */}
      <div className="flex border border-gray-100 border-b-0">
        <div className="w-16 flex-shrink-0">
          <TimeColumnHeader />
        </div>
        {displayDates.map((date, index) => (
          <div key={`header-${date.toISOString()}`} className="flex-1 flex-shrink-1 h-full border-r border-gray-100">
            <DayColumnHeader date={date} isSelectedDay={index === 0} />
          </div>
        ))}
      </div>

      {/* Скроллируемое содержимое */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="flex h-full">
          <div className="w-16 flex-shrink-0 border-gray-200">
            <TimeColumnContent slotHeight={slotHeight} />
          </div>
          {displayDates.map((date) => (
            <div key={`content-${date.toISOString()}`} className="flex-1 flex-shrink-1">
              <DayColumnContent date={date} bookings={bookings} slotHeight={slotHeight} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
