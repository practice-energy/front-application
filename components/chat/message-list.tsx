"use client"

import React from "react"
import { MessageItem } from "./message-item"
import type { Chat, Message } from "@/types/chats"

interface MessageListProps {
  chat: Chat | null
  isLoading: boolean
  onSpecialistClick: (id: string) => void
  onServiceClick: (id: string) => void
  onShare: (message: Message) => void
  onRegenerate: (message: Message) => void
  specialistId: string
  onTagSelection?: (tags: string[]) => void
  onPolicyAcceptance?: (accepted: boolean) => void
}

export const MessageList = React.memo(
  ({
    chat,
    isLoading,
    onSpecialistClick,
    onServiceClick,
    onShare,
    onRegenerate,
    specialistId,
    onTagSelection,
    onPolicyAcceptance,
  }: MessageListProps) => {
    if (!chat) return null

    return (
      <div className="space-y-6">
        {chat.messages.map((message, index) => (
          <MessageItem
            key={message.id}
            specialistId={specialistId}
            message={message}
            onSpecialistClick={onSpecialistClick}
            onServiceClick={onServiceClick}
            onShare={onShare}
            onRegenerate={onRegenerate}
            isAI={chat.isAI}
            aiMessageType={message.aiMessageType}
            onTagSelection={onTagSelection}
            onPolicyAcceptance={onPolicyAcceptance}
          />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}

        {chat.footerContent && (
          <div className="text-gray-600 dark:text-gray-400 text-sm italic">{chat.footerContent}</div>
        )}
      </div>
    )
  },
)

MessageList.displayName = "MessageList"
