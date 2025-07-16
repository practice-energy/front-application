"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarWidgetProps {
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

export function CalendarWidget({ selected, onSelect, className }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())
  const today = new Date()

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7 // Monday = 0
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = new Date(year, month - 1, 0)

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

  const renderCalendarDays = () => {
    const days = []

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i)
      days.push(
        <button
          key={`prev-${date.getDate()}`}
          onClick={() => handleDateClick(date)}
          className="w-full h-full flex items-center justify-center text-sm text-gray-400 hover:bg-violet-50 transition-colors rounded-sm"
        >
          {date.getDate()}
        </button>,
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isCurrentDay = isToday(date)
      const isSelectedDay = isSelected(date)

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={cn("w-full h-full flex items-center justify-center text-sm transition-colors hover:bg-violet-50 rounded-sm", {
            "text-gray-900": !isCurrentDay && !isSelectedDay,
            "text-violet-600 font-medium": isCurrentDay && !isSelectedDay,
            "bg-violet-600 text-white font-medium hover:bg-violet-700": isSelectedDay,
          })}
        >
          {day}
        </button>,
      )
    }

    // Next month days to fill 6 weeks (42 days total)
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push(
        <button
          key={`next-${day}`}
          onClick={() => handleDateClick(date)}
          className={cn(
              "w-full h-full flex items-center justify-center text-sm text-gray-400 hover:bg-violet-50 rounded-sm transition-colors",
              {
                "": !isToday(date) && !isSelected(date),
                "text-violet-600 font-medium": isToday(date) && !isSelected(date),
                "bg-violet-600 text-white font-medium hover:bg-violet-700": isSelected(date),
              }
          )}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <div className={cn("bg-white", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="p-3 text-lg font-semibold">
          {MONTHS_RU[month]} {year}
        </h2>
        <div className="flex items-center gap-1 pr-3">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-violet-50 rounded-sm transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={handleNextMonth} className="p-1 hover:bg-violet-50 rounded-sm transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-3">
        {DAYS_RU.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-sm text-gray-500 font-normal">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays().map((day, index) => (
          <div key={index} className="aspect-square">
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
