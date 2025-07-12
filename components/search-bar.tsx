"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { ArrowUp, X, FileText, Paperclip, MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/use-translations"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"
import { useIsMobile } from "@/hooks/use-mobile"

const searchCategories = [
  { key: "cognition", label: "Познание" },
  { key: "initiation", label: "Инициация" },
  { key: "integration", label: "Интеграция" },
  { key: "translation", label: "Трансляция" },
]

interface SearchBarProps {
  onSearch?: (query: string, category?: string, files?: File[]) => void
  showHeading?: boolean
  dynamicWidth?: boolean
  replyingTo?: {
    id: string
    text: string
    sender: "user" | "system"
  } | null
  onCancelReply?: () => void
  placeholder?: string
}

export const SearchBar = React.memo(function SearchBar({
  onSearch,
  showHeading = true,
  dynamicWidth = false,
  placeholder = "Поиск пути",
}: SearchBarProps) {
  const { t } = useTranslations()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [message, setMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useMemo(
    () =>
      searchCategories.map((category, index) => ({
        ...category,
        index,
        isSelected: selectedCategory === category.key,
      })),
    [selectedCategory],
  )

  useEffect(() => {
    if (!dynamicWidth) return

    const handleSidebarToggle = (event: CustomEvent) => {
      const { isCollapsed } = event.detail
      setIsAnimating(true)

      const targetWidth = isCollapsed ? 0 : 320
      setSidebarWidth(targetWidth)

      setTimeout(() => {
        setIsAnimating(false)
      }, ANIMATION_DURATION)
    }

    const observeSidebar = () => {
      const sidebar = document.querySelector("[data-sidebar]") as HTMLElement
      if (!sidebar) return

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }

      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width
          setSidebarWidth(width)
        }
      })

      resizeObserverRef.current.observe(sidebar)
      setSidebarWidth(sidebar.offsetWidth)
    }

    observeSidebar()
    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener)

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener)
    }
  }, [dynamicWidth])

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobileDevice(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }

    checkMobile()

    if (!isMobileDevice) return

    const handleFocusIn = () => {
      setTimeout(() => {
        const viewport = window.visualViewport
        if (viewport) {
          const keyboardHeight = window.innerHeight - viewport.height
          setKeyboardHeight(keyboardHeight)
          setIsKeyboardVisible(keyboardHeight > 0)
        }
      }, 300)
    }

    const handleFocusOut = () => {
      setTimeout(() => {
        setKeyboardHeight(0)
        setIsKeyboardVisible(false)
      }, 300)
    }

    window.addEventListener("focusin", handleFocusIn)
    window.addEventListener("focusout", handleFocusOut)
  }, [isMobileDevice])

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).slice(0, 5)
    setUploadedFiles((prev) => [...prev, ...newFiles].slice(0, 5))
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedMessage = message.trim()
      if (!trimmedMessage && uploadedFiles.length === 0) return

      if (onSearch) {
        onSearch(trimmedMessage, selectedCategory || undefined, uploadedFiles)
        setMessage("")
        setSelectedCategory(null)
        setIsMenuOpen(false)
        setUploadedFiles([])
      } else {
        const searchId = uuidv4()

        window.dispatchEvent(
          new CustomEvent("newChatCreated", {
            detail: {
              chatId: searchId,
              title:
                trimmedMessage.length > 30 ? `${trimmedMessage.substring(0, 30)}...` : trimmedMessage || "New Chat",
              query: trimmedMessage,
              files: uploadedFiles,
            },
          }),
        )

        const queryParams = new URLSearchParams({
          q: trimmedMessage,
          ...(selectedCategory && { category: selectedCategory }),
        }).toString()

        router.push(`/search/${searchId}?${queryParams}`)
      }
    },
    [message, selectedCategory, uploadedFiles, onSearch, router],
  )

  const handleNewChat = useCallback(() => {
    const searchId = uuidv4()

    window.dispatchEvent(
      new CustomEvent("newChatCreated", {
        detail: {
          chatId: searchId,
          title: "New Chat",
          query: "",
          files: [],
        },
      }),
    )

    router.push(`/search/${searchId}`)
  }, [router])

  const preventEmoji = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent emoji input
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u

    if (emojiRegex.test(e.key)) {
      e.preventDefault()
      return false
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      preventEmoji(e)

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    },
    [preventEmoji, handleSubmit],
  )

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }, [])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Get sidebar state from context
  const { isCollapsed: sidebarCollapsed } = useSidebar()

  // Update dynamic styles to immediately respond to sidebar state
  const dynamicStyles = useMemo(() => {
    if (!dynamicWidth) return {}

    // Use sidebar context state for immediate response
    const currentSidebarWidth = sidebarCollapsed ? 0 : sidebarWidth || 320

    const baseStyles = {
      marginLeft: `${currentSidebarWidth}px`,
      // width: `calc(100% - ${currentSidebarWidth}px)`,
      transition: isAnimating ? `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}` : "none",
    }

    // Add mobile keyboard positioning
    if (isMobileDevice && isKeyboardVisible) {
      return {
        ...baseStyles,
        position: "fixed" as const,
        bottom: `${keyboardHeight}px`,
        left: "0",
        right: "0",
        width: "100%",
        marginLeft: "0",
        zIndex: 1000,
        transform: "translateY(0)",
      }
    }

    return baseStyles
  }, [dynamicWidth, sidebarCollapsed, sidebarWidth, isAnimating, isMobileDevice, isKeyboardVisible, keyboardHeight])

  const selectedCategoryDisplay = useMemo(() => {
    if (!selectedCategory || !showHeading) return null

    const category = searchCategories.find((cat) => cat.key === selectedCategory)
    return (
      <div className="mt-4 text-center animate-in fade-in duration-200">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-700">
          Категория: {category?.label}
        </span>
      </div>
    )
  }, [selectedCategory, showHeading])

  const canSubmit = message.trim() || uploadedFiles.length > 0
  const hasContent = message.trim().length > 0 || isFocused

  // Mobile layout
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className={cn("px-4 py-4 transition-all duration-300", isMobileDevice && isKeyboardVisible && "!px-2 !py-2")}
        style={dynamicStyles}
        data-animating={isAnimating ? "true" : "false"}
      >
        <div className="flex items-center gap-3">
          {/* Main search input container */}
          <div className="flex-1 border rounded-lg">
            {uploadedFiles.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 p-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-violet-600/20 text-white rounded-lg px-3 py-2 text-sm"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span className="truncate max-w-32">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-white hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`relative backdrop-blur-sm p-3 transition-all duration-300 flex items-center gap-2 rounded-lg
                ${
                  isDragOver
                    ? "border-violet-400 bg-violet-50/30"
                    : hasContent
                      ? "bg-white/20 border-white/30"
                      : "bg-white/10 border-white/20 hover:border-white/30"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <Image
                      src="/allura-logo.svg"
                      alt="Alura Logo"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                      priority
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={handleMessageChange}
                      onKeyDown={handleKeyDown}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder={placeholder}
                      className="w-full border-0 bg-transparent text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 resize-none overflow-hidden min-h-[24px] max-h-[120px] text-gray-900 dark:text-white"
                      rows={1}
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    {/* File Upload Button */}
                    <Button
                      type="button"
                      size="sm"
                      onClick={openFileDialog}
                      className="bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-900 dark:text-white px-2 py-1 h-8 transition-colors duration-200 flex items-center gap-1 border"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>

                    {/* Practice Button */}
                    <Button
                      type="button"
                      size="sm"
                      onClick={toggleMenu}
                      className={`px-3 py-1 h-8 font-medium transition-colors duration-200 flex items-center gap-1 ${
                        isMenuOpen
                          ? "bg-violet-600 text-white border-violet-600 hover:bg-violet-500 border"
                          : "bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-900 dark:text-white border"
                      }`}
                    >
                      <Image
                        src="/practice-logo.svg"
                        alt="Settings"
                        width={14}
                        height={14}
                        className={`${isMenuOpen ? "filter brightness-0 invert" : "dark:filter dark:brightness-0 dark:invert"}`}
                      />
                      <span className="text-sm">Практис</span>
                    </Button>
                  </div>

                  {/* Send Button */}
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className={`h-8 w-8 p-0 ${
                      canSubmit
                        ? "bg-violet-600 hover:bg-violet-700 text-white"
                        : "bg-violet-200 dark:bg-violet-700 text-white dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              {isDragOver && (
                <div className="absolute inset-0 bg-violet-100/50 rounded-lg flex items-center justify-center pointer-events-none">
                  <div className="text-violet-600 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Перетащите файлы сюда</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,text/*,.pdf,.doc,.docx"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* New Chat Button - Mobile only */}
          <Button
            onClick={handleNewChat}
            className="h-12 w-12 p-0 bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-900 dark:text-white border rounded-lg flex-shrink-0"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </Button>
        </div>

        <style jsx global>{`
          textarea::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    )
  }

  // Desktop layout (unchanged)
  return (
    <div
      ref={containerRef}
      className={cn(
        "px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300",
        isMobileDevice && isKeyboardVisible && "!px-2 !py-2",
      )}
      style={dynamicStyles}
      data-animating={isAnimating ? "true" : "false"}
    >
      <div className="max-w-4xl mx-auto border rounded-sm">
        {uploadedFiles.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-violet-600/20 text-white rounded-lg px-3 py-2 text-sm"
              >
                <FileText className="w-4 h-4 text-white" />
                <span className="truncate max-w-32">{file.name}</span>
                <button onClick={() => removeFile(index)} className="text-white hover:text-red-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className={`relative border rounded-sm backdrop-blur-sm 
              p-2.5 sm:p-3.5 transition-all duration-300 flex 
              items-center gap-2 animate-in fade-in duration-300
              ${
                isDragOver
                  ? "border-violet-400 bg-violet-50/30"
                  : hasContent
                    ? "bg-white/20 border-white/30"
                    : "bg-white/10 border-white/20 hover:border-white/30"
              }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-2.5 pb-2">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <Image
                  src="/allura-logo.svg"
                  alt="Alura Logo"
                  width={20}
                  height={20}
                  className="w-5 h-5 mb-1.5"
                  priority
                />
              </div>
              <div className="flex-1 min-w-0">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  className="w-full border-0 bg-transparent text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 resize-none overflow-hidden min-h-[24px] max-h-[120px] text-gray-900 dark:text-white"
                  rows={1}
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                {/* File Upload Button */}
                <Button
                  type="button"
                  size="sm"
                  onClick={openFileDialog}
                  className="bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 active:bg-violet-600 dark:active:bg-violet-600 active:hover:bg-violet-700 dark:hover:active:bg-violet-600 text-gray-900 dark:text-white active:text-white dark:active:text-white active:border-violet-600 dark:active:border-violet-600 px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 group border"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                {/* Settings/Practice Button */}
                <Button
                  type="button"
                  size="sm"
                  onClick={toggleMenu}
                  className={`bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 active:bg-violet-600 dark:active:bg-violet-600 active:hover:bg-violet-700 dark:hover:active:bg-violet-600 text-gray-900 dark:text-white active:text-white dark:active:text-white active:border-violet-600 dark:active:border-violet-600 px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 group ${
                    isMenuOpen
                      ? "bg-violet-600 text-white border-violet-600 hover:bg-violet-500 border"
                      : "bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-900 dark:text-white border"
                  }`}
                >
                  <Image
                    src="/practice-logo.svg"
                    alt="Settings"
                    width={14}
                    height={14}
                    className={`mr-2 ${isMenuOpen ? "filter brightness-0 invert" : "dark:filter dark:brightness-0 dark:invert"}`}
                  />
                  <span>Практис</span>
                </Button>
              </div>

              {/* Send Button - выровнена по правому краю */}
              <Button
                type="submit"
                disabled={!canSubmit}
                className={`h-9 w-9 p-0 ${
                  canSubmit
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-violet-200 dark:bg-violet-700 text-white dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {isDragOver && (
            <div className="absolute inset-0 bg-violet-100/50 rounded-sm flex items-center justify-center pointer-events-none">
              <div className="text-violet-600 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Перетащите файлы сюда</p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,text/*,.pdf,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      <style jsx global>{`
        textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
})
