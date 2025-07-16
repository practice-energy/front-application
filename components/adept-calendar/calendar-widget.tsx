"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarWidgetProps {
  selected: Date
  onSelect: (date: Date) => void
  className?: string
}

const MONTHS = [
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

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

export function CalendarWidget({ selected, onSelect, className }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selectedDate = new Date(selected)
  selectedDate.setHours(0, 0, 0, 0)

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0, Sunday = 6
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7

    const days = []

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      })
    }

    // Add days from current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      const dateOnly = new Date(date)
      dateOnly.setHours(0, 0, 0, 0)

      days.push({
        date,
        isCurrentMonth: true,
        isToday: dateOnly.getTime() === today.getTime(),
        isSelected: dateOnly.getTime() === selectedDate.getTime(),
      })
    }

    // Add days from next month to complete 6 weeks (42 days)
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      })
    }

    return days
  }

  const days = getDaysInMonth()

  const handleDateClick = (date: Date) => {
    onSelect(date)
  }

  return (
    <div className={cn("bg-white p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => navigateMonth("prev")} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => navigateMonth("next")} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-xs text-gray-500 text-center py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day.date)}
            className={cn(
              "aspect-square text-sm flex items-center justify-center rounded hover:bg-gray-100 transition-colors",
              {
                "text-gray-400": !day.isCurrentMonth,
                "text-gray-900": day.isCurrentMonth && !day.isToday && !day.isSelected,
                "text-violet-600": day.isToday && !day.isSelected,
                "bg-violet-600 text-white hover:bg-violet-600": day.isSelected,
              },
            )}
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>
    </div>
  )
}
