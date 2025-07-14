"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowUp, X, FileText, Paperclip, MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/use-translations"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

interface MobileSearchBarProps {
  onSearch?: (query: string, title?: string, files?: File[], isPractice?: boolean) => void
  placeholder?: string
  chatTitle?: string
}

export const MobileSearchBar = React.memo(function MobileSearchBar({
                                                                     onSearch,
                                                                     placeholder = "Поиск пути",
                                                                     chatTitle = "Аллюра",
                                                                   }: MobileSearchBarProps) {
  const { t } = useTranslations()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPractice, setIsPractice] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = "auto"
      const lineHeight = 24
      const maxLines = 5
      const maxHeight = lineHeight * maxLines
      const newHeight = Math.min(textarea.scrollHeight, maxHeight)
      textarea.style.height = `${newHeight}px`
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden"
    }

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
          router.push(`/search/${searchId}?q=${encodeURIComponent(trimmedMessage)}`)
        }
      },
      [message, uploadedFiles, onSearch, router, chatTitle, isPractice],
  )

  const handleNewChat = useCallback(() => {
    const searchId = uuidv4()
    window.dispatchEvent(
        new CustomEvent("newChatCreated", {
          detail: {
            chatId: searchId,
            title: chatTitle,
            query: "",
            files: [],
          },
        }),
    )
    router.push(`/search/${searchId}`)
  }, [router, chatTitle])

  const preventEmoji = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const emojiRegex =
        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u
    if (emojiRegex.test(e.key)) {
      e.preventDefault()
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

  const canSubmit = message.trim() || uploadedFiles.length > 0
  const hasContent = message.trim().length > 0 || isFocused

  return (
      <>
        <div
            ref={containerRef}
            className={cn(
                "fixed left-0 right-0 bottom-0 z-50 bg-white dark:bg-gray-900 transition-all duration-300 ease-out shadow-sm",
            )}
        >
          {/* File uploads display */}
          {uploadedFiles.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                      <div
                          key={index}
                          className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-2 py-1 text-xs border"
                      >
                        <FileText className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        <span className="truncate max-w-24">{file.name}</span>
                        <button onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* Main input area */}
          <div className="px-4 py-3 bg-white dark:bg-gray-900">
            <div className="flex flex-row items-end gap-3">
              <div className="flex-1">
                <div
                    className={`relative px-3 py-3 rounded-sm border ${
                        isDragOver
                            ? "border-violet-400 bg-violet-50/30 dark:bg-violet-900/30"
                            : hasContent
                                ? "border-gray-200"
                                : "border-gray-200 hover:border-white/30"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mb-1.5">
                        <Image
                            src="/allura-logo.svg"
                            alt="Alura Logo"
                            width={20}
                            height={20}
                            className="w-4 h-4"
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
                          className="w-full border-0 bg-transparent text-base placeholder:text-gray-400 focus:outline-none focus:ring-0 resize-none overflow-hidden leading-6"
                          rows={1}
                          style={{
                            minHeight: "24px",
                            maxHeight: "120px",
                          }}
                      />
                      </div>
                    </div>

                    {/* Action buttons row - moved below textarea */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isFocused && (
                            <>
                              <Button
                                  type="button"
                                  size="sm"
                                  onClick={openFileDialog}
                                  className="rounded-sm bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 active:bg-violet-600 dark:active:bg-violet-600 active:hover:bg-violet-700 dark:hover:active:bg-violet-600 text-gray-900 dark:text-white active:text-white dark:active:text-white active:border-violet-600 dark:active:border-violet-600 px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 group border"
                              >
                                <Paperclip className="w-4 h-4" />
                              </Button>

                              <Button
                                  type="button"
                                  size="sm"
                                  onClick={togglePractice}
                                  className={`px-3 py-2 h-9 font-medium rounded-sm transition-colors duration-200 flex items-center gap-1 group ${
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
                            </>
                        )}
                      </div>

                      {isFocused && (
                          <>
                            {/* Send Button */}
                            <Button
                                type="submit"
                                disabled={!canSubmit}
                                className={`h-9 w-9 p-0 border-none ${
                                    canSubmit
                                        ? "bg-violet-600 hover:bg-violet-700 text-white"
                                        : "bg-violet-200 dark:bg-violet-700 text-white dark:text-gray-500 cursor-not-allowed"
                                }`}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                          </>
                      )}
                    </div>
                  </form>

                  {isDragOver && (
                      <div className="absolute inset-0 bg-violet-100/50 dark:bg-violet-900/50 rounded-lg flex items-center justify-center pointer-events-none">
                        <div className="text-violet-600 dark:text-violet-400 text-center">
                          <FileText className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs font-medium">Перетащите файлы</p>
                        </div>
                      </div>
                  )}
                </div>
              </div>

              {/* New Chat Button */}
              {!isFocused && (
                  <Button
                      onClick={handleNewChat}
                      variant="outline"
                      size="lg"
                      className="h-14 w-14 mt-0.5 p-1 rounded-sm flex-shrink-0 bg-transparent border-gray-200 [&_svg]:size-4.5"
                  >
                    <MessageSquarePlus className="w-6 h-6" />
                  </Button>
              )}
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
        </div>

        {/* Safe area spacer to prevent content overlap */}
        <div className="h-20" />
      </>
  )
})