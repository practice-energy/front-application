"use client"

import {mockBookings} from "@/services/mock-bookings"
import {AdeptCalendar} from "@/components/adept-calendar"

export default function CalendarPage() {
  return <AdeptCalendar bookings={mockBookings} timezone="GMT+3" />
}
