"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { Archive, VolumeX, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatItemProps } from "../types/sidebar.types"

export function ChatItem({ chat, onChatClick, isActiveChat, hasNewMessages, isCollapsed, isMobile }: ChatItemProps) {
  const isActive = isActiveChat(chat.id)
  const hasUnread = hasNewMessages(chat)

  // State for mute/AI toggle: 'none' | 'muted' | 'ai'
  const [toggleState, setToggleState] = useState<"none" | "muted" | "ai">(
    chat.isMuted ? "muted" : chat.isAIEnabled ? "ai" : "none",
  )

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setToggleState((prev) => {
      switch (prev) {
        case "none":
          return "muted"
        case "muted":
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

  // Split description into two rows for display
  const descriptionRows = chat.description.split(" ")
  const midPoint = Math.ceil(descriptionRows.length / 2)
  const row1 = descriptionRows.slice(0, midPoint).join(" ")
  const row2 = descriptionRows.slice(midPoint).join(" ")

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
        {/* Profile Image - spans all three rows */}
        <div className="flex-shrink-0 self-start">
          {chat.isAI ? (
            <Image
              src="/allura-logo.svg"
              alt={chat.title}
              width={48}
              height={48}
              className={cn("rounded-lg object-cover", isMobile ? "w-12 h-12" : "w-12 h-12")}
            />
          ) : (
            <Image
              src={chat.avatar || "/placeholder.png"}
              alt={chat.title}
              width={48}
              height={48}
              className={cn("rounded-lg object-cover", isMobile ? "w-12 h-12" : "w-12 h-12")}
            />
          )}
        </div>

        {/* Two columns layout */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Row 1: Title and Status */}
          <div className="flex items-center justify-between mb-1">
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

          {/* Row 2: Description Row 1 and New Message Indicator */}
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed truncate flex-1">{row1}</p>
            <div className="ml-2 flex-shrink-0">
              {hasUnread && <div className="w-3 h-3 bg-violet-600 rounded-sm" />}
            </div>
          </div>

          {/* Row 3: Description Row 2 and Toggle Button + Archive (mobile only) */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed truncate flex-1">{row2}</p>
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {/* Toggle Button (Mute/AI/None) */}
              <button
                onClick={handleToggleClick}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {toggleState === "muted" && <VolumeX className="w-3 h-3 text-gray-500" />}
                {toggleState === "ai" && <Bot className="w-3 h-3 text-violet-500" />}
                {toggleState === "none" && <div className="w-3 h-3" />}
              </button>

              {/* Archive button - mobile only */}
              {isMobile && (
                <button
                  onClick={handleArchiveClick}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Archive className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
