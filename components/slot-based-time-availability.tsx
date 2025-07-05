"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockExistingBookings, type ExistingBooking } from "@/utils/availability"

interface SlotBasedTimeAvailabilityProps {
  selectedDate: string | Date
  selectedService: any
  specialist: any
  onTimeSelect: (time: string) => void
  selectedTime: string | null
  onBooking?: () => void
}

interface TimeSlot {
  time: string
  isBooked: boolean
  isSelected: boolean
  isPartOfSelection: boolean
  canSelect: boolean
}

const SlotBasedTimeAvailability = memo(
  ({
    selectedDate,
    selectedService,
    specialist,
    onTimeSelect,
    selectedTime,
    onBooking,
  }: SlotBasedTimeAvailabilityProps) => {
    const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([])

    const dateObj = typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate
    const dateString = useMemo(
      () => (typeof selectedDate === "string" ? selectedDate : selectedDate.toISOString().split("T")[0]),
      [selectedDate],
    )

    // Memoize service duration calculations
    const serviceDurationMinutes = useMemo(
      () => (selectedService ? Number.parseInt(selectedService.duration.split(" ")[0]) : 0),
      [selectedService],
    )

    const slotsNeeded = useMemo(() => Math.ceil(serviceDurationMinutes / 60), [serviceDurationMinutes])

    // Fetch bookings only when date changes
    useEffect(() => {
      const dayBookings = mockExistingBookings.filter(
        (booking) => booking.date === dateString && booking.status !== "cancelled",
      )
      setExistingBookings(dayBookings)
    }, [dateString])

    // Memoize time slot generation
    const baseTimeSlots = useMemo(() => {
      const slots: Omit<TimeSlot, "isSelected" | "isPartOfSelection" | "canSelect">[] = []
      const workStart = specialist.workHours.start
      const workEnd = specialist.workHours.end

      // Generate 1-hour slots
      for (let hour = workStart; hour < workEnd; hour++) {
        const timeString = `${hour.toString().padStart(2, "0")}:00`

        // Check if this slot is booked
        const isBooked = existingBookings.some((booking) => {
          const [slotHour] = timeString.split(":").map(Number)
          const slotMinutes = slotHour * 60

          const [startHour, startMinute] = booking.startTime.split(":").map(Number)
          const [endHour, endMinute] = booking.endTime.split(":").map(Number)

          const startMinutes = startHour * 60 + startMinute
          const endMinutes = endHour * 60 + endMinute

          return slotMinutes >= startMinutes && slotMinutes < endMinutes
        })

        slots.push({
          time: timeString,
          isBooked,
        })
      }

      return slots
    }, [specialist.workHours, existingBookings])

    // Memoize slot availability calculations
    const timeSlots = useMemo(() => {
      return baseTimeSlots.map((slot) => {
        const [slotHour] = slot.time.split(":").map(Number)
        const slotMinutes = slotHour * 60

        // Check if this slot is selected or part of selection
        const isSelected = selectedTime === slot.time
        let isPartOfSelection = false

        if (selectedTime && selectedService) {
          const [selectedHour] = selectedTime.split(":").map(Number)
          const selectedMinutes = selectedHour * 60
          isPartOfSelection = slotMinutes >= selectedMinutes && slotMinutes < selectedMinutes + slotsNeeded * 60
        }

        // Check if this slot can be selected
        let canSelect = false
        if (selectedService && !slot.isBooked) {
          // Check if we have enough consecutive available slots
          canSelect = true
          for (let i = 0; i < slotsNeeded; i++) {
            const checkMinutes = slotMinutes + i * 60
            const checkHour = Math.floor(checkMinutes / 60)

            // Check if it's within work hours
            if (checkHour >= specialist.workHours.end) {
              canSelect = false
              break
            }

            // Check if this slot exists and is not booked
            const checkTime = `${checkHour.toString().padStart(2, "0")}:00`
            const checkSlot = baseTimeSlots.find((s) => s.time === checkTime)
            if (!checkSlot || checkSlot.isBooked) {
              canSelect = false
              break
            }
          }
        }

        return {
          ...slot,
          isSelected,
          isPartOfSelection,
          canSelect,
        }
      })
    }, [baseTimeSlots, selectedTime, selectedService, slotsNeeded, specialist.workHours])

    // Optimize slot click handler
    const handleSlotClick = useCallback(
      (slotTime: string) => {
        const slot = timeSlots.find((s) => s.time === slotTime)
        if (slot?.canSelect) {
          onTimeSelect(slotTime)
        }
      },
      [timeSlots, onTimeSelect],
    )

    // Memoize format time function
    const formatTimeLabel = useCallback((time: string) => {
      const [hours, minutes] = time.split(":")
      const hour = Number.parseInt(hours)
      const ampm = hour >= 12 ? "PM" : "AM"
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    }, [])

    return (
      <div className="space-y-4">
        <Card className="p-6 bg-white border border-gray-200 shadow-sm rounded-sm h-[400px] flex flex-col">
          <div className="space-y-4">
            {/* Time slots grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => handleSlotClick(slot.time)}
                  disabled={slot.isBooked || !slot.canSelect}
                  className={`py-4 px-3 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center justify-center whitespace-nowrap ${
                    slot.isBooked
                      ? "bg-violet-600 text-white cursor-not-allowed"
                      : slot.isSelected || slot.isPartOfSelection
                        ? "bg-violet-500 text-white"
                        : slot.canSelect
                          ? "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                          : "bg-gray-100 cursor-not-allowed"
                  }`}
                  title={`${formatTimeLabel(slot.time)} - ${slot.isBooked ? "Booked" : "Available"}`}
                >
                  <span className="text-sm font-medium">{formatTimeLabel(slot.time)}</span>
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded-md"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-violet-600 rounded-md"></div>
                <span className="text-gray-600">Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-violet-500 rounded-md"></div>
                <span className="text-gray-600">Selected</span>
              </div>
            </div>

            {/* Selected time display */}
            {selectedTime && selectedService && (
              <div className="mt-4 p-3 bg-violet-50 border border-violet-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Selected Time:</p>
                    <p className="font-medium">
                      {formatTimeLabel(selectedTime)} - Duration: {selectedService.duration}
                    </p>
                  </div>
                  {onBooking && (
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={onBooking}>
                      Book Now
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    )
  },
)

SlotBasedTimeAvailability.displayName = "SlotBasedTimeAvailability"

export { SlotBasedTimeAvailability }
