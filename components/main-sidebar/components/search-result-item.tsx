"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { StatusBadge } from "./status-badge"
import { formatTimestamp } from "@/services/mock-data"
import type { SearchResultItemProps } from "../types/sidebar.types"

export function SearchResultItem({ chat, query, onChatClick, isActiveChat }: SearchResultItemProps) {
  return (
    <div
      className={cn(
        "px-3 py-3 cursor-pointer rounded-sm transition-colors",
        isActiveChat(chat.id) ? "bg-violet-50 dark:bg-violet-900/20" : "hover:bg-violet-50 dark:hover:bg-violet-900/20",
      )}
      onClick={() => onChatClick(chat.id)}
    >
      <div className="flex items-start gap-3">
        <Image
          src={chat.avatar || "/placeholder.png"}
          alt={chat.title}
          width={32}
          height={32}
          className="w-8 h-8 rounded-sm object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{chat.title}</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">{chat.description}</p>
          <div className="flex items-center justify-between">
            <StatusBadge status={chat.status} />
            <span className="text-xs text-gray-500">{formatTimestamp(chat.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
