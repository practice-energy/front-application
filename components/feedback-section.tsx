"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {Review} from "@/types/common";

interface FeedbackSectionProps {
  feedbacks: Review[]
  title?: string
  className?: string
}

export function FeedbackSection({ feedbacks, title = "Client Feedback", className = "" }: FeedbackSectionProps) {
  // Состояния для верхней строки (четные индексы)
  const [isTopAutoScrollPaused, setIsTopAutoScrollPaused] = useState(false)
  const [topTouchStart, setTopTouchStart] = useState<number | null>(null)
  const [topTouchEnd, setTopTouchEnd] = useState<number | null>(null)
  const topScrollRef = useRef<HTMLDivElement>(null)

  // Состояния для нижней строки (нечетные индексы)
  const [isBottomAutoScrollPaused, setIsBottomAutoScrollPaused] = useState(false)
  const [bottomTouchStart, setBottomTouchStart] = useState<number | null>(null)
  const [bottomTouchEnd, setBottomTouchEnd] = useState<number | null>(null)
  const bottomScrollRef = useRef<HTMLDivElement>(null)

  // Создаем утроенный массив для бесконечной прокрутки
  const loopedFeedbacks = [...feedbacks, ...feedbacks, ...feedbacks]

  // Разделяем на две строки
  const topFeedbacks = loopedFeedbacks.filter((_, index) => index % 2 === 0) // Четные - верхняя строка
  const bottomFeedbacks = loopedFeedbacks.filter((_, index) => index % 2 === 1) // Нечетные - нижняя строка

  // Автоскролл для верхней строки (движение влево)
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

  // Автоскролл для нижней строки (движение вправо)
  useEffect(() => {
    const scrollContainer = bottomScrollRef.current
    if (!scrollContainer || isBottomAutoScrollPaused) return

    const cardWidth = 320 + 16
    const maxScroll = cardWidth * feedbacks.length

    // Начинаем с середины массива для плавного старта
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

    // Инициализация позиции скролла
    scrollContainer.scrollLeft = maxScroll

    return () => clearInterval(interval)
  }, [isBottomAutoScrollPaused, feedbacks.length])

  // Общие настройки свайпа
  const minSwipeDistance = 50

  // Обработчики для верхней строки
  const onTopTouchStart = (e: React.TouchEvent) => {
    setTopTouchEnd(null)
    setTopTouchStart(e.targetTouches[0].clientX)
    setIsTopAutoScrollPaused(true)
  }

  const onTopTouchMove = (e: React.TouchEvent) => {
    setTopTouchEnd(e.targetTouches[0].clientX)
  }

  const onTopTouchEnd = () => {
    if (!topTouchStart || !topTouchEnd) return
    handleSwipe(topTouchStart, topTouchEnd, topScrollRef, setIsTopAutoScrollPaused)
  }

  // Обработчики для нижней строки
  const onBottomTouchStart = (e: React.TouchEvent) => {
    setBottomTouchEnd(null)
    setBottomTouchStart(e.targetTouches[0].clientX)
    setIsBottomAutoScrollPaused(true)
  }

  const onBottomTouchMove = (e: React.TouchEvent) => {
    setBottomTouchEnd(e.targetTouches[0].clientX)
  }

  const onBottomTouchEnd = () => {
    if (!bottomTouchStart || !bottomTouchEnd) return
    handleSwipe(bottomTouchStart, bottomTouchEnd, bottomScrollRef, setIsBottomAutoScrollPaused)
  }

  // Общая логика обработки свайпа
  const handleSwipe = (
      touchStart: number,
      touchEnd: number,
      scrollRef: React.RefObject<HTMLDivElement>,
      setPaused: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const cardWidth = 320 + 16

    if (isLeftSwipe) {
      scrollContainer.scrollBy({ left: cardWidth, behavior: "smooth" })
    } else if (isRightSwipe) {
      scrollContainer.scrollBy({ left: -cardWidth, behavior: "smooth" })
    }

    setTimeout(() => {
      setPaused(false)
    }, 3000)
  }

  return (
      <div className={className}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{title}</h3>

        {/* Верхняя строка (четные индексы) */}
        <div className="relative mb-8">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>

          <div
              ref={topScrollRef}
              className="flex space-x-4 overflow-x-hidden pb-4 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
              onMouseEnter={() => setIsTopAutoScrollPaused(true)}
              onMouseLeave={() => setIsTopAutoScrollPaused(false)}
              onTouchStart={onTopTouchStart}
              onTouchMove={onTopTouchMove}
              onTouchEnd={onTopTouchEnd}
          >
            {topFeedbacks.map((feedback, index) => (
                <div
                    key={`top-${feedback.id}-${index}`}
                    className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-sm py-3 px-1"
                >
                  <div className="flex items-center mb-3">
                    <img
                        src={feedback.avatar || "/placeholder.svg"}
                        alt={feedback.author}
                        className="w-10 h-10 rounded-sm mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 truncate">{feedback.author}</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">{feedback.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{feedback.comment}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Нижняя строка (нечетные индексы) */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent z-10 pointer-events-none"></div>

          <div
              ref={bottomScrollRef}
              className="flex space-x-4 overflow-x-hidden pb-4 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
              onMouseEnter={() => setIsBottomAutoScrollPaused(true)}
              onMouseLeave={() => setIsBottomAutoScrollPaused(false)}
              onTouchStart={onBottomTouchStart}
              onTouchMove={onBottomTouchMove}
              onTouchEnd={onBottomTouchEnd}
          >
            {bottomFeedbacks.map((feedback, index) => (
                <div
                    key={`bottom-${feedback.id}-${index}`}
                    className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-sm py-3 px-1"
                >
                  <div className="flex items-center mb-3">
                    <img
                        src={feedback.avatar || "/placeholder.svg"}
                        alt={feedback.author}
                        className="w-10 h-10 rounded-sm mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 truncate">{feedback.author}</h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">{feedback.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{feedback.comment}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}
