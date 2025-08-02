export type AiMessageType =
  | "info"
  | "warning"
  | "service"
  | "accept-policy"
  | "become-specialist-drops"
  | "profile-test"

export interface Tag {
  name: string
  subtags?: Tag[]
}

export interface Message {
  id: string
  type: "user" | "assistant" | "specialist" | "become-specialist-drops"
  content?: string
  timestamp: number
  files?: File[]
  specialists?: any[]
  services?: any[]
  footerContent?: string
  aiMessageType?: AiMessageType
  tags?: Tag[]
  questionId?: string // Added for personality test questions
}

export interface Chat {
  id: string
  title: string
  timestamp: number
  messages: Message[]
  isAI?: boolean
  createdAt: number
  isMuted: boolean
  hasNew: boolean
  footerContent?: string
  specialistId?: string
}
