"use client"

import { CalendarWidget } from "./calendar-widget"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  timezone?: string
}

export function CalendarSidebar({ selectedDate, onDateSelect, timezone = "GMT+3" }: CalendarSidebarProps) {
  return (
    <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden sticky top-0">
      <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} />

      <div className="mt-12 bottom-0">
        <div className="text-sm text-gray-500 text-center">{timezone}</div>
      </div>
    </div>
  )
}
