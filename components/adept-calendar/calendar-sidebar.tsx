"use client"

import { CalendarWidget } from "./calendar-widget"
import {SettingsButton} from "@/components/calendar-settings-button";
import {useState} from "react";
import {CalendarSettings} from "@/components/adept-calendar/calendar-settings";
import { CalendarRestrictions } from "@/types/calendar-event";
import {useProfileStore} from "@/stores/profile-store";

interface CalendarSidebarProps {
    selectedDate: Date
    onDateSelect: (date: Date) => void
}

export function CalendarSidebar({selectedDate, onDateSelect}: CalendarSidebarProps) {
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
        <div className="w-[370px] bg-white border-t border-gray-100">
            <div className="fixed mt-24 w-[370px] top-0 z-30 border-gray-100">
                {!showSettings ? (
                    <div className="px-4 ">
                        <CalendarWidget selectedDate={selectedDate} onDateSelect={onDateSelect} timezone={calendarRestrictions.gmt}/>
                        <div className="h-8 bottom-0 ml-auto"/>
                        <div className="flex flex-row items-center gap-3 font-semibold">
                            <SettingsButton
                                onClick={() => {setShowSettings(true)}}
                                className="hover:bg-violet-50 border border-gray-200"
                            />
                            <div className="text-base text-neutral-900">
                                Установки календаря
                            </div>
                        </div>
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
