import type React from "react"
export interface Chat {
  id: string
  title: string
  description: string
  avatar?: string
  isAI: boolean
  isAIEnabled: boolean
  status?: "waiting" | "confirmed" | string
  lastMessage: Date
  lastRead: Date
}

export interface GroupedChats {
  today: Chat[]
  last7Days: Chat[]
  last30Days: Chat[]
  older: Chat[]
}

export interface SectionVisibility {
  today: boolean
  last7Days: boolean
  last30Days: boolean
  older: boolean
  search: boolean
}

export interface ChatItemProps {
  chat: Chat
  onChatClick: (chatId: string) => void
  isActiveChat: (chatId: string) => boolean
  hasNewMessages: (chat: Chat) => boolean
  isCollapsed: boolean
  isMobile: boolean
}

export interface SearchResultItemProps {
  chat: Chat
  query: string
  onChatClick: (chatId: string) => void
  isActiveChat: (chatId: string) => boolean
}

export interface SectionHeaderProps {
  title: string
  sectionKey: keyof SectionVisibility
  count: number
  sectionVisibility: SectionVisibility
  toggleSection: (sectionKey: keyof SectionVisibility) => void
  isCollapsed: boolean
  isMobile: boolean
}

export interface SectionContentProps {
  sectionKey: keyof SectionVisibility
  sectionVisibility: SectionVisibility
  children: React.ReactNode
}

export interface StatusBadgeProps {
  status: string
}
