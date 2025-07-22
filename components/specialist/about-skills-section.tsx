"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skills } from "./skills"

interface AboutSkillsSectionProps {
  description: string
  skills: string[]
}

export function AboutSkillsSection({ description, skills }: AboutSkillsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowToggle, setShouldShowToggle] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight
      setShouldShowToggle(height > 100)
    }
  }, [description, skills])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="relative px-6 pt-6 flex pb-7">
      {/* Колонка "О мастере" (2/3 ширины) */}
      <div className="w-2/3 pr-6">
        <div className="text-base font-semibold text-neutral-900 mb-4 line-clamp-1 leading-relaxed">О мастере</div>
        <div className="relative">
          <div
            ref={contentRef}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "" : shouldShowToggle ? "h-[100px]" : ""
            }`}
          >
            <div className="ml-1 text-neutral-700">{description}</div>
          </div>

          {/* Fade overlay when collapsed */}
          {shouldShowToggle && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}

          {shouldShowToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              className="text-violet-600 hover:text-violet-700 p-0 h-auto font-medium mt-2"
            >
              {isExpanded ? "Скрыть" : "Раскрыть больше"}
            </Button>
          )}
        </div>
      </div>

      {/* Колонка "Навыки" (1/3 ширины) */}
      <div className="w-1/3">
        <Skills title="Навыки" items={skills} />
      </div>
    </div>
  )
}
