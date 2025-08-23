"use client"

import { useState } from "react"
import { CalendarSidebar } from "./calendar-sidebar"
import { ScheduleView } from "./schedule-view"
import { CalendarWidget } from "./calendar-widget"
import type { Booking } from "@/src/types/booking"
import { useIsMobile } from "@/src/hooks/use-mobile"
import {CalendarMobileHeader} from "@/src/components/header/components/calendar-mobile-header";
import {useProfileStore} from "@/src/stores/profile-store";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "@/src/hooks/use-auth";
import {CalendarRestrictions} from "@/src/types/calendar-event";
import {CalendarSettings} from "@/src/components/adept-calendar/calendar-settings";
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
                />
                <ScheduleView selectedDate={selectedDate} bookings={bookings} />
            </div>
        </div>
    )
}
