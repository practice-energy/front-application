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

  return (
    <button
      onClick={() => toggleSection(sectionKey)}
      className={cn(
        "w-full flex items-center justify-between px-4 py-2 text-left",
        "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide",
        "hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
        isCollapsed && !isMobile ? "hidden" : "flex",
      )}
    >
      <span>
        {title} ({count})
      </span>
      <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isVisible ? "rotate-180" : "rotate-0")} />
    </button>
  )
}
