import type React from "react"
import {LucideIcon} from "lucide-react";
import {Icon} from "@/components/icons/icon-types";

export interface Chat {
  id: string
  title: string
  description: string
  avatar?: string
  isAI?: boolean
  isAIEnabled?: boolean
  status?: "waiting" | "confirmed" | null
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
  isMuted: boolean
}

export interface SearchResult {
  id: string
  title: string
  description: string
  avatar?: string
  type: "specialist" | "service" | "chat"
  rating?: number
  price?: string
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
  result: SearchResult
  onResultClick: (resultId: string) => void
  isCollapsed: boolean
  isMobile: boolean
}

export interface SectionHeaderProps {
  title: string
  onAddClick?: () => void
  addButtonLabel?: string
  isCollapsed: boolean
  isMobile: boolean
  icon: Icon
  iconStyle: string
  sectionKey: string
  sectionVisibility: boolean
  toggleSection: boolean
  count: number
}

export interface SectionContentProps {
  children: React.ReactNode
  isCollapsed: boolean
  isMobile: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isSpecialist: boolean
  hat?: "master" | "user"
}
