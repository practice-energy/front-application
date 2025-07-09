import type React from "react"
import type { ChatItem } from "@/types/chats"

export interface LastReadTimestamps {
  [chatId: string]: string
}

export interface SectionVisibility {
  today: boolean
  last7Days: boolean
  last30Days: boolean
  older: boolean
  search: boolean
}

export interface ChatItemProps {
  chat: ChatItem
  onChatClick: (chatId: string) => void
  isActiveChat: (chatId: string) => boolean
  hasNewMessages: (chat: ChatItem) => boolean
  isCollapsed: boolean
  isMobile: boolean
}

export interface SearchResultItemProps {
  chat: ChatItem
  query: string
  onChatClick: (chatId: string) => void
  isActiveChat: (chatId: string) => boolean
}

export interface SectionHeaderProps {
  title: string
  sectionKey: string
  count: number
  sectionVisibility: SectionVisibility
  toggleSection: (section: string) => void
  isCollapsed: boolean
  isMobile: boolean
}

export interface SectionContentProps {
  children: React.ReactNode
  sectionKey: string
  sectionVisibility: SectionVisibility
}
