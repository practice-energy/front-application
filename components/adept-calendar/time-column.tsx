"use client"

interface TimeColumnProps {
  slotHeight: number
}

export function TimeColumn({ slotHeight }: TimeColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  return (
    <div className="w-16 flex-shrink-0 border-r border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 text-center z-30">
        <div className="text-sm font-medium text-transparent">Time</div>
      </div>

      {/* Time labels */}
      {hours.map((hour) => (
        <div
          key={hour}
          className="flex items-center justify-center bg-white text-xs text-gray-500 border-b border-gray-100"
          style={{ height: `${slotHeight}px` }}
        >
          {formatTime(hour)}
        </div>
      ))}
    </div>
  )
}
