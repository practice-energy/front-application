"use client"

import { useMemo } from "react"
import { MessageItem } from "./message-item"
import type { Chat, Message } from "@/types/chats"

interface MessageListProps {
  chat: Chat | null
  highlightedMessageId: string | null
  onSpecialistClick: (id: string) => void
  onServiceClick: (id: string) => void
  onShare: (message: Message) => void
  onRegenerate: (message: Message) => void
  specialistId: string
}

export function MessageList({
  chat,
  highlightedMessageId,
  onSpecialistClick,
  onServiceClick,
  onShare,
  onRegenerate,
  specialistId,
}: MessageListProps) {
  const messageList = useMemo(
    () =>
      chat?.messages.map((message, index) => (
        <MessageItem
          key={message.id}
          specialistId={specialistId}
          message={message}
          onSpecialistClick={onSpecialistClick}
          onServiceClick={onServiceClick}
          onShare={onShare}
          onRegenerate={onRegenerate}
          highlightedMessageId={highlightedMessageId}
          isAi={chat.isAi}
          footerContent={
            message.type === "assistant" && message.specialists && index === chat.messages.length - 1
              ? chat.footerContent
              : undefined
          }
        />
      )),
    [chat, specialistId, highlightedMessageId, onSpecialistClick, onServiceClick, onShare, onRegenerate],
  )

  return <>{messageList}</>
}
