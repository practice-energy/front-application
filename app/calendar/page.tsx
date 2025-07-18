"use client"

import { AdeptCalendar } from "@/components/adept-calendar"
import { mockBookings } from "@/services/mock-bookings"

export default function CalendarPage() {
  return (
    <div className="h-[calc(100vh-72px)] overflow-hidden">
      <AdeptCalendar bookings={mockBookings} timezone="GMT+3" />
    </div>
  )
}
