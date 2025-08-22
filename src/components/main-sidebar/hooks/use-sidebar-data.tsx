"use client"

import { useState, useCallback } from "react"
import type { Chat } from "@/src/types/chats"
import type { LastReadTimestamps, SectionVisibility } from "@/src/components/main-sidebar/types/sidebar.types"
import {useAdeptChats, useMasterChats} from "@/src/stores/chat-store"

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

export function useSidebarData(pathname: string, hat: string = "adept") {
  const { chats: storeChats } = hat === "adept" ? useAdeptChats() : useMasterChats()
  const [lastReadTimestamps, setLastReadTimestamps] = useState<LastReadTimestamps>(getLastReadTimestamps())

  // Section visibility state - each section maintains its own state
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
    today: true,
    last7Days: true,
    older: false,
    search: true,
    awaiting: true,
    requested: true
  })

  const groupChats = (chats: Chat[]) => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    return {
      today: chats.filter((chat) => chat.timestamp > oneDayAgo)
          .sort((a, b) => a.timestamp - b.timestamp).reverse(),

      last7Days: chats.filter(
          (chat) => chat.timestamp <= oneDayAgo &&
              chat.timestamp > sevenDaysAgo
      ).sort((a, b) => a.timestamp - b.timestamp).reverse(),

      older: chats.filter((chat) => chat.timestamp <= sevenDaysAgo)
          .sort((a, b) => a.timestamp - b.timestamp).reverse(),

      awaiting: chats.filter((chat) => chat.status === "waiting")
          .sort((a, b) => a.timestamp - b.timestamp).reverse(),

      requested: chats.filter((chat) => chat.status === "request")
          .sort((a, b) => a.timestamp - b.timestamp).reverse(),
    };
  };

  // Use store chats as the source of truth
  const allChats = storeChats

  // Group chats by time period based on updatedAt
  const groupedChats = groupChats(allChats)

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
    return chat.timestamp > lastRead
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
