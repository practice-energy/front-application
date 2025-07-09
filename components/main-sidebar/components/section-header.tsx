"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SectionHeaderProps } from "../types/sidebar.types"

export function SectionHeader({
  title,
  sectionKey,
  count,
  sectionVisibility,
  toggleSection,
  isCollapsed,
  isMobile,
}: SectionHeaderProps) {
  const isVisible = sectionVisibility[sectionKey]

  if (isCollapsed && !isMobile) return null

  return (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-2">
        <ChevronDown
          className={cn("h-4 w-4 transition-transform text-gray-500 dark:text-gray-400", !isVisible && "-rotate-90")}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        {count > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
    </button>
  )
}
