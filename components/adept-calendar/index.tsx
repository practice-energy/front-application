"use client"

import { useState } from "react"
import { CalendarSidebar } from "./calendar-sidebar"
import { ScheduleView } from "./schedule-view"
import type { Booking } from "@/types/booking"
import {mockBookings} from "@/services/mock-bookings";
import {BookingDetailsModal} from "@/components/modals/booking-details-modal";

interface AdeptCalendarProps {
  bookings: Booking[]
  timezone?: string
}

export function AdeptCalendar({ bookings, timezone }: AdeptCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <div className="h-full flex flex-col overflow-hidden top-0">
      <div className="flex h-full">
        <CalendarSidebar selectedDate={selectedDate} onDateSelect={setSelectedDate} timezone={timezone} />
        <ScheduleView selectedDate={selectedDate} bookings={bookings} />
      </div>
    </div>
  )
}
