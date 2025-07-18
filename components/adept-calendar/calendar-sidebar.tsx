"use client"

import { CalendarWidget } from "./calendar-widget"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function CalendarSidebar({ selectedDate, onDateSelect }: CalendarSidebarProps) {
  return (
    <div className="w-80">
      <div className="fixed mt-24 w-80 top-0 z-30">
        <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} />
      </div>
    </div>
  )
}
