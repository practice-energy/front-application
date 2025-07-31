"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { CalendarRestrictions, Restriction } from "@/types/calendar-event"
import { RestrictionItem } from "./restriction-item"
import { CalendarWidget } from "./calendar-widget"
import { AddEntityButton } from "@/components/add-entity-button"
import { Check, ChevronDown } from "lucide-react"
import { SettingsButton } from "@/components/calendar-settings-button"
import { cn } from "@/lib/utils"
import { EditEntityButton } from "@/components/edit-entity-button"
import { useIsMobile } from "@/hooks/use-mobile"
import { RepeatEntityButton } from "@/components/repeat-entity-button"
import { BurnEntityButton } from "@/components/burn-entity-button"
import { LocationInput } from "@/components/location-input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CalendarSettingsProps {
  restrictions: CalendarRestrictions
  onUpdate: (restrictions: CalendarRestrictions) => void
  disableSettings: () => void
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

// Список доступных часовых поясов
const timezones = [
  "GMT",
  "GMT+1",
  "GMT+2",
  "GMT+3",
  "GMT+4",
  "GMT+5",
  "GMT+6",
  "GMT+7",
  "GMT+8",
  "GMT+9",
  "GMT+10",
  "GMT+11",
  "GMT+12",
  "GMT-1",
  "GMT-2",
  "GMT-3",
  "GMT-4",
  "GMT-5",
  "GMT-6",
  "GMT-7",
  "GMT-8",
  "GMT-9",
  "GMT-10",
  "GMT-11",
  "GMT-12",
]

