"use client"

import { useState } from "react"
import type { CalendarRestrictions } from "@/types/calendar-event"
import { SettingsButton } from "@/components/calendar-settings-button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TimezoneSection } from "./settings-sections/timezone-section"
import { PeriodsFormatsSection } from "./settings-sections/periods-formats-section"
import { ExceptionalSlotsSection } from "./settings-sections/exceptional-slots-section"

interface CalendarSettingsProps {
  restrictions: CalendarRestrictions
  onUpdate: (restrictions: CalendarRestrictions) => void
  disableSettings: () => void
}

export function CalendarSettings({ restrictions, onUpdate, disableSettings }: CalendarSettingsProps) {
  const [editingRestrictionId, setEditingRestrictionId] = useState<string | null>(null)
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col h-screen bg-white rounded-sm">
      <div className="flex flex-row items-center gap-3 py-4 px-3">
        <SettingsButton
          onClick={disableSettings}
          className="bg-violet-600 hover:bg-violet-700 border-0 flex"
          iconClassName="text-white"
        />
        <div className={cn("font-bold", isMobile ? "text-mobilebase" : "text-base")}>Установки календаря</div>
      </div>
      <ScrollArea className="flex-1 flex h-screen">
        <div
          className={cn(
            "sticky top-[-1px] left-0 right-0 h-2 bg-gradient-to-b to-transparent pointer-events-none z-50",
            "from-white via-white/80 to-transparent",
          )}
        />

        <div className="space-y-6 px-4">
          <TimezoneSection restrictions={restrictions} onUpdate={onUpdate} />

          <PeriodsFormatsSection
            restrictions={restrictions}
            onUpdate={onUpdate}
            editingRestrictionId={editingRestrictionId}
            setEditingRestrictionId={setEditingRestrictionId}
          />

          <ExceptionalSlotsSection
            restrictions={restrictions}
            onUpdate={onUpdate}
            editingRestrictionId={editingRestrictionId}
            setEditingRestrictionId={setEditingRestrictionId}
          />
        </div>

        <div className="flex items-center justify-center h-24" />
      </ScrollArea>
    </div>
  )
}
