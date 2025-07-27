"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import type { ProfileData } from "@/components/profile/types/common"
import { EnhancedInput } from "@/components/enhanced-input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface SkillsProps {
  title: string
  items: string[]
  isEditMode: boolean
  onInputChange: (field: keyof ProfileData, value: string | string[] | File[]) => void
  errors: Record<string, string>
  fieldKey: keyof ProfileData
}

export function Skills({ title, items, isEditMode, onInputChange, errors, fieldKey }: SkillsProps) {
  const isMobile = useIsMobile()

  const handleSkillChange = (index: number, value: string) => {
    const updatedItems = [...items]
    updatedItems[index] = value
    onInputChange(fieldKey, updatedItems)
  }

  const handleAddSkill = () => {
    const updatedItems = [...items, ""]
    onInputChange(fieldKey, updatedItems)
  }

  const handleRemoveSkill = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)
    onInputChange(fieldKey, updatedItems)
  }

  if (!items || (items.length === 0 && !isEditMode)) return null

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed",
          isMobile ? "text-mobilebase" : "text-base",
        )}
      >
        {title}
      </div>

      {isEditMode ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-3 h-3 bg-violet-500 dark:bg-violet-600 rounded-sm flex-shrink-0" />
              <div className="flex-1">
                <EnhancedInput
                  value={item}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder={`Enter ${title.toLowerCase().slice(0, -1)}`}
                  className="w-full"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSkill(index)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSkill}
            className="w-fit flex items-center gap-2 mt-2 bg-transparent"
          >
            <Plus className="h-4 w-4" />
            Add {title.toLowerCase().slice(0, -1)}
          </Button>

          {errors[fieldKey] && <p className="text-sm text-red-500 mt-1">{errors[fieldKey]}</p>}
        </div>
      ) : (
        <ul className="space-y-2 ml-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-3 h-3 bg-violet-500 dark:bg-violet-600 rounded-sm mt-1.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
