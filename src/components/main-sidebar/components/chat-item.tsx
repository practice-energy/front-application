"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import {MessageSquareOff} from "lucide-react"
import { cn } from "@/src/lib/utils"
import type { ChatItemProps } from "../types/sidebar.types"
import {ActivityStatus} from "@/src/components/ui/activity-status";
import {IconAlura} from "@/src/components/icons/icon-alura";

export function ChatItem({ chat, onChatClick, isActiveChat, hasNewMessages, isCollapsed, isMobile }: ChatItemProps) {
  const isActive = isActiveChat(chat.id)
  const hasUnread = hasNewMessages(chat)
  const lastMessage = chat.messages.at(-1)

  return (
      <div className="px-1">
        <div
            className={cn(
                "relative rounded-sm transition-all duration-300 ease-in-out cursor-pointer ",
                "shadow-custom bg-white w-full px-1.5",
                isCollapsed && !isMobile ? "cursor-default" : "cursor-pointer",
                isCollapsed && !isMobile
                    ? ""
                    : isActive
                        ? "bg-white shadow-active"
                        : !isMobile && "hover:shadow-active",
                isMobile ? "h-[78px] w-full max-w-[99vw]" : "h-[84px] w-full"
            )}
            onClick={() => onChatClick(chat.id)}
        >
          <div className={cn("flex items-center flex-row w-full hover:bg-opacity-100", "gap-3")}>
            {/* Profile Image - spans all three rows */}
            {chat.isAI ? (
                <IconAlura
                    width={isMobile ? 54 : 60}
                    height={isMobile ? 54 : 60}
                    className={cn("rounded-sm object-cover bg-none p-1.5 flex-shrink-0 flex ")}
                />
            ) : (
                <Image
                    src={chat.avatar || "/placeholder.svg"}
                    alt={chat.title}
                    width={isMobile ? 54 : 60}
                    height={isMobile ? 54 : 60}
                    className={cn("rounded-sm object-cover flex-shrink-0 flex ")}
                />
            )}

            <div className={cn(
                "flex flex-col  flex-1 min-w-0",
                isMobile ? "h-[78px]" : "h-[84px]",
                "py-1.5"
            )}>
              <div className={cn("text-base font-medium truncate flex items-start")}>
                {chat.title}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden"> {/* Ограничиваем overflow */}
                <p className="text-neutral-900 leading-relaxed text-sm line-clamp-2 break-words"> {/* Добавил break-words */}
                  {lastMessage?.content}
                </p>
              </div>
            </div>

            <div className={cn(
                "flex flex-col ml-auto py-1.5 w-[18px] ",
                isMobile ? "gap-1.5" : "gap-[7px]"
            )}>
              <ActivityStatus status={chat.status}  showTitle={false} className="ml-auto"/>
              <ActivityStatus status={hasUnread ? 'new': undefined} showTitle={false} className="ml-auto"/>
              <div className="w-[18px] h-[18px]  ml-auto bg-none rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
  )
}
