"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/use-translations"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar"

const searchCategories = [
  { key: "cognition", label: "Познание" },
  { key: "initiation", label: "Инициация" },
  { key: "integration", label: "Интеграция" },
  { key: "translation", label: "Трансляция" },
]

interface SearchBarProps {
  onSearch?: (query: string, category?: string) => void
  showHeading?: boolean
  dynamicWidth?: boolean
}

export const SearchBar = React.memo(function SearchBar({
  onSearch,
  showHeading = true,
  dynamicWidth = false,
}: SearchBarProps) {
  const { t } = useTranslations()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Memoized category buttons to prevent unnecessary re-renders
  const categoryButtons = useMemo(
    () =>
      searchCategories.map((category, index) => ({
        ...category,
        index,
        isSelected: selectedCategory === category.key,
      })),
    [selectedCategory],
  )

  // Debounced sidebar width update
  const debouncedUpdateWidth = useCallback((width: number) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setSidebarWidth(width)
    }, 16) // ~60fps
  }, [])

  // Setup ResizeObserver for sidebar width tracking
  useEffect(() => {
    if (!dynamicWidth) return

    const observeSidebar = () => {
      const sidebar = document.querySelector("[data-sidebar]") as HTMLElement
      if (!sidebar) return

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }

      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width
          debouncedUpdateWidth(width)
        }
      })

      resizeObserverRef.current.observe(sidebar)
      // Set initial width
      setSidebarWidth(sidebar.offsetWidth)
    }

    // Initial observation
    observeSidebar()

    // Listen for sidebar toggle events with animation details
    const handleSidebarToggle = (event: CustomEvent) => {
      const { isCollapsed, isAnimating: sidebarAnimating } = event.detail

      // Start animation state
      setIsAnimating(true)

      // Update sidebar width immediately to start animation
      const sidebar = document.querySelector("[data-sidebar]") as HTMLElement
      if (sidebar) {
        // For collapsed state, we animate to 0
        // For expanded state, we animate to the sidebar's target width (320px)
        const targetWidth = isCollapsed ? 0 : 320
        setSidebarWidth(targetWidth)
      }

      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }

      // Set timeout to match animation duration
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false)
      }, ANIMATION_DURATION)
    }

    // Listen for animation complete events
    const handleAnimationComplete = () => {
      setIsAnimating(false)
    }

    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener)
    window.addEventListener("sidebarAnimationComplete", handleAnimationComplete as EventListener)

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
      window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener)
      window.removeEventListener("sidebarAnimationComplete", handleAnimationComplete as EventListener)
    }
  }, [dynamicWidth, debouncedUpdateWidth])

  // Auto-resize textarea based on content (optimized)
  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [])

  useEffect(() => {
    resizeTextarea()
  }, [message, resizeTextarea])

  // Optimized event handlers with useCallback
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!message.trim()) return

      if (onSearch) {
        // If we're on a search page, just add the message
        onSearch(message, selectedCategory || undefined)
        // Clear the input after submitting on search pages
        setMessage("")
        setSelectedCategory(null)
        setIsMenuOpen(false)
      } else {
        // If we're on the main page, navigate to a new search page
        const searchId = Date.now().toString()

        // Emit event to add chat to sidebar
        window.dispatchEvent(
          new CustomEvent("newChatCreated", {
            detail: {
              chatId: searchId,
              title: message.length > 30 ? `${message.substring(0, 30)}...` : message,
              query: message,
            },
          }),
        )

        router.push(
          `/search/${searchId}?q=${encodeURIComponent(message)}${selectedCategory ? `&category=${selectedCategory}` : ""}`,
        )
      }
    },
    [message, selectedCategory, onSearch, router],
  )

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    },
    [handleSubmit],
  )

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category))
  }, [])

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  // Calculate dynamic styles with synchronized animations
  const dynamicStyles = useMemo(() => {
    if (!dynamicWidth) return {}

    return {
      marginLeft: `${sidebarWidth}px`,
      width: `calc(100% - ${sidebarWidth}px)`,
      transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
    }
  }, [dynamicWidth, sidebarWidth])

  // Memoized selected category display
  const selectedCategoryDisplay = useMemo(() => {
    if (!selectedCategory || !showHeading) return null

    const category = searchCategories.find((cat) => cat.key === selectedCategory)
    return (
      <div className="mt-4 text-center animate-in fade-in duration-200">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800 border border-violet-200">
          Категория: {category?.label}
        </span>
      </div>
    )
  }, [selectedCategory, showHeading])

  return (
    <div
      ref={containerRef}
      className="px-4 sm:px-6 lg:px-8 py-4"
      style={dynamicStyles}
      data-animating={isAnimating ? "true" : "false"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Main heading - only show if showHeading is true */}
        {showHeading && (
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">{t("search.heading")}</h1>
          </div>
        )}

        {/* Single white frame containing everything */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Search input section */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="p-4">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleMessageChange}
                onKeyPress={handleKeyPress}
                placeholder="Поиск пути"
                className="border-0 bg-transparent text-xl placeholder:text-gray-400 focus:outline-none focus:ring-0 px-4 py-4 w-full resize-none overflow-hidden min-h-[56px] max-h-[120px]"
                rows={1}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              />
            </div>

            {/* Buttons section - no border separator */}
            <div className="flex items-center justify-between p-3 gap-3 flex-wrap">
              {/* Left side buttons - with proper flex layout */}
              <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleMenu}
                  className="flex items-center gap-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 px-4 py-3 h-12 transition-colors duration-200 flex-shrink-0"
                >
                  <Image
                    src="/settings.svg"
                    alt="Settings"
                    width={16}
                    height={16}
                    className={`animate-settings-toggle transition-transform duration-300 ${isMenuOpen ? "rotate-45" : "rotate-0"}`}
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(45%) sepia(69%) saturate(4417%) hue-rotate(244deg) brightness(96%) contrast(91%)",
                      transformOrigin: "center",
                    }}
                  />
                  <span className="text-sm font-medium">Установки</span>
                </Button>

                {/* Category buttons - expandable with proper spacing */}
                {isMenuOpen && (
                  <div className="flex items-center gap-2 animate-in fade-in duration-300 flex-wrap">
                    {categoryButtons.map((category) => (
                      <Button
                        key={category.key}
                        variant={category.isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategorySelect(category.key)}
                        className={`transition-all duration-300 transform hover:scale-105 h-10 px-3 text-sm whitespace-nowrap ${
                          category.isSelected
                            ? "bg-violet-600 hover:bg-violet-700 text-white border-violet-600 shadow-md"
                            : "text-gray-700 border-gray-300 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600"
                        }`}
                        style={{
                          animationDelay: `${category.index * 80}ms`,
                          opacity: 0,
                          animation: `categoryButtonAppear 0.4s ease-out ${category.index * 80}ms forwards`,
                          transform: `translateY(${isMenuOpen ? "0" : "-10px"})`,
                        }}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right side - cost and submit */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-violet-600 font-medium text-sm">12 Senti</span>
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-xl transition-colors duration-200 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Selected category indicator */}
        {selectedCategoryDisplay}
      </div>

      <style jsx>{`
        textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <style jsx global>{`
  @keyframes categoryButtonAppear {
    0% {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    60% {
      opacity: 1;
      transform: translateY(2px) scale(1.02);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .animate-settings-toggle {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`}</style>
    </div>
  )
})
