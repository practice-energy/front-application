"use client"

import { CalendarWidget } from "./calendar-widget"
import type { Booking } from "@/types/booking"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  bookings: Booking[]
}

export function CalendarSidebar({ selectedDate, onDateSelect, bookings }: CalendarSidebarProps) {
  return (
    <div className="fixed top-[72px] left-0 w-80 h-[calc(100vh-72px)] bg-white border-r border-gray-200 z-20 overflow-y-auto">
      <div className="p-4">
        <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} bookings={bookings} />
      </div>
    </div>
  )
}
