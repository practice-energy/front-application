"use client"

interface TimeSlotProps {
  hour: number
  slotHeight: number
}

export function TimeSlot({ hour, slotHeight }: TimeSlotProps) {
  return (
    <div
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
      style={{ height: `${slotHeight}px` }}
    />
  )
}
