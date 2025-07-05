"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"
import { mockExistingBookings, type ExistingBooking } from "@/utils/availability"

interface InteractiveTimeAvailabilityProps {
  selectedDate: string | Date
  selectedService: any
  onTimeSelect: (time: string) => void
  selectedTime: string | null
}

export function InteractiveTimeAvailability({
  selectedDate,
  selectedService,
  onTimeSelect,
  selectedTime,
}: InteractiveTimeAvailabilityProps) {
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  const dateObj = typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate

  useEffect(() => {
    const dateString = typeof selectedDate === "string" ? selectedDate : selectedDate.toISOString().split("T")[0]

    const dayBookings = mockExistingBookings.filter(
      (booking) => booking.date === dateString && booking.status !== "cancelled",
    )
    setExistingBookings(dayBookings)

    // Generate available time slots (every 30 minutes from 9 AM to 6 PM)
    const slots = []
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(timeString)
      }
    }
    setAvailableSlots(slots)
  }, [selectedDate])

  const isTimeSlotBooked = (time: string) => {
    return existingBookings.some((booking) => {
      const bookingStart = booking.startTime
      const bookingEnd = booking.endTime
      return time >= bookingStart && time < bookingEnd
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-foreground flex items-center">
        <Clock className="h-4 w-4 mr-2 text-violet-600" />
        Select time on{" "}
        {dateObj.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Label>

      <Card className="p-6 bg-white border border-gray-200 shadow-sm rounded-sm">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {availableSlots.map((time) => {
            const isBooked = isTimeSlotBooked(time)
            const isSelected = selectedTime === time

            return (
              <button
                key={time}
                onClick={() => !isBooked && onTimeSelect(time)}
                disabled={isBooked}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-violet-600 text-white"
                    : isBooked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-50 text-gray-700 hover:bg-violet-100 hover:text-violet-700 cursor-pointer"
                }`}
              >
                {formatTime(time)}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 text-sm mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span className="text-gray-600">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-violet-600 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
