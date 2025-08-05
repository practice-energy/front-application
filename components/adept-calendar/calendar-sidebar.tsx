"use client"

import { CalendarWidget } from "./calendar-widget"
import {SettingsButton} from "@/components/calendar-settings-button";
import {useState} from "react";
import {CalendarSettings} from "@/components/adept-calendar/calendar-settings";
import { CalendarRestrictions } from "@/types/calendar-event";

interface CalendarSidebarProps {
    selectedDate: Date
    onDateSelect: (date: Date) => void
    timezone?: string
}

export function CalendarSidebar({selectedDate, onDateSelect, timezone}: CalendarSidebarProps) {
    const [showSettings, setShowSettings] = useState(false)
    const [calendarRestrictions, setCalendarRestrictions] = useState<CalendarRestrictions>({
        gmt: "GMT+3",
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
        <div className="w-[370px]">
            <div className="fixed mt-24 w-[370px] top-0 z-30 border-gray-100">
                {!showSettings ? (
                    <div className="px-4 ">
                        <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} timezone={timezone}/>
                        <div className="h-8 bottom-0 ml-auto"/>
                        <SettingsButton
                            onClick={() => {setShowSettings(true)}}
                            className="hover:bg-violet-50"
                        />
                    </div>
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
