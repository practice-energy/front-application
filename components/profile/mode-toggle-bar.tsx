"use client"

import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar"
import { cn } from "@/lib/utils"
import { AlertCircle, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ModeToggleBarProps {
  isEditMode: boolean
  onModeToggle: (mode: "view" | "edit") => void
  hasErrors?: boolean
  errors?: Record<string, string>
  hasChanges?: boolean
  isSaving?: boolean
}

export function ModeToggleBar({
  isEditMode,
  onModeToggle,
  hasErrors = false,
  errors = {},
  hasChanges = false,
  isSaving = false,
}: ModeToggleBarProps) {
  const { toast } = useToast()

  const handleModeChange = (mode: "view" | "edit") => {
    if (isEditMode && mode === "view" && hasErrors) {
      // Show error toast and prevent mode change
      const errorMessages = Object.values(errors).filter(Boolean)
      toast({
        title: "Cannot save changes",
        description:
          errorMessages.length > 0
            ? `Please fix the following errors: ${errorMessages.join(", ")}`
            : "Please fix all errors before saving",
        variant: "destructive",
      })
      return
    }

    onModeToggle(mode)
  }

  return (
    <div
      className={cn("absolute top-20 right-12 z-10", "transition-all duration-300 ease-in-out")}
      style={{
        transition: `margin-left ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}, background-color 200ms ease`,
      }}
    >
      <div className="items-center gap-3">
        {/* Segmented Control Toggle */}
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors duration-200 shadow-md border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleModeChange("view")}
            disabled={isSaving}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2",
              !isEditMode
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
              isSaving && "opacity-50 cursor-not-allowed",
            )}
          >
            {!isEditMode && <Check className="h-3 w-3" />}
            Read
          </button>
          <button
            onClick={() => handleModeChange("edit")}
            disabled={isSaving}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2",
              isEditMode
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
              isSaving && "opacity-50 cursor-not-allowed",
            )}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
