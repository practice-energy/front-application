"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import {cn} from "@/src/lib/utils";

interface CalendarWidgetProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  isMobile?: boolean
  timezone?: string
  isCollapsible?: boolean
}

export function CalendarWidget({ selectedDate, onDateSelect, timezone, isCollapsible = false }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  const [isCollapsed, setIsCollapsed] = useState(false)

  const monthNames = [
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

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Get first day of week (Monday = 0)
    let firstDayOfWeek = firstDay.getDay() - 1
    if (firstDayOfWeek < 0) firstDayOfWeek = 6

    const days = []

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonth.getDate() - i),
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day),
      })
    }

    // Next month days to fill 6 weeks (42 days)
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day),
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(currentMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className={cn(
        "bg-none rounded-sm",
        isCollapsed ? "" : "sm:h-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isCollapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0 flex items-center justify-center transition-transform duration-200"
            >
              <ChevronDown
                className={`h-6 w-6 transition-transform duration-200 text-colors-custom-accent ${isCollapsed ? "rotate-180" : "rotate-0"}`}
              />
            </button>
          )}
          <div className="font-medium text-gray-900 pl-2">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
        </div>
        <div className="flex gap-6 text-colors-custom-accent">
          <button onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Calendar content with smooth animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
        }`}
      >
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-xs text-gray-500 text-center py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 aspect-video">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => onDateSelect(day.fullDate)}
              className={`
                aspect-square text-sm rounded-sm transition-colors hover:bg-violet-50
                ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                ${isToday(day.fullDate) ? "text-colors-custom-accent font-semibold" : ""}
                ${isSelected(day.fullDate) ? "bg-colors-custom-accent text-white hover:bg-violet-700" : ""}
              `}
            >
              {day.date}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
