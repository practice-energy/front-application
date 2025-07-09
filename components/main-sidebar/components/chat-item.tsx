"use client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Chat } from "@/types/chats"

interface ChatItemProps {
  chat: Chat
  isActive?: boolean
  onClick?: () => void
}

export function ChatItem({ chat, isActive = false, onClick }: ChatItemProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/search/${chat.id}`)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "max-w-full w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200",
        isActive
          ? "bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-800",
      )}
      onClick={handleClick}
    >
      {/* Content area with width constraints */}
      <div className="flex-1 min-w-0 max-w-[calc(100%-60px)] overflow-hidden">
        <div className="flex items-center gap-3">
          {/* Chat title */}
          <h4
            className={cn(
              "font-medium text-sm truncate w-full",
              isActive ? "text-violet-700 dark:text-violet-300" : "text-gray-900 dark:text-gray-100",
            )}
          >
            {chat.title}
          </h4>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{chat.timestamp}</p>
      </div>

      {/* Indicators section with fixed width */}
      <div className="w-[50px] flex-shrink-0 flex items-center justify-end gap-1">
        {/* New indicator */}
        {chat.hasNew && <div className="w-3 h-3 bg-violet-500 rounded-full flex-shrink-0" />}

        {/* AI indicator */}
        {chat.isAi && <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />}
      </div>
    </motion.div>
  )
}
