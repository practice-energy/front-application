"use client"

import { useState, useMemo } from "react"
import type { Chat, GroupedChats, SectionVisibility } from "../types/sidebar.types"

// Mock data - в реальном приложении это будет приходить из API
const mockChats: Chat[] = [
  {
    id: "1",
    title: "Снежана Гебельсенидзе",
    description: "История древнего римского серебряного шмурдяка берет...",
    avatar: "/placeholder-user.jpg",
    isAI: false,
    isAIEnabled: true,
    status: "waiting",
    lastMessage: new Date(),
    lastRead: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
  },
  {
    id: "2",
    title: "AI Assistant",
    description: "Помощь с кодом и разработкой",
    avatar: "/allura-logo.svg",
    isAI: true,
    isAIEnabled: true,
    status: "confirmed",
    lastMessage: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
    lastRead: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 час назад
  },
  {
    id: "3",
    title: "Мария Петрова",
    description: "Обсуждение проекта дизайна интерьера",
    avatar: "/placeholder-user.jpg",
    isAI: false,
    isAIEnabled: false,
    lastMessage: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 дня назад
    lastRead: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 дня назад
  },
]

export function useSidebarData(pathname: string) {
  const [allChats] = useState<Chat[]>(mockChats)
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
    today: true,
    last7Days: true,
    last30Days: true,
    older: true,
    search: true,
  })

  const groupedChats = useMemo<GroupedChats>(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    return allChats.reduce(
      (groups, chat) => {
        const messageDate = new Date(chat.lastMessage)

        if (messageDate >= today) {
          groups.today.push(chat)
        } else if (messageDate >= last7Days) {
          groups.last7Days.push(chat)
        } else if (messageDate >= last30Days) {
          groups.last30Days.push(chat)
        } else {
          groups.older.push(chat)
        }

        return groups
      },
      {
        today: [] as Chat[],
        last7Days: [] as Chat[],
        last30Days: [] as Chat[],
        older: [] as Chat[],
      },
    )
  }, [allChats])

  const toggleSection = (sectionKey: keyof SectionVisibility) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const updateLastReadTimestamp = (chatId: string) => {
    // В реальном приложении здесь будет API вызов
    console.log(`Updating last read timestamp for chat ${chatId}`)
  }

  const hasNewMessages = (chat: Chat) => {
    return chat.lastMessage > chat.lastRead
  }

  const isActiveChat = (chatId: string) => {
    return pathname.includes(chatId)
  }

  return {
    allChats,
    groupedChats,
    sectionVisibility,
    toggleSection,
    updateLastReadTimestamp,
    hasNewMessages,
    isActiveChat,
  }
}
