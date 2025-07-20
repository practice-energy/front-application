import type { ReactNode } from "react"

interface OverviewStatCardProps {
  value: string | number
  label: string
  icon: ReactNode
}

export function OverviewStatCard({ value, label, icon }: OverviewStatCardProps) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-semibold text-black">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}
