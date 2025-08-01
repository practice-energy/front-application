"use client"

import { useMemo } from "react"
import { MessageItem } from "./message-item"
import type { Chat, Message } from "@/types/chats"

interface MessageListProps {
  chat: Chat | null
  onSpecialistClick: (id: string) => void
  onServiceClick: (id: string) => void
  onShare: (message: Message) => void
  onRegenerate: (message: Message) => void
  specialistId: string
  isLoading: boolean
}

export function MessageList({
  chat,
  onSpecialistClick,
  onServiceClick,
  onShare,
  onRegenerate,
  specialistId,
  isLoading,
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
          isAI={chat.isAI === true}
          aiMessageType={message.aiMessageType}
        />
      )),
    [chat, specialistId, onSpecialistClick, onServiceClick, onShare, onRegenerate],
  )

  return (
    <>
      {messageList}
      {isLoading && (
        <div className="flex flex-col items-start gap-4 p-4 animate-pulse">
          <div className="flex w-16 h-16 rounded-sm bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="space-y-2 flex-1 flex">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      )}
    </>
  )
}
