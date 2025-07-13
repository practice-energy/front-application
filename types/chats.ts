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

export type Chat = {}
