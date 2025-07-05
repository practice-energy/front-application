"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Reply, Copy, Share, MessageSquare, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { InstagramSpecialistCard } from "@/components/instagram-specialist-card"
import { ShareModal } from "@/components/share-modal"
import {motion} from "framer-motion"
import { useSidebar } from "@/contexts/sidebar-context"
import {cn} from "@/lib/utils"
import {mockSavedSpecialists, mockSpecialist} from "@/services/mock-data";

interface Message {
  id: string
  sender: "user" | "system"
  content: {
    text: string
    cards?: Array<{
      type: "specialist" | "service"
      id: string
      name: string
      image?: string
    }>
    footerText?: string
  }
  timestamp: Date
  status: "sent" | "delivered" | "read"
  replyTo?: {
    id: string
    text: string
    sender: "user" | "system"
  }
}

interface Chat {
  id: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
  relatedEntities?: (Specialist | Service)[]
  title?: string
  isAi: boolean
}

interface Service {
  id: string
  name: string
  price: number
  duration: string
  image?: string
  description?: string
}

interface Specialist {
  id: string
  name: string
  specialty: string
  image?: string
  location?: string
  experience?: string
  education?: string
  bio?: string
  services?: string[]
}

const MessageItem = React.memo(
  ({
    message,
    onSpecialistClick,
    onServiceClick,
    onReply,
    onReplyClick,
    onShare,
    highlightedMessageId,
    isAi,
  }: {
    message: Message
    onSpecialistClick: (id: string) => void
    onServiceClick: (id: string) => void
    onReply: (message: Message) => void
    onReplyClick: (messageId: string) => void
    onShare: (message: Message) => void
    highlightedMessageId: string | null
    isAi: boolean
  }) => {
    const router = useRouter()
    const isUser = message.sender === "user"
    const isHighlighted = highlightedMessageId === message.id

    const handleCopyMessage = useCallback(() => {
      const textToCopy = message.content.text || "Message with cards"
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log("Message copied to clipboard")
      })
    }, [message.content.text])

    const handleViewSpecialistProfile = useCallback(() => {
      if (isAi) {
        console.log("Viewing AI profile")
        return
      }
      router.push(`/specialist/1`)
    }, [isAi, router])

    return (
      <div
        id={`message-${message.id}`}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 transition-all duration-500 ${
          isHighlighted ? "bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-2 -m-2" : ""
        }`}
      >
        <div className={`flex items-start space-x-3 max-w-4xl ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handleViewSpecialistProfile}
              aria-label={isAi ? "View AI profile" : `View ${message.sender} profile`}
              title={isAi ? "Allura" : "View profile"}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={
                    isAi
                      ? "/allura-logo.svg"
                      : URL.createObjectURL(mockSpecialist.images[0]) ||
                        "/placeholder.svg"
                  }
                  className={isAi ? "dark:invert dark:brightness-0 dark:filter" : ""}
                />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {isAi ? "AI" : message.sender === "system" ? "SP" : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}

          <div className="flex-1 space-y-3 min-w-0">
            {/*{message.replyTo && (*/}
            {/*  <div className="ml-4 pl-3 border-l-2 border-violet-300 dark:border-violet-600">*/}
            {/*    <button*/}
            {/*      onClick={() => onReplyClick(message.replyTo!.id)}*/}
            {/*      className="block w-full text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 text-xs transition-colors duration-200"*/}
            {/*    >*/}
            {/*      <div className="flex items-center gap-2 mb-1">*/}
            {/*        <Reply className="h-3 w-3 text-violet-600 dark:text-violet-400" />*/}
            {/*        <span className="font-medium text-gray-600 dark:text-gray-300">*/}
            {/*          {message.replyTo.sender === "user" ? "You" : "Allura"}*/}
            {/*        </span>*/}
            {/*      </div>*/}
            {/*      <p className="text-gray-500 dark:text-gray-400 truncate">*/}
            {/*        {message.replyTo.text.length > 50*/}
            {/*          ? `${message.replyTo.text.substring(0, 50)}...`*/}
            {/*          : message.replyTo.text}*/}
            {/*      </p>*/}
            {/*    </button>*/}
            {/*  </div>*/}
            {/*)}*/}

            {/* Text content - bubble for users and human specialists, plain text for AI */}
            {message.content.text && (
              <div>
                {isUser || !isAi ? (
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm border ${
                      isUser
                        ? "bg-violet-600 text-white rounded-tr-md border-violet-600"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-md border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content.text}</p>
                  </div>
                ) : (
                  <div className="text-gray-800 dark:text-gray-100">
                    <p className="text-sm leading-relaxed">{message.content.text}</p>
                  </div>
                )}
              </div>
            )}

            {/* Cards */}
            {message.content.cards && message.content.cards.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {message.content.cards.slice(0, 2).map((card) => {
                    if (card.type === "specialist") {
                      const specialist = {
                        id: Number.parseInt(card.id),
                        image: card.image || "/placeholder.svg?height=200&width=200",
                        name: card.name,
                        location: "Online",
                        reviews: 100,
                        specialties: [],
                        isNew: false,
                        title: "Specialist",
                      }

                      return (
                        <InstagramSpecialistCard
                          key={card.id}
                          specialist={specialist}
                          onClick={() => onSpecialistClick(card.id)}
                        />
                      )
                    } else {
                      return (
                        <Card
                          key={card.id}
                          className="cursor-pointer hover:shadow-md transition-shadow duration-200 p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          onClick={() => onServiceClick(card.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                              <img
                                src={card.image || "/placeholder.svg?height=48&width=48"}
                                alt={card.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                                {card.name}
                              </h4>
                            </div>
                          </div>
                        </Card>
                      )
                    }
                  })}
                </div>
              </div>
            )}

            {/* Footer text for AI messages */}
            {message.content.footerText && isAi && !isUser && (
              <div className="text-gray-800 dark:text-gray-100">
                <p className="text-sm leading-relaxed">{message.content.footerText}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1"></div>

              <div className="flex items-center gap-2 text-xs opacity-60">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReply(message)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title="Reply to this message"
                >
                  <Reply className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onShare(message)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title="Share message"
                >
                  <Share className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyMessage}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                  title="Copy message"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
                <span className="text-gray-500 dark:text-gray-400">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
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

  useMemo(() => {
    return (
      currentChat &&
      currentChat.messages.length === 0 &&
      (!currentChat.relatedEntities || currentChat.relatedEntities.length === 0)
    )
  }, [currentChat])

  useEffect(() => {
    const chatId = params.id as string
    if (!currentChat || currentChat.id !== chatId) {
      const chat: Chat = {
        id: chatId,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
        isAi: true,
        title: "Новый чат",
      }
      setCurrentChat(chat)
    }
  }, [params.id, currentChat])

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

  // Обработка query параметров при загрузке
  useEffect(() => {
    if (!currentChat || queryParamsProcessed) return

    const query = searchParams.get("q")
    const serviceId = searchParams.get("serviceId")
    const serviceName = searchParams.get("serviceName")
    const servicePrice = searchParams.get("servicePrice")
    const serviceDuration = searchParams.get("serviceDuration")
    const serviceImage = searchParams.get("serviceImage")

    if (query || serviceId) {
      setQueryParamsProcessed(true)

      const userMessage: Message = {
        id: `query-${Date.now()}`,
        sender: "user",
        content: {
          text: query || `Ищу специалиста для услуги "${serviceName}"`,
          ...(serviceId && {
            cards: [
              {
                type: "service",
                id: serviceId,
                name: serviceName || "Услуга",
                image: serviceImage || "/placeholder.svg",
                metadata: `${servicePrice ? `$${servicePrice}` : ""}${serviceDuration ? ` • ${serviceDuration}` : ""}`,
              },
            ],
          }),
        },
        timestamp: new Date(),
        status: "sent",
      }

      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
        updatedAt: new Date(),
      }
      setCurrentChat(updatedChat)
      setIsLoading(true)

      setTimeout(() => {
        const assistantMessage: Message = {
          id: `response-${Date.now()}`,
          sender: "system",
          content: {
            text: query
              ? `Вот результаты по вашему запросу "${query}"`
              : `Отличный выбор! Вот специалисты для услуги "${serviceName}"`,
            cards: mockSavedSpecialists.slice(0, 2).map((specialist) => ({
              type: "specialist",
              id: specialist.id,
              name: specialist.name,
              image: specialist.image,
            })),
            footerText: "Выберите подходящего специалиста или уточните ваш запрос для более точных результатов.",
          },
          timestamp: new Date(),
          status: "delivered",
        }

        const finalChat = {
          ...updatedChat,
          messages: [...updatedChat.messages, assistantMessage],
          updatedAt: new Date(),
        }

        setCurrentChat(finalChat)
        setIsLoading(false)
      }, 1500)
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
    setReplyingTo({
      id: message.id,
      text: message.content.text || "Message with cards",
      sender: message.sender,
    })
    const searchBarElement = document.querySelector("textarea")
    if (searchBarElement) {
      searchBarElement.focus()
    }
  }, [])

  const handleShare = useCallback((message: Message) => {
    setMessageToShare(message)
    setShareModalOpen(true)
  }, [])

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

      const userMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        content: { text: query },
        timestamp: new Date(),
        status: "sent",
        ...(replyingTo && {
          replyTo: {
            id: replyingTo.id,
            text: replyingTo.text || "Message with cards",
            sender: replyingTo.sender,
          },
        }),
      }

      setReplyingTo(null)

      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
        updatedAt: new Date(),
      }
      setCurrentChat(updatedChat)
      setIsLoading(true)

      setTimeout(() => {
        const numSpecialists = Math.floor(Math.random() * 2) + 1
        const selectedSpecialists = mockSavedSpecialists.slice(0, numSpecialists)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "system",
          content: {
            text: `Вот результаты поиска по запросу "${query}". Я нашел ${numSpecialists} специалистов, которые могут помочь вам.`,
            cards: selectedSpecialists.map((specialist) => ({
              type: "specialist" as const,
              id: specialist.id,
              name: specialist.name,
              image: specialist.image,
            })),
            footerText: "Если вам нужны дополнительные варианты или уточнения, просто напишите мне!",
          },
          timestamp: new Date(),
          status: "delivered",
        }

        const finalChat = {
          ...updatedChat,
          messages: [...updatedChat.messages, assistantMessage],
          relatedEntities: [...(updatedChat.relatedEntities || []), ...selectedSpecialists],
          updatedAt: new Date(),
        }

        setCurrentChat(finalChat)
        setIsLoading(false)
      }, 1500)
    },
    [currentChat, replyingTo],
  )

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages, scrollToBottom])

  const messageList = useMemo(
    () =>
      currentChat?.messages.map((message) => (
        <div key={message.id} className="space-y-4">
          <MessageItem
            message={message}
            onSpecialistClick={handleSpecialistClick}
            onServiceClick={handleServiceClick}
            onReply={handleReply}
            onShare={handleShare}
            onReplyClick={handleReplyClick}
            highlightedMessageId={highlightedMessageId}
            isAi={currentChat.isAi}
          />
        </div>
      )),
    [
      currentChat?.messages,
      currentChat?.isAi,
      handleSpecialistClick,
      handleServiceClick,
      handleReply,
      handleShare,
      handleReplyClick,
      highlightedMessageId,
    ],
  )

  const handleNewChat = () => {
    router.push(`/search/${Date.now()}`)
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
          <div className={cn(
              "fixed z-10 transition-all duration-300",
              "top-[5.5rem] left-20", // Позиция под хедером (5.5rem = 88px)
              "md:top-40 md:left-20", // На десктопе немного ниже и правее
              isCollapsed ? "left-4" : "left-6", // Адаптация при сворачивании
          )}>
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
                    "text-sm md:text-base", // Размер текста адаптивный
                )}
                title="New chat"
                aria-label="New chat"
            >
              <MessageSquare className="w-4 h-4" />
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Messages container - always centered regardless of sidebar state */}
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

        {/* Search bar at bottom - always centered regardless of sidebar state */}
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 dark:to-transparent pt-16">
            <div className="max-w-4xl mx-auto px-4 pb-6">
                <SearchBar
                    onSearch={handleSearch}
                    showHeading={false}
                    dynamicWidth={true}
                    replyingTo={replyingTo}
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
