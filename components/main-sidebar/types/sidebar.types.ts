import type React from "react"
export interface Chat {
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
  sectionKey: string
  count: number
  sectionVisibility: { [key: string]: boolean }
  toggleSection: (sectionKey: string) => void
  isCollapsed: boolean
  isMobile: boolean
}

export interface SectionContentProps {
  sectionKey: string
  sectionVisibility: { [key: string]: boolean }
  children: React.ReactNode
}

export interface GroupedChats {
  today: Chat[]
  last7Days: Chat[]
  last30Days: Chat[]
  older: Chat[]
}

export interface SectionVisibility {
  [key: string]: boolean
}
