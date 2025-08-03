"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import {ArrowUp, X, FileText, Paperclip, MessageSquarePlus, MessagesSquareIcon, Check, Bolt} from "lucide-react"
import { useRouter } from "next/navigation"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"
import { IconPractice } from "@/components/icons/icon-practice"
import { IconAlura } from "@/components/icons/icon-alura"
import {useIsMobile} from "@/hooks/use-mobile";

interface MufiBarProps {
  onSearch?: (query: string, title?: string, files?: File[], isPractice?: boolean) => void
  replyingTo?: {
    id: string
    text: string
    sender: "user" | "system"
  } | null
  onCancelReply?: () => void
  placeholder?: string
  chatTitle?: string
  showPractice: boolean
  disableFileApply: boolean
  mode?: "accept" | "continue" | "input"
  onContinue?: () => void
  canAccept?: boolean
}

export const Mufi = React.memo(function DesktopSearchBar({
                                                                  onSearch,
                                                                  placeholder = "Спроси Alura",
                                                                  chatTitle = "Alura",
                                                                  showPractice = false,
                                                                  disableFileApply = true,
                                                                  mode = "input",
                                                                  onContinue,
                                                                  canAccept,
                                                                }: MufiBarProps) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPractice, setIsPractice] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
  const isMobile = useIsMobile()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const canSubmit = (message.trim() || uploadedFiles.length > 0) && mode === "input"
  const hasContent = message.trim().length > 0 || isFocused

  const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        preventEmoji(e)

        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          if (canSubmit) {  // Only submit if canSubmit is true
            handleSubmit(e)
          }
        }
      },
      [preventEmoji, handleSubmit, canSubmit],  // Add canSubmit to dependencies
  )

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const filtered = e.target.value.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        ''
    );
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

  const handleContinue = useCallback(() => {
    if (onContinue) {
      onContinue()
    }
  }, [onContinue])

  const handleNewChat = useCallback(() => {
    const searchId = uuidv4()
    router.push(`/search/${searchId}`)
  }, [router, chatTitle])

  return (
      <div
          ref={containerRef}
          className="p-4"
          data-animating={isAnimating ? "true" : "false"}
      >
        <div className={cn("mx-auto")}>
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

          <div className={cn("border rounded-sm  bg-violet-50 border-violet-100 bg-opacity-80 shadow-md shadow-violet-500/10", isAccepted ? "border-violet-600" : "border-violet-200")}>
            <div
                className={`relative border rounded-sm backdrop-blur-sm 
              p-2.5 sm:p-3.5 transition-all duration-300 flex 
              items-center gap-2 animate-in fade-in
              ${
                    isDragOver
                        ? "border-violet-400 bg-violet-50/30" : "bg-violet-50/10 border-white/20 hover:border-white/30"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex items-center gap-2.5 pb-2">
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <IconAlura width={36} height={36} className="mb-1.5 mr-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                  <textarea
                      inputMode="text"
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
                    <button
                        type="button"
                        onClick={openFileDialog}
                        disabled={disableFileApply || mode === "accept" || mode === "continue"} // Добавлен disabled проп
                        className={`rounded-sm aspect-square px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 group shadow-sm ${
                            disableFileApply
                                ? "bg-violet-50/30 text-gray-400 cursor-not-allowed opacity-100"
                                : "bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 active:bg-violet-600 dark:active:bg-violet-600 text-gray-900 dark:text-white active:text-white dark:active:text-white"
                        }`}
                    >
                      <Paperclip className={`w-4 h-4 ${disableFileApply ? "opacity-50" : ""}`} />
                    </button>

                    {/* Practice Button */}
                    {showPractice && (
                        <button
                            type="button"
                            onClick={togglePractice}
                            className={`rounded-sm px-1.5 h-[36px] w-[36px] font-medium transition-colors duration-200 flex items-center gap-1 group shadow-sm ${
                                isPractice
                                    ? "bg-violet-600 text-white hover:bg-violet-500"
                                    : "bg-white dark:bg-gray-800 dark:hover:bg-violet-700 text-gray-900 dark:text-white"
                            } hover:bg-violet-50`}
                            disabled={mode === "accept" || mode === "continue"}
                        >
                          <IconPractice
                              width={27}
                              height={24}
                              className={`${isPractice ? "filter brightness-0 invert" : "dark:filter dark:brightness-0 dark:invert"}`}
                          />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={togglePractice}
                        className={`rounded-sm aspect-square px-2 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 group shadow-sm bg-violet-50/30 text-gray-400 cursor-not-allowed opacity-100`}
                        disabled={true}
                    >
                      <Bolt className="opacity-50" />
                    </button>
                  </div>

                  {/* Action Button */}
                  {mode === "accept" ? (
                      <button
                          type="button"
                          onClick={handleContinue}
                          className={cn(
                              "h-9 w-9 items-center justify-center shadow-sm rounded-sm bg-teal-400 hover:bg-teal-500 text-white font-medium",
                              canAccept ? "" : "cursor-not-allowed opacity-50"
                          )}
                      >
                        <Check className={"text-white mx-auto"}/>
                      </button>
                  ) : mode === "continue" ? (
                      <button
                          type="button"
                          onClick={handleContinue}
                          className="h-9 w-9 items-center justify-center shadow-sm rounded-sm bg-neutral-900 text-white font-medium"
                      >
                        <IconPractice width={25} height={22} className={"text-white mx-auto"}/>
                      </button>
                  ) : message.trim() || uploadedFiles.length > 0 ? (
                      <button
                          type="submit"
                          disabled={!canSubmit}
                          className={`h-9 w-9 p-0 shadow-sm rounded-sm items-center justify-center flex ${
                              canSubmit
                                  ? "bg-violet-600 hover:bg-violet-700 text-white"
                                  : "bg-violet-200 dark:bg-violet-700 text-white dark:text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        <ArrowUp className="w-6 h-8" />
                      </button>
                  ) : (
                      <button
                          type="button"
                          onClick={handleNewChat}
                          className="shadow-sm rounded-sm border-gray-200 bg-white h-9 w-9 hover:bg-violet-50 text-white font-medium flex items-center"
                      >
                        <MessagesSquareIcon className="w-8 h-8 text-neutral-900 ml-0.5 p-1"/>
                      </button>
                  )}
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
