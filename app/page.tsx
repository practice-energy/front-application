"use client"
import { useRouter } from "next/navigation"
import { Mufi } from "@/components/mufi/index"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"
import { mockChatData } from "@/services/mock-data"
import {useSidebar} from "@/contexts/sidebar-context";
import {cn} from "@/lib/utils";

export default function HomePage() {
  const router = useRouter()

  const handleSearch = (query: string, title = "Alura", files: File[] = [], isPractice?: boolean) => {
    const { isCollapsed } = useSidebar()

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
      title: "Alura",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [userMessage],
      isAI: true,
      hasNew: true,
      createdAt: Date.now(),
      isMuted: false,
      description: query,
      footerContent: ""
    }

    window.dispatchEvent(
        new CustomEvent("addNewChatToSidebar", {
          detail: {
            chat: {
              ...newChat,
              isPractice: isPractice,
            },
          },
        }),
    )

    mockChatData.push(newChat)
    router.push(`/search/${newChatId}`)
  }

  return (
      <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-all duration-300">
        {/* Основной контент */}
        <div className="flex-1 relative min-h-screen">
          {/* Скроллящийся контент с логотипом */}
          <div className="pt-48 pb-96 text-center">
            <Image
                src="/practice-logo.svg"
                alt="Practice Logo"
                width={180}
                height={180}
                className="mx-auto"
            />
          </div>

          {/* Mufi - абсолютно позиционирован, но в потоке контента */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-10">
            <Mufi
                onSearch={handleSearch}
                showHeading={true}
                chatTitle="Alura"
            />
          </div>
        </div>
      </div>
  )
}
