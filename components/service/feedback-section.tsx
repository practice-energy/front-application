"use client"
import { useState, useRef, useEffect } from "react"
import type { Feedback } from "@/types/common"
import { FeedbackItem } from "./feedback-item"

interface FeedbackSectionProps {
  feedbacks: Feedback[]
  title?: string
  className?: string
}

export function FeedbackSection({ feedbacks, title = "Реко и отзывы", className = "" }: FeedbackSectionProps) {
  // States for top row (even indexes)
  const [isTopAutoScrollPaused, setIsTopAutoScrollPaused] = useState(false)
  const topScrollRef = useRef<HTMLDivElement>(null)

  // States for bottom row (odd indexes)
  const [isBottomAutoScrollPaused, setIsBottomAutoScrollPaused] = useState(false)
  const bottomScrollRef = useRef<HTMLDivElement>(null)

  // Create tripled array for infinite scrolling
  const loopedFeedbacks = [...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks]

  // Split into two rows
  const topFeedbacks = loopedFeedbacks.filter((_, index) => index % 2 === 0)
  const bottomFeedbacks = loopedFeedbacks.filter((_, index) => index % 2 === 1)

  // Auto-scroll for top row (left movement)
  useEffect(() => {
    const scrollContainer = topScrollRef.current
    if (!scrollContainer || isTopAutoScrollPaused) return

    let scrollPosition = 0
    const scrollSpeed = 0.5
    const cardWidth = 240 + 16 // card width + gap

    const autoScroll = () => {
      if (!isTopAutoScrollPaused) {
        scrollPosition += scrollSpeed
        if (scrollPosition >= cardWidth * feedbacks.length) {
          scrollPosition = 0
        }
        scrollContainer.scrollLeft = scrollPosition
      }
    }

    const interval = setInterval(autoScroll, 16)
    return () => clearInterval(interval)
  }, [isTopAutoScrollPaused, feedbacks.length])

  // Auto-scroll for bottom row (right movement)
  useEffect(() => {
    const scrollContainer = bottomScrollRef.current
    if (!scrollContainer || isBottomAutoScrollPaused) return

    const cardWidth = 240 + 16
    const maxScroll = cardWidth * feedbacks.length
    let scrollPosition = maxScroll

    const autoScroll = () => {
      if (!isBottomAutoScrollPaused) {
        scrollPosition -= scrollSpeed
        if (scrollPosition <= 0) {
          scrollPosition = maxScroll
        }
        scrollContainer.scrollLeft = scrollPosition
      }
    }

    const scrollSpeed = 0.5
    const interval = setInterval(autoScroll, 16)

    // Initialize scroll position
    scrollContainer.scrollLeft = maxScroll

    return () => clearInterval(interval)
  }, [isBottomAutoScrollPaused, feedbacks.length])

  return (
    <div className={className}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{title}</h3>

      {/* Top row (even indexes) */}
      <div className="relative mb-3">
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-r from-transparent  to-colors-neutral-150 z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-[-1px] w-4 bg-gradient-to-l from-transparent to-colors-neutral-150 z-10 pointer-events-none" />

        <div
          ref={topScrollRef}
          className="flex space-x-4 overflow-x-hidden pb-4 scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          {topFeedbacks.map((feedback, index) => (
            <FeedbackItem key={`top-${feedback.id}-${index}`} feedback={feedback} rating={203} />
          ))}
        </div>
      </div>

      {/* Bottom row (odd indexes) */}
      <div className="relative">
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-r from-transparent  to-colors-neutral-150 z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-[-1px] w-4 bg-gradient-to-l from-transparent to-colors-neutral-150 z-10 pointer-events-none" />

        <div
          ref={bottomScrollRef}
          className="flex space-x-4 overflow-x-hidden pb-1 scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          {bottomFeedbacks.map((feedback, index) => (
            <FeedbackItem key={`bottom-${feedback.id}-${index}`} feedback={feedback} rating={203} />
          ))}
        </div>
      </div>
    </div>
  )
}
