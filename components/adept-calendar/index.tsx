"use client"

import { useState } from "react"
import { CalendarSidebar } from "./calendar-sidebar"
import { ScheduleView } from "./schedule-view"
import { CalendarWidget } from "./calendar-widget"
import type { Booking } from "@/types/booking"
import { useIsMobile } from "@/hooks/use-mobile"
import { CalendarMobileHeader } from "@/components/header/components/calendar-mobile-header"
import { useProfileStore } from "@/stores/profile-store"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { CalendarSettings } from "./calendar-settings"
import type { CalendarRestirctions } from "@/types/calendar-event"
import { SettingsButton } from "@/components/calendar-settings-button"

interface AdeptCalendarProps {
  bookings: Booking[]
  timezone?: string
}

export function AdeptCalendar({ bookings, timezone }: AdeptCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [calendarRestrictions, setCalendarRestrictions] = useState<CalendarRestirctions>({
    gmt: 3,
    commons: {
      Mon: { isActive: true, intervals: [] },
      Tue: { isActive: true, intervals: [] },
      Wed: { isActive: true, intervals: [] },
      Thu: { isActive: true, intervals: [] },
      Fri: { isActive: true, intervals: [] },
      Sat: { isActive: false, intervals: [] },
      Sun: { isActive: false, intervals: [] },
    },
    restrictions: [],
  })
  const isMobile = useIsMobile()
  const { user } = useProfileStore()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        <CalendarMobileHeader
          user={user}
          onSettings={() => router.push("/settings")}
          isAuthenticated={isAuthenticated}
        />

        {!showSettings ? (
          <>
            <div className="flex-shrink-0">
              <div className="flex flex-col px-4 items-start justify-between">
                <div className="flex-1 w-full">
                  <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} isCollapsible={isMobile} />
                </div>
              </div>
            </div>

            {/* Mobile Schedule */}
            <div className="flex-1 overflow-y-auto border-t border-gray-100">
              <div className="flex h-full px-4 justify-center">
                <ScheduleView selectedDate={selectedDate} bookings={bookings} />
              </div>
            </div>

            {/* Settings Button */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex justify-center">
                <SettingsButton onClick={() => setShowSettings(true)} className="w-10 h-10" iconClassName="w-5 h-5" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <CalendarSettings restrictions={calendarRestrictions} onUpdate={setCalendarRestrictions} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex h-full mt-24">
        <CalendarSidebar selectedDate={selectedDate} onDateSelect={setSelectedDate} timezone={timezone} />
        <ScheduleView selectedDate={selectedDate} bookings={bookings} />
      </div>
    </div>
  )
}
