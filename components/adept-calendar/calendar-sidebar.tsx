"use client"

import { CalendarWidget } from "./calendar-widget"
import {SettingsButton} from "@/components/calendar-settings-button";
import {useState} from "react";
import {CalendarSettings} from "@/components/adept-calendar/calendar-settings";
import { CalendarRestirctions } from "@/types/calendar-event";

interface CalendarSidebarProps {
    selectedDate: Date
    onDateSelect: (date: Date) => void
    timezone?: string
}

export function CalendarSidebar({selectedDate, onDateSelect, timezone}: CalendarSidebarProps) {
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

    return (
        <div className="w-80">
            <div className="fixed mt-24 w-80 p-3 top-0 z-30 border-t border-gray-100">
                {showSettings ? (
                    <>
                        <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} timezone={timezone}/>
                        <SettingsButton onClick={() => {setShowSettings(true)}}/>
                    </>
                ) : (
                    <CalendarSettings
                        restrictions={calendarRestrictions}
                        onRestrictionsChange={setCalendarRestrictions}
                        disableSettings={() => {setShowSettings(false)}}
                        onUpdate={(r) => {setCalendarRestrictions(r)}}
                    />
          )}
      </div>
    </div>
  )
}
