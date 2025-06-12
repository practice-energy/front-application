"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "@/hooks/use-translations"

export function MovingClouds() {
  const { t } = useTranslations()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const questions = [
    t("cloudQuestions.0"),
    t("cloudQuestions.1"),
    t("cloudQuestions.2"),
    t("cloudQuestions.3"),
    t("cloudQuestions.4"),
    t("cloudQuestions.5"),
    t("cloudQuestions.6"),
    t("cloudQuestions.7"),
    t("cloudQuestions.8"),
    t("cloudQuestions.9"),
    t("cloudQuestions.10"),
    t("cloudQuestions.11"),
  ]

  const handleCloudClick = (question: string) => {
    const params = new URLSearchParams()
    params.append("message", question)
    window.location.href = `/chat?${params.toString()}`
  }

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.innerHTML = ""

    // Create animation styles
    const style = document.createElement("style")
    style.textContent = `
      @keyframes floatRight {
        0% { transform: translateX(-100%); opacity: 1; }
        100% { transform: translateX(calc(100vw + 200px)); opacity: 1; }
      }
      @keyframes floatLeft {
        0% { transform: translateX(calc(100vw + 200px)); opacity: 1; }
        100% { transform: translateX(-100%); opacity: 1; }
      }
      .cloud-bubble {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.2s ease;
        z-index: 5;
        opacity: 1;
      }
      .cloud-bubble:hover {
        background: #f9fafb;
        border-color: #d1d5db;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
      }
    `
    document.head.appendChild(style)

    // Parameters for larger gaps and immediate appearance
    const ROWS = 3
    const BUBBLES_PER_ROW = 3 // Reduced further for much larger gaps
    const ROW_HEIGHT = 120
    const MIN_BUBBLE_WIDTH = 350
    const MAX_BUBBLE_WIDTH = 500
    const ANIMATION_DURATION = 50
    const LARGE_GAP_SPACING = 20 // Much larger gap between bubbles in same row

    for (let row = 0; row < ROWS; row++) {
      const direction = row % 2 === 0 ? "right" : "left"

      for (let i = 0; i < BUBBLES_PER_ROW; i++) {
        const bubble = document.createElement("div")
        const questionIndex = (row * BUBBLES_PER_ROW + i) % questions.length
        const question = questions[questionIndex]

        // Calculate dynamic width based on text length
        const textLength = question.length
        const bubbleWidth = Math.min(MAX_BUBBLE_WIDTH, Math.max(MIN_BUBBLE_WIDTH, textLength * 10 + 120))

        // Style the bubble
        bubble.className = `cloud-bubble absolute text-gray-800 cursor-pointer select-none`
        bubble.style.cssText = `
          width: ${bubbleWidth}px;
          height: 65px;
          padding: 20px 28px;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.4;
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: absolute;
          opacity: 1;
        `

        bubble.textContent = question
        bubble.addEventListener("click", () => handleCloudClick(question))

        // Position the bubble
        const topPosition = 40 + row * ROW_HEIGHT
        bubble.style.top = `${topPosition}px`

        // Set initial position based on direction with larger gaps
        if (direction === "right") {
          bubble.style.left = `-${bubbleWidth + 50 + i * (bubbleWidth + 400)}px` // Much larger gap
        } else {
          bubble.style.left = `calc(100% + ${50 + i * (bubbleWidth + 400)}px)` // Much larger gap
        }

        // Animation with minimal delays for immediate appearance
        bubble.style.animationName = direction === "right" ? "floatRight" : "floatLeft"
        bubble.style.animationDuration = `${ANIMATION_DURATION}s`
        bubble.style.animationDelay = `${i * LARGE_GAP_SPACING + row * 0.5}s` // Very small delays
        bubble.style.animationIterationCount = "infinite"
        bubble.style.animationTimingFunction = "linear"
        bubble.style.animationFillMode = "both"

        container.appendChild(bubble)
      }
    }

    return () => {
      container.innerHTML = ""
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  return (
    <div className="relative w-full bg-white py-16 overflow-hidden">
      <div ref={containerRef} className="relative w-full overflow-hidden" style={{ height: "400px" }}>
        {/* Gradient overlays for smooth fade */}
        <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-white via-white/95 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-white via-white/95 to-transparent z-10 pointer-events-none"></div>
      </div>
    </div>
  )
}
