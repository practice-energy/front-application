interface TimeColumnProps {
  slotHeight: number
}

export function TimeColumn({ slotHeight }: TimeColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="w-16 flex-shrink-0">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 h-12 flex items-center justify-center text-xs font-medium text-gray-500">
        Time
      </div>
      {/* Time slots */}
      {hours.map((hour) => (
        <div
          key={hour}
          className="border-b border-gray-100 flex items-start justify-end pr-2 text-xs text-gray-500"
          style={{ height: slotHeight }}
        >
          <span className="mt-1">
            {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
          </span>
        </div>
      ))}
    </div>
  )
}
