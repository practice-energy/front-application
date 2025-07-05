"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ArrowLeft, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TimeSlot {
  hour: number
  status: "available" | "booked"
  bookingId?: string
}

interface DayData {
  date: number
  status: "available" | "booked" | "fully-booked" | "non-working" | "past"
  slots: TimeSlot[]
}

interface AirbnbCalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onBookSlot?: (date: Date, hour: number) => void
  onCancelBooking?: (bookingId: string) => void
  onRebookSlot?: (oldBookingId: string, date: Date, hour: number) => void
}

type Phase = "calendar" | "time-slots"

export function AirbnbCalendar({
  selectedDate,
  onDateSelect,
  onBookSlot,
  onCancelBooking,
  onRebookSlot,
}: AirbnbCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [phase, setPhase] = useState<Phase>("calendar")
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data generation
  const generateMockSlots = (day: number): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let hour = 9; hour <= 17; hour++) {
      const random = Math.random()
      const status: "available" | "booked" = random < 0.3 ? "booked" : "available"

      slots.push({
        hour,
        status,
        bookingId: status === "booked" ? `booking-${day}-${hour}` : undefined,
      })
    }
    return slots
  }

  const generateCalendarData = (): DayData[] => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const today = new Date()
    const data: DayData[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const slots = generateMockSlots(day)
      const bookedSlots = slots.filter((slot) => slot.status === "booked").length
      const totalSlots = slots.length

      let status: DayData["status"] = "available"

      // Determine day status
      if (date < today) {
        status = "past"
      } else if (date.getDay() === 0 && Math.random() < 0.2) {
        // Some Sundays are non-working
        status = "non-working"
      } else if (bookedSlots === totalSlots) {
        status = "fully-booked"
      } else if (bookedSlots > 0) {
        status = "booked"
      }

      data.push({
        date: day,
        status,
        slots,
      })
    }
    return data
  }

  const calendarData = generateCalendarData()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const handleDateClick = (dayData: DayData) => {
    if (dayData.status === "past" || dayData.status === "non-working" || dayData.status === "fully-booked") {
      return
    }

    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayData.date)
    setSelectedDay(dayData)
    setPhase("time-slots")
    onDateSelect?.(date)
  }

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.status === "booked") return

    if (selectedSlot?.hour === slot.hour) {
      setSelectedSlot(null) // Deselect if clicking same slot
    } else {
      setSelectedSlot(slot) // Select new slot
    }
  }

  const handleBooking = async () => {
    if (!selectedDay || !selectedSlot) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay.date)
      onBookSlot?.(date, selectedSlot.hour)
      setShowBookingModal(false)
      setPhase("calendar")
      setSelectedSlot(null)
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancellation = async () => {
    const existingBooking = selectedDay?.slots.find((slot) => slot.status === "booked")
    if (!existingBooking?.bookingId) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onCancelBooking?.(existingBooking.bookingId)
      setShowCancelModal(false)
      setPhase("calendar")
    } catch (error) {
      console.error("Cancellation failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDayStyles = (dayData: DayData) => {
    const baseStyles =
      "relative h-16 md:h-20 w-full border border-gray-200 dark:border-gray-700 rounded-sm transition-all duration-200 cursor-pointer"

    switch (dayData.status) {
      case "past":
        return `${baseStyles} opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800`
      case "non-working":
        return `${baseStyles} bg-gray-100 dark:bg-gray-700 bg-diagonal-stripes cursor-not-allowed`
      case "fully-booked":
        return `${baseStyles} bg-gray-300 dark:bg-gray-600 cursor-not-allowed`
      case "booked":
        return `${baseStyles} bg-violet-100 dark:bg-violet-900/30 hover:shadow-md`
      default:
        return `${baseStyles} bg-white dark:bg-gray-800 hover:shadow-md`
    }
  }

  const renderCalendarDays = () => {
    const days = []
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    // Add weekday headers
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
          {weekdays[i]}
        </div>,
      )
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-1"></div>)
    }

    // Add days of the month
    calendarData.forEach((dayData) => {
      const isTodayDay = isToday(dayData.date)

      days.push(
        <div key={`day-${dayData.date}`} className="p-1">
          <div
            className={getDayStyles(dayData)}
            onClick={() => handleDateClick(dayData)}
            role="button"
            tabIndex={
              dayData.status === "past" || dayData.status === "non-working" || dayData.status === "fully-booked"
                ? -1
                : 0
            }
            aria-label={`${dayData.date} ${monthName} ${year}, ${dayData.status}`}
          >
            <div
              className={`absolute top-2 right-2 text-sm font-medium ${
                isTodayDay ? "text-violet-600 dark:text-violet-400 font-bold" : "text-gray-900 dark:text-gray-200"
              }`}
            >
              {dayData.date}
            </div>
            {isTodayDay && (
              <div className="absolute inset-0 border-2 border-violet-500 rounded-sm pointer-events-none" />
            )}
          </div>
        </div>,
      )
    })

    return days
  }

  const renderTimeSlots = () => {
    if (!selectedDay) return null

    const existingBooking = selectedDay.slots.find((slot) => slot.status === "booked")

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setPhase("calendar")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Calendar
          </Button>
          <div className="text-lg font-semibold">
            {monthName} {selectedDay.date}, {year}
          </div>
        </div>

        {/* Time Slots Grid */}
        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {selectedDay.slots.map((slot) => (
              <button
                key={slot.hour}
                onClick={() => handleSlotClick(slot)}
                disabled={slot.status === "booked"}
                className={`h-12 md:h-14 rounded-sm border-2 transition-all duration-200 flex items-center justify-center font-medium ${
                  slot.status === "booked"
                    ? "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
                    : selectedSlot?.hour === slot.hour
                      ? "bg-violet-100 dark:bg-violet-900/50 border-violet-500 text-violet-700 dark:text-violet-300 scale-100"
                      : "border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-900 dark:text-gray-200"
                }`}
              >
                {slot.hour}:00
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {existingBooking && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCancelModal(true)}
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          )}

          <div className="flex-1 flex justify-center">
            <Button
              onClick={() => setShowBookingModal(true)}
              disabled={!selectedSlot}
              className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
            >
              <Check className="h-4 w-4 mr-2" />
              {existingBooking ? "Rebook" : "Book Slot"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full">
        <div
          className={`transition-all duration-300 ease-in-out ${
            phase === "time-slots" ? "transform translate-x-0" : ""
          }`}
        >
          {phase === "calendar" ? (
            <>
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {monthName} {year}
                </h3>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={goToNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Calendar">
                  {renderCalendarDays()}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4">{renderTimeSlots()}</div>
          )}
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Booking for</p>
              <p className="font-semibold text-lg">
                {monthName} {selectedDay?.date}, {year} at {selectedSlot?.hour}:00
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBookingModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={handleBooking} disabled={isLoading}>
                {isLoading ? "Booking..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancellation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">Are you sure you want to cancel your booking?</p>
              <p className="font-semibold mt-2">
                {monthName} {selectedDay?.date}, {year}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCancelModal(false)}
                disabled={isLoading}
              >
                Keep Booking
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleCancellation} disabled={isLoading}>
                {isLoading ? "Cancelling..." : "Cancel Booking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
