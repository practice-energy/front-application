"use client"

import { useState } from "react"
import { CalendarWidget } from "./calendar-widget"
import { CalendarSidebar } from "./calendar-sidebar"
import { ScheduleView } from "./schedule-view"
import { TimeColumn } from "./time-column"
import { DayColumn } from "./day-column"
import { useIsMobile } from "@/hooks/use-mobile"
import { BackButton } from "@/components/ui/button-back"

export function AdeptCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Mobile Header with Back Button */}
        <div className="flex items-center p-4 border-b bg-background">
          <BackButton />
          <h1 className="ml-4 text-lg font-semibold">Календарь</h1>
        </div>

        {/* Calendar Widget */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
          <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Schedule Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            <TimeColumn />
            <div className="flex-1 overflow-auto">
              <DayColumn date={selectedDate} isSelected={true} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop layout
  return (
    <div className="h-[calc(100vh-96px)] flex bg-background">
      <CalendarSidebar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <div className="flex-1">
        <ScheduleView selectedDate={selectedDate} />
      </div>
    </div>
  )
}
