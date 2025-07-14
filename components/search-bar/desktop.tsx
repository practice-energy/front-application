"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { ArrowUp, X, FileText, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/use-translations"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

interface DesktopSearchBarProps {
  onSearch?: (query: string, title?: string, files?: File[], isPractice?: boolean) => void
  showHeading?: boolean
  dynamicWidth?: boolean
  replyingTo?: {
    id: string
    text: string
    sender: "user" | "system"
  } | null
  onCancelReply?: () => void
  placeholder?: string
  chatTitle?: string
}

export const DesktopSearchBar = React.memo(function DesktopSearchBar({
  onSearch,
  showHeading = true,
  dynamicWidth = false,
  placeholder = "Поиск пути",
  chatTitle = "Аллюра",
}: DesktopSearchBarProps) {
  const { t } = useTranslations()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPractice, setIsPractice] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto"

      // Calculate the number of lines based on line height
      const lineHeight = 24 // Base line height in pixels
      const maxLines = 5
      const maxHeight = lineHeight * maxLines

      // Set height based on content, but cap at maxHeight
      const newHeight = Math.min(textarea.scrollHeight, maxHeight)
      textarea.style.height = `${newHeight}px`

      // Enable/disable scrolling based on content
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.overflowY = "auto"
      } else {
        textarea.style.overflowY = "hidden"
      }
    }

    // Adjust height whenever the message changes
    adjustHeight()
  }, [message])

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
        onSearch(trimmedMessage, chatTitle, uploadedFiles, isPractice)
        setMessage("")
        setUploadedFiles([])
        setIsPractice(false)
      } else {
        const searchId = uuidv4()

        window.dispatchEvent(
          new CustomEvent("newChatCreated", {
            detail: {
              chatId: searchId,
              title: chatTitle,
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
    [message, selectedCategory, uploadedFiles, onSearch, router, chatTitle, isPractice],
  )

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

  const togglePractice = useCallback(() => {
    setIsPractice((prev) => !prev)
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
    const currentSidebarWidth = sidebarCollapsed ? 0 : sidebarWidth || 384

    const baseStyles = {
      marginLeft: `${currentSidebarWidth}px`,
      transition: isAnimating ? `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}` : "none",
    }

    return baseStyles
  }, [dynamicWidth, sidebarCollapsed, sidebarWidth, isAnimating])

  const canSubmit = message.trim() || uploadedFiles.length > 0
  const hasContent = message.trim().length > 0 || isFocused

  return (
    <div
      ref={containerRef}
      className="px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 z-100"
      // style={dynamicStyles}
      data-animating={isAnimating ? "true" : "false"}
    >
      <div className="max-w-4xl mx-auto">
        {uploadedFiles.length > 0 && (
          <div className="pb-2 flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1.5 text-sm"
              >
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="truncate max-w-48 text-gray-800 dark:text-gray-200">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={cn("border rounded-sm", showHeading && "bg-violet-50 border-violet-100 bg-opacity-70")}>
          <div
            className={`relative border rounded-sm backdrop-blur-sm 
              p-2.5 sm:p-3.5 transition-all duration-300 flex 
              items-center gap-2 animate-in fade-in
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
                    className="w-4 h-4 mb-1.5"
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
                    className="w-full border-0 bg-transparent text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 resize-none overflow-hidden text-gray-900 dark:text-white leading-6"
                    rows={1}
                    style={{
                      scrollbarWidth: "thin",
                      msOverflowStyle: "auto",
                      minHeight: "24px",
                      maxHeight: "120px",
                    }}
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
                    onClick={togglePractice}
                    className={`px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 group ${
                      isPractice
                        ? "bg-violet-600 text-white border-violet-600 hover:bg-violet-500 border"
                        : "bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-900 dark:text-white border"
                    }`}
                  >
                    <Image
                      src="/practice-logo.svg"
                      alt="Settings"
                      width={14}
                      height={14}
                      className={`mr-2 ${isPractice ? "filter brightness-0 invert" : "dark:filter dark:brightness-0 dark:invert"}`}
                    />
                    <span>Практис</span>
                  </Button>
                </div>

                {/* Send Button */}
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
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,text/*,.pdf,.doc,.docx"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <style jsx global>{`
        textarea::-webkit-scrollbar {
          width: 4px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  )
})
