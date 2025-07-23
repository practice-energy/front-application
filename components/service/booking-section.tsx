"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Booking } from "@/types/booking"
import { format, addDays, isSameDay, parseISO } from "date-fns"
import { ru } from "date-fns/locale"

interface BookingSectionProps {
  selectedDate: Date
  bookings: Booking[]
}

export function BookingSection({ selectedDate, bookings }: BookingSectionProps) {
  // Generate 3 days: selected + 2 next days
  const days = [selectedDate, addDays(selectedDate, 1), addDays(selectedDate, 2)]

  // Generate 30-minute time slots for the day (from 00:00 to 23:30)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(timeString)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Filter time slots that have bookings in at least one of the 3 days
  const getBookingsForTimeSlot = (timeSlot: string) => {
    return days.map((day) => {
      return bookings.filter((booking) => {
        const bookingDate = parseISO(booking.date)
        const bookingTime = booking.time
        return isSameDay(bookingDate, day) && bookingTime === timeSlot
      })
    })
  }

  const visibleTimeSlots = timeSlots.filter((timeSlot) => {
    const bookingsForSlot = getBookingsForTimeSlot(timeSlot)
    return bookingsForSlot.some((dayBookings) => dayBookings.length > 0)
  })

  const formatDayHeader = (date: Date) => {
    const dayName = format(date, "EEEEEE", { locale: ru }) // Short day name
    const dayNumber = format(date, "d")
    return `${dayName} ${dayNumber}`
  }

  return (
    <div className="flex-1 border-l border-gray-200">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Выбрать свой слот</h3>

        {/* Month/Year header */}
        <div className="mb-4">
          <span className="text-sm text-gray-600">{format(selectedDate, "LLLL yyyy", { locale: ru })}</span>
        </div>

        {/* Days header */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-sm text-gray-500"></div> {/* Empty cell for time column */}
          {days.map((day, index) => (
            <div key={index} className="text-center">
              <div
                className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-medium ${
                  index === 0 ? "bg-purple-500 text-white" : "text-gray-700"
                }`}
              >
                {formatDayHeader(day)}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots with bookings */}
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {visibleTimeSlots.map((timeSlot) => {
              const bookingsForSlot = getBookingsForTimeSlot(timeSlot)

              return (
                <div key={timeSlot} className="grid grid-cols-4 gap-2 items-center">
                  {/* Time label */}
                  <div className="text-sm text-gray-500 text-right pr-2">{timeSlot}</div>

                  {/* Booking slots for each day */}
                  {bookingsForSlot.map((dayBookings, dayIndex) => (
                    <div key={dayIndex} className="min-h-[40px] flex flex-col gap-1">
                      {dayBookings.map((booking, bookingIndex) => (
                        <div
                          key={bookingIndex}
                          className="bg-purple-500 text-white text-xs px-2 py-1 rounded text-center"
                        >
                          {booking.duration || "03:30"}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
