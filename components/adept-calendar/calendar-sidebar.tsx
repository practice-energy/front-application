"use client"

import { CalendarWidget } from "./calendar-widget"

interface CalendarSidebarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  timezone?: string
}

export function CalendarSidebar({ selectedDate, onDateSelect, timezone = "GMT+3" }: CalendarSidebarProps) {
  return (
    <div className="w-80 border-r bg-white border-gray-200 flex flex-col pl-3">
      {/* Calendar at the top */}
      <div className="">
        <div className="w-full aspect-square">
          <CalendarWidget selected={selectedDate} onSelect={onDateSelect} className="w-full" />
        </div>
      </div>

      {/* Timezone at the bottom */}
      <div className="mt-auto p-6">
        <div className="text-xs text-gray-500">{timezone}</div>
      </div>
    </div>
  )
}
