"use client"

import { Calendar } from "@/components/ui/calendar"

interface CalendarWidgetProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function CalendarWidget({ selectedDate, onDateSelect }: CalendarWidgetProps) {
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={(date) => date && onDateSelect(date)}
      className="rounded-md border"
    />
  )
}
