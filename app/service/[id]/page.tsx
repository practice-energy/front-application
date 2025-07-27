"use client"

import {use, useMemo} from "react"
import { mockServices } from "@/services/mock-services"
import { ServicePageContent } from "@/components/service/service-page-content"
import { mockBookingSlots } from "@/services/booking-slot-data"
import type { Chat, Message } from "@/types/chats"
import { v4 as uuidv4 } from "uuid"
import { router } from "next/client"
import { useAdeptChats } from "@/stores/chat-store"
import { useIsMobile } from "@/components/ui/use-mobile"
import { MobileServiceCard } from "@/components/service/mobile-service-card"

export default function ServicePage({ params }: { params: { id: string } }) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const isMobile = useIsMobile()

  const { getChatDataById, findChatBySpecialistId, addMessageToChat, addChat } = useAdeptChats()

  // Мемоизируем сервис чтобы избежать ререндеринга дочерних компонентов
  const service = useMemo(() => {
    return mockServices.find((s) => s.id === id) || mockServices[0]
  }, [id])

  // Мемоизируем booking slots
  const bookingSlots = useMemo(() => mockBookingSlots, [])

  const handleSearch = (query: string, title?: string, files: File[] = [], isPractice?: boolean) => {
    if (!query.trim() && files.length === 0) return

    const existingChat = findChatBySpecialistId(service.specialist.id)

    if (existingChat) {
      const userMessage: Omit<Message, "id"> = {
        type: "user",
        content: query,
        timestamp: Date.now(),
        files: files,
      }
      addMessageToChat(existingChat.id, userMessage)
      window.dispatchEvent(new CustomEvent("chatUpdated", { detail: { chatId: existingChat.id } }))
      router.push(`/search/${existingChat.id}`)
    } else {
      const newChatId = uuidv4()
      const userMessage: Message = {
        id: uuidv4(),
        type: "user",
        content: query,
        timestamp: Date.now(),
        files: files,
      }

      const newChat: Chat = {
        id: newChatId,
        title: service.specialist.name,
        specialistId: service.specialist.id,
        avatar: service.specialist.avatar || "placeholder.jpg",
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
      {isMobile ? (
        <MobileServiceCard service={service} bookingSlots={bookingSlots} />
      ) : (
        <div className="mx-auto px-4 sm:px-6 py-8">
          {/* Service Page Content */}
          <div className="h-24" />
          <ServicePageContent service={service} bookingSlots={bookingSlots} />
        </div>
      )}
      {/*<Mufi*/}
      {/*    onSearch={handleSearch}*/}
      {/*    showHeading={false}*/}
      {/*    dynamicWidth={false}*/}
      {/*    showPractice={false}*/}
      {/*    disableFileApply={true}*/}
      {/*    placeholder={ `Спроси у ${service.specialist?.name || "Alura"}`}*/}
      {/*    onCancelReply={() => {}}*/}
      {/*    chatTitle="Alura"*/}
      {/*/>*/}
    </>
  )
}
