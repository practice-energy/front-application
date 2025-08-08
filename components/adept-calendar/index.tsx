"use client"

import { useState } from "react"
import { CalendarWidget } from "./calendar-widget"
import { CalendarSidebar } from "./calendar-sidebar"
import { CalendarSettings } from "./calendar-settings"
import { ScheduleView } from "./schedule-view"
import type { Booking } from "@/types/booking"
import type { CalendarRestrictions } from "@/types/calendar-event"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface AdeptCalendarProps {
  bookings: Booking[]
  timezone: string
}

const mockRestrictions: CalendarRestrictions = {
  timezone: "GMT+3",
  weeklyRestrictions: [
    {
      id: "1",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "18:00",
      isEnabled: true,
    },
    {
      id: "2", 
      dayOfWeek: 2,
      startTime: "09:00",
      endTime: "18:00",
      isEnabled: true,
    },
  ],
  exceptionalSlots: [],
}

export function AdeptCalendar({ bookings, timezone }: AdeptCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [restrictions, setRestrictions] = useState<CalendarRestrictions>(mockRestrictions)
  const [showSettings, setShowSettings] = useState(false)
  const isMobile = useIsMobile()

  const enableSettings = () => setShowSettings(true)
  const disableSettings = () => setShowSettings(false)

  const handleRestrictionsUpdate = (newRestrictions: CalendarRestrictions) => {
    setRestrictions(newRestrictions)
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              <CalendarSettings
                restrictions={restrictions}
                onUpdate={handleRestrictionsUpdate}
                disableSettings={disableSettings}
              />
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              <ScheduleView
                bookings={bookings}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                restrictions={restrictions}
                enableSettings={enableSettings}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex">
        <motion.div
          animate={{ width: showSettings ? "60%" : "75%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          className="flex"
        >
          <ScheduleView
            bookings={bookings}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            restrictions={restrictions}
            enableSettings={enableSettings}
          />
        </motion.div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "40%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="border-l border-gray-200 overflow-hidden"
            >
              <CalendarSettings
                restrictions={restrictions}
                onUpdate={handleRestrictionsUpdate}
                disableSettings={disableSettings}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        animate={{ width: showSettings ? 0 : "25%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className={cn("border-l border-gray-200 overflow-hidden", showSettings && "w-0")}
      >
        <AnimatePresence>
          {!showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: showSettings ? 0 : 0.1 }}
              className="h-full"
            >
              <CalendarSidebar>
                <CalendarWidget
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  bookings={bookings}
                />
              </CalendarSidebar>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
