"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { TimeAvailabilityDiagram } from "@/components/time-availability-diagram"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { mockExistingBookings, type ExistingBooking } from "@/utils/availability"

interface BookingForm {
  service: string
  date: string
  time: string
  duration: string
  type: "video" | "in-person"
  location: string
  notes: string
  price: number
}

interface BookingSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  specialistName: string
  onCreateBooking: (bookingData: BookingForm) => void
}

export function BookingSessionDialog({
  open,
  onOpenChange,
  specialistName,
  onCreateBooking,
}: BookingSessionDialogProps) {
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    service: "",
    date: "",
    time: "",
    duration: "",
    type: "video",
    location: "",
    notes: "",
    price: 0,
  })

  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([])
  const [timeValidation, setTimeValidation] = useState<{ available: boolean; reason?: string } | null>(null)

  const services = [
    { value: "Consultation", duration: "30", price: 5000, color: "amber" },
    { value: "Therapy Session", duration: "60", price: 10000, color: "violet" },
    { value: "Couple Therapy", duration: "90", price: 15000, color: "sky" },
  ]

  // Update existing bookings when date changes
  useEffect(() => {
    if (bookingForm.date) {
      const dayBookings = mockExistingBookings.filter(
        (booking) => booking.date === bookingForm.date && booking.status !== "cancelled",
      )
      setExistingBookings(dayBookings)
    } else {
      setExistingBookings([])
    }
  }, [bookingForm.date])

  // Validate time when it changes
  useEffect(() => {
    if (bookingForm.date && bookingForm.time && bookingForm.duration) {
      const validation = validateTimeSlot(bookingForm.time, bookingForm.duration)
      setTimeValidation(validation)
    } else {
      setTimeValidation(null)
    }
  }, [bookingForm.date, bookingForm.time, bookingForm.duration, existingBookings])

  const validateTimeSlot = (time: string, duration: string) => {
    if (!time || !duration) return { available: false, reason: "Please select a time and service" }

    const [hours, minutes] = time.split(":").map(Number)
    const startTime = hours * 60 + minutes
    const durationMinutes = Number.parseInt(duration)
    const endTime = startTime + durationMinutes

    // Check if time is within business hours (9 AM to 6 PM)
    if (startTime < 9 * 60 || endTime > 18 * 60) {
      return { available: false, reason: "Time must be between 9:00 AM and 6:00 PM" }
    }

    // Check for conflicts with existing bookings
    for (const booking of existingBookings) {
      const [bookingStartHours, bookingStartMinutes] = booking.startTime.split(":").map(Number)
      const [bookingEndHours, bookingEndMinutes] = booking.endTime.split(":").map(Number)

      const bookingStart = bookingStartHours * 60 + bookingStartMinutes
      const bookingEnd = bookingEndHours * 60 + bookingEndMinutes

      // Check if there's any overlap
      if (startTime < bookingEnd && endTime > bookingStart) {
        return {
          available: false,
          reason: `Time conflicts with existing booking (${booking.startTime} - ${booking.endTime})`,
        }
      }
    }

    return { available: true }
  }

  const handleSubmit = () => {
    if (bookingForm.service && bookingForm.date && bookingForm.time && timeValidation?.available) {
      onCreateBooking(bookingForm)
      onOpenChange(false)
    }
  }

  const handleServiceSelect = (service: (typeof services)[0]) => {
    setBookingForm((prev) => ({
      ...prev,
      service: service.value,
      duration: service.duration,
      price: service.price,
      time: "", // Reset time when service changes
    }))
  }

  const handleDateSelect = (date: string) => {
    setBookingForm((prev) => ({ ...prev, date: date, time: "" }))
  }

  const handleTimeSelect = (time: string) => {
    setBookingForm((prev) => ({ ...prev, time: time }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Session with {specialistName}</DialogTitle>
          <DialogDescription>Choose a service, date and time that works best for you.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Service Type Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">Choose Service</Label>
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => handleServiceSelect(service)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    bookingForm.service === service.value
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 bg-${service.color}-500 rounded-full`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{service.value}</p>
                          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                            {service.price} Centi
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.duration} minutes</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          {bookingForm.service && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-foreground">Choose Date</Label>
              <Card className="p-4">
                <div className="flex space-x-2 flex-1 justify-center">
                  {(() => {
                    const today = new Date()
                    const days = []
                    for (let i = 0; i < 7; i++) {
                      const date = new Date(today)
                      date.setDate(today.getDate() + i)
                      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
                      const dayNumber = date.getDate()
                      const dateString = date.toISOString().split("T")[0]

                      days.push(
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleDateSelect(dateString)}
                          className={`flex flex-col items-center p-3 rounded-full min-w-[60px] transition-all duration-200 ${
                            bookingForm.date === dateString
                              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span className="text-xs font-medium">{dayName}</span>
                          <span className="text-lg font-bold">{dayNumber}</span>
                        </button>,
                      )
                    }
                    return days
                  })()}
                </div>
              </Card>
            </div>
          )}

          {/* Time Availability Diagram */}
          {bookingForm.date && (
            <div className="space-y-3">
              <TimeAvailabilityDiagram selectedDate={bookingForm.date} existingBookings={existingBookings} />
            </div>
          )}

          {/* Time Selection */}
          {bookingForm.date && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-foreground">Select Time</Label>
              <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label
                        htmlFor="time-input"
                        className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2 block"
                      >
                        Session Time
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <input
                          id="time-input"
                          type="time"
                          value={bookingForm.time}
                          onChange={(e) => handleTimeSelect(e.target.value)}
                          min="09:00"
                          max="18:00"
                          className="pl-10 w-full h-12 px-3 text-lg font-semibold border-2 border-amber-200 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-200"
                          placeholder="Select time"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-amber-200 dark:border-amber-700 min-w-[120px]">
                      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mb-1" />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Duration</span>
                      <span className="text-lg font-bold text-amber-900 dark:text-amber-100">
                        {bookingForm.duration} min
                      </span>
                    </div>
                  </div>

                  {/* Time Validation */}
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
                          timeValidation.available
                            ? "text-green-800 dark:text-green-200"
                            : "text-red-800 dark:text-red-200"
                        }`}
                      >
                        {timeValidation.available ? "✓ Time slot is available" : timeValidation.reason}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!bookingForm.service || !bookingForm.date || !bookingForm.time || !timeValidation?.available}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            Book Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
