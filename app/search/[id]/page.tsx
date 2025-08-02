"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Mufi } from "@/components/mufi/index"
import { ShareModal } from "@/components/modals/share-modal"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"
import { useAdeptChats, useBecomeSpecialist, useMasterChats } from "@/stores/chat-store"
import { MessageList } from "@/components/chat/message-list"
import { ChatEmptyState } from "@/components/chat/chat-empty-state"
import { useIsMobile } from "@/hooks/use-mobile"
import { mockSavedSpecialists } from "@/services/mock-specialists"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useAuth } from "@/hooks/use-auth"
import { ChatHeader } from "@/components/header/components/chat-header"
import { useProfileStore } from "@/stores/profile-store"
import { personalitySelector } from "@/components/become-specialist/messages"

export default function SearchPage() {
  const params = useParams()
  const router = useRouter()
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [messageToShare, setMessageToShare] = useState<Message | null>(null)
  const lastHandledMessageId = useRef<string | null>(null)
  const isMobile = useIsMobile()
  const { user } = useProfileStore()
  const {
    state: becomeSpecialistState,
    setStep: setBecomeSpecialistStep,
    setSelectedTags,
    setPolicyAccepted,
    setPersonalityAnswer,
    resetState: resetBecomeSpecialistState,
  } = useBecomeSpecialist()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { isAuthenticated } = useAuth()

  const { getChatDataById, addMessageToChat, addChat, chats } =
    user?.hat === "adept" ? useAdeptChats() : useMasterChats()

  useEffect(() => {
    const chatId = params.id as string
    const existingChat = getChatDataById(chatId)

    if (existingChat) {
      setCurrentChat(existingChat)

      // Determine step based on chat state
      if (existingChat.messages.length === 1) {
        setBecomeSpecialistStep(1)
      } else if (existingChat.messages.length > 1) {
        // Check if we're in personality test phase
        const lastMessage = existingChat.messages[existingChat.messages.length - 1]
        if (lastMessage.aiMessageType === "profile-test") {
          setBecomeSpecialistStep(2)
        }
      }
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
      }
      setCurrentChat(newChat)
    }
  }, [params.id, getChatDataById, setBecomeSpecialistStep])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages, scrollToBottom])

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

  const handleStepTransition = useCallback(() => {
    if (
      becomeSpecialistState.step === 1 &&
      becomeSpecialistState.selectedTags.length > 0 &&
      becomeSpecialistState.policyAccepted
    ) {
      setBecomeSpecialistStep(2)

      const firstQuestion = personalitySelector.questions[0]
      const questionMessage: Message = {
        id: uuidv4(),
        type: "assistant",
        content: firstQuestion.question,
        timestamp: Date.now(),
        aiMessageType: "profile-test",
        tags: firstQuestion.variants.map((variant) => ({ name: variant })),
      }

      const updatedChat = addMessageToChat(currentChat!.id, questionMessage)
      if (updatedChat) {
        setCurrentChat(updatedChat)
      }
    } else if (
      becomeSpecialistState.step === 2 &&
      Object.keys(becomeSpecialistState.personalityAnswers).length === personalitySelector.questions.length
    ) {
      setBecomeSpecialistStep(3)
    }
  }, [becomeSpecialistState, currentChat, addMessageToChat, setBecomeSpecialistStep])

  const handlePersonalityAnswer = useCallback(
    (questionId: string, answer: string) => {
      setPersonalityAnswer(questionId, answer)

      if (Object.keys(becomeSpecialistState.personalityAnswers).length < personalitySelector.questions.length - 1) {
        const nextQuestionIndex = Object.keys(becomeSpecialistState.personalityAnswers).length + 1
        const nextQuestion = personalitySelector.questions[nextQuestionIndex]

        setTimeout(() => {
          const questionMessage: Message = {
            id: uuidv4(),
            type: "assistant",
            content: nextQuestion.question,
            timestamp: Date.now(),
            aiMessageType: "profile-test",
            tags: nextQuestion.variants.map((variant) => ({ name: variant })),
          }

          const updatedChat = addMessageToChat(currentChat!.id, questionMessage)
          if (updatedChat) {
            setCurrentChat(updatedChat)
          }
        }, 500)
      }
    },
    [becomeSpecialistState.personalityAnswers, currentChat, addMessageToChat, setPersonalityAnswer],
  )

  const handleAddMessage = useCallback(
    (message: Message) => {
      if (!currentChat) return

      const updatedChat = addMessageToChat(currentChat.id, message)
      if (updatedChat) {
        setCurrentChat(updatedChat)
      }
    },
    [currentChat, addMessageToChat],
  )

  const getMufiMode = useCallback(() => {
    if (!currentChat || currentChat.messages.length === 0) {
      return { mode: "input", canAccept: false }
    }

    const lastMessage = currentChat.messages[currentChat.messages.length - 1]

    if (becomeSpecialistState.step === 1 && lastMessage.aiMessageType === "become-specialist-drops") {
      const canAccept = becomeSpecialistState.selectedTags.length > 0 && becomeSpecialistState.policyAccepted
      return { mode: "accept", canAccept }
    }

    if (becomeSpecialistState.step === 2 && lastMessage.aiMessageType === "profile-test") {
      const canContinue =
        Object.keys(becomeSpecialistState.personalityAnswers).length === personalitySelector.questions.length
      return { mode: "continue", canAccept: canContinue }
    }

    return { mode: "input", canAccept: false }
  }, [currentChat, becomeSpecialistState])

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

  const handleRegenerate = useCallback(async (message: Message) => {
    setCurrentChat((prevChat) => {
      if (!prevChat || message.type !== "assistant") return prevChat

      const updatedMessages = prevChat.messages.filter((m) => m.id !== message.id)
      lastHandledMessageId.current = null

      const updatedChat = { ...prevChat, messages: updatedMessages }
      return updatedChat
    })
  }, [])

  const handleTagSelection = useCallback(
    (tags: string[]) => {
      setSelectedTags(tags)
    },
    [setSelectedTags],
  )

  const handlePolicyAcceptance = useCallback(
    (accepted: boolean) => {
      setPolicyAccepted(accepted)
    },
    [setPolicyAccepted],
  )

  const handleContinue = useCallback(() => {
    handleStepTransition()
  }, [handleStepTransition])

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
        const updatedChat = addMessageToChat(chatId, userMessage)
        if (updatedChat) {
          setCurrentChat(updatedChat)
        }
      }
    },
    [params.id, getChatDataById, addChat, addMessageToChat],
  )

  const { mode, canAccept } = getMufiMode()

  if (!user || !isAuthenticated) {
    router.push("/")
    return null
  }

  return (
    <div className="relative h-screen bg-white dark:bg-gray-900">
      {isMobile && isCollapsed ? (
        <>
          <ChatHeader
            user={user}
            currentChat={currentChat!}
            toggleSidebar={toggleSidebar}
            toggleProfileMenu={toggleSidebar}
            isAuthenticated={isAuthenticated}
          />

          <div className="w-full h-full overflow-y-auto pt-20 pb-32 px-4 md:pr-40 items-center z-0">
            <div className={cn("w-full", isMobile ? "h-12" : "h-24")} />
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
                onTagSelection={handleTagSelection}
                onPolicyAcceptance={handlePolicyAcceptance}
                onPersonalityAnswer={handlePersonalityAnswer}
                onAddMessage={handleAddMessage}
              />
            )}
            <div className="h-16" />
            <div ref={messagesEndRef} />
          </div>
        </>
      ) : (
        <>
          <div
            className="fixed inset-0 flex justify-center overflow-hidden"
            style={{
              left: "500px",
              right: "0",
            }}
          >
            <div className="w-full h-full overflow-y-auto pt-20 pb-32 px-4 pr-40 items-center z-0">
              <div className="h-24" />
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
                  onTagSelection={handleTagSelection}
                  onPolicyAcceptance={handlePolicyAcceptance}
                  onPersonalityAnswer={handlePersonalityAnswer}
                  onAddMessage={handleAddMessage}
                />
              )}
              <div className="h-16" />
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div
            className="fixed bottom-0 left-0 right-0 flex justify-center"
            style={{
              left: "500px",
            }}
          >
            <div className="w-full max-w-4xl px-4 pb-4 pt-4">
              <Mufi
                onSearch={handleSearch}
                showHeading={false}
                dynamicWidth={false}
                showPractice={currentChat?.isAI === true}
                disableFileApply={true}
                placeholder={`Спроси у ${currentChat?.title || "Alura"}`}
                onCancelReply={() => {}}
                chatTitle="Alura"
                mode={mode}
                canAccept={canAccept}
                selectedTags={becomeSpecialistState.selectedTags}
                onContinue={handleContinue}
              />
            </div>
          </div>
        </>
      )}

      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} message={messageToShare} />
    </div>
  )
}
