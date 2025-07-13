"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface AboutSectionProps {
  title: string
  description: string
  fullDescription?: string
  includes?: string[]
  education?: ExperienceItem[]
  experience?: ExperienceItem[]
  showIncludes?: boolean
  showEducationExperience?: boolean
}

interface ExperienceItem {
  description: string
  certificate?: File | null
}

export function AboutSection({
                               title,
                               description,
                               fullDescription,
                               includes,
                               education,
                               experience,
                               showIncludes = false,
                               showEducationExperience = false,
                             }: AboutSectionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [contentHeight, setContentHeight] = useState<number | string>("auto")
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const shouldShowToggle = fullDescription && fullDescription.length > 100

  useEffect(() => {
    if (contentRef.current) {
      if (showFullDescription) {
        // Expand animation
        const fullHeight = contentRef.current.scrollHeight
        setContentHeight(0)
        requestAnimationFrame(() => {
          setContentHeight(fullHeight)
        })
      } else {
        // Collapse animation
        setContentHeight(contentRef.current.scrollHeight)
        requestAnimationFrame(() => {
          setContentHeight(0)
        })
      }
    }
  }, [showFullDescription, fullDescription])

  const handleToggle = () => {
    if (!showFullDescription) {
      setShowFullDescription(true)
    } else {
      setShowFullDescription(false)
      // Scroll to title after collapse animation
      setTimeout(() => {
        titleRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        })
      }, 300)
    }
  }

  return (
      <div className="space-y-6">
        <div>
          <h3
              ref={titleRef}
              className="text-xl font-bold mb-4 dark:text-gray-100 scroll-mt-20"
          >
            {title}
          </h3>
          <div className="space-y-4">
            <div className="relative overflow-hidden">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {description}
              </div>

              {shouldShowToggle && (
                  <div
                      ref={contentRef}
                      className="transition-all duration-300 ease-in-out overflow-hidden"
                      style={{ height: showFullDescription ? contentHeight : 0 }}
                  >
                    <div className="pt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {fullDescription?.substring(description.length)}
                    </div>
                  </div>
              )}

              {/* Fade overlay when collapsed */}
              {shouldShowToggle && !showFullDescription && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>

            {shouldShowToggle && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggle}
                    className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 p-0 h-auto font-medium"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </Button>
            )}
          </div>
        </div>

        {/* Остальная часть компонента остается без изменений */}
        {showIncludes && includes && includes.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 dark:text-gray-100">What's Included</h4>
              <ul className="space-y-2">
                {includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-violet-500 dark:bg-violet-600 rounded-sm mt-1.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                ))}
              </ul>
            </div>
        )}

        {showEducationExperience && (
            <div className="space-y-6">
              {education && education.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 dark:text-gray-100">Education</h4>
                    <ul className="space-y-2">
                      {education.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-3 h-3 border-2 border-violet-500 dark:border-violet-400 mt-1.5 rounded-sm flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item.description}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {experience && experience.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 dark:text-gray-100">Experience</h4>
                    <ul className="space-y-2">
                      {experience.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-violet-500 dark:bg-violet-600 flex-shrink-0 mt-1.5 rounded-sm" />
                            <span className="text-gray-700 dark:text-gray-300">{item.description}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </div>
        )}
      </div>
  )
}
