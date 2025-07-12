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
          return "none"
      }
    })
  }

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Archive functionality for mobile
    console.log("Archive chat:", chat.id)
  }

  return (
      <div
          className={cn(
              "relative rounded-sm transition-colors cursor-pointer w-full",
              isMobile ? "px-2 py-2" : "px-3 py-0.5",
              isCollapsed && !isMobile ? "cursor-default" : "cursor-pointer",
              isCollapsed && !isMobile
                  ? ""
                  : isActive
                      ? "bg-violet-50 dark:bg-violet-900/20 shadow-sm"
                      : "hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:shadow-sm",
          )}
          onClick={() => onChatClick(chat.id)}
      >
        <div className={cn("flex items-start w-full", isMobile ? "gap-1.5" : "gap-3")}>
          {/* Profile Image - spans all three rows */}
          <div className={cn(
              "flex-shrink-0 flex items-center",
              isMobile ? "h-[81px]" : "h-[81px]" // Высота аватара под три строки
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
                    src={chat.avatar || "/placeholder.png"}
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
                              "w-3 h-3 rounded-sm flex-shrink-0",
                              chat.status === "waiting" && "bg-pink-500",
                              chat.status === "confirmed" && "bg-green-500",
                          )}
                      />
                    </>
                )}
              </div>
            </div>

            {/* Row 2: Description (multi-line) and New Message Indicator */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-1">
                  {chat.description}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0 pt-1">
                {hasUnread && <div className="w-3 h-3 bg-violet-600 rounded-sm" />}
              </div>
            </div>

            {/* Row 3: Empty space and Toggle Button + Archive (mobile only) */}
            <div className="flex items-center justify-end mt-auto">
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {/* Toggle Button (Mute/AI/None) */}
                <button
                    onClick={handleToggleClick}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  {toggleState === "mute" && <MessageSquareOff className="w-3 h-3 text-red-600" />}
                  {toggleState === "ai" &&
                      <Image
                          src="/allura-logo.svg"
                          alt="AI"
                          width={15}
                          height={15}
                          className="text-violet-600 flex-shrink-0"
                      />}
                  {toggleState === "none" && <div className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}