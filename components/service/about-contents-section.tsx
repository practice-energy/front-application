"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Included } from "@/components/service/included"

interface AboutContentsSectionProps {
  description: string
  contents: string[]
}

export function AboutContentsSection({ description, contents }: AboutContentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showExpandButton, setShowExpandButton] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight
      setShowExpandButton(height > 100)
    }
  }, [description, contents])

  return (
    <div className="bg-white p-6 space-y-6">
      <div className="relative">
        <div
          ref={contentRef}
          className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-none" : "max-h-[100px]"}`}
        >
          {/* About This Service Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">О данной услуге</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
          </div>

          {/* What's Included Section */}
          {contents && contents.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Что входит в услугу</h3>
              <Included items={contents} />
            </div>
          )}
        </div>

        {/* Gradient overlay when collapsed */}
        {!isExpanded && showExpandButton && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand/Collapse button */}
      {showExpandButton && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
          >
            {isExpanded ? (
              <>
                Скрыть
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Раскрыть больше
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
