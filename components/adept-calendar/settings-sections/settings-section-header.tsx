"use client"

import type React from "react"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsSectionHeaderProps {
  title: string
  sectionKey: string
  sectionVisibility: Record<string, boolean>
  toggleSection: (sectionKey: string) => void
  isMobile: boolean
  iconStyle?: string
}

export function SettingsSectionHeader({
  title,
  sectionKey,
  sectionVisibility,
  toggleSection,
  isMobile,
  iconStyle = "",
}: SettingsSectionHeaderProps) {
  const isVisible = sectionVisibility[sectionKey]

  return (
    <div>
      <button
        className={cn(
          "flex items-center w-full py-3 group transition-all duration-100 ease-in-out gap-3 text-simple text-neutral-900",
          "rounded-sm",
        )}
        onClick={(e) => {
          e.stopPropagation()
          toggleSection(sectionKey)
        }}
      >
        <div className="tracking-wider font-semibold">{title}</div>
        <ChevronDown
          className={cn(
            "w-6 h-6 text-violet-600 transition-all duration-200 ease-in-out transform ml-auto",
            isVisible ? "rotate-180" : "rotate-0",
          )}
        />
      </button>
    </div>
  )
}
