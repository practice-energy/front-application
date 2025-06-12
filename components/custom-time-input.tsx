"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { isTimeSlotAvailable, getSessionDurationMinutes } from "@/utils/availability"

interface Service {
  name: string
  duration: string
  price: number
}

interface CustomTimeInputProps {
  selectedTime: string
  onTimeSelect: (time: string) => void
  selectedService: Service
  onValidationChange: (validation: { available: boolean; reason?: string } | null) => void
  selectedDate: Date
}

export function CustomTimeInput({
  selectedTime,
  onTimeSelect,
  selectedService,
  onValidationChange,
  selectedDate,
}: CustomTimeInputProps) {
  useEffect(() => {
    if (selectedDate && selectedTime && selectedService) {
      const dateString = selectedDate.toISOString().split("T")[0]
      const sessionDuration = getSessionDurationMinutes(selectedService.duration)
      const validation = isTimeSlotAvailable(dateString, selectedTime, sessionDuration)
      onValidationChange(validation)
    } else {
      onValidationChange(null)
    }
  }, [selectedDate, selectedTime, selectedService, onValidationChange])

  const timeValidation =
    selectedDate && selectedTime && selectedService
      ? isTimeSlotAvailable(
          selectedDate.toISOString().split("T")[0],
          selectedTime,
          getSessionDurationMinutes(selectedService.duration),
        )
      : null

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-foreground">Enter your preferred time</Label>

      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="time-input" className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2 block">
                Session Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-600 dark:text-amber-400" />
                <Input
                  id="time-input"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => onTimeSelect(e.target.value)}
                  min="09:00"
                  max="18:00"
                  className="pl-10 h-14 text-xl font-semibold border-2 border-amber-200 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-200"
                  placeholder="Select time"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-amber-200 dark:border-amber-700 min-w-[120px]">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mb-1" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Duration</span>
              <span className="text-lg font-bold text-amber-900 dark:text-amber-100">{selectedService.duration}</span>
            </div>
          </div>

          {timeValidation && (
            <div
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                timeValidation.available
                  ? "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
                  : "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700"
              }`}
            >
              {timeValidation.available ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
              <span
                className={`font-medium ${
                  timeValidation.available ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                }`}
              >
                {timeValidation.available ? "✓ Time slot is available" : timeValidation.reason}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