export function CalendarSettings({ restrictions, onUpdate, disableSettings }: CalendarSettingsProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showExceptionalSlots, setShowExceptionalSlots] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showPeriodsFormats, setShowPeriodsFormats] = useState(true)
  const [editingRestrictionId, setEditingRestrictionId] = useState<string | null>(null)
  const [repeatDatePickerId, setRepeatDatePickerId] = useState<string | null>(null)
  const isMobile = useIsMobile()

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

  const isDaySettedUp = (dayKey: string) => {
    return restrictions.commons[dayKey as keyof typeof restrictions.commons]?.intervals.length > 0
  }

  const handleDaySelect = (dayKey: string) => {
    setSelectedDay(selectedDay === dayKey ? null : dayKey)
  }

  const handleDateSelect = (date: Date) => {
    if (repeatDatePickerId) {
      // Repeat existing restriction to new date
      const sourceRestriction = restrictions.restrictions.find((r) => r.id === repeatDatePickerId)
      if (sourceRestriction) {
        const newRestriction: Restriction = {
          id: Date.now().toString(),
          date,
          isActive: sourceRestriction.isActive,
          intervals: [...sourceRestriction.intervals],
        }
        onUpdate({
          ...restrictions,
          restrictions: [...restrictions.restrictions, newRestriction],
        })
      }
      setRepeatDatePickerId(null)
    } else {
      // Create new restriction
      const newRestriction: Restriction = {
        id: Date.now().toString(),
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
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  const repeatSettingsToAllActive = () => {
    if (!selectedDay) return

    const sourceDaySettings = restrictions.commons[selectedDay as keyof typeof restrictions.commons]
    const updatedCommons = { ...restrictions.commons }

    Object.keys(updatedCommons).forEach((dayKey) => {
      const day = updatedCommons[dayKey as keyof typeof updatedCommons]
      if (day.isActive && dayKey !== selectedDay) {
        updatedCommons[dayKey as keyof typeof updatedCommons] = {
          ...day,
          intervals: [...sourceDaySettings.intervals],
        }
      }
    })

    onUpdate({
      ...restrictions,
      commons: updatedCommons,
    })
  }

  const burnDaySettings = () => {
    if (!selectedDay) return

    const updatedCommons = {
      ...restrictions.commons,
      [selectedDay]: {
        isActive: false,
        intervals: [],
      },
    }

    onUpdate({
      ...restrictions,
      commons: updatedCommons,
    })
  }

  const handleRestrictionUpdate = (updatedRestriction: Restriction) => {
    if (updatedRestriction.id) {
      // Update exceptional restriction
      const updatedRestrictions = restrictions.restrictions.map((r) =>
        r.id === updatedRestriction.id ? updatedRestriction : r,
      )
      onUpdate({
        ...restrictions,
        restrictions: updatedRestrictions,
      })
    } else {
      // Update common day restriction
      if (!selectedDay) return
      onUpdate({
        ...restrictions,
        commons: {
          ...restrictions.commons,
          [selectedDay]: updatedRestriction,
        },
      })
    }
    setEditingRestrictionId(null)
  }

  const startEditing = (restriction: Restriction) => {
    setEditingRestrictionId(restriction.id || selectedDay)
  }

  const cancelEditing = () => {
    setEditingRestrictionId(null)
  }

  const deleteRestriction = (id: string) => {
    onUpdate({
      ...restrictions,
      restrictions: restrictions.restrictions.filter((r) => r.id !== id),
    })
  }

  const startRepeatForRestriction = (id: string) => {
    setRepeatDatePickerId(id)
    if (!showExceptionalSlots) {
      setShowExceptionalSlots(true)
    }
  }

  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleTimezoneSelect = (timezone: string) => {
    onUpdate({
      ...restrictions,
      gmt: timezone,
    })
    setShowTimezoneDropdown(false)
  }

  const handleLocationSelect = (location: string) => {
    onUpdate({
      ...restrictions,
      location: location,
    })
    setShowTimezoneDropdown(false)
  }

  // Закрываем dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTimezoneDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-white rounded-sm">
      <div className="flex flex-row items-center gap-3 ml-6 py-4">
        <SettingsButton
          onClick={disableSettings}
          className="bg-violet-600 hover:bg-violet-700 border-0 flex"
          iconClassName="text-white"
        />
        <div className={cn(
            "font-bold",
            isMobile ? "text-mobilebase": "text-base"
        )}>Установки календаря</div>
      </div>
      <ScrollArea className="flex-1 flex h-screen">
        <div
            className={cn(
                "sticky top-[-1px] left-0 right-0 h-2 bg-gradient-to-b to-transparent pointer-events-none z-50",
                "from-white via-white/80 to-transparent",
            )}
        />

        <div className="space-y-6 p-4">
          <div className="flex items-center justify-start">
            <div className="font-semibold justify-start text-neutral-900">Часовой пояс</div>
          </div>

          <LocationInput value={restrictions.location || ""} onChange={handleLocationSelect} />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded-sm hover:bg-gray-50 w-full h-10"
            >
              <span>{restrictions.gmt || "GMT+3"}</span>
              <ChevronDown
                className={`w-4 h-4 ml-auto transition-transform ${showTimezoneDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showTimezoneDropdown && (
              <div className="absolute right-0 z-10 mt-1 w-32 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg">
                {timezones.map((tz) => (
                  <div
                    key={tz}
                    onClick={() => handleTimezoneSelect(tz)}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      restrictions.gmt === tz ? "bg-violet-50 text-violet-600" : ""
                    }`}
                  >
                    {tz}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Periods and Formats Section */}
          <div className="space-y-4">
            <div>
              <button
                className={cn(
                  "flex items-center w-full py-3 group transition-all duration-100 ease-in-out gap-3 text-simple text-neutral-900 opacity-80",
                  "rounded-sm items-center",
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPeriodsFormats(!showPeriodsFormats)
                }}
              >
                <div className="flex flex-row items-center justify-between w-full ">
                  <div className="font-semibold justify-start">Периоды и форматы</div>
                  <ChevronDown
                    className={cn(
                      "w-6 h-6 text-gray-400 transition-all duration-200 ease-in-out transform ml-auto",
                      "group-hover:text-gray-600",
                      showPeriodsFormats ? "rotate-180" : "rotate-0",
                    )}
                  />
                </div>
              </button>
            </div>

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
                        <div className="flex flex-col gap-2 items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`w-[18px] h-[18px] p-0 border-none ${isActive ? "bg-teal-400 hover:bg-teal-500" : "bg-neutral-300 hover:bg-neutral-400"}`}
                            onClick={() => handleDayToggle(day.key)}
                            disabled={editingRestrictionId !== null}
                          >
                            {isDaySettedUp(day.key) && <Check className="w-2 h-2 bg-none rounded-sm text-white" />}
                          </Button>
                          <button
                            className={cn(
                              "text-xs px-1.5 py-1 items-center rounded-sm w-7 h-7 aspect-square",
                              isMobile || editingRestrictionId !== null ? "" : "hover:bg-violet-50",
                              isSelected && "border border-violet-600",
                            )}
                            onClick={() => handleDaySelect(day.key)}
                            disabled={editingRestrictionId !== null}
                          >
                            {day.label}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Selected day settings */}
                {selectedDay && (
                  <div className="mt-4">
                    <RestrictionItem
                      restriction={restrictions.commons[selectedDay as keyof typeof restrictions.commons]}
                      onUpdate={handleRestrictionUpdate}
                      isEditMode={editingRestrictionId === selectedDay}
                      onEditToggle={() => {
                        if (editingRestrictionId === selectedDay) {
                          cancelEditing()
                        } else {
                          startEditing(restrictions.commons[selectedDay as keyof typeof restrictions.commons])
                        }
                      }}
                    />

                    {editingRestrictionId !== selectedDay && (
                      <div className="mt-4 flex items-center gap-6 mr-2">
                        <span className="text-sm text-gray-600">Повторить для всех активных</span>
                        <div className="flex gap-6">
                          <RepeatEntityButton onClick={repeatSettingsToAllActive} />
                          <EditEntityButton
                            onClick={() =>
                              startEditing(restrictions.commons[selectedDay as keyof typeof restrictions.commons])
                            }
                          />
                          <BurnEntityButton onClick={burnDaySettings} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Exceptional Slots Section */}
          <div className="space-y-4">
            <div>
              <button
                className={cn(
                  "flex items-center w-full py-3 group transition-all duration-100 ease-in-out gap-3 text-simple text-neutral-900 opacity-80",
                  "rounded-sm items-center",
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowExceptionalSlots(!showExceptionalSlots)
                }}
              >
                <div className="flex flex-row items-center justify-between w-full ">
                  <div className="font-semibold justify-start">Исключительные слоты</div>
                  <ChevronDown
                    className={cn(
                      "w-6 h-6 text-gray-400 transition-all duration-200 ease-in-out transform ml-auto",
                      "group-hover:text-gray-600",
                      showExceptionalSlots ? "rotate-180" : "rotate-0",
                    )}
                  />
                </div>
              </button>
              {editingRestrictionId === null && !showDatePicker && !repeatDatePickerId && (
                <AddEntityButton
                  onClick={() => {
                    setShowDatePicker(true)
                    if (!showExceptionalSlots) {
                      setShowExceptionalSlots(true)
                    }
                  }}
                />
              )}
            </div>

            {showExceptionalSlots && (
              <div className="space-y-4">
                {showDatePicker && (
                  <div>
                    <CalendarWidget selectedDate={new Date()} onDateSelect={handleDateSelect} isCollapsible={true} />
                  </div>
                )}

                {/* Exceptional restrictions */}
                <div className="space-y-4">
                  {restrictions.restrictions.map((restriction) => (
                    <div key={restriction.id} className="space-y-2">
                      <RestrictionItem
                        restriction={restriction}
                        onUpdate={handleRestrictionUpdate}
                        showDate={true}
                        date={restriction.date ? formatDate(restriction.date) : undefined}
                        isEditMode={editingRestrictionId === restriction.id}
                        onEditToggle={() => {
                          if (editingRestrictionId === restriction.id) {
                            cancelEditing()
                          } else {
                            startEditing(restriction)
                          }
                        }}
                        onDelete={() => deleteRestriction(restriction.id!)}
                      />
                      {editingRestrictionId !== restriction.id && (
                        <div className="flex items-center gap-2 mr-2 justify-between">
                          <span className="text-sm text-gray-600">Повторить для другой даты</span>
                          <div className="flex gap-6 ml-auto">
                            <RepeatEntityButton onClick={() => startRepeatForRestriction(restriction.id!)} />
                            <EditEntityButton onClick={() => startEditing(restriction)} />
                            <BurnEntityButton onClick={() => deleteRestriction(restriction.id!)} />
                          </div>
                        </div>
                      )}
                      {repeatDatePickerId === restriction.id && (
                        <div className="mt-4">
                          <CalendarWidget
                            selectedDate={restriction.date!}
                            onDateSelect={handleDateSelect}
                            isCollapsible={true}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center h-24"/>
      </ScrollArea>
    </div>
  )
}
