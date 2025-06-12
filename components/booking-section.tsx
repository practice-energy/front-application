"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react"
import {
  getAvailableTimeSlots,
  isTimeSlotAvailable,
  getSessionDurationMinutes,
  mockExistingBookings,
  type ExistingBooking,
} from "@/utils/availability"

interface Service {
  name: string
  duration: string
  price: number
}

interface Specialist {
  id: number
  name: string
  services: Service[]
}

interface BookingSectionProps {
  specialist: Specialist
  onBooking: (bookingData: {
    service: Service
    date: Date
    time: string
  }) => void
}

export function BookingSection({ specialist, onBooking }: BookingSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([])
  const [timeValidation, setTimeValidation] = useState<{ available: boolean; reason?: string } | null>(null)

  // Update available time slots when date or service changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      const dateString = selectedDate.toISOString().split("T")[0]
      const sessionDuration = getSessionDurationMinutes(selectedService.duration)
      const slots = getAvailableTimeSlots(dateString, sessionDuration)
      setAvailableTimeSlots(slots)

      // Get existing bookings for the selected date
      const dayBookings = mockExistingBookings.filter(
        (booking) => booking.date === dateString && booking.status !== "cancelled",
      )
      setExistingBookings(dayBookings)
    } else {
      setAvailableTimeSlots([])
      setExistingBookings([])
    }
  }, [selectedDate, selectedService])

  // Validate time when it changes
  useEffect(() => {
    if (selectedDate && selectedTime && selectedService) {
      const dateString = selectedDate.toISOString().split("T")[0]
      const sessionDuration = getSessionDurationMinutes(selectedService.duration)
      const validation = isTimeSlotAvailable(dateString, selectedTime, sessionDuration)
      setTimeValidation(validation)
    } else {
      setTimeValidation(null)
    }
  }, [selectedDate, selectedTime, selectedService])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getNextDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  const handleBooking = () => {
    if (selectedService && selectedTime && timeValidation?.available) {
      onBooking({
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
      })
    }
  }

  const isBookingValid = selectedService && selectedTime && timeValidation?.available

  return (
    <div className="space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold mb-6">Book a Session</h3>

      {/* Service Selection */}
      {!selectedService && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800">Please select a service from the table above</p>
        </div>
      )}

      {selectedService && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Service</h4>
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">{selectedService.name}</h5>
                <p className="text-sm text-gray-600">{selectedService.duration}</p>
              </div>
              <Badge className="bg-amber-100 text-amber-700">{selectedService.price} Centi</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Date Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Date</h4>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {getNextDays().map((date, index) => (
            <Button
              key={index}
              variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
              className={`rounded-full flex-shrink-0 ${
                selectedDate.toDateString() === date.toDateString()
                  ? "bg-gradient-to-r from-amber-500 to-orange-600"
                  : ""
              }`}
              onClick={() => {
                setSelectedDate(date)
                setSelectedTime("")
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                <span className="text-sm font-bold">{date.getDate()}</span>
              </div>
            </Button>
          ))}
          <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      </div>

      {/* Time Availability Diagram */}
      {selectedDate && selectedService && (
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-foreground flex items-center">
            <Clock className="h-4 w-4 mr-2 text-amber-600" />
            Availability on{" "}
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Label>

          {/* Time Availability Visual */}
          <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
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
                <div className="h-8 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full border border-gray-200 dark:border-gray-600 shadow-inner">
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
                  <div className="absolute inset-1 bg-gradient-to-r from-purple-200 via-pink-100 to-purple-200 dark:from-purple-800 dark:via-pink-700 dark:to-purple-800 rounded-full opacity-60"></div>

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
                        className="absolute top-1 bottom-1 bg-gradient-to-r from-orange-400 to-amber-500 dark:from-orange-600 dark:to-amber-700 rounded-full shadow-sm border border-orange-300 dark:border-orange-500"
                        style={{
                          left: `${Math.max(0.5, startPercent)}%`,
                          width: `${Math.min(99, widthPercent)}%`,
                        }}
                        title={`${booking.clientName} - ${booking.service}`}
                      />
                    )
                  })}

                  {/* Current Time Indicator */}
                  {selectedDate.toDateString() === new Date().toDateString() && (
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
                {selectedDate.toDateString() === new Date().toDateString() && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-teal-500 dark:bg-teal-400 rounded-full border border-teal-600 dark:border-teal-300"></div>
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Now</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Custom Time Input */}
      {selectedDate && selectedService && (
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-foreground">Enter your preferred time</Label>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700">
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
                    <Input
                      id="time-input"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
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
                  <span className="text-lg font-bold text-amber-900 dark:text-amber-100">
                    {selectedService.duration}
                  </span>
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
      )}

      {/* Existing Bookings Preview */}
      {selectedDate && existingBookings.length > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <Label className="text-sm font-semibold text-blue-800 dark:text-blue-300">
              Existing Sessions for {selectedDate.toLocaleDateString()}
            </Label>
          </div>
          <div className="space-y-2">
            {existingBookings.map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-500"
                        : booking.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="font-medium text-sm">
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{booking.clientName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{booking.service}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Book Session Button */}
      <Button
        type="button"
        onClick={handleBooking}
        disabled={!isBookingValid}
        className={`w-full h-12 font-semibold shadow-lg transition-all duration-200 ${
          isBookingValid
            ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        }`}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Book Session
      </Button>

      {/* Service Selection Helper */}
      {!selectedService && (
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Select a service from the table above to continue
        </div>
      )}
    </div>
  )
}
