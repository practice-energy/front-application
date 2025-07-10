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
        "relative rounded-sm transition-colors cursor-pointer w-full",
        isMobile ? "px-2 py-2" : "px-3 py-3",
        isCollapsed && !isMobile ? "cursor-default" : "cursor-pointer",
        isCollapsed && !isMobile
          ? ""
          : isActive
            ? "bg-violet-50 dark:bg-violet-900/20 shadow-sm"
            : "hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:shadow-sm",
      )}
      onClick={() => onChatClick(chat.id)}
    >
      <div className={cn("flex items-start w-full", isMobile ? "gap-2" : "gap-3")}>
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {chat.isAI ? (
            <Image
              src="/allura-logo.svg"
              alt={chat.title}
              width={48}
              height={48}
              className={cn("rounded-lg object-cover", isMobile ? "w-10 h-10" : "w-12 h-12")}
            />
          ) : (
            <Image
              src={chat.avatar || "/placeholder.png"}
              alt={chat.title}
              width={48}
              height={48}
              className={cn("rounded-lg object-cover", isMobile ? "w-10 h-10" : "w-12 h-12")}
            />
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            "flex-1 min-w-0 overflow-hidden",
            isMobile ? "max-w-full]" : "max-w-[calc(330px-120px)]",
          )}
        >
          {/* Header with name and indicators */}
          <div className="flex items-start justify-between mb-1 w-full">
            <div className="flex-1 min-w-0 max-w-[calc(330px-120px)] overflow-hidden">
              {/* Name */}
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate min-w-full">
                {chat.title}
              </h3>
              {/* Message preview - теперь прямо под именем */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed truncate w-full">
                {chat.description}
              </p>
            </div>

            {/* Right side indicators */}
            <div className="flex flex-col items-end gap-1 ml-4.5 flex-shrink-0">
              {/* Status indicator - first line */}
              {chat.status && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {chat.status === "waiting" ? "Ожидает" : chat.status === "confirmed" ? "Подтвержден" : chat.status}
                  </span>
                  <div
                    className={cn(
                      "w-3 h-3 rounded-sm flex-shrink-0",
                      chat.status === "waiting" && "bg-pink-500",
                      chat.status === "confirmed" && "bg-green-500",
                    )}
                  />
                </div>
              )}

              {/* New message indicator - second line */}
              {hasUnread ? (
                <div className="w-3 h-3 bg-violet-500 rounded-sm flex-shrink-0" />
              ) : (
                <div className="w-3 h-3 bg-none flex-shrink-0" />
              )}

              {/* AI Star Icon - third line */}
              {chat.isAIEnabled && (
                <Image
                  src="/allura-logo.svg"
                  alt="AI"
                  width={16}
                  height={16}
                  className="text-violet-500 flex-shrink-0"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
