"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, Share, MessageSquare, Plus } from "lucide-react"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { InstagramSpecialistCard } from "@/components/instagram-specialist-card"
import { ShareModal } from "@/components/share-modal"
import { motion } from "framer-motion"
import { useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"
import { mockSavedSpecialists, getChatDataById, addMessageToChat } from "@/services/mock-data"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"

const MessageItem = React.memo(
    ({
         specialistId,
         message,
         onSpecialistClick,
         onServiceClick,
         onReply,
         onReplyClick,
         onShare,
         onRegenerate,
         highlightedMessageId,
         isAi,
         footerContent,
     }: {
        specialistId: string
        message: Message
        onSpecialistClick: (id: string) => void
        onServiceClick: (id: string) => void
        onReply: (message: Message) => void
        onReplyClick: (messageId: string) => void
        onShare: (message: Message) => void
        onRegenerate: (message: Message) => void
        highlightedMessageId: string | null
        isAi: boolean
        footerContent?: string
    }) => {
        const router = useRouter()
        const isUser = message.type === "user"
        const isAssistant = message.type === "assistant"
        const isSpecialist = message.type === "specialist"
        const isHighlighted = highlightedMessageId === message.id

        const handleCopyMessage = useCallback(() => {
            const textToCopy = message.content || "Message with cards"
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log("Message copied to clipboard")
            })
        }, [message.content])

        const handleViewSpecialistProfile = useCallback(() => {
            if (isAssistant) {
                return
            }
            onSpecialistClick(specialistId)
        }, [isAssistant, router])

        return (
            <div
                id={`message-${message.id}`}
                className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 transition-all duration-500 ${
                    isHighlighted ? "bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-2 -m-2" : ""
                }`}
            >
                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-4xl w-full`}>
                    {/* Аватарка (только для не-пользователя) */}
                    {!isUser && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-16 h-16 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-2"
                            onClick={handleViewSpecialistProfile}
                            aria-label={isAssistant ? "View AI profile" : `View ${message.type} profile`}
                            title={isAssistant ? "Allura" : isSpecialist ? "Specialist" : "View profile"}
                        >
                            <Avatar className="w-16 h-16">
                                <AvatarImage
                                    src={isAssistant ? "/allura-logo.svg" : isSpecialist ? "/placeholder-user.png" : "/placeholder.png"}
                                    className={isAssistant ? "dark:invert dark:brightness-0 dark:filter" : ""}
                                />
                                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    {isAssistant ? "AI" : isSpecialist ? "SP" : "U"}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    )}

                    {/* Текстовый блок (пузырь или обычный текст) */}
                    <div className="flex-1 space-y-3 min-w-0 gap-3">
                        {message.content && (
                            <div>
                                {isUser || isSpecialist ? (
                                    <div
                                        className={`px-3 py-3 gap-3 rounded-sm shadow-sm border ${
                                            isUser
                                                ? "bg-violet-50 rounded-tr-md"
                                                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-Date border-gray-200 dark:border-gray-700"
                                        }`}
                                        style={{ wordBreak: "break-word" }} // ← Добавлено здесь
                                    >
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>
                                ) : (
                                    <div className="text-gray-800 dark:text-gray-100" style={{ wordBreak: "break-word" }}> {/* ← И здесь */}
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Карточки специалистов */}
                        {message.specialists && message.specialists.length > 0 && (
                            <div className="mt-3 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {message.specialists.slice(0, 2).map((specialist) => {
                                        const specialistCard = {
                                            id: specialist.id,
                                            image: specialist.avatar || "/placeholder.png?height=200&width=200",
                                            name: specialist.name,
                                            location: specialist.location || "Online",
                                            reviews: specialist.reviewCount || 100,
                                            specialties: specialist.specialties || [],
                                            isNew: false,
                                            title: specialist.title || "Specialist",
                                            avatar: specialist.avatar,
                                            reviewCount: specialist.reviewCount || 100,
                                        }

                                        return (
                                            <InstagramSpecialistCard
                                                key={specialist.id}
                                                specialist={specialistCard}
                                                onClick={() => onSpecialistClick(specialist.id)}
                                                showActionButtons={true}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Footer (только для AI) */}
                        {footerContent && isAssistant && !isUser && (
                            <div className="mt-3 text-gray-800 dark:text-gray-100">
                                <p className="text-sm leading-relaxed">{footerContent}</p>
                            </div>
                        )}

                        {/* Кнопки действий */}
                        <div className="flex items-center justify-left mt-3">
                            <div className="flex items-center gap-2 text-xs opacity-60">
                                {isAi && isAssistant && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onRegenerate(message)}
                                        className="p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                                        title="Regenerate response"
                                    >
                                        <ArrowPathIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onShare(message)}
                                    className="p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                                    title="Share message"
                                >
                                    <Share className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCopyMessage}
                                    className="p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                                    title="Copy message"
                                >
                                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </motion.button>
                                <span className="text-gray-500 dark:text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
)

export default function SearchPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const { isCollapsed } = useSidebar()
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAnimating] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [messageToShare, setMessageToShare] = useState<Message | null>(null)
  const [queryParamsProcessed, setQueryParamsProcessed] = useState(false)

  // Load chat data when component mounts or ID changes
  useEffect(() => {
    const chatId = params.id as string

    // Try to load existing chat data
    const existingChat = getChatDataById(chatId)

    if (existingChat) {
      setCurrentChat(existingChat)
    } else {
      // Create new empty chat for new IDs
      const newChat: Chat = {
        id: chatId,
        title: "Новый чат",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        messages: [],
        searchQueries: [],
        isAi: true,
        hasNew: false,
        createdAt: Date.now(),
      }
      setCurrentChat(newChat)
    }
  }, [params.id])

  useEffect(() => {
    if (currentChat) {
      const chatId = params.id as string
      window.dispatchEvent(
        new CustomEvent("chatMessagesUpdated", {
          detail: { chatId, messages: currentChat.messages },
        }),
      )
    }
  }, [currentChat, params.id])

  // Handle query parameters for initial search
  useEffect(() => {
    if (!currentChat || queryParamsProcessed || currentChat.messages.length > 0) return

    const query = searchParams.get("q")
    const serviceId = searchParams.get("serviceId")
    const serviceName = searchParams.get("serviceName")

    if (query || serviceId) {
      setQueryParamsProcessed(true)
      handleSearch(query || `Ищу специалиста для услуги "${serviceName}"`)
    }
  }, [currentChat, searchParams, queryParamsProcessed])

  useEffect(() => {
    setQueryParamsProcessed(false)
  }, [params.id])

  const handleSpecialistClick = useCallback(
    (specialistId: string) => {
      router.push(`/specialist/${specialistId}`)
    },
    [router],
  )

  const handleServiceClick = useCallback(
    (serviceId: string) => {
      router.push(`/service/${serviceId}`)
    },
    [router],
  )

  const handleReply = useCallback((message: Message) => {
    setReplyingTo(message)
    const searchBarElement = document.querySelector("textarea")
    if (searchBarElement) {
      searchBarElement.focus()
    }
  }, [])

  const handleShare = useCallback((message: Message) => {
    setMessageToShare(message)
    setShareModalOpen(true)
  }, [])

  const handleRegenerate = useCallback(
    async (message: Message) => {
      if (!currentChat || message.type !== "assistant") return

      setIsLoading(true)

      // Remove the old AI message
      const updatedMessages = currentChat.messages.filter((m) => m.id !== message.id)
      const updatedChat = { ...currentChat, messages: updatedMessages }
      setCurrentChat(updatedChat)

      // Simulate new AI response
      setTimeout(() => {
        const numSpecialists = 2
        const selectedSpecialists = mockSavedSpecialists.slice(0, numSpecialists)

        const assistantMessage: Message = {
          id: uuidv4(),
          type: "assistant",
          content: `Вот обновленные результаты поиска. Я нашел ${numSpecialists} специалистов, которые могут помочь вам.`,
          timestamp: Date.now(),
          specialists: selectedSpecialists,
        }

        const finalChat = addMessageToChat(updatedChat, assistantMessage)
        finalChat.footerContent = "Если вам нужны дополнительные варианты или уточнения, просто напишите мне!"

        setCurrentChat(finalChat)
        setIsLoading(false)
      }, 1500)
    },
    [currentChat],
  )

  const handleReplyClick = useCallback((messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`)
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" })
      setHighlightedMessageId(messageId)
      setTimeout(() => {
        setHighlightedMessageId(null)
      }, 2000)
    }
  }, [])

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim() || !currentChat) return

      const now = Date.now()
      const userMessage: Message = {
        id: `${now}`,
        type: "user",
        content: query,
        timestamp: now,
      }

      // Add user message immediately
      const updatedChatWithUser = addMessageToChat(currentChat, userMessage)
      setCurrentChat(updatedChatWithUser)
      setReplyingTo(null)
      setIsLoading(true)

      // If this is the first message in a new chat, add it to sidebar
      if (currentChat.messages.length === 0) {
        // Dispatch event to add chat to sidebar
        window.dispatchEvent(
          new CustomEvent("addNewChatToSidebar", {
            detail: {
              chat: {
                ...updatedChatWithUser,
                title: query.length > 30 ? query.substring(0, 30) + "..." : query,
              },
            },
          }),
        )
      }

      // Simulate AI response
      setTimeout(() => {
        const numSpecialists = 2
        const selectedSpecialists = mockSavedSpecialists.slice(0, numSpecialists)

        const assistantMessage: Message = {
          id: uuidv4(),
          type: "assistant",
          content: `Вот результаты поиска по запросу "${query}". Я нашел ${numSpecialists} специалистов, которые могут помочь вам.`,
          timestamp: now + 1000,
          specialists: selectedSpecialists,
        }

        const finalChat = addMessageToChat(updatedChatWithUser, assistantMessage)
        finalChat.footerContent = "Если вам нужны дополнительные варианты или уточнения, просто напишите мне!"
        finalChat.searchQueries = [...finalChat.searchQueries, query]

        setCurrentChat(finalChat)
        setIsLoading(false)
      }, 1500)
    },
    [currentChat],
  )

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages, scrollToBottom])

  const messageList = useMemo(
    () =>
      currentChat?.messages.map((message, index) => (
        <div key={message.id} className="space-y-4">
          <MessageItem
            specialistId={params.id as string}
            message={message}
            onSpecialistClick={handleSpecialistClick}
            onServiceClick={handleServiceClick}
            onReply={handleReply}
            onShare={handleShare}
            onRegenerate={handleRegenerate}
            onReplyClick={handleReplyClick}
            highlightedMessageId={highlightedMessageId}
            isAi={currentChat.isAi}
            footerContent={
              // Show footer content only after the last assistant message with specialists
              message.type === "assistant" && message.specialists && index === currentChat.messages.length - 1
                ? currentChat.footerContent
                : undefined
            }
          />
        </div>
      )),
    [
      currentChat?.messages,
      currentChat?.isAi,
      currentChat?.footerContent,
      handleSpecialistClick,
      handleServiceClick,
      handleReply,
      handleShare,
      handleRegenerate,
      handleReplyClick,
      highlightedMessageId,
    ],
  )

  const handleNewChat = () => {
    router.push(`/search/${uuidv4()}`)
  }

  return (
    <div className="flex h-screen flex-col">
      <div
        className="flex-1 bg-white dark:bg-gray-900 overflow-hidden relative"
        style={{
          transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
        }}
        data-animating={isAnimating ? "true" : "false"}
      >
        <ScrollArea className="h-full relative">
          {/* New Chat Button under logo */}
          <div
            className={cn(
              "fixed z-10 transition-all duration-300",
              "top-[5.5rem] left-20",
              "md:top-40 md:left-20",
              isCollapsed ? "left-4" : "left-6",
            )}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewChat}
              className={cn(
                "flex items-center gap-2 px-3 py-2",
                "bg-white dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700",
                "rounded-lg shadow-sm hover:shadow-md",
                "transition-all duration-200",
                "text-gray-700 dark:text-gray-300",
                "text-sm md:text-base",
              )}
              title="New chat"
              aria-label="New chat"
            >
              <MessageSquare className="w-4 h-4" />
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Messages container */}
          <div className="flex justify-center px-6 py-4">
            <div className="max-w-4xl w-full pb-64 pt-20">
              {currentChat && currentChat.messages.length === 0 && !isLoading && (
                <div className="text-center py-20">
                  <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">Начните поиск специалистов</div>
                  <div className="text-gray-400 dark:text-gray-500 text-sm">Введите ваш запрос в поле поиска ниже</div>
                </div>
              )}

              {messageList}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>

        {/* Search bar at bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 dark:to-transparent pt-16">
            <div className="pb-6">
              <SearchBar
                onSearch={handleSearch}
                showHeading={false}
                dynamicWidth={true}
                placeholder={"Найти специалистов..."}
                onCancelReply={() => setReplyingTo(null)}
              />
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} message={messageToShare} />
    </div>
  )
}
