"use client"

import {cn} from "@/src/lib/utils";

interface TimeColumnProps {
  slotHeight: number
}

// Выделяем компонент заголовка времени
export function TimeColumnHeader() {
  return (
    <div className="bg-white p-3 text-center z-10 border-b border-r border-gray-100 w-full">
      <div className="text-sm font-medium text-transparent h-[30px]">Time</div>
    </div>
  )
}

// Основной компонент содержимого колонки времени
export function TimeColumnContent({ slotHeight }: TimeColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  return (
    <div className="flex-1">
      {hours.map((hour) => (
        <div
          key={hour}
          className={cn(
              "flex items-start pt-1 justify-center bg-white text-xs text-gray-500 border-gray-100 border border-x z-30",
              hour !== 0 && "border-t"
          )}
          style={{ height: `${slotHeight * 2}px` }}
        >
          {formatTime(hour)}
        </div>
      ))}
    </div>
  )
}
