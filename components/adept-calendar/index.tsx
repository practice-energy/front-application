"use client"

import { useState } from "react"
import { CalendarSidebar } from "./calendar-sidebar"
import { ScheduleView } from "./schedule-view"
import { CalendarWidget } from "./calendar-widget"
import type { Booking } from "@/types/booking"
import { useIsMobile } from "@/hooks/use-mobile"
import {CalendarMobileHeader} from "@/components/header/components/calendar-mobile-header";
import {useProfileStore} from "@/stores/profile-store";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "@/hooks/use-auth";
import {CalendarRestrictions} from "@/types/calendar-event";
import {CalendarSettings} from "@/components/adept-calendar/calendar-settings";
import { useSidebar } from "@/contexts/sidebar-context";
import { motion, AnimatePresence } from "framer-motion";

interface AdeptCalendarProps {
    bookings: Booking[]
    timezone?: string
}

export function AdeptCalendar({ bookings, timezone }: AdeptCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const isMobile = useIsMobile()
    const { user } = useProfileStore()
    const { isAuthenticated } = useAuth()
    const [showSettings, setShowSettings] = useState(false)
    const { toggleSidebar, isCollapsed } = useSidebar()



    // Функция для получения системного часового пояса
    const getSystemTimezone = () => {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            const offset = -new Date().getTimezoneOffset() / 60
            return `GMT${offset >= 0 ? '+' : ''}${offset}`
        } catch (e) {
            return "GMT+3" // fallback
        }
    }

    const [calendarRestrictions, setCalendarRestrictions] = useState<CalendarRestrictions>({
        gmt:  timezone || getSystemTimezone(),
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

    if (isMobile) {
        return (
            <div className="h-full flex flex-col overflow-hidden">
                {isCollapsed && (
                    <CalendarMobileHeader
                        user={user}
                        onSettings={() => setShowSettings(true)}
                        onCalendar={() => setShowSettings(false)}
                        isAuthenticated={isAuthenticated}
                        isSettingsOpen={showSettings}
                        toggleSidebar={toggleSidebar}
                    />
                )}

                <AnimatePresence mode="wait" initial={false}>
                    {!showSettings ? (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="h-full flex flex-col"
                        >
                            <div className="flex-shrink-0">
                                <div className="flex flex-col px-4 items-start justify-between">
                                    <div className="flex-1 w-full">
                                        <CalendarWidget
                                            selectedDate={selectedDate}
                                            onDateSelect={setSelectedDate}
                                            isCollapsible={isMobile}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Schedule */}
                            <div className="flex-1 overflow-y-auto border-t border-gray-100">
                                <div className="flex h-full px-2 justify-center">
                                    <ScheduleView selectedDate={selectedDate} bookings={bookings} />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="h-full"
                        >
                            <CalendarSettings
                                restrictions={calendarRestrictions}
                                onRestrictionsChange={setCalendarRestrictions}
                                disableSettings={() => setShowSettings(false)}
                                onUpdate={(r) => setCalendarRestrictions(r)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex h-full mt-[66px]">
                <CalendarSidebar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    timezone={timezone}
                    onSettings={() => setShowSettings(!showSettings)}
                    showSettings={showSettings}
                />
                <ScheduleView selectedDate={selectedDate} bookings={bookings} />
            </div>
        </div>
    )
}