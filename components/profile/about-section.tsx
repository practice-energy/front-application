"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"
import { EnhancedInput } from "@/components/enhanced-input"
import type { ProfileData } from "@/components/profile/types/common"

interface AboutSectionProps {
  description: string
  isEditMode: boolean
  onInputChange: (field: keyof ProfileData, value: string | string[] | File[]) => void
  errors: Record<string, string>
}

export function AboutSection({ description, isEditMode, onInputChange, errors }: AboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowToggle, setShouldShowToggle] = useState(false)
  const [contentHeight, setContentHeight] = useState<number | string>('auto')
  const contentRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Функция для расчета высоты контента
  const calculateContentHeight = () => {
    if (!contentRef.current) return 0

    // Сохраняем текущую высоту перед расчетом
    const prevHeight = contentRef.current.style.height
    contentRef.current.style.height = 'auto'

    const height = contentRef.current.scrollHeight
    contentRef.current.style.height = prevHeight

    return height
  }

  useEffect(() => {
    if (isEditMode) {
      // В режиме редактирования всегда показываем полностью
      setIsExpanded(true)
      setContentHeight('auto')
      setShouldShowToggle(false)
    } else {
      const newHeight = calculateContentHeight()
      setContentHeight(newHeight)
      setShouldShowToggle(newHeight > 130)
    }
  }, [description, isEditMode, isMobile])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
      <div className={cn("relative pt-6 pb-6", isMobile ? "px-4" : "px-6")}>
        <div
            ref={contentRef}
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              height: isEditMode ? 'auto' : isExpanded ? `${contentHeight}px` : shouldShowToggle ? '130px' : 'auto'
            }}
        >
          <div className={cn("w-full")}>
            <div className={cn(
                "font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed",
                isMobile ? "text-mobilebase" : "text-base",
            )}>
              Обо мне
            </div>

            {isEditMode ? (
                <EnhancedInput
                    value={description}
                    onChange={(e) => onInputChange("bio", e.target.value)}
                    placeholder="Расскажите о себе..."
                    error={errors.bio}
                    required
                    showEditIcon
                    rows={3}
                    type="textarea"
                />
            ) : (
                <div className={cn("ml-1 text-neutral-700 transition-opacity duration-300")}>
                  {description || "Нет описания"}
                </div>
            )}
          </div>
        </div>

        {/* Fade overlay when collapsed */}
        {!isEditMode && shouldShowToggle && !isExpanded && (
            <div className={cn(
                "absolute w-full h-14 left-0 right-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-500",
                "bottom-[50px]"
            )}/>
        )}

        {!isEditMode && shouldShowToggle && (
            <button
                onClick={handleToggle}
                className="text-violet-600 hover:text-violet-700 h-auto ml-1 mt-1 transition-colors duration-300 flex items-center gap-1 group"
            >
              {isExpanded ? "Свернуть" : "Раскрыть больше"}
              <ChevronDown
                  width={24}
                  height={24}
                  className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")}
              />
            </button>
        )}
      </div>
  )
}
