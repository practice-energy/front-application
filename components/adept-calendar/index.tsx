"use client"

import { useState } from "react"
import { CalendarSidebar } from "./calendar-sidebar"
import { ScheduleView } from "./schedule-view"
import type { Booking } from "@/types/booking"
import {useIsMobile} from "@/hooks/use-mobile";

interface AdeptCalendarProps {
  bookings: Booking[]
  timezone?: string
}

export function AdeptCalendar({ bookings, timezone }: AdeptCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const isMobile = useIsMobile()

  return (
      <>
          isMobile ? (
          <div>
              {/*Place mobile here*/}
          </div>
          ) : (<div className="h-full flex flex-col overflow-auto top-0">
          <div className="flex h-full">
              <CalendarSidebar selectedDate={selectedDate} onDateSelect={setSelectedDate} timezone={timezone} />
              <ScheduleView selectedDate={selectedDate} bookings={bookings} />
          </div>
      </div>)
      </>
  )
}
