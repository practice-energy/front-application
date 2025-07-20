"use client"

import { useState, useEffect, useCallback } from "react"
import { groupChatsByTime } from "@/services/mock-data"
import type { Chat } from "@/types/chats"
import type { LastReadTimestamps, SectionVisibility } from "@/components/main-sidebar/types/sidebar.types"
import { useAdeptChats } from "@/stores/chat-store"

const getLastReadTimestamps = (): LastReadTimestamps => {
  if (typeof window === "undefined") return {}
  try {
    const data = localStorage.getItem("lastReadTimestamps")
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

const saveLastReadTimestamps = (timestamps: LastReadTimestamps) => {
  if (typeof window === "undefined") return
  localStorage.setItem("lastReadTimestamps", JSON.stringify(timestamps))
}

export function useSidebarData(pathname: string) {
  const { chats: storeChats } = useAdeptChats()
  const [newChats, setNewChats] = useState<Chat[]>([])
  const [lastReadTimestamps, setLastReadTimestamps] = useState<LastReadTimestamps>(getLastReadTimestamps())

  // Section visibility state - each section maintains its own state
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
    today: true,
    last7Days: true,
    older: true,
    search: true,
  })

  // Listen for new chats being added from search pages
  useEffect(() => {
    const handleAddNewChat = (event: CustomEvent) => {
      const { chat } = event.detail
      setNewChats((prev) => {
        // Check if chat already exists
        const exists = prev.some((c) => c.id === chat.id)
        if (exists) return prev

        console.log(chat)
        console.log(prev)

        // Add new chat to the beginning of the list
        return [chat, ...prev]
      })
    }

    window.addEventListener("addNewChatToSidebar", handleAddNewChat as EventListener)

    return () => {
      window.removeEventListener("addNewChatToSidebar", handleAddNewChat as EventListener)
    }
  }, [])

  // Convert new chats to ChatItem format for display
  const convertedNewChats: Chat[] = newChats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    description: chat.messages?.length > 0 ? chat.messages[0].content : "Новый чат",
    avatar: chat.isAI ? "/allura-logo.png" : chat.avatar,
    timestamp: chat.createdAt,
    updatedAt: chat.createdAt,
    isAIEnabled: chat.isAIEnabled,
    isAI: chat.isAI,
    isNew: true,
    status: chat.status
  }))

  // Convert store chats to ChatItem format
  const convertedStoreChats: Chat[] = storeChats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    description: chat.messages?.length > 0 ? chat.messages[0].content : chat.description || "Новый чат",
    avatar: chat.isAI ? "/allura-logo.png" : chat.avatar,
    status: null,
    timestamp: chat.createdAt,
    updatedAt: chat.createdAt,
    isAIEnabled: chat.isAIEnabled,
    isAI: chat.isAI,
    isNew: chat.hasNew,
    mode: undefined,
  }))

  // Combine store chats, new chats, and existing sidebar chats
  const allChats = [...convertedStoreChats]

  // Group chats by time period based on updatedAt
  const groupedChats = groupChatsByTime(allChats)

  const toggleSection = useCallback((section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const updateLastReadTimestamp = (chatId: string) => {
    const timestamps = { ...lastReadTimestamps, [chatId]: new Date().toISOString() }
    setLastReadTimestamps(timestamps)
    saveLastReadTimestamps(timestamps)
  }

  const hasNewMessages = (chat: Chat): boolean => {
    const lastRead = lastReadTimestamps[chat.id]
    if (!lastRead) return true
    return chat.timestamp > new Date(lastRead).getTime()
  }

  const isActiveChat = (chatId: string) => pathname === `/search/${chatId}`

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
