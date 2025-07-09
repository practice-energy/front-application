"use client"

import { cn } from "@/lib/utils"
import type { StatusBadgeProps } from "../types/sidebar.types"

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "waiting":
        return {
          label: "Ожидает",
          className: "bg-pink-500",
        }
      case "confirmed":
        return {
          label: "Подтвержден",
          className: "bg-green-500",
        }
      default:
        return {
          label: status,
          className: "bg-gray-500",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{config.label}</span>
      <div className={cn("w-4 h-4 rounded-sm flex-shrink-0", config.className)} />
    </div>
  )
}
