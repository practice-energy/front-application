"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CustomCalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  className?: string
}

const DAYS_OF_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
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

export function CustomCalendar({ selected, onSelect, className = "" }: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of the month and adjust for Monday start (0 = Monday, 6 = Sunday)
  const firstDayOfMonth = new Date(year, month, 1)
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0

  // Get last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Get previous month's last days
  const prevMonth = new Date(year, month - 1, 0)
  const daysInPrevMonth = prevMonth.getDate()

  // Generate calendar days (6 weeks = 42 days)
  const calendarDays = []

  // Previous month's days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    })
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
    })
  }

  // Next month's days to fill 6 weeks (42 days total)
  const remainingDays = 42 - calendarDays.length
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day),
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
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
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((calendarDay, index) => {
          const { day, isCurrentMonth, date } = calendarDay
          const todayClass = isToday(date) && isCurrentMonth ? "text-violet-600" : ""
          const selectedClass = isSelected(date) ? "bg-violet-600 text-white" : ""
          const currentMonthClass = isCurrentMonth ? "text-gray-900" : "text-gray-400"

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                aspect-square p-2 text-sm font-medium transition-colors hover:bg-gray-100 
                ${selectedClass} 
                ${selectedClass ? "" : todayClass} 
                ${selectedClass ? "" : currentMonthClass}
                ${selectedClass ? "hover:bg-violet-700" : ""}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
