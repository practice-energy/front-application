"use client"

import { ChevronDown, GalleryHorizontalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SectionHeaderProps } from "../types/sidebar.types"

export function SectionHeader({
  title,
  sectionKey,
  sectionVisibility,
  toggleSection,
  isCollapsed,
  isMobile,
  icon: Icon = GalleryHorizontalEnd,
  iconStyle = "",
  toggleStyle
}: SectionHeaderProps) {
  const isVisible = sectionVisibility[sectionKey]

  return (
      <div>
        <button
            className={cn(
                "flex items-center w-full py-3 px-1 group transition-all duration-100 ease-in-out gap-3 text-simple text-neutral-700",
                "rounded-sm",
                isCollapsed && !isMobile ? "hidden" : "flex",
            )}
            onClick={(e) => {
              e.stopPropagation()
              toggleSection(sectionKey)
            }}
        >
          <Icon className={cn(
              "h-6 w-6 mb-0.5",
              iconStyle,
          )}/>
          <h3 className="font-semibold">
        {title}
      </h3>

          <ChevronDown
              className={cn(
                  "w-6 h-6 text-colors-custom-accent transition-all duration-200 ease-in-out transform ml-auto",
                  isVisible ?  "rotate-0" : "rotate-180",
                  toggleStyle || "",
              )}
          />
        </button>
      </div>
  )
}
