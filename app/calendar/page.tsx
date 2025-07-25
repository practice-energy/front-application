"use client"

import { AdeptCalendar } from "@/components/adept-calendar"
import { mockBookings } from "@/services/mock-bookings"
import { useIsMobile } from "@/hooks/use-mobile"

export default function CalendarPage() {
  const isMobile = useIsMobile()

  return (
    <div className={isMobile ? "h-screen overflow-hidden" : "h-screen overflow-hidden top-0"}>
      <AdeptCalendar bookings={mockBookings} timezone="GMT+3" />
    </div>
  )
}
