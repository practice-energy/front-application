"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AirbnbCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function AirbnbCalendar({ selectedDate, onDateSelect }: AirbnbCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // Get the number of days in the month
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  // Get the month name and year
  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  // Check if a date is selected
  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Check if a date is in the past
  const isPastDate = (day: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date < today
  }

  // Handle date selection
  const handleDateSelect = (day: number) => {
    if (!isPastDate(day)) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      onDateSelect(newDate)
    }
  }

  // Create calendar grid
  const renderCalendarDays = () => {
    const days = []
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    // Add weekday headers
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="text-center text-xs font-medium text-gray-500 py-2">
          {weekdays[i]}
        </div>,
      )
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isPastDate(day)
      days.push(
        <div key={`day-${day}`} className="p-1">
          <button
            onClick={() => handleDateSelect(day)}
            disabled={isDisabled}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors
              ${isSelected(day) ? "bg-violet-500 text-white" : ""}
              ${isToday(day) && !isSelected(day) ? "border border-violet-500 text-violet-700" : ""}
              ${isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
            `}
          >
            {day}
          </button>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[400px] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">
          {monthName} {year}
        </h3>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-2 flex-1">
        <div className="grid grid-cols-7 gap-1 h-full">{renderCalendarDays()}</div>
      </div>
    </div>
  )
}
