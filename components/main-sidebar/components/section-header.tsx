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
      <div>
        <button
            className={cn(
                "flex items-center w-full py-3 px-1 pl-2 group transition-all duration-100 ease-in-out gap-3 text-simple text-gray-700 opacity-80",
                "md:hover:bg-violet-50 rounded-sm",
                isCollapsed && !isMobile ? "hidden" : "flex",
            )}
            onClick={(e) => {
              e.stopPropagation()
              toggleSection(sectionKey)
            }}
        >
          <Icon className={cn(
              "h-6 w-6 mb-0.5 ml-3",
              iconStyle,
          )}/>
          <h3 className="tracking-wider font-semibold">
        {title}
      </h3>
          <ChevronDown
              className={cn(
                  "w-6 h-6 text-gray-400 transition-all duration-200 ease-in-out transform ml-auto",
                  "group-hover:text-gray-600 dark:group-hover:text-gray-300",
                  isVisible ? "rotate-180" : "rotate-0",
              )}
          />
        </button>
      </div>
  )
}
