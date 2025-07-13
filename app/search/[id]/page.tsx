"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar/index"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { ShareModal } from "@/components/share-modal"
import { useSidebar } from "@/contexts/sidebar-context"
import { mockSavedSpecialists, getChatDataById, addMessageToChat } from "@/services/mock-data"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"

import { MessageList } from "@/components/chat/message-list"
import { ChatNewButton } from "@/components/chat/chat-new-button"
import { ChatEmptyState } from "@/components/chat/chat-empty-state"

export default function SearchPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { isCollapsed } = useSidebar()
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAnimating] = useState(false)
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [messageToShare, setMessageToShare] = useState<Message | null>(null)
  const lastHandledMessageId = useRef<string | null>(null)

  useEffect(() => {
    const chatId = params.id as string
    const existingChat = getChatDataById(chatId)
    if (existingChat) {
      setCurrentChat(existingChat)
    } else {
      const newChat: Chat = {
        id: chatId,
        title: "Новый чат",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        messages: [],
        isAI: true,
        createdAt: Date.now(),
        isMuted: false,
      }
      setCurrentChat(newChat)
    }
  }, [params.id])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages, scrollToBottom])

  // This useEffect is now the single source of truth for generating assistant responses.
  useEffect(() => {
    if (!currentChat || currentChat.messages.length === 0) {
      return
    }

    const lastMessage = currentChat.messages[currentChat.messages.length - 1]

    if (lastMessage.type === "user" && lastHandledMessageId.current !== lastMessage.id) {
      lastHandledMessageId.current = lastMessage.id
      setIsLoading(true)

      setTimeout(() => {
        const numSpecialists = 2
        const selectedSpecialists = mockSavedSpecialists.slice(0, numSpecialists)
        const assistantMessage: Message = {
          id: uuidv4(),
          type: "assistant",
          content: `Вот результаты поиска по запросу "${lastMessage.content}". Я нашел ${numSpecialists} специалистов, которые могут помочь вам.`,
          timestamp: Date.now(),
          specialists: selectedSpecialists,
        }

        setCurrentChat((prevChat) => {
          if (!prevChat) return null
          const finalChat = addMessageToChat(prevChat, assistantMessage)
          finalChat.footerContent = "Если вам нужны дополнительные варианты или уточнения, просто напишите мне!"
          return finalChat
        })

        setIsLoading(false)
      }, 1500)
    }
  }, [currentChat])

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

  const handleShare = useCallback((message: Message) => {
    setMessageToShare(message)
    setShareModalOpen(true)
  }, [])

  const handleRegenerate = useCallback(
    async (message: Message) => {
      if (!currentChat || message.type !== "assistant") return

      // Remove the assistant message to be regenerated
      const updatedMessages = currentChat.messages.filter((m) => m.id !== message.id)

      // The last message is now a user message. We want the useEffect to re-run for it.
      // To do that, we clear the lastHandledMessageId ref before updating the state.
      lastHandledMessageId.current = null

      const updatedChat = { ...currentChat, messages: updatedMessages }
      setCurrentChat(updatedChat)
    },
    [currentChat],
  )

  // handleSearch now only adds the user's message. The useEffect handles the response.
  const handleSearch = useCallback(
    async (query: string, title = "Аллюра", files: File[] = [], isPractice = false) => {
      if ((!query || !query.trim()) && (!files || files.length === 0)) return

      const isNewChat = !currentChat || currentChat.messages.length === 0

      const now = Date.now()
      const userMessage: Message = {
        id: uuidv4(),
        type: "user",
        content: query,
        timestamp: now,
        files: files,
      }

      setCurrentChat((prevChat) => {
        const chatToUpdate = prevChat ?? {
          id: params.id as string,
          title: "Новый чат",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          messages: [],
          isAI: true,
          createdAt: Date.now(),
          isMuted: false,
        }
        const updatedChat = addMessageToChat(chatToUpdate, userMessage)

        if (isNewChat) {
          window.dispatchEvent(
            new CustomEvent("addNewChatToSidebar", {
              detail: {
                chat: {
                  ...updatedChat,
                  title: title,
                  description: query,
                  files: files,
                  isPractice: isPractice,
                },
              },
            }),
          )
        }
        return updatedChat
      })
    },
    [params.id, currentChat],
  )

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
          <ChatNewButton />
          <div className="flex justify-center px-6 py-4">
            <div className="max-w-4xl w-full pb-64 pt-20">
              {currentChat && currentChat.messages.length === 0 && !isLoading ? (
                <ChatEmptyState />
              ) : (
                <MessageList
                  chat={currentChat}
                  isLoading={isLoading}
                  highlightedMessageId={highlightedMessageId}
                  onSpecialistClick={handleSpecialistClick}
                  onServiceClick={handleServiceClick}
                  onShare={handleShare}
                  onRegenerate={handleRegenerate}
                  specialistId={params.id as string}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>

        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 dark:to-transparent pt-16">
            <div className="pb-6">
              <SearchBar
                onSearch={handleSearch}
                showHeading={false}
                dynamicWidth={true}
                placeholder={"Найти специалистов..."}
                onCancelReply={() => {}}
                chatTitle="Аллюра"
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
