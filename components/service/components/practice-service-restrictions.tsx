"use client"

import { ExceptionalSlotsSection } from "@/components/adept-calendar/settings-sections/exceptional-slots-section"
import { PeriodsFormatsSection } from "@/components/adept-calendar/settings-sections/periods-formats-section"
import type { CalendarRestrictions } from "@/types/calendar-event"
import { useIsMobile } from "@/hooks/use-mobile"
import {useState} from "react";
import {SettingsSectionHeader} from "@/components/adept-calendar/settings-sections/settings-section-header";
import {SettingsSectionContent} from "@/components/adept-calendar/settings-sections/settings-section-content";
import {TimezoneSection} from "@/components/adept-calendar/settings-sections/timezone-section";

interface PracticeServiceRestrictionsProps {
  restrictions: CalendarRestrictions
  onUpdate: (restrictions: CalendarRestrictions) => void
  editingRestrictionId: string | null
  setEditingRestrictionId: (id: string | null) => void
}

export function PracticeServiceRestrictions({
  restrictions,
  onUpdate,
  editingRestrictionId,
  setEditingRestrictionId,
}: PracticeServiceRestrictionsProps) {
  const isMobile = useIsMobile()
  const [showDatePicker, setShowDatePicker] = useState(false)
    const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({
        periods: true,
        exceptional: true,
    })

  if (isMobile) {
    return (
          <div className="space-y-2 px-4">
              <SettingsSectionHeader
                  title="Периоды и форматы"
                  sectionKey="periods"
                  sectionVisibility={sectionVisibility}
                  isMobile={isMobile}
                  iconStyle="text-violet-600"
                  trackingWider={false}
              />
              <SettingsSectionContent sectionKey="periods" sectionVisibility={sectionVisibility}>
                  <div className="py-2">
                      <PeriodsFormatsSection
                          restrictions={restrictions}
                          onUpdate={onUpdate}
                          editingRestrictionId={editingRestrictionId}
                          setEditingRestrictionId={setEditingRestrictionId}
                          isCollapsable={false}
                          title={"Периоды и форматы для этой практис"}
                      />
                  </div>
              </SettingsSectionContent>

              <SettingsSectionHeader
                  title="Исключительные слоты"
                  sectionKey="exceptional"
                  sectionVisibility={sectionVisibility}
                  isMobile={isMobile}
                  iconStyle="text-violet-600"
                  showAddButton={editingRestrictionId === null}
                  onAddClick={() => {
                      setShowDatePicker(true)
                  }}
                  trackingWider={false}
              />

              <div className="py-2">
                  <ExceptionalSlotsSection
                      restrictions={restrictions}
                      onUpdate={onUpdate}
                      editingRestrictionId={editingRestrictionId}
                      setEditingRestrictionId={setEditingRestrictionId}
                      showDatePicker={showDatePicker}
                      setShowDatePicker={setShowDatePicker}
                      isCollapsable={false}
                  />
              </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <SettingsSectionHeader
            title="Периоды и форматы"
            sectionKey="periods"
            sectionVisibility={sectionVisibility}
            isMobile={isMobile}
            iconStyle="text-violet-600"
            trackingWider={false}
            />
        <SettingsSectionContent sectionKey="periods" sectionVisibility={sectionVisibility}>
            <div className="py-2">
                <PeriodsFormatsSection
                    restrictions={restrictions}
                    onUpdate={onUpdate}
                    editingRestrictionId={editingRestrictionId}
                    setEditingRestrictionId={setEditingRestrictionId}
                    isCollapsable={false}
                    title={"Периоды и форматы для этой практис"}
                />
            </div>
        </SettingsSectionContent>
      </div>
      <div>
          <SettingsSectionHeader
              title="Исключительные слоты"
              sectionKey="exceptional"
              sectionVisibility={sectionVisibility}
              isMobile={isMobile}
              iconStyle="text-violet-600"
              showAddButton={editingRestrictionId === null}
              onAddClick={() => {
                  setShowDatePicker(true)
              }}
              trackingWider={false}
          />

          <div className="py-2">
              <ExceptionalSlotsSection
                  restrictions={restrictions}
                  onUpdate={onUpdate}
                  editingRestrictionId={editingRestrictionId}
                  setEditingRestrictionId={setEditingRestrictionId}
                  setShowDatePicker={setShowDatePicker}
                  isCollapsable={false}
                  showDatePicker={showDatePicker}
              />
          </div>
      </div>
    </div>
  )
}
