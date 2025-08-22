"use client"
import { ChevronDown } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { AddEntityButton } from "@/src/components/add-entity-button"

interface SettingsSectionHeaderProps {
  title: string
  sectionKey: string
  sectionVisibility: Record<string, boolean>
  toggleSection?: (sectionKey: string) => void
  isMobile: boolean
  iconStyle?: string
  onAddClick?: () => void
  showAddButton?: boolean
  trackingWider?: boolean
}

export function SettingsSectionHeader({
  title,
  sectionKey,
  sectionVisibility,
  toggleSection,
  isMobile,
  iconStyle = "",
  onAddClick,
  showAddButton = false,
    trackingWider = true,
}: SettingsSectionHeaderProps) {
  const isVisible = sectionVisibility[sectionKey]

  if (toggleSection) {
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
            {showAddButton && onAddClick && <AddEntityButton onClick={onAddClick} />}
            <div className="tracking-wider font-semibold">{title}</div>
            <ChevronDown
                className={cn(
                    "w-6 h-6 text-colors-custom-accent transition-all duration-200 ease-in-out transform ml-auto",
                    isVisible ? "rotate-0" : "rotate-180",
                )}
            />
          </button>
        </div>
    )
  }

  return (<div className={cn("flex items-center w-full py-3 group transition-all duration-100 ease-in-out gap-3 text-simple text-neutral-900",
      "rounded-sm",)}>
    {showAddButton && onAddClick && <AddEntityButton onClick={onAddClick} />}
    <div className={cn(trackingWider && "tracking-wider", "font-semibold")}>{title}</div>
  </div>)
}
