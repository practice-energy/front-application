import type React from "react"
import { cn } from "@/lib/utils"

interface TopStatsCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
}

export function TopStatsCard({ icon, title, subtitle }: TopStatsCardProps) {
  return (
    <div className={cn("flex items-center w-full gap-3 shadow-md h-[72px] p-3 rounded-sm md:w-full")}>
      <div className={cn("flex items-center justify-center h-10 w-10 rounded-sm bg-neutral-100")}>{icon}</div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium truncate flex-1">{title}</h3>
        </div>

        <div className="flex items-start">
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-gray-600 leading-relaxed line-clamp-1 w-full">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
