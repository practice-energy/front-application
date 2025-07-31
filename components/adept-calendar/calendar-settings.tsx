"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { CalendarRestirctions, Restriction } from "@/types/calendar-event"
import { RestrictionItem } from "./restriction-item"
import { CalendarWidget } from "./calendar-widget"
import { AddEntityButton } from "@/components/add-entity-button"
import {Check, ChevronDown, ChevronUp} from "lucide-react"
import {SettingsButton} from "@/components/calendar-settings-button";
import {cn} from "@/lib/utils";
import {EditEntityButton} from "@/components/edit-entity-button";
import {useIsMobile} from "@/hooks/use-mobile";
import {RepeatEntityButton} from "@/components/repeat-entity-button";
import {BurnEntityButton} from "@/components/burn-entity-button";
import {ScrollArea} from "@/components/ui/scroll-area";

interface CalendarSettingsProps {
  restrictions: CalendarRestirctions
  onUpdate: (restrictions: CalendarRestirctions) => void
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

export function CalendarSettings({ restrictions, onUpdate, disableSettings }: CalendarSettingsProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>("Tue")
  const [showExceptionalSlots, setShowExceptionalSlots] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showPeriodsFormats, setShowPeriodsFormats] = useState(true)
  const [editingRestrictionId, setEditingRestrictionId] = useState<string | null>(null)
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
    const newRestriction: Restriction = {
      id: Date.now().toString(), // Add unique ID
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

  const repeatSettingsToAllActive = () => {
    if (!selectedDay) return

    const sourceDaySettings = restrictions.commons[selectedDay as keyof typeof restrictions.commons]
    const updatedCommons = { ...restrictions.commons }

    Object.keys(updatedCommons).forEach(dayKey => {
      const day = updatedCommons[dayKey as keyof typeof updatedCommons]
      if (day.isActive && dayKey !== selectedDay) {
        updatedCommons[dayKey as keyof typeof updatedCommons] = {
          ...day,
          intervals: [...sourceDaySettings.intervals]
        }
      }
    })

    onUpdate({
      ...restrictions,
      commons: updatedCommons
    })
  }

  const burnDaySettings = () => {
    if (!selectedDay) return

    const updatedCommons = {
      ...restrictions.commons,
      [selectedDay]: {
        isActive: false,
        intervals: []
      }
    }

    onUpdate({
      ...restrictions,
      commons: updatedCommons
    })
  }

  const handleRestrictionUpdate = (updatedRestriction: Restriction) => {
    if (updatedRestriction.id) {
      // Update exceptional restriction
      const updatedRestrictions = restrictions.restrictions.map(r =>
          r.id === updatedRestriction.id ? updatedRestriction : r
      )
      onUpdate({
        ...restrictions,
        restrictions: updatedRestrictions
      })
    } else {
      // Update common day restriction
      if (!selectedDay) return
      onUpdate({
        ...restrictions,
        commons: {
          ...restrictions.commons,
          [selectedDay]: updatedRestriction
        }
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
      restrictions: restrictions.restrictions.filter(r => r.id !== id)
    })
  }

  return (
      <ScrollArea className="space-y-6 overflow-y-auto">
        <div className="flex flex-row items-center gap-2 ml-6">
          <SettingsButton onClick={disableSettings} className="bg-violet-600 hover:bg-violet-700" iconClassName="text-white"/>
          <div>Установки календаря</div>
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
                              {isDaySettedUp(day.key) && <Check className="w-2 h-2 bg-none rounded-sm text-white"/>}
                            </Button>
                            <button
                                className={cn(
                                    "text-xs px-1.5 py-1 items-center rounded-sm w-7 h-7 aspect-square",
                                    isMobile || editingRestrictionId !== null ? "" : "hover:bg-violet-50" ,
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
                          <div className="mt-4 flex items-center gap-2 mr-2">
                            <span className="text-sm text-gray-600">Повторить для всех активных</span>
                            <div className="flex gap-6">
                              <RepeatEntityButton onClick={repeatSettingsToAllActive}/>
                              <EditEntityButton onClick={() => startEditing(restrictions.commons[selectedDay as keyof typeof restrictions.commons])}/>
                              <BurnEntityButton onClick={burnDaySettings}/>
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
            {editingRestrictionId === null && (<AddEntityButton onClick={() => {
              setShowDatePicker(true)
              if (!showExceptionalSlots) {
                setShowExceptionalSlots(true)
              }
            }}
            />)}
          </div>

          {showExceptionalSlots && (
              <div className="space-y-4">
                {showDatePicker && (
                    <div>
                      <CalendarWidget selectedDate={new Date()} onDateSelect={handleDateSelect} />
                    </div>
                )}

                {/* Exceptional restrictions */}
                <div className="space-y-4">
                  {restrictions.restrictions.map((restriction) => (
                      <RestrictionItem
                          key={restriction.id}
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
                  ))}
                </div>
              </div>
          )}
        </div>
      </ScrollArea>
  )
}