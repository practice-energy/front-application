"use client"

import { useState } from "react"
import type { CalendarRestirctions, Restriction } from "@/types/calendar-event"
import { CalendarWidget } from "./calendar-widget"
import { RestrictionItem } from "./restriction-item"
import { AddEntityButton } from "@/components/add-entity-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CalendarSettingsProps {
  restrictions: CalendarRestirctions
  onRestrictionsChange: (restrictions: CalendarRestirctions) => void
}

const DAYS = [
  { key: "Mon", label: "Пн" },
  { key: "Tue", label: "Вт" },
  { key: "Wed", label: "Ср" },
  { key: "Thu", label: "Чт" },
  { key: "Fri", label: "Пт" },
  { key: "Sat", label: "Сб" },
  { key: "Sun", label: "Вс" },
] as const

export function CalendarSettings({ restrictions, onRestrictionsChange }: CalendarSettingsProps) {
  const [selectedDay, setSelectedDay] = useState<keyof typeof restrictions.commons | null>(null)
  const [showExceptionalSlots, setShowExceptionalSlots] = useState(true)
  const [showCalendarWidget, setShowCalendarWidget] = useState(false)

  const handleDayToggle = (day: keyof typeof restrictions.commons) => {
    const updatedRestrictions = {
      ...restrictions,
      commons: {
        ...restrictions.commons,
        [day]: {
          ...restrictions.commons[day],
          isActive: !restrictions.commons[day].isActive,
        },
      },
    }
    onRestrictionsChange(updatedRestrictions)
  }

  const handleDaySelect = (day: keyof typeof restrictions.commons) => {
    setSelectedDay(selectedDay === day ? null : day)
  }

  const handleExceptionalDateSelect = (date: Date) => {
    const newRestriction: Restriction = {
      date,
      isActive: true,
      intervals: [
        {
          start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0),
          end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 0),
          formats: [],
        },
      ],
    }

    const updatedRestrictions = {
      ...restrictions,
      restrictions: [...restrictions.restrictions, newRestriction],
    }
    onRestrictionsChange(updatedRestrictions)
    setShowCalendarWidget(false)
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
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
        </div>
        <h2 className="text-lg font-semibold">Установки календаря</h2>
      </div>

      {/* Timezone Section */}
      <div className="space-y-2">
        <h3 className="font-medium">Часовой пояс</h3>
        <p className="text-sm text-gray-500">Как реализовано в локейшн</p>
        <Select
          value={`GMT+${restrictions.gmt}`}
          onValueChange={(value) => {
            const gmt = Number.parseInt(value.replace("GMT+", "").replace("GMT", ""))
            onRestrictionsChange({ ...restrictions, gmt })
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 25 }, (_, i) => i - 12).map((offset) => (
              <SelectItem key={offset} value={`GMT${offset >= 0 ? "+" : ""}${offset}`}>
                GMT{offset >= 0 ? "+" : ""}
                {offset}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Periods and Formats Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Периоды и форматы</h3>
          <ChevronDown className="w-4 h-4" />
        </div>

        {/* Day Columns */}
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="flex flex-col items-center space-y-2">
              {/* Toggle Button */}
              <button
                onClick={() => handleDayToggle(key)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  restrictions.commons[key].isActive ? "bg-teal-400 border-teal-400" : "border-gray-300"
                }`}
              >
                {restrictions.commons[key].isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </button>

              {/* Day Button */}
              <Button
                variant={selectedDay === key ? "default" : "outline"}
                size="sm"
                onClick={() => handleDaySelect(key)}
                className="h-8 px-2 text-xs"
              >
                {label}
              </Button>
            </div>
          ))}
        </div>

        {/* Selected Day Settings */}
        {selectedDay && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <RestrictionItem
                restriction={restrictions.commons[selectedDay]}
                onChange={(updatedRestriction) => {
                  const updatedRestrictions = {
                    ...restrictions,
                    commons: {
                      ...restrictions.commons,
                      [selectedDay]: updatedRestriction,
                    },
                  }
                  onRestrictionsChange(updatedRestrictions)
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Exceptional Slots Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Исключительные слоты</h3>
          <button onClick={() => setShowExceptionalSlots(!showExceptionalSlots)}>
            {showExceptionalSlots ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showExceptionalSlots && (
          <div className="space-y-4">
            <AddEntityButton onClick={() => setShowCalendarWidget(true)} className="w-8 h-8" />

            {showCalendarWidget && (
              <div className="border rounded-lg p-4">
                <CalendarWidget selectedDate={new Date()} onDateSelect={handleExceptionalDateSelect} />
              </div>
            )}

            {/* Exceptional Restrictions */}
            {restrictions.restrictions.map((restriction, index) => (
              <div key={index} className="space-y-2">
                {restriction.date && <div className="text-sm font-medium">{formatDate(restriction.date)}</div>}
                <Card>
                  <CardContent className="p-4">
                    <RestrictionItem
                      restriction={restriction}
                      onChange={(updatedRestriction) => {
                        const updatedRestrictions = {
                          ...restrictions,
                          restrictions: restrictions.restrictions.map((r, i) => (i === index ? updatedRestriction : r)),
                        }
                        onRestrictionsChange(updatedRestrictions)
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
