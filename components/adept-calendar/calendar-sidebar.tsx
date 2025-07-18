"use client"

import { CalendarWidget } from "./calendar-widget"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function CalendarSidebar({ selectedDate, onDateSelect }: CalendarSidebarProps) {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
      <div className="sticky top-0 z-10">
        <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} />
      </div>
    </div>
  )
}
