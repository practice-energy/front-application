"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

interface DateSelectionProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function DateSelection({ selectedDate, onDateSelect }: DateSelectionProps) {
  const getNextDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  return (
    <div className="space-y-3">
      <Label className="text-lg font-semibold text-foreground">Select a date</Label>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex space-x-2 flex-1 justify-center">
          {getNextDays().map((date, index) => {
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
            const dayNumber = date.getDate()

            return (
              <button
                key={index}
                type="button"
                onClick={() => onDateSelect(date)}
                className={`flex flex-col items-center p-3 rounded-full min-w-[60px] transition-all duration-200 ${
                  selectedDate.toDateString() === date.toDateString()
                    ? "bg-violet-400 text-white shadow-lg"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-xs font-medium">{dayName}</span>
                <span className="text-lg font-bold">{dayNumber}</span>
              </button>
            )
          })}
        </div>
        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Button>
      </div>
    </div>
  )
}
