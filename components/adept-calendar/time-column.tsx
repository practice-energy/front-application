"use client"

type TimeColumnProps = {}

export function TimeColumn({}: TimeColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="w-16 border-r bg-gray-50 flex-shrink-0">
      {hours.map((hour) => (
        <div
          key={hour}
          className="h-[60px] border-b flex items-start justify-center pt-1 text-xs text-gray-500 sticky top-0 bg-gray-50 z-20"
        >
          {hour.toString().padStart(2, "0")}:00
        </div>
      ))}
    </div>
  )
}
