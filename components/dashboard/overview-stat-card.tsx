import type React from "react"

interface OverviewStatCardProps {
  value: string | number
  label: string
  icon: React.ReactNode
}

export function OverviewStatCard({ value, label, icon }: OverviewStatCardProps) {
  return (
    <div className="flex flex-col w-full p-4 border border-gray-200 rounded-sm bg-white">
      <div className="flex items-end justify-between h-9 w-full">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <div className="flex items-center justify-center h-9 w-9 rounded">{icon}</div>
      </div>
      <div className="mt-2">
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  )
}
