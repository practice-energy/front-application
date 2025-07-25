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
    <div className="w-16 flex-shrink-0 border border-gray-100 flex flex-col">
      {/* Header - fixed at top */}
      <div className="sticky top-0 bg-white p-3 text-center z-10 border-b border-gray-100 w-full">
        <div className="text-sm font-medium text-transparent">Time</div>
      </div>

      {/* Time labels - scrollable */}
      <div className="flex-1">
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex items-center justify-center bg-white text-xs text-gray-500 border-t border-gray-100"
            style={{ height: `${slotHeight * 2}px` }}
          >
            {formatTime(hour)}
          </div>
        ))}
      </div>
    </div>
  )
}
