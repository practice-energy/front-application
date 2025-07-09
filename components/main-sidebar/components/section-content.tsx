"use client"

import { cn } from "@/lib/utils"
import type { SectionContentProps } from "../types/sidebar.types"

export function SectionContent({ sectionKey, sectionVisibility, children }: SectionContentProps) {
  const isVisible = sectionVisibility[sectionKey]

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-200 ease-in-out",
        isVisible ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
      )}
    >
      {children}
    </div>
  )
}
