"use client"

interface TimeSlotProps {
  slotHeight: number
}

export function TimeSlot({ slotHeight }: TimeSlotProps) {
  return (
    <div
      className="border-b border-gray-100 "
      style={{ height: `${slotHeight}px` }}
    />
  )
}
