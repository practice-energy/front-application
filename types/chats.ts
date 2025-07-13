// Типы данных (остаются без изменений)
import type { Service, Specialist } from "@/types/common"

export interface ChatItem {
  id: string
  title: string
  description: string
  avatar?: string
  status?: "waiting" | "confirmed"
  timestamp: number
  updatedAt: number
  mode: "mute" | "ai" | "none"
  isAI: boolean
  specialistId?: string
  serviceId?: string
}

export interface SearchResult {
  id: string
  query: string
  specialists: Specialist[]
  services: Service[]
  timestamp: number
}

// Новые типы для чатов
export interface Message {
  id: string // UUID
  type: "user" | "assistant" | "specialist"
  content: string
  timestamp: number // UNIX timestamp
  specialists?: Specialist[]
  files?: File[]
}

export interface Chat {
  id: string // UUID
  title: string
  timestamp: string // Time string like "10:45"
  messages: Message[]
  searchQueries: string[]
  isAi: boolean
  hasNew: boolean
  createdAt: number // UNIX timestamp
  footerContent?: string // Текст после карточек специалистов
  specialistId?: string
  serviceId?: string
}
