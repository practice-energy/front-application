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
  icon?: React.ComponentType<{ className?: string }>
  iconStyle?: string
}

export function SettingsSectionHeader({
  title,
  sectionKey,
  sectionVisibility,
  toggleSection,
  isMobile,
  icon: Icon,
  iconStyle = "",
}: SettingsSectionHeaderProps) {
  const isVisible = sectionVisibility[sectionKey]

  return (
    <div>
      <button
        className={cn(
          "flex items-center w-full py-3 px-1 pl-2 group transition-all duration-100 ease-in-out gap-3 text-simple text-gray-700 opacity-80",
          "rounded-sm",
        )}
        onClick={(e) => {
          e.stopPropagation()
          toggleSection(sectionKey)
        }}
      >
        {Icon && <Icon className={cn("h-6 w-6 mb-0.5 ml-3", iconStyle)} />}
        <h3 className="tracking-wider font-semibold">{title}</h3>
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
