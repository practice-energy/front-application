"use client"

import React, { useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Copy, Share, Paperclip } from "lucide-react"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { InstagramSpecialistCard } from "@/components/instagram-specialist-card"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { cn } from "@/lib/utils"
import type { Message } from "@/types/chats"
import type { Service } from "@/types/common"

interface MessageItemProps {
  specialistId: string
  message: Message
  onSpecialistClick: (id: string) => void
  onServiceClick: (id: string) => void
  onShare: (message: Message) => void
  onRegenerate: (message: Message) => void
  highlightedMessageId: string | null
  isAi: boolean
  footerContent?: string
}

export const MessageItem = React.memo(
  ({
    specialistId,
    message,
    onSpecialistClick,
    onServiceClick,
    onShare,
    onRegenerate,
    highlightedMessageId,
    isAi,
    footerContent,
  }: MessageItemProps) => {
    const router = useRouter()
    const isUser = message.type === "user"
    const isAssistant = message.type === "assistant"
    const isSpecialist = message.type === "specialist"
    const isHighlighted = highlightedMessageId === message.id

    const handleCopyMessage = useCallback(() => {
      const textToCopy = message.content || "Message with cards"
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log("Message copied to clipboard")
      })
    }, [message.content])

    const handleViewSpecialistProfile = useCallback(() => {
      if (isAssistant) {
        return
      }
      onSpecialistClick(specialistId)
    }, [isAssistant, router, specialistId, onSpecialistClick])

    return (
      <div
        id={`message-${message.id}`}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 transition-all duration-500 ${
          isHighlighted ? "bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-2 -m-2" : ""
        }`}
      >
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-4xl w-full`}>
          {!isUser && (
            <Button
              size="sm"
              className="w-16 h-16 p-3 transition-colors mb-1.5 border-none hover:bg-transparent"
              onClick={handleViewSpecialistProfile}
              aria-label={isAssistant ? "View AI profile" : `View ${message.type} profile`}
              title={isAssistant ? "Allura" : isSpecialist ? "Specialist" : "View profile"}
            >
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={isAssistant ? "/allura-logo.svg" : isSpecialist ? "/placeholder-user.png" : "/placeholder.png"}
                  className={cn(isAssistant ? "dark:invert dark:brightness-0 dark:filter" : "hover:bg-gray-100")}
                />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {isAssistant ? "AI" : isSpecialist ? "SP" : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}

          <div className="flex-1 space-y-3 min-w-0 w-full">
            {message.content && (
              <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                <div
                  className={`px-3 py-3 gap-3 rounded-sm shadow-sm border ${
                    isUser
                      ? "bg-violet-50 rounded-tr-md"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-Date border-gray-200 dark:border-gray-700"
                  }`}
                  style={{ wordBreak: "break-word" }}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            )}

            {message.files && message.files.length > 0 && (
              <div className={cn("mt-2 space-y-2 inline-flex flex-col", isUser ? "items-end" : "items-start")}>
                {message.files.map((file, index) => (
                  <a
                    key={index}
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={file.name}
                    className="inline-flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded"
                  >
                    <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-300 flex-shrink-0" />
                    <span className="text-sm text-gray-800 dark:text-gray-200 truncate max-w-xs">{file.name}</span>
                  </a>
                ))}
              </div>
            )}

            {message.specialists && message.specialists.length > 0 && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {message.specialists.slice(0, 2).map((specialist) => (
                    <InstagramSpecialistCard
                      key={specialist.id}
                      specialist={specialist}
                      onClick={() => onSpecialistClick(specialist.id)}
                      showActionButtons={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {message.services && message.services.length > 0 && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {message.services.map((service: Service) => (
                    <InstagramServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => onServiceClick(service.id)}
                      showActionButtons={true}
                      specialistId={service.specialist.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {footerContent && isAssistant && !isUser && (
            <div className="mt-3 text-gray-800 dark:text-gray-100">
              <p className="text-sm leading-relaxed">{footerContent}</p>
            </div>
          )}

          <div className="flex items-center mt-3 w-full">
            <div className="flex-1">
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex gap-2 text-xs opacity-60 items-end">
              {isAi && isAssistant && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onRegenerate(message)}
                  className="p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                  title="Regenerate response"
                >
                  <ArrowPathIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onShare(message)}
                className="p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                title="Share message"
              >
                <Share className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyMessage}
                className="p-1.5 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
                title="Copy message"
              >
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

MessageItem.displayName = "MessageItem"
