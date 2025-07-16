"use client"

import { CalendarWidget } from "./calendar-widget"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  timezone?: string
}

export function CalendarSidebar({ selectedDate, onDateSelect, timezone }: CalendarSidebarProps) {
  return (
    <div className="w-80 border-r bg-white flex-shrink-0 h-full overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Календарь</h2>
        {timezone && <p className="text-sm text-gray-500">Часовой пояс: {timezone}</p>}
      </div>

      <div className="p-4">
        <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} />
      </div>
    </div>
  )
}
