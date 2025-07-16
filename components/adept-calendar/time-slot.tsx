"use client"

import { BookingCard } from "@/components/adept-calendar/booking-card"
import type { Booking } from "@/types/booking"

interface TimeSlotProps {
  hour: number
  booking?: Booking
  isHidden?: boolean
  slotHeight: number
}

export function TimeSlot({ hour, booking, isHidden, slotHeight }: TimeSlotProps) {
  if (isHidden) {
    return (
      <div style={{ height: `${slotHeight}px` }} className="border-b border-gray-100">
        {/* Empty slot that's part of a multi-hour booking */}
      </div>
    )
  }

  return (
    <div className="border-b border-gray-100" style={{ height: `${slotHeight}px` }}>
      <div className="h-full p-1">{booking && <BookingCard booking={booking} slotHeight={slotHeight} />}</div>
    </div>
  )
}
