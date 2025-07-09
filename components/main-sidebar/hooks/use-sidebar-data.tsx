"use client"

import { useState, useMemo } from "react"

interface Chat {
  id: string
  title: string
  description: string
  avatar?: string
  isAI: boolean
  isAIEnabled: boolean
  status?: string
  lastMessage?: {
    timestamp: Date
    content: string
  }
  lastReadTimestamp?: Date
}

interface GroupedChats {
  today: Chat[]
  last7Days: Chat[]
  last30Days: Chat[]
  older: Chat[]
}

interface SectionVisibility {
  [key: string]: boolean
}

// Моковые данные для демонстрации
const mockChats: Chat[] = [
  {
    id: "1",
    title: "Снежана Гебельсенидзе",
    description: "История древнего римского серебряного шмурдяка берет...",
    avatar: "/placeholder-user.jpg",
    isAI: false,
    isAIEnabled: true,
    status: "Ожидает",
    lastMessage: {
      timestamp: new Date(),
      content: "История древнего римского серебряного шмурдяка берет...",
    },
    lastReadTimestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
  },
  {
    id: "2",
    title: "AI Ассистент",
    description: "Помощь с планированием проекта",
    isAI: true,
    isAIEnabled: true,
    status: "Подтверждено",
    lastMessage: {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
      content: "Помощь с планированием проекта",
    },
  },
  {
    id: "3",
    title: "Мария Иванова",
    description: "Обсуждение дизайна интерфейса",
    avatar: "/placeholder-user.jpg",
    isAI: false,
    isAIEnabled: false,
    lastMessage: {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 дня назад
      content: "Обсуждение дизайна интерфейса",
    },
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
        const messageDate = chat.lastMessage?.timestamp || new Date(0)

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
      { today: [], last7Days: [], last30Days: [], older: [] } as GroupedChats,
    )
  }, [allChats])

  const toggleSection = (sectionKey: string) => {
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
    if (!chat.lastMessage || !chat.lastReadTimestamp) return false
    return chat.lastMessage.timestamp > chat.lastReadTimestamp
  }

  const isActiveChat = (chatId: string) => {
    return pathname === `/search/${chatId}`
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
