"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomCalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  className?: string
}

const MONTHS_RU = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
]

const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

export function CustomCalendar({ selected, onSelect, className }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())
  const today = new Date()

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Get first day of month and adjust for Monday start (0 = Monday, 6 = Sunday)
  const firstDayOfMonth = new Date(year, month, 1)
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7 // Convert to Monday = 0

  // Get days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Get days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Calculate calendar grid (6 weeks = 42 days)
  const calendarDays = []

  // Previous month days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
    })
  }

  // Next month days to fill 42 slots (6 weeks)
  const remainingSlots = 42 - calendarDays.length
  for (let day = 1; day <= remainingSlots; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day),
    })
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    onSelect?.(date)
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selected && date.toDateString() === selected.toDateString()
  }

  return (
    <div className={cn("bg-white", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">
          {MONTHS_RU[month]} {year}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_RU.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((calendarDay, index) => {
          const { day, isCurrentMonth, date } = calendarDay

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={cn(
                "aspect-square flex items-center justify-center text-sm transition-colors hover:bg-gray-50",
                {
                  "text-gray-400": !isCurrentMonth,
                  "text-gray-900": isCurrentMonth,
                  "text-violet-600 font-semibold": isToday(date) && isCurrentMonth,
                  "bg-violet-600 text-white hover:bg-violet-600": isSelected(date),
                },
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
