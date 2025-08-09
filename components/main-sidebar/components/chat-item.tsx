"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import {MessageSquareOff} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatItemProps } from "../types/sidebar.types"
import {ActivityStatus} from "@/components/ui/activity-status";
import {IconAlura} from "@/components/icons/icon-alura";

export function ChatItem({ chat, onChatClick, isActiveChat, hasNewMessages, isCollapsed, isMobile }: ChatItemProps) {
  const isActive = isActiveChat(chat.id)
  const hasUnread = hasNewMessages(chat)
  const lastMessage = chat.messages.at(-1)

  return (
      <div
          className={cn(
              "relative rounded-sm transition-colors cursor-pointer mt-1.5",
              "pl-0 px-1  shadow-md border border-gray-300 h-[84px] bg-white",
              isMobile ? "w-full" : "w-[390px]",
              isCollapsed && !isMobile ? "cursor-default" : "cursor-pointer",
              isCollapsed && !isMobile
                  ? ""
                  : isActive
                      ? "bg-white "
                      : "hover:bg-violet-600 hover:bg-opacity-5",
          )}
          onClick={() => onChatClick(chat.id)}
      >
        <div className={cn("flex items-center flex-row w-full, hover:bg-opacity-100", "gap-2")}>
          {/* Profile Image - spans all three rows */}
          <div className={cn(
              "flex-shrink-0 flex items-center h-full ml-1",
              "h-[84px]"
          )}>
            {chat.isAI ? (
                <IconAlura
                    width={60}
                    height={60}
                    className={cn("rounded-sm object-cover bg-none p-1.5")}
                />
            ) : (
                <Image
                    src={chat.avatar || "/placeholder.svg"}
                    alt={chat.title}
                    width={60}
                    height={60}
                    className={cn("rounded-sm object-cover")}
                />
            )}
          </div>

          <div className="flex flex-col h-[84px] py-1.5">
            <div className={cn("text-base font-medium truncate flex items-start",)}>{chat.title}</div>
            <div className="flex-1 min-w-0 overflow-hidden">  {/* Добавлен overflow-hidden */}
              <p className="text-neutral-900 leading-relaxed text-sm line-clamp-2 w-full">
                {lastMessage && (lastMessage.content)}
              </p>
            </div>
          </div>

          <div className="flex flex-col ml-auto gap-1.5 h-[84px] w-6 py-1.5">
            <ActivityStatus status={chat.status}  showTitle={false} className="ml-auto"/>
            <ActivityStatus status={hasUnread ? 'new': undefined} showTitle={false} className="ml-auto pl-1"/>
            <div className="w-5 h-5 ml-auto bg-none"></div>
          </div>
        </div>
      </div>
  )
}
