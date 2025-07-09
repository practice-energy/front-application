"use client"

import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ожидает":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "Подтверждено":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Отменено":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", getStatusColor(status))}>
      {status}
    </span>
  )
}
