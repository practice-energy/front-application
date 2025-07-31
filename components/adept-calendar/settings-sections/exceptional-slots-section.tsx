"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { CalendarRestrictions, Restriction } from "@/types/calendar-event"
import { RestrictionItem } from "../restriction-item"
import { CalendarWidget } from "../calendar-widget"
import { AddEntityButton } from "@/components/add-entity-button"
import { cn } from "@/lib/utils"
import { EditEntityButton } from "@/components/edit-entity-button"
import { RepeatEntityButton } from "@/components/repeat-entity-button"
import { BurnEntityButton } from "@/components/burn-entity-button"

interface ExceptionalSlotsSectionProps {
  restrictions: CalendarRestrictions
  onUpdate: (restrictions: CalendarRestrictions) => void
  editingRestrictionId: string | null
  setEditingRestrictionId: (id: string | null) => void
}

export function ExceptionalSlotsSection({
  restrictions,
  onUpdate,
  editingRestrictionId,
  setEditingRestrictionId,
}: ExceptionalSlotsSectionProps) {
  const [showExceptionalSlots, setShowExceptionalSlots] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [repeatDatePickerId, setRepeatDatePickerId] = useState<string | null>(null)

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
    }
    setEditingRestrictionId(null)
  }

  const startEditing = (restriction: Restriction) => {
    setEditingRestrictionId(restriction.id || null)
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

  return (
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
  )
}
