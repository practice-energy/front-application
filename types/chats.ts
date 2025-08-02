export type MessageType = "user" | "assistant" | "specialist" | "become-specialist-drops"

export type AiMessageType =
  | "info"
  | "service"
  | "warning"
  | "accept-policy"
  | "become-specialist-drops"
  | "profile-test"

export interface Tag {
  name: string
  subtags?: Tag[]
}

export interface Message {
  id: string
  type: MessageType
  content?: string
  timestamp: number
  files?: File[]
  specialists?: import("@/types/specialist").Specialist[]
  services?: import("@/types/service").Service[]
  footerContent?: string
  aiMessageType?: AiMessageType
  tags?: Tag[]
  questionId?: string
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  lastMessage: string
  timestamp: number
  isActive: boolean
}
