"use client"

import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { cn } from "@/lib/utils"
import {Check, Edit, Eye, ScanEye} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ModeToggleBarProps {
  isEditMode: boolean
  onModeToggle: (mode: "view" | "edit") => void
  onPublish?: () => void
  hasErrors?: boolean
  errors?: Record<string, string>
  hasChanges?: boolean
  isSaving?: boolean
}

export function ModeToggleBar({
                                isEditMode,
                                onModeToggle,
                                onPublish,
                                hasErrors = false,
                                errors = {},
                                hasChanges = false,
                                isSaving = false,
                              }: ModeToggleBarProps) {
  const { toast } = useToast()

  const handleModeChange = (mode: "view" | "edit") => {
    if (isEditMode && mode === "view" && hasErrors) {
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

  const handlePublish = () => {
    if (hasErrors) {
      const errorMessages = Object.values(errors).filter(Boolean)
      toast({
        title: "Cannot publish",
        description:
            errorMessages.length > 0
                ? `Please fix the following errors: ${errorMessages.join(", ")}`
                : "Please fix all errors before publishing",
        variant: "destructive",
      })
      return
    }

    if (onPublish) {
      onPublish()
    }
  }

  return (
      <div
          className={cn( "transition-all duration-300 ease-in-out")}
          style={{
            transition: `margin-left ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}, background-color 200ms ease`,
          }}
      >
        <div className="flex items-center gap-6">
          {isEditMode && (
              <>
                <button
                    onClick={() => handleModeChange("view")}
                    disabled={isSaving}
                    className={cn(
                        "flex items-center h-9 gap-2 pl-2 justify-center rounded-sm bg-whtie  hover:bg-violet-50 shadow-sm transition-colors",
                        isSaving && "opacity-50 cursor-not-allowed"
                    )}
                    title="Превью"
                >
                    <div className="flex flex-row text-gray-600 items-center gap-1">
                        <ScanEye className="h-6 w-6" />
                        <div>Превью</div>
                    </div>

                    <div
                        className={cn(
                            "w-9 h-9 flex items-center justify-center rounded-sm transition-colors",
                                 "bg-violet-600",
                            isSaving && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Edit className={cn(
                            "h-6 w-6",
                            isEditMode ? "text-white" : "text-gray-600 dark:text-gray-400"
                        )} />
                    </div>
                </button>
              </>
          )}

          {!isEditMode && (
              <button
                  onClick={() => handleModeChange(isEditMode ? "view" : "edit")}
                  disabled={isSaving}
                  className={cn(
                      "w-9 h-9 flex items-center justify-center rounded-sm shadow-sm transition-colors",
                          "bg-white hover:bg-violet-50",
                      isSaving && "opacity-50 cursor-not-allowed"
                  )}
              >
                  <Edit className={cn(
                      "h-6 w-6",
                      isEditMode ? "text-white" : "text-gray-600 dark:text-gray-400"
                  )} />
              </button>
          )}

          {isEditMode && (
              <button
                  onClick={handlePublish}
                  disabled={isSaving || hasErrors}
                  className={cn(
                      "w-9 h-9 flex items-center justify-center rounded-sm bg-teal-400 transition-colors",
                      "hover:bg-teal-500",
                      (isSaving || hasErrors) && "opacity-50 cursor-not-allowed"
                  )}
                  title="Опубликовать"
              >
                  <Check className="h-6 w-6 text-white" />
              </button>
          )}
        </div>
      </div>
  )
}