"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { SearchResultItemProps } from "../types/sidebar.types"

export function SearchResultItem({ chat, query, onChatClick, isActiveChat }: SearchResultItemProps) {
  const isActive = isActiveChat(chat.id)

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-gray-900 dark:text-gray-100">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div
      className={cn(
        "relative px-3 py-3 rounded-sm transition-colors cursor-pointer",
        isActive
          ? "bg-violet-50 dark:bg-violet-900/20 shadow-sm"
          : "hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:shadow-sm",
      )}
      onClick={() => onChatClick(chat.id)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {chat.isAI ? (
            <Image
              src="/allura-logo.svg"
              alt={chat.title}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <Image
              src={chat.avatar || "/placeholder.png"}
              alt={chat.title}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {chat.isAIEnabled && (
              <Image src="/allura-logo.svg" alt="AI" width={16} height={16} className="w-4 h-4 flex-shrink-0" />
            )}
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1">
              {highlightText(chat.title, query)}
            </h3>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2 leading-relaxed">
            {highlightText(chat.description, query)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            {chat.status && <span className="text-xs text-gray-500 dark:text-gray-400">{chat.status}</span>}

            {/* Статусный индикатор */}
            {chat.status === "Ожидает" && <div className="w-3 h-3 bg-red-500 rounded-sm" />}
            {chat.status === "Подтверждено" && <div className="w-3 h-3 bg-green-500 rounded-sm" />}
          </div>
        </div>
      </div>
    </div>
  )
}
