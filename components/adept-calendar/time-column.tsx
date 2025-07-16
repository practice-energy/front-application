"use client"

interface TimeColumnProps {
  slotHeight: number
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

const formatTime = (hour: number) => {
  return `${hour.toString().padStart(2, "0")}:00`
}

export function TimeColumn({ slotHeight }: TimeColumnProps) {
  return (
    <div className="w-16 flex-shrink-0 border-r border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 text-center z-10">
        <div className="text-sm font-medium text-transparent">Time</div>
      </div>
      <div>
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="border-b border-gray-100 px-2 py-4 text-xs text-gray-500 text-right"
            style={{ height: `${slotHeight}px` }}
          >
            {formatTime(hour)}
          </div>
        ))}
      </div>
    </div>
  )
}
