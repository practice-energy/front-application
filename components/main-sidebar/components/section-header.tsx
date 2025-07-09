"use client"

import { ChevronDown, GalleryHorizontalEnd } from "lucide-react"
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

  if (count === 0) return null

  return (
    <button
      className={cn(
        "flex items-center gap-1 w-full px-3 py-3 group transition-all duration-100 ease-in-out",
        "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm",
        isCollapsed && !isMobile ? "hidden" : "flex",
      )}
      onClick={(e) => {
        e.stopPropagation()
        toggleSection(sectionKey)
      }}
    >
      <GalleryHorizontalEnd className="h-4 w-4 ml-3 mb-0.5 gap-1" />
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {title} ({count})
      </span>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-gray-400 dark:text-gray-500 transition-all duration-300 ease-in-out transform",
          "group-hover:text-gray-600 dark:group-hover:text-gray-300",
          isVisible ? "rotate-180" : "rotate-0",
        )}
      />
    </button>
  )
}
