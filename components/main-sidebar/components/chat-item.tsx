"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import {Archive, VolumeX, Bot, MessageSquareOff} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatItemProps } from "../types/sidebar.types"

export function ChatItem({ chat, onChatClick, isActiveChat, hasNewMessages, isCollapsed, isMobile }: ChatItemProps) {
  const isActive = isActiveChat(chat.id)
  const hasUnread = hasNewMessages(chat)

  // State for mute/AI toggle: 'none' | 'muted' | 'ai'
  const [toggleState, setToggleState] = useState<"none" | "mute" | "ai">("none")

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setToggleState((prev) => {
      switch (prev) {
        case "none":
          return "mute"
        case "mute":
          return "ai"
        case "ai":
          return "none"
        default:
          return "mute"
      }
    })
  }

  return (
      <div
          className={cn(
              "relative rounded-sm transition-colors cursor-pointer w-full",
              isMobile ? "px-2 py-2" : "pr-3 pl-0 py-0.5",
              isCollapsed && !isMobile ? "cursor-default" : "cursor-pointer",
              isCollapsed && !isMobile
                  ? ""
                  : isActive
                      ? "bg-white shadow-md"
                      : "hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:shadow-sm",
          )}
          onClick={() => onChatClick(chat.id)}
      >
        <div className={cn("flex items-start w-full", isMobile ? "gap-1.5" : "gap-3")}>
          {/* Profile Image - spans all three rows */}
          <div className={cn(
              "flex-shrink-0 flex items-center",
              "h-[81px] pl-1.5" // Высота аватара под три строки
          )}>
            {chat.isAI ? (
                <Image
                    src="/allura-logo.svg"
                    alt={chat.title}
                    width={71}
                    height={71}
                    className={cn("rounded-sm object-cover bg-white p-1.5")}
                />
            ) : (
                <Image
                    src={chat.avatar || "/placeholder.svg"}
                    alt={chat.title}
                    width={71}
                    height={71}
                    className={cn("rounded-sm object-cover")}
                />
            )}
          </div>

          {/* Two columns layout */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Row 1: Title and Status */}
            <div className="flex items-center justify-between mt-1.5">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate flex-1">{chat.title}</h3>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {chat.status && (
                    <>
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {chat.status === "waiting" ? "Ожидает" : chat.status === "confirmed" ? "Подтвержден" : chat.status}
                  </span>
                      <div
                          className={cn(
                              "w-4 h-4 rounded-sm flex-shrink-0",
                              chat.status === "waiting" && "bg-pink-500",
                              chat.status === "confirmed" && "bg-green-300",
                          )}
                      />
                    </>
                )}
              </div>
            </div>

            {/* Row 2: Description (multi-line) and New Message Indicator */}
            <div className="flex items-start">  {/* Убрано justify-between */}
              {/* Описание - занимает всё доступное пространство */}
              <div className="flex-1 min-w-0 overflow-hidden">  {/* Добавлен overflow-hidden */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-1 w-full">
                  {chat.description}
                </p>
              </div>

              {/* Правый блок (иконки) - не сжимает описание */}
              <div className="flex-shrink-0 ml-2">  {/* flex-shrink-0 + ml-2 для отступа */}
                <div className="flex flex-col items-end gap-1 py-1.5">  {/* Вертикальное выравнивание */}
                  {/* Индикатор непрочитанного */}
                  <div className={cn(
                      "w-4 h-4 rounded-sm bg-none",
                      hasUnread && "bg-violet-600"
                  )} />

                  {/* Кнопка */}
                  <button
                      onClick={handleToggleClick}
                      className="hover:bg-none dark:hover:bg-gray-700 rounded transition-colors mt-1.5"
                  >
                    {toggleState === "mute" && <MessageSquareOff className="w-4 h-4 text-red-600" />}
                    {toggleState === "ai" && (
                        <img
                            src="/allura-logo.svg"
                            alt="AI"
                            className="text-violet-600 flex-shrink-0 bg-none w-4 h-4"
                        />
                    )}
                    {/*{toggleState === "none" && */}
                        <div className="w-3 h-3 bg-none rounded-sm" />
                  {/*}*/}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
