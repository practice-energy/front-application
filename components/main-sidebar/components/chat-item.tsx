"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ChatItemProps } from "../types/sidebar.types"

export function ChatItem({ chat, onChatClick, isActiveChat, hasNewMessages, isCollapsed, isMobile}: ChatItemProps) {
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
        <div className={cn("flex items-start w-full", isMobile ? "gap-1" : "gap-3")}>
          {/* Profile Image - занимает всю высоту трех строк */}
          <div className="flex-shrink-0">
            {chat.isAI ? (
                <Image
                    src="/allura-logo.svg"
                    alt={chat.title}
                    width={60}
                    height={60}
                    className={cn("rounded-lg object-cover", isMobile ? "w-10 h-10" : "w-12 h-12")}
                />
            ) : (
                <Image
                    src={chat.avatar || "/placeholder.png"}
                    alt={chat.title}
                    width={60}
                    height={60}
                    className={cn("rounded-lg object-cover", isMobile ? "w-10 h-10" : "w-12 h-12")}
                />
            )}
          </div>

          {/* Две колонки контента */}
          <div className="flex-1 min-w-0 flex justify-between">
            {/* Левая колонка - название и описание */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="text-base text-gray-900 dark:text-gray-100 truncate">
                {chat.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed truncate">
                {chat.description}
              </p>
            </div>

            {/* Правая колонка - статус, индикаторы */}
            <div className="flex flex-col items-end gap-1 ml-2">
              {/* Первая строка - статус */}
              <div className="flex items-center gap-1">
                {chat.status && (
                    <>
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
                    </>
                )}
              </div>

              {/* Вторая строка - индикатор новых сообщений */}
              <div>
                {hasUnread ? (
                    <div className="w-3 h-3 bg-violet-600 rounded-sm flex-shrink-0" />
                ) : (
                    <div className="w-3 h-3 bg-none flex-shrink-0" />
                )}
              </div>

              {/* Третья строка - AI и Muted индикаторы */}
              <div className="flex items-center gap-1">
                {chat.isAIEnabled && (
                    <Image
                        src="/allura-logo.svg"
                        alt="AI"
                        width={16}
                        height={16}
                        className="text-violet-500 flex-shrink-0"
                    />
                )}
                {chat.isMuted && (
                    <div className="w-3 h-3 bg-gray-400 rounded-sm flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
