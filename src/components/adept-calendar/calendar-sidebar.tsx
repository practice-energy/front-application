"use client"

import { CalendarWidget } from "./calendar-widget"
import {SettingsButton} from "@/src/components/calendar-settings-button";
import {useState} from "react";
import {CalendarSettings} from "@/src/components/adept-calendar/calendar-settings";
import { CalendarRestrictions } from "@/src/types/calendar-event";
import {useProfileStore} from "@/src/stores/profile-store";

interface CalendarSidebarProps {
    selectedDate: Date
    onDateSelect: (date: Date) => void
}

export function CalendarSidebar({selectedDate, onDateSelect}: CalendarSidebarProps) {
    const [showSettings, setShowSettings] = useState(false)
    const [calendarRestrictions, setCalendarRestrictions] = useState<CalendarRestrictions>({
        gmt: "GMT+3",
        commons: {
            Mon: { id: "mon", name: "Monday", isActive: true, intervals: [], isPractice: false },
            Tue: { id: "tue", name: "Tuesday", isActive: true, intervals: [], isPractice: false },
            Wed: { id: "wed", name: "Wednesday", isActive: true, intervals: [], isPractice: false },
            Thu: { id: "thu", name: "Thursday", isActive: true, intervals: [], isPractice: false },
            Fri: { id: "fri", name: "Friday", isActive: true, intervals: [], isPractice: false },
            Sat: { id: "sat", name: "Saturday", isActive: false, intervals: [], isPractice: false },
            Sun: { id: "sun", name: "Sunday", isActive: false, intervals: [], isPractice: false },
        },
        restrictions: [],
    })
    // const useSide

    return (
        <div className="bg-white border-t border-gray-100">
            <div className="top-0 z-30 border-gray-100 py-4 px-2">
                {!showSettings ? (
                    <>
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
                    </>
                ) : (
                    <div className="flex flex-1">
                    <CalendarSettings
                        restrictions={calendarRestrictions}
                        disableSettings={() => {setShowSettings(false)}}
                        onUpdate={(r) => {setCalendarRestrictions(r)}}
                    />
                    </div>
                )}
      </div>
    </div>
  )
}
