"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CalendarRestirctions, Restriction } from "@/types/calendar-event"
import { RestrictionItem } from "./restriction-item"
import { CalendarWidget } from "./calendar-widget"
import { AddEntityButton } from "@/components/add-entity-button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CalendarSettingsProps {
  restrictions: CalendarRestirctions
  onUpdate: (restrictions: CalendarRestirctions) => void
}

const dayNames = [
  { key: "Mon", label: "Пн" },
  { key: "Tue", label: "Вт" },
  { key: "Wed", label: "Ср" },
  { key: "Thu", label: "Чт" },
  { key: "Fri", label: "Пт" },
  { key: "Sat", label: "Сб" },
  { key: "Sun", label: "Вс" },
]

export function CalendarSettings({ restrictions, onUpdate }: CalendarSettingsProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>("Tue")
  const [showExceptionalSlots, setShowExceptionalSlots] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showPeriodsFormats, setShowPeriodsFormats] = useState(true)

  const handleDayToggle = (dayKey: string) => {
    const updatedCommons = {
      ...restrictions.commons,
      [dayKey]: {
        ...restrictions.commons[dayKey as keyof typeof restrictions.commons],
        isActive: !restrictions.commons[dayKey as keyof typeof restrictions.commons].isActive,
      },
    }
    onUpdate({
      ...restrictions,
      commons: updatedCommons,
    })
  }

  const handleDaySelect = (dayKey: string) => {
    setSelectedDay(selectedDay === dayKey ? null : dayKey)
  }

  const handleDateSelect = (date: Date) => {
    const newRestriction: Restriction = {
      date,
      isActive: true,
      intervals: [],
    }
    onUpdate({
      ...restrictions,
      restrictions: [...restrictions.restrictions, newRestriction],
    })
    setShowDatePicker(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
        </div>
        <h2 className="text-lg font-medium">Установки календаря</h2>
      </div>

      {/* Timezone Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Часовой пояс</h3>
        <p className="text-xs text-gray-500">Как реализовано в локейшн</p>
        <Select defaultValue="GMT">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите часовой пояс" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GMT">Дроплаун GMT</SelectItem>
            <SelectItem value="GMT+1">GMT+1</SelectItem>
            <SelectItem value="GMT+2">GMT+2</SelectItem>
            <SelectItem value="GMT+3">GMT+3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Periods and Formats Section */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto"
          onClick={() => setShowPeriodsFormats(!showPeriodsFormats)}
        >
          <h3 className="text-sm font-medium">Периоды и форматы</h3>
          {showPeriodsFormats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {showPeriodsFormats && (
          <div className="space-y-4">
            {/* Day toggles */}
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day) => {
                const dayRestriction = restrictions.commons[day.key as keyof typeof restrictions.commons]
                const isActive = dayRestriction?.isActive || false
                const isSelected = selectedDay === day.key

                return (
                  <div key={day.key} className="flex flex-col items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-5 h-5 p-0 ${isActive ? "bg-green-400 border-green-400" : "bg-gray-200"}`}
                      onClick={() => handleDayToggle(day.key)}
                    >
                      {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </Button>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="text-xs px-2 py-1"
                      onClick={() => handleDaySelect(day.key)}
                    >
                      {day.label}
                    </Button>
                  </div>
                )
              })}
            </div>

            {/* Selected day settings */}
            {selectedDay && (
              <div className="mt-4">
                <RestrictionItem
                  restriction={restrictions.commons[selectedDay as keyof typeof restrictions.commons]}
                  onUpdate={(updatedRestriction) => {
                    onUpdate({
                      ...restrictions,
                      commons: {
                        ...restrictions.commons,
                        [selectedDay]: updatedRestriction,
                      },
                    })
                  }}
                />

                {/* Repeat for all active button */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Повторить для всех активных</span>
                  <div className="flex gap-2">
                    <Button size="sm" className="w-8 h-8 p-0 bg-teal-400 hover:bg-teal-500">
                      <div className="w-4 h-4 bg-white rounded"></div>
                    </Button>
                    <Button size="sm" className="w-8 h-8 p-0 bg-purple-400 hover:bg-purple-500">
                      <div className="w-4 h-4 bg-white rounded"></div>
                    </Button>
                    <Button size="sm" className="w-8 h-8 p-0 bg-red-400 hover:bg-red-500">
                      <div className="w-4 h-4 bg-white rounded"></div>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exceptional Slots Section */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto"
          onClick={() => setShowExceptionalSlots(!showExceptionalSlots)}
        >
          <h3 className="text-sm font-medium">Исключительные слоты</h3>
          {showExceptionalSlots ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {showExceptionalSlots && (
          <div className="space-y-4">
            <AddEntityButton onClick={() => setShowDatePicker(true)} />

            {showDatePicker && (
              <div className="border rounded-lg p-4">
                <CalendarWidget selectedDate={new Date()} onDateSelect={handleDateSelect} />
              </div>
            )}

            {/* Exceptional restrictions */}
            <div className="space-y-4">
              {restrictions.restrictions.map((restriction, index) => (
                <RestrictionItem
                  key={index}
                  restriction={restriction}
                  onUpdate={(updatedRestriction) => {
                    const updatedRestrictions = [...restrictions.restrictions]
                    updatedRestrictions[index] = updatedRestriction
                    onUpdate({
                      ...restrictions,
                      restrictions: updatedRestrictions,
                    })
                  }}
                  showDate={true}
                  date={restriction.date ? formatDate(restriction.date) : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
