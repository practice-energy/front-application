"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Review } from "@/types/common"

interface FeedbackSectionProps {
  feedbacks: Review[]
  title?: string
  className?: string
}

export function FeedbackSection({ feedbacks, title = "Client Feedback", className = "" }: FeedbackSectionProps) {
  // States for top row (even indexes)
  const [isTopAutoScrollPaused, setIsTopAutoScrollPaused] = useState(false)
  const topScrollRef = useRef<HTMLDivElement>(null)

  // States for bottom row (odd indexes)
  const [isBottomAutoScrollPaused, setIsBottomAutoScrollPaused] = useState(false)
  const bottomScrollRef = useRef<HTMLDivElement>(null)

  // Format date to "day monthName" (e.g. "12 January")
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const day = date.getDate()
    const monthNames = [
     'Января', 'Февраля', 'Марта', 'Апреля', 'Мая',
      'Июня', 'Июля', 'Августа', 'Сентября', 'Октября',
      'Ноября', 'Декабря'
    ]
    const monthName = monthNames[date.getMonth()]
    return `${day} ${monthName}`
  }

  // Create tripled array for infinite scrolling
  const loopedFeedbacks = [...feedbacks, ...feedbacks, ...feedbacks]

  // Split into two rows
  const topFeedbacks = loopedFeedbacks.filter((_, index) => index % 2 === 0)
  const bottomFeedbacks = loopedFeedbacks.filter((_, index) => index % 2 === 1)

  // Auto-scroll for top row (left movement)
  useEffect(() => {
    const scrollContainer = topScrollRef.current
    if (!scrollContainer || isTopAutoScrollPaused) return

    let scrollPosition = 0
    const scrollSpeed = 0.5
    const cardWidth = 320 + 16 // card width + gap

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

    const cardWidth = 320 + 16
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
          <div className="absolute left-0 top-0 bottom-0 w-9 bg-gradient-to-r from-white dark:from-gray-800 to-transparent z-5 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-9 bg-gradient-to-l from-white dark:from-gray-800 to-transparent z-5 pointer-events-none"></div>

          <div
              ref={topScrollRef}
              className="flex space-x-4 overflow-x-hidden pb-4 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
          >
            {topFeedbacks.map((feedback, index) => (
                <div
                    key={`top-${feedback.id}-${index}`}
                    className="flex-shrink-0 w-80 bg-white shadow-md rounded-sm py-3 px-1"
                >
                  <div className="flex items-center mb-3 p-1">
                    <img
                        src={feedback.avatar || "/placeholder.svg"}
                        alt={feedback.author}
                        className="w-10 h-10 rounded-sm mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{feedback.author}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {formatDate(feedback.date)}
                    </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed px-1">{feedback.comment}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Bottom row (odd indexes) */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-9 bg-gradient-to-r from-white dark:from-gray-800 to-transparent z-5 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-9 bg-gradient-to-l from-white dark:from-gray-800 to-transparent z-5 pointer-events-none"></div>

          <div
              ref={bottomScrollRef}
              className="flex space-x-4 overflow-x-hidden pb-1 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
          >
            {bottomFeedbacks.map((feedback, index) => (
                <div
                    key={`top-${feedback.id}-${index}`}
                    className="flex-shrink-0 w-80 bg-white  shadow-md rounded-sm py-3 px-1"
                >
                  <div className="flex items-center mb-3 p-1">
                    <img
                        src={feedback.avatar || "/placeholder.svg"}
                        alt={feedback.author}
                        className="w-10 h-10 rounded-sm mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900  truncate">{feedback.author}</span>
                        <span className="text-sm text-gray-500  flex-shrink-0 ml-2">
                      {formatDate(feedback.date)}
                    </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed px-1">{feedback.comment}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}
