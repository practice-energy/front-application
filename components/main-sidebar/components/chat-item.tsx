"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import {MessageSquareOff} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatItemProps } from "../types/sidebar.types"
import {ActivityStatus} from "@/components/ui/activity-status";

export function ChatItem({ chat, onChatClick, isActiveChat, hasNewMessages, isCollapsed, isMobile }: ChatItemProps) {
  const isActive = isActiveChat(chat.id)
  const hasUnread = hasNewMessages(chat)
  const lastMessage = chat.messages.at(-1)

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
              "pl-0 py-0.5 px-2",
              isCollapsed && !isMobile ? "cursor-default" : "cursor-pointer",
              isCollapsed && !isMobile
                  ? ""
                  : isActive
                      ? "bg-white shadow-md shadow-violet-50"
                      : "hover:bg-violet-600 hover:shadow-sm hover:bg-opacity-5",
          )}
          onClick={() => onChatClick(chat.id)}
      >
        <div className={cn("flex items-start w-full, hover:bg-opacity-100", isMobile ? "gap-1.5" : "gap-3")}>
          {/* Profile Image - spans all three rows */}
          <div className={cn(
              "flex-shrink-0 flex items-center",
              "h-[81px]" // Высота аватара под три строки
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
              <h3 className={cn("text-base font-medium truncate flex-1",

              )}>{chat.title}</h3>
              <ActivityStatus status={chat.status} className="items-end pl-1"/>
            </div>

            {/* Row 2: Description (multi-line) and New Message Indicator */}
            <div className="flex items-start">  {/* Убрано justify-between */}
              {/* Описание - занимает всё доступное пространство */}
              <div className="flex-1 min-w-0 overflow-hidden">  {/* Добавлен overflow-hidden */}
                <p className="text-gray-600  leading-relaxed line-clamp-2 w-full">
                  {lastMessage && (lastMessage.content)}
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
