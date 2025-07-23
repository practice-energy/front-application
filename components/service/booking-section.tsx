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

  const getBookingsForTimeSlot = (timeSlot: string) => {
    return days.map((day) => {
      return bookingSlots.filter((booking) => {
        // Проверяем что booking.date существует и является Date объектом
        if (!booking.date) {
          return false
        }

        // Сравниваем даты (без времени)
        const isSameDate = isSameDay(booking.date, day)

        // Приводим оба времени к формату HH:mm для сравнения
        const bookingTime = format(booking.date, "HH:mm")

        return isSameDate && bookingTime === timeSlot
      })
    })
  }

  const visibleTimeSlots = timeSlots.filter((timeSlot) => {
    const bookingsForSlot = getBookingsForTimeSlot(timeSlot)
    return bookingsForSlot.some((dayBookings) => dayBookings.length > 0)
  })

  // Format day header
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

  const SLOT_HEIGHT = 40 // высота одного слота в пикселях

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
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-sm text-gray-500"></div> {/* Empty cell for time column */}
            {days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-900">{formatDate(day, index === 0)}</div>
              </div>
            ))}
          </div>

          {/* Time slots with bookings */}
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {visibleTimeSlots.map((timeSlot) => {
                const bookingsForSlot = getBookingsForTimeSlot(timeSlot)

                return (
                  <div key={timeSlot} className="grid grid-cols-4 items-center">
                    {/* Time label */}
                    <div className="text-sm text-gray-500 text-right pr-2">{timeSlot}</div>

                    {/* Booking slots for each day */}
                    {bookingsForSlot.map((dayBookings, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="flex flex-col gap-1 border"
                        style={{
                          minHeight: `${Math.max(1, dayBookings.length) * SLOT_HEIGHT}px`,
                        }}
                      >
                        {dayBookings.map((booking, bookingIndex) => (
                          <div
                            key={bookingIndex}
                            className="bg-violet-600 text-white text-simple font-normal px-2 py-1 rounded text-center"
                            style={{ height: `${SLOT_HEIGHT}px` }}
                          >
                            {booking.date.toLocaleTimeString("ru-RU", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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
      )}
    </div>
  )
}
