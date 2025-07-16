"use client"

import { CalendarWidget } from "./calendar-widget"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  timezone?: string
}

export function CalendarSidebar({ selectedDate, onDateSelect, timezone = "GMT+3" }: CalendarSidebarProps) {
  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      {/* Calendar at the top */}
      <div className="p-6 border-b border-gray-200">
        <div className="w-full aspect-square">
          <CalendarWidget selected={selectedDate} onSelect={onDateSelect} className="w-full h-full" />
        </div>
      </div>

      {/* Timezone at the bottom */}
      <div className="mt-auto p-6">
        <div className="text-xs text-gray-500">{timezone}</div>
      </div>
    </div>
  )
}
