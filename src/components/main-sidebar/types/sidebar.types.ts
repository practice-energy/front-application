import type React from "react"
import {Icon} from "@/src/components/icons/icon-types";
import { Chat } from "@/src/types/chats";

export interface ChatItemProps {
  chat: Chat
  onChatClick: (chatId: string) => void
  isActiveChat: (chatId: string) => boolean
  hasNewMessages: (chat: Chat) => boolean
  isCollapsed: boolean
  isMobile: boolean
}

export interface SectionHeaderProps {
  title: string
  onAddClick?: () => void
  addButtonLabel?: string
  toggleSection: (s: string) => void
  isCollapsed: boolean
  isMobile: boolean
  icon?: Icon
  iconStyle: string
  sectionKey: string
  sectionVisibility: boolean
  count: number
  toggleStyle: string
}

export interface SectionContentProps {
  children: React.ReactNode
  sectionKey: string
  sectionVisibility: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isSpecialist: boolean
  hat?: "master" | "user"
}
