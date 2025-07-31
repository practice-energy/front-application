"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type {Interval, Restriction} from "@/types/calendar-event"
import { User, Video, } from "lucide-react"
import { useState, useEffect } from "react"
import {Format} from "@/types/common";
import {IconPractice} from "@/components/icons/icon-practice";
import {BurnEntityButton} from "@/components/burn-entity-button";
import {AddEntityButton} from "@/components/add-entity-button";
import {SaveEntityButton} from "@/components/save-entity-button";

interface RestrictionItemProps {
  restriction: Restriction
  onUpdate: (restriction: Restriction) => void
  showDate?: boolean
  date?: string
  isEditMode: boolean
  onEditToggle: () => void
  onDelete?: () => void
}

export function RestrictionItem({
                                  restriction,
                                  onUpdate,
                                  showDate,
                                  date,
                                  isEditMode,
                                  onEditToggle,
                                  onDelete
                                }: RestrictionItemProps) {
  const [editedIntervals, setEditedIntervals] = useState<Interval[]>(restriction.intervals)
  const [editedFormats, setEditedFormats] = useState<Format[][]>(restriction.intervals.map(interval => interval.formats || []))

  useEffect(() => {
    if (restriction.intervals.length === 0) {
      addInterval()
    }

    if (!isEditMode) {
      setEditedIntervals(restriction.intervals)
      setEditedFormats(restriction.intervals.map(interval => interval.formats || []))
    }
  }, [restriction, isEditMode])

  const handleSave = () => {
    const updatedRestriction = {
      ...restriction,
      intervals: editedIntervals.map((interval, i) => ({
        ...interval,
        formats: editedFormats[i] || []
      }))
    }
    onUpdate(updatedRestriction)
  }

  const handleTimeChange = (intervalIndex: number, field: 'start' | 'end', value: string) => {
    const newIntervals = [...editedIntervals]
    newIntervals[intervalIndex] = {
      ...newIntervals[intervalIndex],
      [field]: value
    }
    setEditedIntervals(newIntervals)
  }

  const toggleFormat = (intervalIndex: number, format: Format) => {
    const newFormats = [...editedFormats]
    const currentFormats = newFormats[intervalIndex] || []

    if (currentFormats.includes(format)) {
      newFormats[intervalIndex] = currentFormats.filter(f => f !== format)
    } else if (currentFormats.length < 2) {
      newFormats[intervalIndex] = [...currentFormats, format]
    }

    setEditedFormats(newFormats)
  }

  const addInterval = () => {
    if (editedIntervals.length < 3) {
      setEditedIntervals([...editedIntervals, { start: '09:00', end: '17:00', formats: [] }])
      setEditedFormats([...editedFormats, []])
    }
  }

  const removeInterval = (index: number) => {
    if (editedIntervals.length > 1) {
      const newIntervals = [...editedIntervals]
      const newFormats = [...editedFormats]
      newIntervals.splice(index, 1)
      newFormats.splice(index, 1)
      setEditedIntervals(newIntervals)
      setEditedFormats(newFormats)
    }
  }

  const renderTimeDisplay = (time: string) => (
      <span className="text-sm font-medium">{time}</span>
  )

  const renderTimeInput = (value: string, onChange: (val: string) => void) => (
      <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
    appearance-none text-sm border rounded-sm
    hover:border-gray-100 active:border-gray-100 active:ring-0
    focus:outline-none focus:ring-0
    focus:border-violet-600 px-2 w-[60px]
    /* Полное сброс браузерных стилей */
    [&::-webkit-calendar-picker-indicator]:hidden
    [&::-webkit-clear-button]:hidden
    [&::-webkit-inner-spin-button]:hidden
    [&::-webkit-datetime-edit-ampm-field]:hidden
    [&::-webkit-datetime-edit-hour-field]:appearance-none
    [&::-webkit-datetime-edit-minute-field]:appearance-none
  "
      />
  )

  return (
      <>
        {showDate && date && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">{date}</div>
         </div>)}
        <div className="space-y-2 flex flex-row gap-2">
          <Card className="p-4 w-full">
            <CardContent className="p-0">
              <div className="space-y-4">
                {/* Intervals row */}
                <div className="flex items-start gap-6">
                  {isEditMode ? (
                      <>
                        {editedIntervals.map((interval, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                              <div className="flex flex-col items-center gap-1">
                                {renderTimeInput(interval.start, (val) => handleTimeChange(i, 'start', val))}
                                <div className="w-8 h-px bg-gray-300"></div>
                                {renderTimeInput(interval.end, (val) => handleTimeChange(i, 'end', val))}
                              </div>
                            </div>
                        ))}
                      </>
                  ) : (
                      <>
                        {restriction.intervals.map((interval, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                              <div className="flex flex-col items-center gap-1">
                                {renderTimeDisplay(interval.start)}
                                <div className="w-8 h-px bg-gray-300"></div>
                                {renderTimeDisplay(interval.end)}
                              </div>
                            </div>
                        ))}
                      </>
                  )}

                  {!isEditMode && restriction.intervals.length > 1 && (
                      <div className="self-center">
                        <IconPractice width={24} height={24}/>
                      </div>
                  )}
                </div>

                {/* Formats row */}
                <div className="flex items-center gap-6">
                  {(isEditMode ? editedIntervals : restriction.intervals).map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                          <Button
                              variant={(
                                  isEditMode
                                      ? editedFormats[i]?.includes('video')
                                          ? 'default'
                                          : 'outline'
                                      : restriction.intervals[i].formats?.includes('video')
                                          ? 'default'
                                          : 'outline'
                              )}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={isEditMode ? () => toggleFormat(i, 'video') : undefined}
                              disabled={!isEditMode}
                          >
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button
                              variant={(
                                  isEditMode
                                      ? editedFormats[i]?.includes('in-person')
                                          ? 'default'
                                          : 'outline'
                                      : restriction.intervals[i].formats?.includes('in-person')
                                          ? 'default'
                                          : 'outline'
                              )}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={isEditMode ? () => toggleFormat(i, 'in-person') : undefined}
                              disabled={!isEditMode}
                          >
                            <User className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {isEditMode && (
              <div className="flex flex-col justify-between gap-2 my-6">
                <BurnEntityButton onClick={
                  (e) => {
                    removeInterval(restriction.intervals.length - 1)
                  }}
                />
                {editedIntervals.length < 3 && (<AddEntityButton onClick={addInterval}/>)}
                <SaveEntityButton onClick={handleSave}/>
              </div>
          )}
        </div>
      </>
  )
}