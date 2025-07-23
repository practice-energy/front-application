"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { BookingSlot } from "@/types/booking"
import { format, addDays, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "lucide-react"

interface BookingSectionProps {
  selectedDate: Date
  bookingSlots: BookingSlot[]
}

export function BookingSection({ selectedDate, bookingSlots }: BookingSectionProps) {
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
  const visibleTimeSlots = timeSlots.filter((timeSlot) => {
    return days.some((day) => {
      return bookingSlots.some((booking) => {
        if (!booking.date) return false
        return isSameDay(booking.date, day) && format(booking.date, "HH:mm") === timeSlot
      })
    })
  })

  // Get bookings for specific day and time slot
  const getBookingsForDayAndTime = (day: Date, timeSlot: string) => {
    return bookingSlots.filter((booking) => {
      if (!booking.date) return false
      return isSameDay(booking.date, day) && format(booking.date, "HH:mm") === timeSlot
    })
  }

  function formatDate(date: Date, isSelectedDay = false) {
    const formatted = date
      .toLocaleDateString("ru-RU", {
        weekday: "short",
        day: "numeric",
      })
      .replace(",", "")

    const [weekday, day] = formatted.split(" ")

    return (
      <>
        <span className={cn("px-1 py-0.5 mr-1", isSelectedDay && "bg-violet-600 text-white rounded-sm aspect-square")}>
          {weekday.replace(/^./, (letter) => letter.toUpperCase())}
        </span>
        {day}
      </>
    )
  }

  const SLOT_HEIGHT = 40

  return (
    <div className="flex-1 h-full w-full">
      {visibleTimeSlots.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 bold text-gray-500">
          <Calendar />
          <span>Нет доступных слотов для бронирования</span>
        </div>
      ) : (
        <div className="w-full">
          {/* Days header */}
          <div className="grid grid-cols-4 mb-4">
            <div className="text-sm w-[50px] text-gray-500"></div>
            {days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium mx-auto text-neutral-900">{formatDate(day, index === 0)}</div>
              </div>
            ))}
          </div>

          {/* Time slots with bookings */}
          <ScrollArea className="h-96 border-t border-gray-200">
            <div>
              {visibleTimeSlots.map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-4 items-center border-b border-l border-gray-200">
                  {/* Time label */}
                  <div className="text-xs text-gray-500 w-[50px] text-right mx-auto">{timeSlot}</div>

                  {/* Booking slots for each day */}
                  {days.map((day, dayIndex) => {
                    const dayBookings = getBookingsForDayAndTime(day, timeSlot)

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "flex flex-col gap-1 border-r border-gray-200 h-full p-0.5",
                          dayIndex === 0 && "border-l",
                        )}
                        style={{
                          minHeight: `${Math.max(1, dayBookings.length) * SLOT_HEIGHT}px`,
                        }}
                      >
                        {dayBookings.map((booking, bookingIndex) => (
                          <div
                            key={bookingIndex}
                            className="bg-violet-600 w-full text-white text-simple font-normal rounded-sm text-center"
                            style={{ height: `${SLOT_HEIGHT}px` }}
                          >
                            {booking.date.toLocaleTimeString("ru-RU", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        ))}
                        {dayBookings.length === 0 && <div style={{ height: `${SLOT_HEIGHT}px` }}></div>}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
