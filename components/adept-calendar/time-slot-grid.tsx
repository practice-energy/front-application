"use client"
import { Button } from "@/components/ui/button"

interface TimeSlotGridProps {
  selectedDate: Date
  bookingSlots: number
  onTimeSlotSelect: (timeSlot: string) => void
}

export function TimeSlotGrid({ selectedDate, bookingSlots, onTimeSlotSelect }: TimeSlotGridProps) {
  // Generate 3 days starting from selected date
  const getDates = () => {
    const dates = []
    for (let i = 0; i < 3; i++) {
      const date = new Date(selectedDate)
      date.setDate(selectedDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const dates = getDates()

  // Mock available time slots - in real app this would come from API
  const getAvailableSlots = (date: Date) => {
    const dayOfWeek = date.getDay()
    const slots = []

    // Different availability for different days (mock data)
    if (dayOfWeek === 1) {
      // Monday
      slots.push({ time: "4:00", available: true })
      slots.push({ time: "5:00", available: true })
      slots.push({ time: "5:30", available: true })
    } else if (dayOfWeek === 2) {
      // Tuesday
      slots.push({ time: "4:30", available: true })
    } else if (dayOfWeek === 3) {
      // Wednesday
      slots.push({ time: "4:30", available: true })
      slots.push({ time: "5:30", available: true })
      slots.push({ time: "17:00", available: true })
      slots.push({ time: "17:30", available: true })
    }

    return slots
  }

  const formatDayHeader = (date: Date) => {
    const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
    return `${dayNames[date.getDay()]} ${date.getDate()}`
  }

  const timeSlots = ["4:00", "5:00", "6:00", "17:00"]

  return (
    <div className="space-y-4">
      {/* Date headers */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-sm font-medium text-gray-500"></div>
        {dates.map((date, index) => (
          <div key={index} className="text-sm font-medium text-center">
            {formatDayHeader(date)}
          </div>
        ))}
      </div>

      {/* Time slot grid */}
      <div className="space-y-2">
        {timeSlots.map((timeSlot) => (
          <div key={timeSlot} className="grid grid-cols-4 gap-2 items-center">
            <div className="text-sm text-gray-600">{timeSlot}</div>
            {dates.map((date, dateIndex) => {
              const availableSlots = getAvailableSlots(date)
              const slotData = availableSlots.find((slot) => slot.time === timeSlot)

              return (
                <div key={dateIndex} className="min-h-[40px] flex items-center">
                  {slotData?.available && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-colors-custom-accent hover:bg-violet-700 text-white text-xs"
                      style={{
                        height: `${bookingSlots * 20 + 20}px`,
                        minHeight: "40px",
                      }}
                      onClick={() => onTimeSlotSelect(timeSlot)}
                    >
                      {timeSlot}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
