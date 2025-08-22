"use client"

import {use, useMemo, useState} from "react"
import { mockServices } from "@/services/mock-services"
import { ServicePageContent } from "@/components/service/service-page-content"
import { mockBookingSlots } from "@/services/booking-slot-data"
import type { Chat, Message } from "@/types/chats"
import { v4 as uuidv4 } from "uuid"
import { router } from "next/client"
import { useAdeptChats } from "@/stores/chat-store"
import { useIsMobile } from "@/components/ui/use-mobile"
import { MobileServiceCard } from "@/components/service/mobile-service-card"
import {useSearchParams} from "next/navigation";
import {cn} from "@/lib/utils";
import {Mufi} from "@/components/mufi";

export default function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const isMobile = useIsMobile()

  const isEditable = true //user?.specialistProfile?.id === specialist.id

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
        avatar: service.specialist.avatar || "",
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
        <MobileServiceCard service={service} bookingSlots={bookingSlots} isEditable={isEditable}/>
      ) : (
        <div className="mx-auto px-4">
          <div className="h-[66px]"/>
          <ServicePageContent service={service} bookingSlots={bookingSlots} isEditable={isEditable}/>
          <div className="h-[138px]"/>
        </div>
      )}

      <div className={cn(
          isMobile ? "fixed bottom-0 w-full" : "fixed bottom-0 w-[800px] left-[calc(50%-400px)]",
      )}>
        <Mufi
            onSearch={handleSearch}
            chatTitle="Alura"
            showPractice={false}
            disableFileApply={true}
        />
      </div>
    </>
  )
}
