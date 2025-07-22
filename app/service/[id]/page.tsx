"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/modals/auth-modal"
import { Mufi } from "@/components/mufi/index"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { BackButton } from "@/components/ui/button-back"
import { cn } from "@/lib/utils"
import { ShareServiceModal } from "@/components/modals/share-service-modal"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"
import { useAdeptChats } from "@/stores/chat-store"
import { mockServices } from "@/services/mock-services"
import { ServiceCard } from "@/components/service/service-card"

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [, setSelectedTimeRange] = useState<string | null>(null)
  const [isAnimating] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  // Refs for scrolling
  const bookingRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Find the service by ID
  const service = mockServices.find((s) => s.id === id) || mockServices[0]
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
            {/* Header with buttons */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <BackButton className="text-gray-600 dark:text-gray-300" />
              <Button
                size="sm"
                className={cn(
                  "text-gray-600 dark:text-white",
                  "shadow-md hover:shadow-lg",
                  "backdrop-blur-sm bg-white/80 dark:bg-gray-800/80",
                )}
                onClick={() => setShareModalOpen(true)}
              >
                <Share className="h-4 w-4 mr-2" />
                Поделиться
              </Button>
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

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />

      <ShareServiceModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} service={service} />
    </>
  )
}
