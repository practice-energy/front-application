"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowUp, X, FileText, Paperclip, MessagesSquareIcon, Check, Bolt } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/src/lib/utils"
import { v4 as uuidv4 } from "uuid"
import { IconPractice } from "@/src/components/icons/icon-practice"
import { IconAlura } from "@/src/components/icons/icon-alura"
import {IconPractice1} from "@/src/components/icons/practice-1-logo";
import {ChatsIcon,} from "@phosphor-icons/react";
import {AnimatePresence, motion} from "framer-motion";

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
  isOnPage?: boolean
  onPushOnPage?: (s: string) => string
  isMobile?: boolean
  addNewChatButtonMobile?: boolean
  avatar?: string
}

export const Mufi = React.memo(function DesktopSearchBar({
  onSearch,
  placeholder = "Alura",
  chatTitle = "Alura",
  showPractice = true,
  disableFileApply = true,
  mode = "input",
  onContinue,
  canAccept,
  isOnPage = false,
  onPushOnPage,
  isMobile = false,
  addNewChatButtonMobile = true,
  avatar,
}: MufiBarProps) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPractice, setIsPractice] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)

  const [onPageMessages, setOnPageMessages] = useState<
    Array<{ id: string; content: string; type: "user" | "response"; timestamp: number }>
  >([])

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

      // Handle on-page functionality if enabled
      if (isOnPage && onPushOnPage && trimmedMessage) {
        const userMessage = {
          id: uuidv4(),
          content: trimmedMessage,
          type: "user" as const,
          timestamp: Date.now(),
        }

        const responseContent = onPushOnPage(trimmedMessage)
        const responseMessage = {
          id: uuidv4(),
          content: responseContent,
          type: "response" as const,
          timestamp: Date.now() + 1,
        }

        setOnPageMessages((prev) => [...prev, userMessage, responseMessage])
        setMessage("")
        setUploadedFiles([])
        setIsPractice(false)
        return
      }

      // Existing functionality
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
    [message, selectedCategory, uploadedFiles, onSearch, router, chatTitle, isPractice, isOnPage, onPushOnPage],
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
        if (canSubmit) {
          // Only submit if canSubmit is true
          handleSubmit(e)
        }
      }
    },
    [preventEmoji, handleSubmit, canSubmit], // Add canSubmit to dependencies
  )

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const filtered = e.target.value.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      "",
    )
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

  if (isMobile) {
    return (
        <div
            ref={containerRef}
            data-animating={isAnimating ? "true" : "false"}
            style={{
              zIndex: 10000,
            }}
            className="flex flex-col items-center"
        >
          <div
              className="w-full"
              style={{
                overflow: "hidden", // Основное свойство для скрытия скроллбара
                scrollbarWidth: "none", // Для Firefox
                msOverflowStyle: "none", // Для IE/Edge
              }}
          >
            {/* On-page messages display */}
            {isOnPage && onPageMessages.length > 0 && (
                <div className="border rounded-sm border-violet-100 bg-colors-custom-accent/5 shadow-active max-h-96 overflow-y-auto backdrop-blur-sm ">
                  <div className="py-4">
                    {onPageMessages.map((msg) => {
                      if (msg.type === "user") {
                        return (<div key={msg.id} className={cn("flex justify-end")}>
                          <div
                              className={cn(
                                  "max-w-[70%] px-3 py-2 rounded-sm text-sm",
                                  "bg-colors-custom-accent/10 text-neutral-900",
                              )}
                          >
                            {msg.content}
                          </div>
                        </div>)
                      }

                      return (<div className="flex flex-col">
                        <div className="flex flex-row ml-1 ">
                          <IconAlura width={36} height={36} className="rounded-sm active:bg-none" />
                          <div className="flex flex-col ml-3 justify-end">
                            <div className="text-stone-900 font-sans">{"Alura"}</div>
                            <div className="text-accent text-gray-400">
                              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                        <div className="text-neutral-700">
                          {msg.content}
                        </div>
                      </div>)
                    })
                    }
                  </div>
                </div>
            )}
          </div>

          <div className="flex flex-row w-full gap-1.5">
            <div
                className={cn(
                    "border rounded-sm bg-violet-50 border-violet-100 bg-opacity-80 shadow-active",
                    "bg-opacity-80 shadow-md shadow-violet-500/10",
                    "transition-all duration-500 ease-in-out", // Добавляем плавный переход для всех свойств
                    isAccepted ? "border-colors-custom-accent" : "border-violet-200",
                    (message.trim() || isFocused || uploadedFiles.length > 0) ? "bg-white" : "bg-violet-50",
                    "flex-1" // Всегда занимает доступное пространство
                )}
            >
              <form onSubmit={handleSubmit} className="w-full bg-white/80 shadow-md rounded-sm backdrop-blur-sm shadow-violet-200 p-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0 flex items-center justify-center">
                    {avatar ? (
                        <img
                            width={36}
                            height={36}
                            className="rounded-sm"
                            src={avatar}
                            alt={""}
                        />
                    ) : (
                        <IconAlura width={24} height={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 transition-all duration-300 flex items-center">
                  <textarea
                      inputMode="text"
                      ref={textareaRef}
                      value={message}
                      onChange={handleMessageChange}
                      onKeyDown={handleKeyDown}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder={placeholder}
                      className="w-full border-0 bg-transparent text-[16px] placeholder:text-gray-400 focus:outline-none focus:ring-0 resize-none overflow-hidden text-gray-900 leading-6 transition-all duration-300 py-1"
                      rows={1}
                      style={{
                        minHeight: "24px",
                        maxHeight: "120px",
                        lineHeight: "1.5",
                        overflow: "hidden", // Основное свойство для скрытия скроллбара
                        scrollbarWidth: "none", // Для Firefox
                        msOverflowStyle: "none", // Для IE/Edge
                      }}
                  />
                  </div>

                  {/* Action Button */}
                  {mode === "accept" ? (
                      <button
                          type="button"
                          onClick={handleContinue}
                          className={cn(
                              "h-9 w-9 items-center justify-center shadow-sm rounded-sm bg-teal-400 hover:bg-teal-500 text-white font-medium",
                              canAccept ? "" : "cursor-not-allowed opacity-50",
                          )}
                      >
                        <Check className={"text-white mx-auto"} />
                      </button>
                  ) : mode === "continue" ? (
                      <button
                          type="button"
                          onClick={handleContinue}
                          className="h-9 w-9 items-center justify-center shadow-sm rounded-sm bg-neutral-900 text-white font-medium"
                      >
                        <IconPractice width={25} height={22} className={"text-white mx-auto"} />
                      </button>
                  ) : !isOnPage ? (isFocused  || message.trim()) && (
                      <button
                          type="submit"
                          onClick={handleSubmit}
                          disabled={!canSubmit}
                          className={`h-9 w-9 p-0 shadow-sm rounded-sm items-center justify-center flex ${
                              canSubmit
                                  ? "bg-colors-custom-accent hover:bg-violet-700 text-white"
                                  : "bg-violet-200  text-white cursor-not-allowed"
                          }`}
                      >
                        <ArrowUp className="w-6 h-8" />
                      </button>
                  ) : (<div className="bg-violet-200  h-9 w-9 p-0  items-center justify-center flex  rounded-sm text-white cursor-not-allowed">
                    <ArrowUp className="w-6 h-8" />
                  </div>)}
                </div>
              </form>
            </div>

            {/* Кнопка нового чата с анимацией */}
            {!isOnPage && (<AnimatePresence>
              {addNewChatButtonMobile && !(isFocused || message.trim()) && (
                  <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                  >
                    <button
                        type="button"
                        onClick={handleNewChat}
                        className="rounded-sm border bg-white h-full w-11 aspect-square hover:bg-violet-50 shadow-sm shadow-violet-500/10 text-white font-medium flex items-center justify-center border-violet-200 transition-all duration-300"
                        disabled={isOnPage}
                    >
                      <ChatsIcon
                          className="text-neutral-900"
                          size={36}
                          style={{ transform: 'scaleX(-1)' }}
                      />
                    </button>
                  </motion.div>
              )}
            </AnimatePresence>)}
          </div>
        </div>
    )
  }

  return (
    <div
        ref={containerRef}
        className="p-4"
        data-animating={isAnimating ? "true" : "false"}
        styles={{
          zIndex: 1000,
        }}
    >
      {/* On-page messages display */}
      {isOnPage && onPageMessages.length > 0 && (
        <div className="border rounded-sm border-violet-100 bg-colors-custom-accent/5 shadow-sm max-h-96 overflow-y-auto backdrop-blur-sm ">
          <div
              className="p-4"
              style={{
                overflow: "hidden", // Основное свойство для скрытия скроллбара
                scrollbarWidth: "none", // Для Firefox
                msOverflowStyle: "none", // Для IE/Edge
              }}
          >
            {onPageMessages.map((msg) => {
                  if (msg.type === "user") {
                    return (<div key={msg.id} className={cn("flex justify-end")}>
                      <div
                          className={cn(
                              "max-w-[70%] px-3 py-2 rounded-sm text-sm",
                              "bg-colors-custom-accent/10 text-neutral-900",
                          )}
                      >
                        {msg.content}
                      </div>
                    </div>)
                  }

                  return (<div className="flex flex-col">
                    <div className="flex flex-row ml-1 ">
                      <IconAlura width={36} height={36} className="rounded-sm active:bg-none" />
                      <div className="flex flex-col ml-3 justify-end">
                        <div className="text-stone-900 font-sans">{"Alura"}</div>
                        <div className="text-accent text-gray-400">
                          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                  </div>
                    <div className="text-neutral-700">
                      {msg.content}
                    </div>
                  </div>)
                })
            }
          </div>
        </div>
      )}

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

        <div
            className={cn(
                "border rounded-sm bg-violet-50 border-violet-100 bg-opacity-80 shadow-active",
                "transition-all duration-500 ease-in-out", // Добавляем плавный переход для всех свойств
                (message.trim() || isFocused || uploadedFiles.length > 0) ? "bg-white shadow-custom" : "bg-violet-50"
            )}
        >
          <div
            className={`relative border rounded-sm backdrop-blur-sm 
              p-2.5 sm:p-3.5 transition-all duration-300 flex 
              items-center gap-2 animate-in fade-in
              ${
                isDragOver
                  ? "border-violet-400 bg-violet-50/30"
                  : "bg-violet-50/10 border-white/20 hover:border-white/30"
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
                      minHeight: "24px",
                      maxHeight: "120px",
                      overflow: "hidden", // Основное свойство для скрытия скроллбара
                      scrollbarWidth: "none", // Для Firefox
                      msOverflowStyle: "none", // Для IE/Edge
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
                        ? "bg-white text-gray-400 cursor-not-allowed opacity-100"
                        : "bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 active:bg-colors-custom-accent dark:active:bg-colors-custom-accent text-gray-900 dark:text-white active:text-white dark:active:text-white"
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
                          ? "bg-colors-custom-accent text-white hover:bg-violet-500"
                          : "bg-white dark:bg-gray-800 dark:hover:bg-violet-700 text-gray-900 dark:text-white"
                      } hover:bg-violet-50`}
                      disabled={mode === "accept" || mode === "continue"}
                    >
                      <IconPractice1
                        width={27}
                        height={24}
                        className={`${isPractice ? "filter brightness-0 invert" : "dark:filter dark:brightness-0 dark:invert"}`}
                      />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={togglePractice}
                    className={`rounded-sm bg-white aspect-square px-2 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 group shadow-sm bg-violet-50/30 text-gray-400 cursor-not-allowed opacity-100`}
                    disabled={true}
                  >
                    <Bolt className="text-gray-400 " />
                  </button>
                </div>

                {/* Action Button */}
                {mode === "accept" ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className={cn(
                      "h-9 w-9 items-center justify-center shadow-custom rounded-sm bg-teal-400 hover:bg-teal-500 text-white font-medium",
                      canAccept ? "" : "cursor-not-allowed opacity-50",
                    )}
                  >
                    <Check className={"text-white mx-auto"} />
                  </button>
                ) : mode === "continue" ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="h-9 w-9 items-center justify-center  shadow-custom rounded-sm bg-neutral-900 text-white font-medium"
                  >
                    <IconPractice width={25} height={22} className={"text-white mx-auto"} />
                  </button>
                ) : message.trim() || uploadedFiles.length > 0 ? (
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`h-9 w-9 p-0  shadow-custom rounded-sm items-center justify-center flex ${
                      canSubmit
                        ? "bg-colors-custom-accent hover:bg-violet-700 text-white"
                        : "bg-violet-200  text-white cursor-not-allowed"
                    }`}
                  >
                    <ArrowUp className="w-6 h-8" />
                  </button>
                ) : !isOnPage ? (
                  <button
                    type="button"
                    onClick={handleNewChat}
                    className="shadow-sm rounded-sm border-gray-200 bg-white h-9 w-9 hover:bg-violet-50 text-white font-medium flex items-center"
                    disabled={isOnPage}
                  >
                    <ChatsIcon
                        className="w-8 h-8 text-neutral-900 ml-0.5 p-1"
                        size={36}
                        style={{ transform: 'scaleX(-1)' }} // Flips horizontally
                    />
                  </button>
                ) : (<div className="bg-violet-200  h-9 w-9 p-0  items-center justify-center flex  rounded-sm text-white cursor-not-allowed">
                  <ArrowUp className="w-6 h-8" />
                </div>)}
              </div>
            </form>

            {isDragOver && (
              <div className="absolute inset-0 bg-violet-100/50 rounded-sm flex items-center justify-center pointer-events-none">
                <div className="text-colors-custom-accent text-center">
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
