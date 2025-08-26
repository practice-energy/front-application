"use client"

import { BookingCard } from "./booking-card"
import { TimeSlot } from "./time-slot"
import type { Booking } from "@/src/types/booking"
import type { CalendarRestrictions } from "@/src/types/calendar-event"
import { cn } from "@/src/lib/utils"

interface DayColumnProps {
  date: Date
  bookings: Booking[]
  slotHeight: number
  isSelectedDay: boolean
  calendarRestrictions?: CalendarRestrictions
}

// Выделяем компонент заголовка дня
export function DayColumnHeader({ date, isSelectedDay }: Pick<DayColumnProps, "date" | "isSelectedDay">) {
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
        <div className="flex flex-row items-center justify-center w-full h-[30px] gap-1">
          <div className="text-sm font-medium ">
            {weekday.replace(/^./, (letter) => letter.toUpperCase())}
          </div>
          <div
              className={cn(
                  "flex items-center justify-center text-neutral-700",
                  isSelectedDay && "bg-colors-custom-accent text-white rounded-sm aspect-square h-[30px] w-[30px]",
              )}
          >
            {day}
          </div>
        </div>
    )
  }

  return (
    <div className="w-full bg-white border-b border-gray-200 p-3 text-center z-20">
      <div className="text-sm font-medium text-gray-900">{formatDate(date)}</div>
    </div>
  )
}

// Основной компонент содержимого колонки дня
export function DayColumnContent({ date, bookings, slotHeight, calendarRestrictions }: Omit<DayColumnProps, "isSelectedDay">) {
  const halfhours = Array.from({ length: 48 }, (_, i) => i)

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
    const dayBookings = getBookingsForDate(date)

    // Преобразуем номер получасового интервала в часы и минуты
    const hour = Math.floor(halfhour / 2)
    const minute = (halfhour % 2) * 30 // 0 или 30 минут

    return dayBookings.find((booking) => {
      const bookingTime = new Date(booking.date)
      const bookingHour = bookingTime.getHours()
      const bookingMinute = bookingTime.getMinutes()

      // Проверяем совпадение с получасовым интервалом
      return bookingHour === hour && Math.floor(bookingMinute / 30) === Math.floor(minute / 30)
    })
  }

  // Проверяем, активен ли слот на основе calendar restrictions
  const isSlotActive = (halfhour: number) => {
    if (!calendarRestrictions) return false

    // Получаем день недели
    const dayOfWeek = date.getDay()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const currentDay = dayNames[dayOfWeek]
    
    // Проверяем, активен ли день недели
    const dayRestriction = calendarRestrictions.commons[currentDay as keyof typeof calendarRestrictions.commons]
    if (!dayRestriction || !dayRestriction.isActive) return false

    // Если день активен, но нет интервалов - считаем весь день активным
    if (dayRestriction.intervals.length === 0) return true

    // Преобразуем номер получасового интервала в часы и минуты
    const hour = Math.floor(halfhour / 2)
    const minute = (halfhour % 2) * 30

    // Создаем время для текущего слота (в минутах от начала дня)
    const slotMinutes = hour * 60 + minute

    // Проверяем, попадает ли слот в один из интервалов
    return dayRestriction.intervals.some(interval => {
      const startTime = new Date(interval.start)
      const endTime = new Date(interval.end)
      
      // Преобразуем время интервала в минуты от начала дня
      const startMinutes = startTime.getHours() * 60 + startTime.getMinutes()
      const endMinutes = endTime.getHours() * 60 + endTime.getMinutes()
      
      // Проверяем, попадает ли слот в интервал
      return slotMinutes >= startMinutes && slotMinutes < endMinutes
    })
  }

  return (
    <div className="flex-1 flex-shrink-1 bg-white border-gray-200 border-r">
      {halfhours.map((halfHour) => {
        const booking = getBookingForHalfHour(halfHour)
        const isActive = isSlotActive(halfHour)

        return (
          <div key={halfHour} className="relative" style={{ height: `${slotHeight}px` }}>
            <TimeSlot slotHeight={slotHeight} />

            {booking && (
              <div className="absolute w-full inset-0 z-10">
                <BookingCard booking={booking} slotHeight={slotHeight} />
              </div>
            )}

            {/* Покраска неактивных слотов в серый цвет */}
            {!isActive && (
              <div className="absolute w-full inset-0 bg-colors-custom-calendarSlotBg z-5" />
            )}
          </div>
        )
      })}
      {/*<div className="h-[56px]" />*/}
    </div>
  )
}
