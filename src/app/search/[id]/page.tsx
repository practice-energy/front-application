"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Mufi } from "@/src/components/mufi"
import { ShareModal } from "@/src/components/modals/share-modal"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/src/types/chats"
import { useAdeptChats, useMasterChats } from "@/src/stores/chat-store"
import { MessageList } from "@/src/components/chat/message-list"
import { ChatEmptyState } from "@/src/components/chat/chat-empty-state"
import { useIsMobile } from "@/src/hooks/use-mobile"
import { mockSavedSpecialists } from "@/src/services/mock-specialists"
import { cn } from "@/src/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
import { useAuth } from "@/src/hooks/use-auth"
import { ChatHeader } from "@/src/components/header/components/chat-header"
import { useProfileStore } from "@/src/stores/profile-store"
import { useBecomeSpecialist } from "@/src/stores/chat-store"
import {
  createVersionMessage,
  getVersionQuestions,
  initVersionTestMessage,
  initVersionTestMessageFooter,
  personalitySelector,
  step4ContinueMessage,
} from "@/src/components/become-specialist/messages"

const useChatStore = (user) => (user?.hat === "adept" ? useAdeptChats() : useMasterChats())

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
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { isAuthenticated } = useAuth()
  const { getChatDataById, addMessageToChat, addChat, chats } = useChatStore(user)
  const {
    state: becomeSpecialistState,
    setStep: setBecomeSpecialistStep,
    setChatId: setBecomeSpecialistChatId,
    setPersonalityAnswer,
    setVersionAnswer,
    setSelectedTags,
    setPolicyAccepted,
    setMeetingLetted,
  } = useBecomeSpecialist()

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
      }
      setCurrentChat(newChat)
    }
  }, [params.id, getChatDataById])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior,
        block: "end",
        inline: "nearest"
      });
    });
  }, []);

  useEffect(() => {
    // Первый скролл при монтировании (instant)
    if (messagesEndRef.current) {
      scrollToBottom("auto");
    }
  }, []);

  useEffect(() => {
    // Скролл при изменении сообщений (smooth)
    if (currentChat?.messages?.length) {
      scrollToBottom();
    }
  }, [currentChat?.messages, scrollToBottom]);

  useEffect(() => {
    if (!currentChat || currentChat.messages.length === 0) {
      return
    }

    const lastMessage = currentChat.messages[currentChat.messages.length - 1]

    if (lastMessage.type === "user" && lastHandledMessageId.current !== lastMessage.id) {
      lastHandledMessageId.current = lastMessage.id

      setTimeout(() => {
        const numSpecialists = 2
        const selectedSpecialists = mockSavedSpecialists.slice(0, numSpecialists)
        const assistantMessage: Message = {
          id: uuidv4(),
          type: "assistant",
          content: `Вот результаты поиска по запросу "${lastMessage.content}". Я нашел ${numSpecialists} специалистов, которые могут помочь вам.`,
          timestamp: Date.now(),
          specialists: selectedSpecialists,
          footerContent: "Если вам нужны дополнительные варианты или уточнения, просто напишите мне!",
          aiMessageType: Date.now() % 2 > 0 ? "service" : "info",
        }

        const updatedChat = addMessageToChat(currentChat.id, assistantMessage)
        if (updatedChat) {
          updatedChat.footerContent = "Если вам нужны дополнительные варианты или уточнения, просто напишите мне!"
          setCurrentChat(updatedChat)
        }

      }, 1500)
    }
  }, [currentChat, addMessageToChat])

  useEffect(() => {
    setCurrentChat(getChatDataById(params.id))
  }, [addMessageToChat, chats]);

  const handleStepTransition = useCallback(() => {
    console.log(becomeSpecialistState)

    if (!currentChat) return

    // Step 1 → 2
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
        testQuestion: firstQuestion.question,
        questionIndex: 0,
        timestamp: Date.now(),
        aiMessageType: "profile-test",
        tags: firstQuestion.variants.map((variant) => ({ name: variant })),
      }

      const updatedChat = addMessageToChat(currentChat.id, questionMessage)
      if (updatedChat) {
        setCurrentChat(updatedChat)
      }

      console.log(becomeSpecialistState)
    }

    // Step 2 → 3
    else if (
      becomeSpecialistState.step === 2 &&
      Object.keys(becomeSpecialistState.personalityAnswers).length === personalitySelector.questions.length
    ) {
      setBecomeSpecialistStep(3)

      const questions = getVersionQuestions(becomeSpecialistState.v)
      const updatedChat = addMessageToChat(currentChat.id, createVersionMessage(questions[0], 0))
      if (updatedChat) {
        setCurrentChat(updatedChat)
      }
    }
    // Step 4 → 5
    else if (becomeSpecialistState.step === 4) {
      setBecomeSpecialistStep(5)
      setMeetingLetted()
      setBecomeSpecialistChatId(null)
    }
  }, [
    becomeSpecialistState.step,
    becomeSpecialistState.selectedTags,
    becomeSpecialistState.policyAccepted,
    becomeSpecialistState.personalityAnswers,
    becomeSpecialistState.v,
    currentChat,
    addMessageToChat,
    setBecomeSpecialistStep,
    setBecomeSpecialistChatId,
  ])

  useEffect(() => {
    if (
      becomeSpecialistState.step === 3 &&
      becomeSpecialistState.v &&
      currentChat &&
      currentChat.isSpecialChat === "become-specialist"
    ) {
      const questions = getVersionQuestions(becomeSpecialistState.v)
      const hasVersionMessage = currentChat.messages.some((msg) => msg.aiMessageType === "version-test")

      if (!hasVersionMessage && questions.length > 0) {
        const firstVersionMessage = createVersionMessage(
          questions[0],
          0,
          initVersionTestMessage,
          initVersionTestMessageFooter,
        )

        const updatedChat = addMessageToChat(currentChat.id, firstVersionMessage)
        if (updatedChat) {
          setCurrentChat(updatedChat)
        }
      }
    }
  }, [
    becomeSpecialistState.step,
    becomeSpecialistState.v,
    currentChat,
    addMessageToChat,
    initVersionTestMessage,
    initVersionTestMessageFooter,
  ])

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
            testQuestion: nextQuestion.question,
            questionIndex: nextQuestionIndex,
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

  const handleVersionAnswer = useCallback(
    (questionId: string, answer: number) => {
      setVersionAnswer(questionId, answer)

      const questions = getVersionQuestions(becomeSpecialistState.v)

      if (Object.keys(becomeSpecialistState.versionAnswers).length < questions.length - 1) {
        const nextQuestionIndex = Object.keys(becomeSpecialistState.versionAnswers).length + 1
        const nextQuestion = questions[nextQuestionIndex]

        setTimeout(() => {
          const updatedChat = addMessageToChat(currentChat!.id, createVersionMessage(nextQuestion, nextQuestionIndex))
          if (updatedChat) {
            setCurrentChat(updatedChat)
          }
        }, 500)
      }
    },
    [
      becomeSpecialistState.step,
      becomeSpecialistState.v,
      becomeSpecialistState.versionAnswers,
      currentChat,
      addMessageToChat,
      setVersionAnswer,
    ],
  )

  const getMufiMode = useCallback((): { mode: "accept" | "continue" | "input"; canAccept: boolean } => {
    if (!currentChat || currentChat.messages.length === 0) {
      return { mode: "input", canAccept: false }
    }

    const lastMessage = currentChat.messages[currentChat.messages.length - 1]

    if (becomeSpecialistState.step === 1 && lastMessage.aiMessageType === "become-specialist-drops") {
      const canAccept = becomeSpecialistState.selectedTags.length > 0 && becomeSpecialistState.policyAccepted
      return { mode: "accept", canAccept }
    }

    if (
      (becomeSpecialistState.step === 2 || becomeSpecialistState.step === 3) &&
      (lastMessage.aiMessageType === "profile-test" || lastMessage.aiMessageType === "version-test")
    ) {
      const canContinue =
        Object.keys(becomeSpecialistState.personalityAnswers).length === personalitySelector.questions.length
      return { mode: "continue", canAccept: canContinue }
    }

    if (becomeSpecialistState.step === 4) return { mode: "continue", canAccept: true }

    if (becomeSpecialistState.step === 5) return { mode: "input", canAccept: false }

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

  useEffect(() => {
    if (becomeSpecialistState.step === 4 && !becomeSpecialistState.meetingLetted) {
      const updatedChat = addMessageToChat(currentChat?.id, step4ContinueMessage)
      setMeetingLetted()
      if (updatedChat) {
        setCurrentChat(updatedChat)
      }
    }
  }, [becomeSpecialistState.step, currentChat?.id, addMessageToChat])

  return (
    <div className="relative h-screen bg-theme-light-bg dark:bg-gray-900">
      {isMobile && isCollapsed ? (
        <>
          <ChatHeader
            user={user}
            currentChat={currentChat!}
            toggleSidebar={toggleSidebar}
            toggleProfileMenu={toggleSidebar}
            isAuthenticated={isAuthenticated}
          />

          <div className="w-full h-full overflow-y-auto px-2 pb-16 items-center z-0">
            <div className={cn("w-full h-12")} />
            {currentChat && currentChat.messages.length === 0 ? (
              <ChatEmptyState />
            ) : (
              <MessageList
                chat={currentChat}
                onSpecialistClick={handleSpecialistClick}
                onServiceClick={handleServiceClick}
                onShare={handleShare}
                onRegenerate={handleRegenerate}
                specialistId={params.id as string}
                onTagSelection={handleTagSelection}
                onPolicyAcceptance={handlePolicyAcceptance}
                onPersonalityAnswer={handlePersonalityAnswer}
                onVersionAnswer={handleVersionAnswer}
                isMobile={isMobile}
              />
            )}
            <div
                ref={messagesEndRef}
                style={{ float: "left", clear: "both" }}
            />
          </div>
          <div className="absolute bottom-0 px-1 mb-2 z-[1000] w-full">
            <Mufi
                onSearch={handleSearch}
                showPractice={false}
                disableFileApply={true}
                placeholder={currentChat?.title || "Alura"}
                onCancelReply={() => {}}
                chatTitle="Alura"
                mode={mode}
                canAccept={canAccept}
                onContinue={handleContinue}
                isMobile={isMobile}
            />
          </div>
        </>
      ) : (
        <>
          <div
            className="fixed inset-0 flex justify-center overflow-hidden"
            style={{
              left: "458px",
              right: "0",
            }}
          >
            <div className="w-full h-full overflow-y-auto pb-32 px-4 pr-[216px] items-center z-0">
              <div className={cn("w-full h-20")} />
              {currentChat && currentChat.messages.length === 0 ? (
                <ChatEmptyState />
              ) : (
                <MessageList
                  chat={currentChat}
                  onSpecialistClick={handleSpecialistClick}
                  onServiceClick={handleServiceClick}
                  onShare={handleShare}
                  onRegenerate={handleRegenerate}
                  specialistId={params.id as string}
                  onTagSelection={handleTagSelection}
                  onPolicyAcceptance={handlePolicyAcceptance}
                  onPersonalityAnswer={handlePersonalityAnswer}
                  onVersionAnswer={handleVersionAnswer}
                  isMobile={isMobile}
                />
              )}
              <div className="h-16" />
              <div ref={messagesEndRef} />
            </div>
          </div>
        </>
      )}

      <div
          className="fixed bottom-0 left-[458px] flex justify-center w-[720px] "
      >
        <div className="w-full pb-4 pt-4">
          {!isMobile && (
              <Mufi
                  onSearch={handleSearch}
                  showPractice={currentChat?.isAI === true}
                  disableFileApply={true}
                  placeholder={currentChat?.title || "Alura"}
                  onCancelReply={() => {}}
                  chatTitle="Alura"
                  mode={mode}
                  canAccept={canAccept}
                  onContinue={handleContinue}
                  isMobile={isMobile}
              />
          )}
        </div>
      </div>

      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} message={messageToShare} />
    </div>
  )
}
