"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar"
import { ChevronUpIcon } from "@heroicons/react/24/outline"

export function Footer() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  // Calculate content height on mount/resize
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setIsCollapsed(event.detail.isCollapsed)
    }

    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener)
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener)
  }, [])

  // Auto-expand/collapse based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return

      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const threshold = 100

      setIsExpanded(documentHeight - scrollPosition < threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
      <div
          className="fixed bottom-0 z-10"
          style={{
            left: isCollapsed ? "0" : "320px",
            width: isCollapsed ? "100%" : "calc(100% - 320px)",
            transition: `left ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}, width ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
          }}
      >
        {/* Footer Peek (always visible) */}
        <div
            className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-all duration-300 ${
                isExpanded ? 'h-0 opacity-0' : 'h-20 opacity-100'
            }`}
        >
          <div className="h-full max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4">
                <Image
                    src="/logo.svg"
                    alt="Practice Energy"
                    width={100}
                    height={26}
                    className="h-6 w-auto dark:filter dark:invert"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © 2024 Practice Energy
              </p>
            </div>

            <button
                onClick={toggleExpand}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <span className="text-xs mr-1">Подробнее</span>
              <ChevronUpIcon className={`w-4 h-4 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
            </button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div
            ref={footerRef}
            className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-500 ease-in-out ${
                isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              height: isExpanded ? `${contentHeight}px` : '0px',
            }}
        >
          <div ref={contentRef} className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Company Info */}
              <div className="text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-4">
                  <Image
                      src="/logo.svg"
                      alt="Practice Energy"
                      width={120}
                      height={32}
                      className="h-8 w-auto dark:filter dark:invert"
                  />
                </div>
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  © 2024 Practice Energy. Все права защищены.
                </p>
              </div>

              {/* Support */}
              <div className="text-center md:text-left">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Поддержка</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                        href="/help"
                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                        aria-label="Центр помощи"
                    >
                      Центр помощи
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
