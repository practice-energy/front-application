"use client"

import { TimeColumnHeader, TimeColumnContent } from "./time-column"
import { DayColumnHeader, DayColumnContent } from "./day-column"
import type { Booking } from "@/src/types/booking"
import { useIsMobile } from "@/src/hooks/use-mobile"

interface ScheduleViewProps {
  selectedDate: Date
  bookings: Booking[]
}

export function ScheduleView({ selectedDate, bookings }: ScheduleViewProps) {
  const isMobile = useIsMobile()
  const slotHeight = isMobile ? 52 : 56

  // Calculate display dates
  const getDisplayDates = (baseDate: Date) => {
    // Desktop: show 3 days with selected date in center
    const dates = []
    for (let i = -1; i <= 1; i++) {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const displayDates = getDisplayDates(selectedDate)

  return (
    <div className="flex-1 flex flex-col md:pr-[30px] h-full overflow-hidden">
      {/* Фиксированные заголовки */}
      <div className="flex border border-gray-100 border-b-0 flex-shrink-0">
        <div className="w-16 flex-shrink-0">
          <TimeColumnHeader />
        </div>
        {displayDates.map((date, index) => (
          <div key={`header-${date.toISOString()}`} className="flex-1 flex-shrink-1 h-full border-r border-gray-100">
            <DayColumnHeader date={date} isSelectedDay={index === 1} />
          </div>
        ))}
      </div>

      {/* Скроллируемое содержимое */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          <div className="w-16 flex-shrink-0 bg-white border-gray-200">
            <TimeColumnContent slotHeight={slotHeight} />
          </div>
          {displayDates.map((date) => (
            <div key={`content-${date.toISOString()}`} className="flex-1 flex-shrink-1">
              <DayColumnContent date={date} bookings={bookings} slotHeight={slotHeight} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
