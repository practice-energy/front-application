"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skills } from "./skills"
import { cn } from "@/lib/utils"
import {ChevronDown} from "lucide-react";

interface AboutSkillsSectionProps {
    description: string
    skills: string[]
}

export function AboutSkillsSection({ description, skills }: AboutSkillsSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [shouldShowToggle, setShouldShowToggle] = useState(false)
    const [contentHeight, setContentHeight] = useState(0)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (contentRef.current) {
            const height = contentRef.current.scrollHeight
            setContentHeight(height)
            setShouldShowToggle(height > 130)
        }
    }, [description, skills])

    const handleToggle = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="relative px-6 pt-6 pb-7">
            <div
                ref={contentRef}
                className="overflow-hidden transition-all duration-500 ease-in-out flex"
                style={{
                    height: isExpanded
                        ? `${contentHeight}px`
                        : shouldShowToggle
                            ? '130px'
                            : 'auto'
                }}
            >
                {/* Колонка "О мастере" (2/3 ширины) */}
                <div className="w-2/3 pr-6">
                    <div className="text-base font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed">
                        О мастере
                    </div>
                    <div
                        className={cn(
                            "ml-1 text-neutral-700 transition-opacity duration-300",
                            !isExpanded && "line-clamp-3"
                        )}
                    >
                        {description}
                    </div>
                </div>

                {/* Колонка "Навыки" (1/3 ширины) */}
                <div className="w-1/3">
                    <Skills title="Навыки" items={skills} />
                </div>
            </div>

            {/* Fade overlay when collapsed */}
            {shouldShowToggle && !isExpanded && (
                <div className="absolute w-full h-14 bottom-[56px] left-0 right-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-500" />
            )}

            {shouldShowToggle && (
                <button
                    onClick={handleToggle}
                    className="text-violet-600 hover:text-violet-700 h-auto mt-1 ml-1 transition-colors duration-300 flex items-center gap-1 group"
                >
                    {isExpanded ? "Свернуть" : "Раскрыть больше"}
                    <ChevronDown width={24} height={24} className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
                </button>
            )}
        </div>
    )
}
