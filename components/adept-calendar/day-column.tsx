"use client"

import { BookingCard } from "./booking-card"
import { TimeSlot } from "./time-slot"
import type { Booking } from "@/types/booking"
import { cn } from "@/lib/utils"

interface DayColumnProps {
  date: Date
  bookings: Booking[]
  slotHeight: number
  isSelectedDay: boolean
}

export function DayColumn({ date, bookings, slotHeight, isSelectedDay }: DayColumnProps) {
  const halfhours = Array.from({ length: 48 }, (_, i) => i)

  // Format day header
  function formatDate(date: Date) {
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
  // Get bookings for this date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date)
      return (
        bookingDate.getFullYear() === date.getFullYear() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getDate() === date.getDate()
      )
    })
  }

  // Get booking for specific hour
  const getBookingForHalfHour = (halfhour: number) => {
    const dayBookings = getBookingsForDate(date);

    // Преобразуем номер получасового интервала в часы и минуты
    const hour = Math.floor(halfhour / 2);
    const minute = (halfhour % 2) * 30; // 0 или 30 минут

    return dayBookings.find((booking) => {
      const bookingTime = new Date(booking.date);
      const bookingHour = bookingTime.getHours();
      const bookingMinute = bookingTime.getMinutes();

      // Проверяем совпадение с получасовым интервалом
      return bookingHour === hour &&
          Math.floor(bookingMinute / 30) === Math.floor(minute / 30);
    });
  };

  // Check if hour is continuation of multi-slot booking
  const isBookingContinuation = (hour: number) => {
    const dayBookings = getBookingsForDate(date)
    return dayBookings.some((booking) => {
      const bookingHour = new Date(booking.date).getHours()
      return hour > bookingHour && hour < bookingHour + booking.slots
    })
  }

  return (
      <div className="flex-1 flex-shrink-1">
        {/* Day header */}
        <div className="fixed top-24 bg-white border-r border-l border-b border-gray-100 p-3 text-center z-20 w-[calc(100%/5)]">
          <div className="text-sm font-medium text-gray-900">{formatDate(date)}</div>
        </div>

      {/* Time slots */}
      <div className="relative bg-white border-r border-t mt-11">
        {halfhours.map((halfHour) => {
          const booking = getBookingForHalfHour(halfHour)
          const isContinuation = isBookingContinuation(halfHour)

          return (
            <div key={halfHour} className="relative" style={{ height: `${slotHeight}px` }}>
              {!isContinuation && <TimeSlot slotHeight={slotHeight} />}

              {booking && (
                <div className="absolute inset-0 z-10">
                  <BookingCard booking={booking} slotHeight={slotHeight} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
