"use client"

import { CalendarWidget } from "./calendar-widget"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  timezone?: string
}

export function CalendarSidebar({ selectedDate, onDateSelect, timezone = "GMT+3" }: CalendarSidebarProps) {
  return (
    <div className="w-80 flex-shrink-0 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
      <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} />

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 text-center">{timezone}</div>
      </div>
    </div>
  )
}
