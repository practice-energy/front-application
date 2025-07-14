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
  icon: Icon = GalleryHorizontalEnd,
  iconStyle = ""
}: SectionHeaderProps) {
  const isVisible = sectionVisibility[sectionKey]

  if (count === 0) return null

  return (
    <button
      className={cn(
        "flex items-center w-full px-3 py-3 group transition-all duration-100 ease-in-out gap-3",
        "hover:bg-violet-50 rounded-sm",
        isCollapsed && !isMobile ? "hidden" : "flex",
      )}
      onClick={(e) => {
        e.stopPropagation()
        toggleSection(sectionKey)
      }}
    >
      <Icon className={cn(
          "h-4 w-4 ml-3 mb-0.5 gap-3",
          iconStyle,
      )}/>
      <span className="text-xs font-medium uppercase tracking-wider px-1.5">
        {title}
      </span>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-gray-400 transition-all duration-200 ease-in-out transform",
          "group-hover:text-gray-600 dark:group-hover:text-gray-300",
          isVisible ? "rotate-180" : "rotate-0",
        )}
      />
    </button>
  )
}
