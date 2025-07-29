"use client"

import { useState } from "react"
import type { Restriction, Interval } from "@/types/calendar-event"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { X, User, Video, Clock } from "lucide-react"

interface RestrictionItemProps {
  restriction: Restriction
  onChange: (restriction: Restriction) => void
}

export function RestrictionItem({ restriction, onChange }: RestrictionItemProps) {
  const [newInterval, setNewInterval] = useState<Partial<Interval>>({})

  const addInterval = () => {
    if (newInterval.start && newInterval.end) {
      const updatedRestriction = {
        ...restriction,
        intervals: [
          ...restriction.intervals,
          {
            start: newInterval.start,
            end: newInterval.end,
            formats: [],
          } as Interval,
        ],
      }
      onChange(updatedRestriction)
      setNewInterval({})
    }
  }

  const removeInterval = (index: number) => {
    const updatedRestriction = {
      ...restriction,
      intervals: restriction.intervals.filter((_, i) => i !== index),
    }
    onChange(updatedRestriction)
  }

  const updateInterval = (index: number, field: keyof Interval, value: any) => {
    const updatedRestriction = {
      ...restriction,
      intervals: restriction.intervals.map((interval, i) => (i === index ? { ...interval, [field]: value } : interval)),
    }
    onChange(updatedRestriction)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const parseTime = (timeString: string, baseDate: Date = new Date()) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const date = new Date(baseDate)
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  return (
    <div className="space-y-4">
      {/* Existing Intervals */}
      {restriction.intervals.map((interval, index) => (
        <Card key={index} className="relative">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Input
                  type="time"
                  value={formatTime(interval.start)}
                  onChange={(e) => {
                    const newStart = parseTime(e.target.value, interval.start)
                    updateInterval(index, "start", newStart)
                  }}
                  className="w-20"
                />
                <span>—</span>
                <Input
                  type="time"
                  value={formatTime(interval.end)}
                  onChange={(e) => {
                    const newEnd = parseTime(e.target.value, interval.end)
                    updateInterval(index, "end", newEnd)
                  }}
                  className="w-20"
                />
                <div className="w-6 h-6 bg-teal-400 rounded"></div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeInterval(index)} className="h-6 w-6 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Break Time */}
            <div className="flex items-center gap-4 mb-4">
              <div className="text-sm">|</div>
              <X className="w-4 h-4" />
              <div className="text-sm">|</div>
              <X className="w-4 h-4" />
              <div className="text-sm">|</div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Input type="time" placeholder="13:00" className="w-20" />
              <Input type="time" placeholder="17:00" className="w-20" />
              <Input type="time" placeholder="00:00" className="w-20" />
            </div>

            {/* Format Icons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                <User className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Repeat for all active button */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Повторить для всех активных</span>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-teal-100">
          <div className="w-4 h-4 bg-teal-400 rounded"></div>
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-purple-100">
          <div className="w-4 h-4 bg-purple-400 rounded"></div>
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-red-100">
          <Clock className="w-4 h-4 text-red-400" />
        </Button>
      </div>
    </div>
  )
}
