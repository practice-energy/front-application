import {Service} from "@/types/service";
import {Specialist} from "@/types/specialist";

export interface Message {
  id: string
  type: "user" | "assistant" | "specialist"
  content: string
  timestamp: number
  specialists?: Specialist[]
  services?: Service[]
  files?: File[]
  replyTo?: string
  aiMessageType?: AiMessageType
  tags?: Tag[]
  footerContent?: string
  bookingFrame?: boolean
  bookingTextTitle?: string
  testQuestion: string
  questionIndex: number
}

export type Tag = {
  name: string
  subtags?:  Tag[]
}

export type AiMessageType = "info" | "warning" | "service" | "become-specialist-drops" | "accept-policy" | "drops-or-input" | "profile-test" | "version-test"

export type Chat = {
  id: string
  title: string
  specialistId?: string
  serviceId?: string
  avatar?: string
  isAI?: boolean
  isAIEnabled?: boolean
  status?: "waiting" | "confirmed" | "request" | "declined" | null
  timestamp: number
  isMuted?: boolean
  messages: Message[]
  createdAt: number,
  hasNew?: boolean
  description?: string
  isSpecialChat?: "become-specialist"
}
