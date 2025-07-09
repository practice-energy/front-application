"use client"

import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ожидает":
        return "text-red-600 dark:text-red-400"
      case "Подтверждено":
        return "text-green-600 dark:text-green-400"
      case "Активен":
        return "text-blue-600 dark:text-blue-400"
      case "Завершен":
        return "text-gray-600 dark:text-gray-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return <span className={cn("text-xs font-medium", getStatusColor(status), className)}>{status}</span>
}
