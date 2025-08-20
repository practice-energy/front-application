"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import type { CalendarRestrictions, Restriction } from "@/types/calendar-event"
import { RestrictionItem } from "../restriction-item"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { EditEntityButton } from "@/components/edit-entity-button"
import { RepeatEntityButton } from "@/components/repeat-entity-button"
import { BurnEntityButton } from "@/components/burn-entity-button"

interface PeriodsFormatsSectionProps {
  restrictions: CalendarRestrictions
  onUpdate: (restrictions: CalendarRestrictions) => void
  editingRestrictionId: string | null
  setEditingRestrictionId: (id: string | null) => void
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

export function PeriodsFormatsSection({
  restrictions,
  onUpdate,
  editingRestrictionId,
  setEditingRestrictionId,
}: PeriodsFormatsSectionProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>("Mon")
  const [showPeriodsFormats, setShowPeriodsFormats] = useState(true)
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

  return (
    <div>
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
                      className={`w-[24px] h-[24px] p-0 border-none ${isActive ? "bg-teal-400 hover:bg-teal-500" : "bg-neutral-300 hover:bg-neutral-400"}`}
                      onClick={() => handleDayToggle(day.key)}
                      disabled={editingRestrictionId !== null}
                    >
                      {isDaySettedUp(day.key) && <Check className="w-2 h-2 bg-none rounded-sm text-white" />}
                    </Button>
                    <button
                      className={cn(
                        "text-xs px-1.5 py-1 items-center rounded-sm w-7 h-7 aspect-square",
                        isMobile || editingRestrictionId !== null ? "" : "hover:bg-violet-50",
                        isSelected && "border border-colors-custom-accent",
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
                    <RepeatEntityButton onClick={repeatSettingsToAllActive} className="w-8 h-8" iconClassName="w-6 h-6" />
                    <EditEntityButton
                      onClick={() =>
                        startEditing(restrictions.commons[selectedDay as keyof typeof restrictions.commons])
                      }
                      className="w-8 h-8" iconClassName="w-6 h-6"
                    />
                    <BurnEntityButton onClick={burnDaySettings} className="w-8 h-8" iconClassName="w-6 h-6" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
