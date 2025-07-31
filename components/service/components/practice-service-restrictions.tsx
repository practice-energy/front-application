"use client"

import { ExceptionalSlotsSection } from "@/components/adept-calendar/settings-sections/exceptional-slots-section"
import { PeriodsFormatsSection } from "@/components/adept-calendar/settings-sections/periods-formats-section"
import type { CalendarRestrictions } from "@/types/calendar-event"
import { useIsMobile } from "@/hooks/use-mobile"

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

  if (isMobile) {
    return (
      <div className="space-y-6">
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
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <PeriodsFormatsSection
          restrictions={restrictions}
          onUpdate={onUpdate}
          editingRestrictionId={editingRestrictionId}
          setEditingRestrictionId={setEditingRestrictionId}
        />
      </div>
      <div>
        <ExceptionalSlotsSection
          restrictions={restrictions}
          onUpdate={onUpdate}
          editingRestrictionId={editingRestrictionId}
          setEditingRestrictionId={setEditingRestrictionId}
        />
      </div>
    </div>
  )
}
