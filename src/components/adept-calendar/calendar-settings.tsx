"use client"

import { useState } from "react"
import type { CalendarRestrictions } from "@/src/types/calendar-event"
import { cn } from "@/src/lib/utils"
import { useIsMobile } from "@/src/hooks/use-mobile"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { TimezoneSection } from "./settings-sections/timezone-section"
import { PeriodsFormatsSection } from "./settings-sections/periods-formats-section"
import { ExceptionalSlotsSection } from "./settings-sections/exceptional-slots-section"
import { SettingsSectionHeader } from "./settings-sections/settings-section-header"
import { SettingsSectionContent } from "./settings-sections/settings-section-content"
import { Settings, Check } from "lucide-react"

interface CalendarSettingsProps {
  restrictions: CalendarRestrictions
  onUpdate: (restrictions: CalendarRestrictions) => void
  disableSettings: () => void
}

export function CalendarSettings({ restrictions, onUpdate, disableSettings }: CalendarSettingsProps) {
  const [editingRestrictionId, setEditingRestrictionId] = useState<string | null>(null)
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({
    timezone: true,
    periods: true,
    exceptional: true,
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const isMobile = useIsMobile()

  const toggleSection = (sectionKey: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  return (
    <div className="flex flex-1 flex-col h-screen bg-white rounded-sm">
      <ScrollArea className="flex-1 flex h-screen">
        <div className="flex flex-row items-center justify-between gap-3 flex-1 pb-2 px-3">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center justify-center aspect-square rounded-sm shadow-custom h-10 w-10 p-1 border-0 bg-colors-custom-accent">
              <Settings className="h-[30px] w-[30px] text-white" />
            </div>
            <div className={cn("font-bold", isMobile ? "text-mobilebase" : "text-base")}>Установки календаря</div>
          </div>
          
          <button 
            onClick={disableSettings}
            className="hidden md:flex items-center justify-center aspect-square rounded-sm shadow-custom h-10 w-10 p-1 border-0 bg-teal-400 hover:bg-teal-500 transition-colors"
          >
            <Check className="h-[30px] w-[30px] text-white" />
          </button>
        </div>

        <div className="space-y-2 px-4">
          <SettingsSectionHeader
            title="Часовой пояс"
            sectionKey="timezone"
            sectionVisibility={sectionVisibility}
            toggleSection={toggleSection}
            isMobile={isMobile}
            iconStyle="text-colors-custom-accent"
          />
          <SettingsSectionContent sectionKey="timezone" sectionVisibility={sectionVisibility}>
              <TimezoneSection restrictions={restrictions} onUpdate={onUpdate} />
          </SettingsSectionContent>

          <SettingsSectionHeader
            title="Периоды и форматы"
            sectionKey="periods"
            sectionVisibility={sectionVisibility}
            toggleSection={toggleSection}
            isMobile={isMobile}
            iconStyle="text-colors-custom-accent"
          />
          <SettingsSectionContent sectionKey="periods" sectionVisibility={sectionVisibility}>
            <PeriodsFormatsSection
              restrictions={restrictions}
              onUpdate={onUpdate}
              editingRestrictionId={editingRestrictionId}
              setEditingRestrictionId={setEditingRestrictionId}
            />
          </SettingsSectionContent>

          <SettingsSectionHeader
            title="Исключительные слоты"
            sectionKey="exceptional"
            sectionVisibility={sectionVisibility}
            toggleSection={toggleSection}
            isMobile={isMobile}
            iconStyle="text-colors-custom-accent"
            showAddButton={editingRestrictionId === null}
            onAddClick={() => {
              setSectionVisibility(
                  (prev) => ({ ...prev, exceptional: false })
              )
              setShowDatePicker(true)
            }}
          />

          <SettingsSectionContent sectionKey="exceptional" sectionVisibility={sectionVisibility}>
            <ExceptionalSlotsSection
              restrictions={restrictions}
              onUpdate={onUpdate}
              editingRestrictionId={editingRestrictionId}
              setEditingRestrictionId={setEditingRestrictionId}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
            />
          </SettingsSectionContent>
        </div>

        <div className="flex items-center justify-center h-48" />
      </ScrollArea>
    </div>
  )
}
