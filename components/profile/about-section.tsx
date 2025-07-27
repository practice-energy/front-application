"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import {ChevronDown} from "lucide-react";
import {useIsMobile} from "@/components/ui/use-mobile";
import {EnhancedInput} from "@/components/enhanced-input";
import {ProfileData} from "@/components/profile/types/common";

interface AboutSectionProps {
    description: string
    isEditMode: boolean
    onInputChange: (field: keyof ProfileData, value: string | string[] | File[]) => void
    errors: Record<string, string>
}

export function AboutSection({ description, isEditMode, onInputChange, errors }: AboutSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [shouldShowToggle, setShouldShowToggle] = useState(false)
    const [contentHeight, setContentHeight] = useState(0)
    const contentRef = useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile()

    useEffect(() => {
        // Рассчитываем высоту только для описания на мобильных устройствах
        const targetElement = contentRef.current;
        if (targetElement) {
            const height = targetElement.scrollHeight
            setContentHeight(height)
            setShouldShowToggle(height > 130)
        }
    }, [description]) // Добавили isMobile в зависимости

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
                className="overflow-hidden transition-all duration-500 ease-in-out flex"
                style={{
                    height: isExpanded
                        ? `${contentHeight}px`
                        : shouldShowToggle
                            ? `130px`
                            : 'auto'
                }}
            >
                <div
                    className={cn("w-full"
                    )}
                >
                    <div className={cn(
                        "font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed",
                        isMobile ? "text-mobilebase" : "text-base",)}
                    >
                        Обо мне
                    </div>
                    {isEditMode ? (
                        <EnhancedInput
                            value={description}
                            onChange={(e) => onInputChange("bio", e.target.value)}
                            placeholder="Обо мне"
                            error={errors.name}
                            required
                            showEditIcon
                            rows={3}
                        />
                    ) : (<div className={cn("ml-1 text-neutral-700 transition-opacity duration-300",)}>
                            {description}
                    </div>)}
                </div>
            </div>

            {/* Fade overlay when collapsed */}
            {shouldShowToggle && !isExpanded && !isEditMode && (
                <div className={cn(
                    "absolute w-full h-14  left-0 right-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-500",
                    "bottom-[50px]"
                )}/>
            )}

            {shouldShowToggle && !isEditMode && (
                <button
                    onClick={handleToggle}
                    className="text-violet-600 hover:text-violet-700 h-auto ml-1 mt-1 transition-colors duration-300 flex items-center gap-1 group"
                >
                    {isExpanded ? "Свернуть" : "Раскрыть больше"}
                    <ChevronDown width={24} height={24} className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
                </button>
            )}
        </div>
    )
}
