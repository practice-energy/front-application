"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/modals/auth-modal"
import { useTranslations } from "@/hooks/use-translations"
import { Mufi } from "@/components/mufi/index"
import { ShareSpecialistModal } from "@/components/modals/share-specialist-modal"
import { notFound } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"
import DesctopSpecialistProfile from "@/components/specialist/desktop-specialist-profile"
import { useAdeptChats } from "@/stores/chat-store"
import {getSpecialistById, mockSpecialist} from "@/services/mock-specialists";
import MobileSpecialistProfile from "@/components/specialist/mobile-specialist-profile";
import {useIsMobile} from "@/components/ui/use-mobile";

export default function SpecialistPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useTranslations()
  const { id } = params
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const isMobile = useIsMobile()

  // Refs for scrolling
  const servicesRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const [shareModalOpen, setShareModalOpen] = useState(false)

  // Find the specialist by ID
  const specialist = getSpecialistById(id) || mockSpecialist

  // If specialist not found, show not-found page
  if (!specialist) {
    notFound()
  }

  // Handle service card click - navigate to service page
  const handleServiceCardClick = (service: any) => {
    router.push(`/service/${service.id}`)
  }

  const { getChatDataById, findChatBySpecialistId, addMessageToChat, addChat } = useAdeptChats()

  const handleSearch = (query: string, title?: string, files: File[] = [], isPractice?: boolean) => {
    if (!query.trim() && files.length === 0) return

    const existingChat = findChatBySpecialistId(specialist.id)

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
        title: specialist.name,
        specialistId: specialist.id,
        avatar: specialist.avatar || "placeholder.jpg",
        timestamp:Date.now(),
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
      {isMobile ? (<MobileSpecialistProfile specialist={specialist} />) :
          (<>
            <div className="h-24"/>
            <DesctopSpecialistProfile specialist={specialist} />
          </>)}

      <Mufi
          onSearch={handleSearch}
          showHeading={false}
          dynamicWidth={false}
          showPractice={false}
          disableFileApply={true}
          placeholder={`Спроси у ${specialist?.name || "Alura"}`}
          onCancelReply={() => {}}
          chatTitle="Alura"
      />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />

      <ShareSpecialistModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        specialist={{
          id,
          name: specialist.name,
          title: specialist.title,
        }}
      />
    </>
  )
}
