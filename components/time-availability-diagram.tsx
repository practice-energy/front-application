"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"
import { mockExistingBookings, type ExistingBooking } from "@/utils/availability"

interface TimeAvailabilityDiagramProps {
  selectedDate: string | Date
  existingBookings?: ExistingBooking[]
}

export function TimeAvailabilityDiagram({
  selectedDate,
  existingBookings: propBookings,
}: TimeAvailabilityDiagramProps) {
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([])

  // Convert selectedDate to Date object if it's a string
  const dateObj = typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate

  useEffect(() => {
    if (propBookings) {
      setExistingBookings(propBookings)
    } else {
      const dateString = typeof selectedDate === "string" ? selectedDate : selectedDate.toISOString().split("T")[0]

      const dayBookings = mockExistingBookings.filter(
        (booking) => booking.date === dateString && booking.status !== "cancelled",
      )
      setExistingBookings(dayBookings)
    }
  }, [selectedDate, propBookings])

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-foreground flex items-center">
        <Clock className="h-4 w-4 mr-2 text-amber-600" />
        Availability on{" "}
        {dateObj.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Label>

      <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-sm">
        <div className="space-y-6">
          {/* Time Scale Header */}
          <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
            <span>9 AM</span>
            <span>11 AM</span>
            <span>1 PM</span>
            <span>3 PM</span>
            <span>5 PM</span>
          </div>

          {/* Visual Timeline */}
          <div className="relative">
            {/* Background Timeline */}
            <div className="h-8 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-md border border-gray-200 dark:border-gray-600 shadow-inner">
              {/* Hour Markers */}
              <div className="absolute inset-0 flex">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 border-r border-gray-200 dark:border-gray-600 last:border-r-0 relative"
                  >
                    <div className="absolute top-1/2 right-0 w-px h-4 bg-gray-300 dark:bg-gray-500 transform -translate-y-1/2"></div>
                  </div>
                ))}
              </div>

              {/* Available Time Background */}
              <div className="absolute inset-1 bg-gradient-to-r from-purple-200 via-pink-100 to-purple-200 dark:from-purple-800 dark:via-pink-700 dark:to-purple-800 rounded-md opacity-60"></div>

              {/* Existing Bookings */}
              {existingBookings.map((booking, index) => {
                const startHour = Number.parseInt(booking.startTime.split(":")[0])
                const startMinute = Number.parseInt(booking.startTime.split(":")[1])
                const endHour = Number.parseInt(booking.endTime.split(":")[0])
                const endMinute = Number.parseInt(booking.endTime.split(":")[1])

                const startPercent = (((startHour - 9) * 60 + startMinute) / (9 * 60)) * 100
                const duration = (endHour - startHour) * 60 + (endMinute - startMinute)
                const widthPercent = (duration / (9 * 60)) * 100

                return (
                  <div
                    key={index}
                    className="absolute top-1 bottom-1 bg-gradient-to-r from-orange-400 to-amber-500 dark:from-orange-600 dark:to-amber-700 rounded-md shadow-sm border border-orange-300 dark:border-orange-500"
                    style={{
                      left: `${Math.max(0.5, startPercent)}%`,
                      width: `${Math.min(99, widthPercent)}%`,
                    }}
                    title={`${booking.clientName} - ${booking.service}`}
                  />
                )
              })}

              {/* Current Time Indicator */}
              {dateObj.toDateString() === new Date().toDateString() && (
                <div
                  className="absolute inset-y-0 w-1 bg-teal-500 dark:bg-teal-400 rounded-full shadow-lg z-20 border border-teal-600 dark:border-teal-300"
                  style={{
                    left: `${Math.min(98, Math.max(1, (((new Date().getHours() - 9) * 60 + new Date().getMinutes()) / (9 * 60)) * 100))}%`,
                  }}
                >
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-teal-500 dark:bg-teal-400 rounded-full border-2 border-white dark:border-gray-900 shadow-lg"></div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-200 to-pink-100 dark:from-purple-800 dark:to-pink-700 rounded-full border border-purple-300 dark:border-purple-600"></div>
              <span className="text-gray-600 dark:text-gray-300 font-medium">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-amber-500 dark:from-orange-600 dark:to-amber-700 rounded-full border border-orange-300 dark:border-orange-500"></div>
              <span className="text-gray-600 dark:text-gray-300 font-medium">Booked</span>
            </div>
            {dateObj.toDateString() === new Date().toDateString() && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-teal-500 dark:bg-teal-400 rounded-full border border-teal-600 dark:border-teal-300"></div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Now</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
