"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, User, X } from "lucide-react"
import { ServicesSelection } from "./services-selection"
import { DateSelection } from "./date-selection"
import { TimeAvailabilityDiagram } from "./time-availability-diagram"
import { CustomTimeInput } from "./custom-time-input"

interface Service {
  name: string
  duration: string
  price: number
}

interface BookingBubbleProps {
  services: Service[]
  onClose: () => void
  onBooking: (bookingData: { service: Service; date: Date; time: string }) => void
  specialistName: string
  specialistAvatar?: string
}

export function BookingBubble({ services, onClose, onBooking, specialistName, specialistAvatar }: BookingBubbleProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [timeValidation, setTimeValidation] = useState<{ available: boolean; reason?: string } | null>(null)

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
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              {specialistAvatar ? (
                <img
                  src={specialistAvatar || "/placeholder.svg"}
                  alt={specialistName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Book with {specialistName}</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">Schedule your session</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-blue-600 hover:text-blue-800">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Service Selection */}
        <ServicesSelection
          services={services}
          selectedService={selectedService}
          onServiceSelect={setSelectedService}
          title="Choose Service"
        />

        {/* Date Selection */}
        {selectedService && (
          <DateSelection
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date)
              setSelectedTime("")
            }}
          />
        )}

        {/* Time Availability */}
        {selectedService && selectedDate && (
          <TimeAvailabilityDiagram selectedDate={selectedDate} selectedService={selectedService} />
        )}

        {/* Custom Time Input */}
        {selectedService && selectedDate && (
          <CustomTimeInput
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
            selectedService={selectedService}
            onValidationChange={setTimeValidation}
            selectedDate={selectedDate}
          />
        )}

        {/* Book Button */}
        <Button
          type="button"
          onClick={handleBooking}
          disabled={!isBookingValid}
          className={`w-full h-12 font-semibold shadow-lg transition-all duration-200 ${
            isBookingValid
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Session
        </Button>
      </div>
    </Card>
  )
}
