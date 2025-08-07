"use client"

import { useRef, useEffect } from "react"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "../utils/sidebar.utils"
import type { SectionContentProps } from "../types/sidebar.types"

export function SectionContent({ children, sectionKey, sectionVisibility }: SectionContentProps) {
  const isVisible = sectionVisibility[sectionKey]
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    const element = contentRef.current
    const height = element.scrollHeight

    if (isVisible) {
      element.style.height = "0px"
      element.style.opacity = "0"
      element.offsetHeight // Force reflow
      element.style.transition = `height ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}, opacity ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`
      element.style.height = `${height}px`
      element.style.opacity = "1"

      const timeoutId = setTimeout(() => {
        element.style.height = "auto"
      }, ANIMATION_DURATION)

      return () => clearTimeout(timeoutId)
    } else {
      element.style.height = `${height}px`
      element.style.opacity = "1"
      element.offsetHeight // Force reflow
      element.style.transition = `height ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}, opacity ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`
      element.style.height = "0px"
      element.style.opacity = "0"
    }
  }, [isVisible])

  return (
    <div
      ref={contentRef}
      className="overflow-hidden"
      style={{
        height: isVisible ? "auto" : "0px",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="pb-2">{children}</div>
    </div>
  )
}
