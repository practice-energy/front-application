import type { Specialist, Service } from "./common"

export interface Message {
  id: string
  type: "user" | "assistant" | "specialist"
  content: string
  timestamp: number
  specialists?: Specialist[]
  services?: Service[]
  files?: File[]
  replyTo?: string
}

export type Chat = {
  id: string
  title: string
  description: string
  specialistId?: string
  serviceId?: string
  avatar?: string
  isAI?: boolean
  isAIEnabled?: boolean
  status?: "waiting" | "confirmed" | null
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
  isMuted: boolean
  messages: Message[]
  createdAt: number,
  hasNew?: boolean
}
