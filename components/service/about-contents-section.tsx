"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"
import { EnhancedInput } from "@/components/enhanced-input"
import {Skills} from "@/components/specialist/skills";

interface AboutContentsSectionProps {
    contents: string
    included?: string[]
    isEditMode?: boolean
    onContentsChange?: (value: string) => void
    onIncludedChange?: (index: number, value: string) => void
    onAddIncluded?: () => void
    onRemoveIncluded?: (index: number) => void
    errors?: Record<string, string>
    contentsTitle?: string
    includedTitle?: string
}

export function AboutContentsSection({
                                       contents,
                                       included,
                                       contentsTitle = "О практис",
                                       includedTitle = "Наполнение",
                                       isEditMode = false,
                                       onContentsChange,
                                       onIncludedChange,
                                       onAddIncluded,
                                       onRemoveIncluded,
                                       errors
                                   }: AboutContentsSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [shouldShowToggle, setShouldShowToggle] = useState(false)
    const [contentHeight, setContentHeight] = useState<number | string>('auto')
    const contentRef = useRef<HTMLDivElement>(null)
    const descriptionRef = useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile()

    // Функция для расчета высоты контента
    const calculateContentHeight = () => {
        const targetElement = isMobile ? descriptionRef.current : contentRef.current
        if (targetElement) {
            // Сохраняем текущую высоту перед расчетом, чтобы избежать скачков
            const prevHeight = targetElement.style.height
            targetElement.style.height = 'auto'

            const height = targetElement.scrollHeight
            targetElement.style.height = prevHeight

            return height
        }
        return 0
    }

    // Эффект для обновления высоты при изменении контента или режима
    useEffect(() => {
        const newHeight = calculateContentHeight()
        setContentHeight(newHeight)
        setShouldShowToggle(newHeight > 130 && !isEditMode)

        // Если включен режим редактирования, автоматически разворачиваем
        if (isEditMode) {
            setIsExpanded(true)
        }
    }, [contents, included, isMobile, isEditMode])

    const handleToggle = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className={cn(
            "relative pt-6 pb-6",
            isMobile ? "px-4" : "px-6"
        )}>
            <div
                ref={contentRef}
                className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out flex",
                )}
                style={{
                    height: isEditMode
                        ? 'auto'
                        : isExpanded
                            ? `${contentHeight}px`
                            : shouldShowToggle
                                ? '130px'
                                : 'auto'
                }}
            >
                {/* Колонка "О мастере" (2/3 ширины) */}
                <div
                    ref={isMobile ? descriptionRef : null}
                    className={cn(
                        isMobile ? "w-full" : "w-2/3 pr-6",
                    )}
                >
                    <div className={cn(
                        "font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed",
                        isMobile ? "text-mobilebase" : "text-base",
                    )}>
                        {contentsTitle}
                    </div>

                    {isEditMode ? (
                        <EnhancedInput
                            value={contents}
                            onChange={(e) => onContentsChange?.(e.target.value)}
                            placeholder="..."
                            type="textarea"
                            rows={4}
                            error={errors?.contents}
                            showEditIcon
                        />
                    ) : (
                        <div className={cn(
                            "ml-1 text-neutral-700 transition-opacity duration-300",
                        )}>
                            {contents || (isEditMode ? "" : "Нет описания")}
                        </div>
                    )}
                </div>

                {/* Колонка "Навыки" (1/3 ширины) */}
                {!isMobile && (
                    <div className="w-1/3">
                        {included && (
                            <Skills
                                title={includedTitle}
                                items={included}
                                isEditMode={isEditMode}
                                onSkillChange={onIncludedChange}
                                onAddSkill={onAddIncluded}
                                onRemoveSkill={onRemoveIncluded}
                            />
                        )}
                    </div>
                )}
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
                    <ChevronDown width={24} height={24} className={cn(
                        "transition-transform duration-300",
                        isExpanded ? "rotate-180" : ""
                    )} />
                </button>
            )}
        </div>
    )
}
