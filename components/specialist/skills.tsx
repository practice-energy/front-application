"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import type { ProfileData } from "@/components/profile/types/common"
import { EnhancedInput } from "@/components/enhanced-input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import {AddEntityButton} from "@/components/add-entity-button";
import { BurnEntityButton } from "../burn-entity-button"

interface SkillsProps {
  title: string
  items: string[]
  isEditMode: boolean
  onSkillChange: (index: number, value: string) => void
  onAddSkill: () => void
  onRemoveSkill: (index: number) => void
}

export function Skills({
                         title,
                         items,
                         isEditMode,
                         onSkillChange,
                         onAddSkill,
                         onRemoveSkill,
}: SkillsProps) {
  const isMobile = useIsMobile()

  if (!items || (items.length === 0 && !isEditMode)) return null

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2">
        <div
            className={cn(
                "font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed",
                isMobile ? "text-mobilebase" : "text-base",
            )}
        >
          {title}
        </div>
        {isEditMode && (<AddEntityButton
            onClick={onAddSkill}
        />)}
      </div>

      {isEditMode ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <EnhancedInput
                  value={item}
                  onChange={(e) => onSkillChange(index, e.target.value)}
                  placeholder="..."
                  className="w-full"
                />
              </div>
              <BurnEntityButton
                onClick={() => onRemoveSkill(index)}
                className="mb-2 w-9 h-9"
                iconSize={24}
              />
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2 ml-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-3 h-3 bg-violet-500 dark:bg-violet-600 rounded-sm mt-1.5 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
