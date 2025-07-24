"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Mufi } from "@/components/mufi/index"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { AuthModal } from "@/components/modals/auth-modal"
import { ShareModal } from "@/components/modals/share-modal"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"
import { useAdeptChats } from "@/stores/chat-store"

import { MessageList } from "@/components/chat/message-list"
import { ChatNewButton } from "@/components/chat/chat-new-button"
import { ChatEmptyState } from "@/components/chat/chat-empty-state"
import { useIsMobile } from "@/hooks/use-mobile"
import {mockSavedSpecialists} from "@/services/mock-specialists";

export default function SearchPage() {
  const params = useParams()
  const router = useRouter()
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAnimating] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [messageToShare, setMessageToShare] = useState<Message | null>(null)
  const lastHandledMessageId = useRef<string | null>(null)
  const isMobile = useIsMobile()
  const { getChatDataById, addMessageToChat, addChat } = useAdeptChats()

  useEffect(() => {
    const chatId = params.id as string
    const existingChat = getChatDataById(chatId)
    if (existingChat) {
      setCurrentChat(existingChat)
    } else {
      const newChat: Chat = {
        id: chatId,
        title: "Alura",
        timestamp: Date.now(),
        isAI: true,
        createdAt: Date.now(),
        isMuted: false,
        messages: [],
        hasNew: false,
        footerContent: "",
      }
      setCurrentChat(newChat)
    }
  }, [params.id, getChatDataById])

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

        const updatedChat = addMessageToChat(currentChat.id, assistantMessage)
        if (updatedChat) {
          updatedChat.footerContent = "Если вам нужны дополнительные варианты или уточнения, просто напишите мне!"
          setCurrentChat(updatedChat)
        }

        setIsLoading(false)
      }, 1500)
    }
  }, [currentChat, addMessageToChat])

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
      setCurrentChat((prevChat) => {
        if (!prevChat || message.type !== "assistant") return prevChat

        // Remove the assistant message to be regenerated
        const updatedMessages = prevChat.messages.filter((m) => m.id !== message.id)

        // The last message is now a user message. We want the useEffect to re-run for it.
        // To do that, we clear the lastHandledMessageId ref before updating the state.
        lastHandledMessageId.current = null

        const updatedChat = { ...prevChat, messages: updatedMessages }
        return updatedChat
      })
    },
    [], // No dependencies needed, making the function stable
  )

  // handleSearch now only adds the user's message. The useEffect handles the response.
  const handleSearch = useCallback(
    async (query: string, title = "Alura", files: File[] = [], isPractice = false) => {
      if ((!query || !query.trim()) && (!files || files.length === 0)) return

      const now = Date.now()
      const userMessage: Message = {
        id: uuidv4(),
        type: "user",
        content: query,
        timestamp: now,
        files: files,
      }

      const chatId = params.id as string
      const existingChat = getChatDataById(chatId)

      if (!existingChat || existingChat.messages.length === 0) {
        // Create new chat only if it doesn't exist in store
        const newChat: Chat = {
          id: chatId,
          title: title,
          timestamp: Date.now(),
          messages: [userMessage],
          isAI: true,
          createdAt: Date.now(),
          isMuted: false,
          hasNew: true,
        }

        addChat(newChat)
        setCurrentChat(newChat)
      } else {
        // Add message to existing chat
        const updatedChat = addMessageToChat(chatId, userMessage)
        if (updatedChat) {
          setCurrentChat(updatedChat)
        }
      }
    },
    [params.id, getChatDataById, addChat, addMessageToChat],
  )

  return (
      <div className="relative h-screen bg-white dark:bg-gray-900">
        {!isMobile && <ChatNewButton />}

        {isMobile ? (<>
          {/* Прокручиваемая область сообщений */}
          <div className="w-full h-full overflow-y-auto pt-20 pb-32 px-4 md:pr-40 items-center z-0">
            <div className="h-24 w-full"/>
            {currentChat && currentChat.messages.length === 0 && !isLoading ? (
                <ChatEmptyState />
            ) : (
                <MessageList
                    chat={currentChat}
                    isLoading={isLoading}
                    onSpecialistClick={handleSpecialistClick}
                    onServiceClick={handleServiceClick}
                    onShare={handleShare}
                    onRegenerate={handleRegenerate}
                    specialistId={params.id as string}
                />
            )}
            <div className="h-16"/>
            <div ref={messagesEndRef} />
          </div>
        </>) : (<>
          {/* Фиксированный контейнер чата по центру экрана */}
          <div
              className="fixed inset-0 flex justify-center overflow-hidden"
              style={{
                left: "500px", // Отступ для сайдбара
                right: "0",
              }}
          >
            {/* Прокручиваемая область сообщений */}
            <div className="w-full h-full overflow-y-auto pt-20 pb-32 px-4 pr-40 items-center z-0">
              <div className="h-24"/>
              {currentChat && currentChat.messages.length === 0 && !isLoading ? (
                  <ChatEmptyState />
              ) : (
                  <MessageList
                      chat={currentChat}
                      isLoading={isLoading}
                      onSpecialistClick={handleSpecialistClick}
                      onServiceClick={handleServiceClick}
                      onShare={handleShare}
                      onRegenerate={handleRegenerate}
                      specialistId={params.id as string}
                  />
              )}
              <div className="h-16"/>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Фиксированный Mufi по центру экрана */}
          <div
              className="fixed bottom-0 left-0 right-0 flex justify-center"
              style={{
                left: "500px", // Учитываем отступ сайдбара
              }}
          >
            <div className="w-full max-w-4xl px-4 pb-4 pt-4">
              <Mufi
                  onSearch={handleSearch}
                  showHeading={false}
                  dynamicWidth={false}
                  showPractice={currentChat?.isAI}
                  disableFileApply={true}
                  placeholder={ `Спроси у ${currentChat?.title || "Alura"}`}
                  onCancelReply={() => {}}
                  chatTitle="Alura"
              />
            </div>
          </div>
        </>)}

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />
        <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} message={messageToShare} />
      </div>
  )
}
