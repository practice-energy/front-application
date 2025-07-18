import type React from "react"

interface DayColumnProps {
  date: Date
  children: React.ReactNode
}

const DayColumn: React.FC<DayColumnProps> = ({ date, children }) => {
  const dayOfWeek = date.toLocaleDateString("default", { weekday: "short" })
  const dayOfMonth = date.getDate()

  return (
    <div className="flex flex-col w-32 border-r border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 text-center z-20">
        {dayOfWeek}, {dayOfMonth}
      </div>
      {children}
    </div>
  )
}

export default DayColumn
