"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/contexts/sidebar-context"
import Image from "next/image"

interface SidebarToggleButtonProps {
  sidebarId: string
  className?: string
}

export function SidebarToggleButton({ sidebarId, className }: SidebarToggleButtonProps) {
  const { isCollapsed, toggleSidebar } = useSidebar()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    toggleSidebar()

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
                type="button"
                onClick={handleToggle}
                aria-expanded={!isCollapsed}
                aria-controls={sidebarId}
                className={cn(
                    "relative p-0 transition-all duration-300 ease-in-out",
                    "hover:scale-105 active:scale-95",
                    "cursor-pointer focus:outline-none",
                    "touch-manipulation flex items-center justify-center",
                    className,
                )}
                data-testid="sidebar-toggle-button"
            >
              {isAnimating ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-700 dark:text-gray-300" />
              ) : (
                    <Image
                        src="/sidebar-toggle.svg"
                        alt="Toggle sidebar"
                        width={60}
                        height={60}
                        className={cn(
                            "transition-all duration-300 ease-in-out",
                            {
                              "rotate-0": isCollapsed,
                              "rotate-180": !isCollapsed,
                              "scale-110": isAnimating,
                              "scale-100": !isAnimating,
                            }
                        )}
                        style={{
                          filter: isCollapsed
                              ? "brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(500%) hue-rotate(0deg) brightness(95%) contrast(85%)"
                              : !isAnimating
                                  ? "brightness(0) saturate(100%) invert(45%) sepia(69%) saturate(4417%) hue-rotate(244deg) brightness(96%) contrast(91%)"
                                  : "brightness(0) saturate(100%) invert(45%) sepia(69%) saturate(4417%) hue-rotate(244deg) brightness(96%) contrast(91%)",
                          transition: "filter 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isCollapsed && !isAnimating) {
                            e.currentTarget.style.filter =
                                "brightness(0) saturate(100%) invert(45%) sepia(69%) saturate(5000%) hue-rotate(244deg) brightness(110%) contrast(91%)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCollapsed && !isAnimating) {
                            e.currentTarget.style.filter =
                                "brightness(0) saturate(100%) invert(45%) sepia(69%) saturate(4417%) hue-rotate(244deg) brightness(96%) contrast(91%)";
                          }
                        }}
                        onMouseDown={(e) => {
                          if (!isCollapsed && !isAnimating) {
                            e.currentTarget.style.filter =
                                "brightness(0) saturate(100%) invert(45%) sepia(69%) saturate(4417%) hue-rotate(244deg) brightness(85%) contrast(91%)";
                          }
                        }}
                        onMouseUp={(e) => {
                          if (!isCollapsed && !isAnimating) {
                            e.currentTarget.style.filter =
                                "brightness(0) saturate(100%) invert(45%) sepia(69%) saturate(5000%) hue-rotate(244deg) brightness(110%) contrast(91%)";
                          }
                        }}
                    />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
  )
}
