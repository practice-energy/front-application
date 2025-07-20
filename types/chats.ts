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
  aiMessageType?: "info" | "warning" | "service"
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
  status?: "waiting" | "confirmed" | "request" | "declined" | null
  timestamp?: string
  isMuted?: boolean
  messages: Message[]
  createdAt: number,
  hasNew?: boolean
  footerContent?: string
}
