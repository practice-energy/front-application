"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ChatItemProps } from "../types/sidebar.types"

export function ChatItem({ chat, onChatClick, isActiveChat, hasNewMessages, isCollapsed, isMobile }: ChatItemProps) {
  const isActive = isActiveChat(chat.id)
  const hasUnread = hasNewMessages(chat)

  return (
    <div
      className={cn(
        "relative px-3 py-3 rounded-sm transition-colors cursor-pointer",
        isCollapsed && !isMobile ? "cursor-default" : "cursor-pointer",
        isCollapsed && !isMobile
          ? ""
          : isActive
            ? "bg-violet-50 dark:bg-violet-900/20 shadow-sm"
            : "hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:shadow-sm",
      )}
      onClick={() => onChatClick(chat.id)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {chat.isAI ? (
            <Image
              src="/allura-logo.svg"
              alt={chat.title}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <Image
              src={chat.avatar || "/placeholder.png"}
              alt={chat.title}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
        </div>

        <div className={cn("flex-1 min-w-0", isCollapsed && !isMobile ? "hidden" : "block")}>
          <div className="flex items-center gap-2 mb-1">
            {chat.isAIEnabled && (
              <Image src="/allura-logo.svg" alt="AI" width={16} height={16} className="w-4 h-4 flex-shrink-0" />
            )}
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1">{chat.title}</h3>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2 leading-relaxed">{chat.description}</p>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            {chat.status && <span className="text-xs text-gray-500 dark:text-gray-400">{chat.status}</span>}

            {/* Статусный индикатор */}
            {chat.status === "Ожидает" && <div className="w-3 h-3 bg-red-500 rounded-sm" />}
            {chat.status === "Подтверждено" && <div className="w-3 h-3 bg-green-500 rounded-sm" />}
          </div>

          {/* Индикатор нового сообщения */}
          {hasUnread && <div className="w-3 h-3 bg-violet-500 rounded-sm" />}
        </div>
      </div>
    </div>
  )
}
