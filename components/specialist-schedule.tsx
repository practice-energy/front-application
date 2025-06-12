"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Clock, Plus, X, Save, Calendar, Check, AlertTriangle } from "lucide-react"

interface TimeSlot {
  start: string
  end: string
}

interface DaySchedule {
  enabled: boolean
  slots: TimeSlot[]
}

interface WeekSchedule {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

export function SpecialistSchedule() {
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const days = [
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
    { key: "sunday", label: "Sunday", short: "Sun" },
  ]

  // Helper function to convert time string to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Helper function to check if two time slots overlap
  const slotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
    const start1 = timeToMinutes(slot1.start)
    const end1 = timeToMinutes(slot1.end)
    const start2 = timeToMinutes(slot2.start)
    const end2 = timeToMinutes(slot2.end)

    return start1 < end2 && start2 < end1
  }

  // Helper function to validate a slot
  const validateSlot = (slot: TimeSlot, daySlots: TimeSlot[], currentIndex?: number): string | null => {
    const startMinutes = timeToMinutes(slot.start)
    const endMinutes = timeToMinutes(slot.end)

    // Check if end time is greater than or equal to start time
    if (endMinutes <= startMinutes) {
      return "End time must be after start time"
    }

    // Check for overlaps with other slots
    for (let i = 0; i < daySlots.length; i++) {
      if (currentIndex !== undefined && i === currentIndex) continue

      if (slotsOverlap(slot, daySlots[i])) {
        return "Time slot overlaps with existing slot"
      }
    }

    return null
  }

  const toggleDay = (day: keyof WeekSchedule) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots: !prev[day].enabled ? [{ start: "09:00", end: "17:00" }] : [],
      },
    }))
    // Clear errors for this day
    setErrors((prev) => {
      const newErrors = { ...prev }
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`${day}-`)) {
          delete newErrors[key]
        }
      })
      return newErrors
    })
  }

  const addTimeSlot = (day: keyof WeekSchedule) => {
    const daySchedule = schedule[day]
    const newSlot = { start: "09:00", end: "17:00" }

    // Find a non-overlapping time slot
    let startHour = 9
    while (startHour < 22) {
      const testSlot = {
        start: `${startHour.toString().padStart(2, "0")}:00`,
        end: `${(startHour + 1).toString().padStart(2, "0")}:00`,
      }

      const error = validateSlot(testSlot, daySchedule.slots)
      if (!error) {
        newSlot.start = testSlot.start
        newSlot.end = testSlot.end
        break
      }
      startHour++
    }

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, newSlot],
      },
    }))
  }

  const removeTimeSlot = (day: keyof WeekSchedule, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }))
    // Clear error for this slot
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`${day}-${index}`]
      return newErrors
    })
  }

  const updateTimeSlot = (day: keyof WeekSchedule, index: number, field: "start" | "end", value: string) => {
    const daySchedule = schedule[day]
    const updatedSlot = { ...daySchedule.slots[index], [field]: value }

    // Validate the updated slot
    const error = validateSlot(updatedSlot, daySchedule.slots, index)
    const errorKey = `${day}-${index}`

    if (error) {
      setErrors((prev) => ({ ...prev, [errorKey]: error }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) => (i === index ? updatedSlot : slot)),
      },
    }))
  }

  const getSlotError = (day: string, index: number): string | undefined => {
    return errors[`${day}-${index}`]
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Work Schedule</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Set your availability</p>
        </div>
        <Button
          size="sm"
          disabled={hasErrors}
          className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Error Summary */}
      {hasErrors && (
        <Card className="p-3 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-700 dark:text-red-300">Please fix the time slot conflicts before saving</p>
          </div>
        </Card>
      )}

      {/* Compact Schedule Grid */}
      <div className="grid gap-3">
        {days.map(({ key, label, short }) => {
          const daySchedule = schedule[key as keyof WeekSchedule]
          return (
            <Card key={key} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-semibold text-violet-700">{short}</span>
                  </div>
                  <div>
                    <Label htmlFor={`${key}-toggle`} className="text-sm font-medium cursor-pointer">
                      {label}
                    </Label>
                    {daySchedule.enabled && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {daySchedule.slots.length} slot{daySchedule.slots.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {daySchedule.enabled && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs px-2 py-1"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      On
                    </Badge>
                  )}
                  <Switch
                    id={`${key}-toggle`}
                    checked={daySchedule.enabled}
                    onCheckedChange={() => toggleDay(key as keyof WeekSchedule)}
                    size="sm"
                  />
                </div>
              </div>

              {daySchedule.enabled && (
                <div className="space-y-2">
                  {daySchedule.slots.map((slot, index) => {
                    const slotError = getSlotError(key, index)
                    return (
                      <div key={index} className="space-y-1">
                        <div
                          className={`flex items-center space-x-2 p-3 rounded-lg border ${
                            slotError
                              ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                              : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <Clock
                            className={`h-4 w-4 flex-shrink-0 ${slotError ? "text-red-500" : "text-violet-500"}`}
                          />
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) =>
                                updateTimeSlot(key as keyof WeekSchedule, index, "start", e.target.value)
                              }
                              className={`px-2 py-1 border rounded text-xs bg-white dark:bg-gray-900 focus:ring-1 focus:border-violet-500 w-20 ${
                                slotError
                                  ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-violet-500"
                              }`}
                            />
                            <span className="text-xs text-gray-400">—</span>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateTimeSlot(key as keyof WeekSchedule, index, "end", e.target.value)}
                              className={`px-2 py-1 border rounded text-xs bg-white dark:bg-gray-900 focus:ring-1 focus:border-violet-500 w-20 ${
                                slotError
                                  ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-violet-500"
                              }`}
                            />
                            <div
                              className={`text-xs font-medium ${slotError ? "text-red-600 dark:text-red-400" : "text-violet-600 dark:text-violet-400"}`}
                            >
                              {(() => {
                                const start = new Date(`2000-01-01T${slot.start}`)
                                const end = new Date(`2000-01-01T${slot.end}`)
                                const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                                return `${diff > 0 ? diff : 0}h`
                              })()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {daySchedule.slots.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeSlot(key as keyof WeekSchedule, index)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        {slotError && (
                          <p className="text-xs text-red-600 dark:text-red-400 ml-6 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {slotError}
                          </p>
                        )}
                      </div>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(key as keyof WeekSchedule)}
                    className="w-full h-8 text-xs text-violet-600 border-violet-200 hover:bg-violet-50 dark:text-violet-400 dark:border-violet-800 dark:hover:bg-violet-900/20"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Time Slot
                  </Button>
                </div>
              )}

              {!daySchedule.enabled && (
                <div className="text-center py-3">
                  <div className="text-xs text-gray-400 dark:text-gray-500">Not available</div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Compact Tips */}
      <Card className="p-4 bg-violet-50 border-violet-200">
        <div className="flex items-start space-x-2">
          <Calendar className="h-4 w-4 text-violet-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-violet-800 mb-1">Quick Tips</h3>
            <ul className="text-xs text-violet-700 space-y-0.5">
              <li>• Time slots cannot overlap with each other</li>
              <li>• End time must be after start time</li>
              <li>• New slots will automatically find available times</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
