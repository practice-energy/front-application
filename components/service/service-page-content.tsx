"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { MessagesSquare, Share } from "lucide-react"
import { AuthModal } from "@/components/modals/auth-modal"
import { Mufi } from "@/components/mufi/index"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { BackButton } from "@/components/ui/button-back"
import { ShareServiceModal } from "@/components/modals/share-service-modal"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"
import { useAdeptChats } from "@/stores/chat-store"
import { ServiceCard } from "@/components/service/service-card"
import type { Service } from "@/types/common"

interface ServicePageContentProps {
  service: Service
}

export function ServicePageContent({ service }: ServicePageContentProps) {
  const router = useRouter()
  const [isAnimating] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  // Refs for scrolling
  const bookingRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const specialist = service.specialist

  const { getChatDataById, findChatBySpecialistId, addMessageToChat, addChat } = useAdeptChats()

  const handleSearch = (query: string, title?: string, files: File[] = [], isPractice?: boolean) => {
    const existingChat = findChatBySpecialistId(specialist.id)

    if (existingChat) {
      const userMessage: Message = {
        id: uuidv4(),
        type: "user",
        content: query,
        timestamp: Date.now(),
        files: files,
        services: [service],
      }
      addMessageToChat(existingChat.id, userMessage)
      router.push(`/search/${existingChat.id}`)
    } else {
      const newChatId = uuidv4()
      const userMessage: Message = {
        id: uuidv4(),
        type: "user",
        content: query,
        timestamp: Date.now(),
        files: files,
        services: [service],
      }

      const newChat: Chat = {
        id: newChatId,
        title: specialist.name,
        avatar: specialist.avatar,
        specialistId: specialist.id,
        serviceId: service.id,
        timestamp: Date.now(),
        messages: [userMessage],
        isAI: false,
        hasNew: false,
        createdAt: Date.now(),
      }

      addChat(newChat)

      window.dispatchEvent(
        new CustomEvent("addNewChatToSidebar", {
          detail: {
            chat: {
              ...newChat,
              description: query,
              isPractice: isPractice,
            },
          },
        }),
      )

      router.push(`/search/${newChatId}`)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShareModalOpen(true)
  }

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/search/${specialist.id}`)
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-[144px] relative">
        <div
          className="flex-1 overflow-hidden"
          style={{
            transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
          }}
          data-animating={isAnimating ? "true" : "false"}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Header with Back Button and Action Buttons */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="flex-1">
                <BackButton className="text-neutral-700 opacity-80" text={"назад к профайл"} />
              </div>

              <div className="flex flex-row gap-3 items-center pt-2.5">
                {/* Message Button */}
                <button
                  type="button"
                  onClick={handleReply}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                  title="Написать специалисту"
                >
                  <MessagesSquare size={24} />
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                  title="Поделиться"
                >
                  <Share size={24} />
                </button>
              </div>
            </div>

            {/* Service Card */}
            <ServiceCard service={service} />
          </div>
        </div>

        {/* Fixed SearchBar at the bottom of the screen with sidebar sync */}
        <div ref={searchRef} className="fixed bottom-0 left-0 right-0">
          <div className="px-6">
            <Mufi
              onSearch={handleSearch}
              showHeading={false}
              dynamicWidth={true}
              placeholder="Забронировать услугу"
              chatTitle={specialist.name}
            />
          </div>
        </div>
      </main>

      <AuthModal isOpen={false} onClose={() => {}} mode="login" />

      <ShareServiceModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} service={service} />
    </>
  )
}
