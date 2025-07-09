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
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {chat.isAI ? (
                <Image
                    src="/allura-logo.svg"
                    alt={chat.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover"
                />
            ) : (
                <Image
                    src={chat.avatar || "/placeholder.png"}
                    alt={chat.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover"
                />
            )}
          </div>

          {/* Content */}
          <div className={cn("flex-1 min-w-0", isCollapsed && !isMobile ? "hidden" : "block")}>
            {/* Header with name and indicators */}
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                {/* Name */}
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">{chat.title}</h3>
                {/* Message preview - теперь прямо под именем */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed truncate">
                  {chat.description}
                </p>
              </div>

              {/* Right side indicators */}
              <div className="flex flex-col items-end gap-1 ml-2">
                {/* Status indicator */}
                {chat.status && (
                    <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {chat.status === "waiting" ? "Ожидает" : chat.status === "confirmed" ? "Подтвержден" : chat.status}
                  </span>
                      <div
                          className={cn(
                              "w-4 h-4 rounded-sm flex-shrink-0",
                              chat.status === "waiting" && "bg-pink-500",
                              chat.status === "confirmed" && "bg-green-500",
                          )}
                      />
                    </div>
                )}

                {/* New message indicator */}
                {hasUnread && <div className="w-4 h-4 bg-violet-500 rounded-sm" />}

                {/* AI Star Icon */}
                {chat.isAIEnabled && (
                    <Image
                        src="/allura-logo.svg"
                        alt="AI"
                        width={20}
                        height={20}
                        className="text-violet-500"
                    />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
