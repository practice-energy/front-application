"use client"

import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "waiting" | "confirmed" | "active" | "inactive"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "waiting":
        return {
          label: "Ожидает",
          bgColor: "bg-pink-500",
          textColor: "text-gray-600 dark:text-gray-400",
        }
      case "confirmed":
        return {
          label: "Подтвержден",
          bgColor: "bg-green-500",
          textColor: "text-gray-600 dark:text-gray-400",
        }
      case "active":
        return {
          label: "Активен",
          bgColor: "bg-green-500",
          textColor: "text-gray-600 dark:text-gray-400",
        }
      case "inactive":
        return {
          label: "Неактивен",
          bgColor: "bg-gray-400",
          textColor: "text-gray-600 dark:text-gray-400",
        }
      default:
        return {
          label: status,
          bgColor: "bg-gray-400",
          textColor: "text-gray-600 dark:text-gray-400",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("text-sm", config.textColor)}>{config.label}</span>
      <div className={cn("w-4 h-4 rounded-sm flex-shrink-0", config.bgColor)} />
    </div>
  )
}
