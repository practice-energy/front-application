"use client"

import { CalendarWidget } from "./calendar-widget"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  timezone?: string
}

export function CalendarSidebar({ selectedDate, onDateSelect, timezone }: CalendarSidebarProps) {
  return (
    <div className="w-80">
      <div className="fixed mt-24 w-80 p-3 top-0 z-30 border-t border-gray-100">
        <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} timezone={timezone} />
      </div>
    </div>
  )
}
