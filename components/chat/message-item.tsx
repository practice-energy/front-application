"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Copy, Share2, RotateCcw, ThumbsUp, ThumbsDown, MoreHorizontal, Flame, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

interface MessageItemProps {
  message: {
    id: string
    content: string
    isUser: boolean
    timestamp: Date
    aiMessageType?: "service" | "response" | "suggestion"
  }
  onCopy?: (content: string) => void
  onShare?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onLike?: (messageId: string) => void
  onDislike?: (messageId: string) => void
}

export function MessageItem({ message, onCopy, onShare, onRegenerate, onLike, onDislike }: MessageItemProps) {
  const [showActions, setShowActions] = useState(false)
  const { user } = useAuth()

  const handleCopy = () => {
    onCopy?.(message.content)
  }

  const handleShare = () => {
    onShare?.(message.id)
  }

  const handleRegenerate = () => {
    onRegenerate?.(message.id)
  }

  const handleLike = () => {
    onLike?.(message.id)
  }

  const handleDislike = () => {
    onDislike?.(message.id)
  }

  const handleBurn = () => {
    // Handle burn action for service messages
    console.log("Burn action for message:", message.id)
  }

  const handleConfirm = () => {
    // Handle confirm action for service messages
    console.log("Confirm action for message:", message.id)
  }

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
        message.isUser ? "flex-row-reverse" : "flex-row",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage
          src={message.isUser ? user?.avatar : "/placeholder-user.jpg"}
          alt={message.isUser ? "User" : "AI"}
        />
        <AvatarFallback>{message.isUser ? "U" : "AI"}</AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn("flex-1 space-y-2", message.isUser ? "text-right" : "text-left")}>
        <div
          className={cn(
            "inline-block max-w-[80%] rounded-lg px-3 py-2 text-sm",
            message.isUser
              ? "bg-blue-500 text-white ml-auto"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          )}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <div className={cn("text-xs text-gray-500", message.isUser ? "text-right" : "text-left")}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>

        {/* Action Buttons */}
        {!message.isUser && showActions && (
          <div className="flex items-center gap-1 mt-2">
            {message.aiMessageType === "service" ? (
              // Service-specific buttons
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBurn}
                  className="bg-pink-500 hover:bg-pink-600 text-white border-pink-500 hover:border-pink-600"
                >
                  <Flame className="h-4 w-4 mr-2" />
                  Сжечь
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConfirm}
                  className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Подтвердить
                </Button>
              </div>
            ) : (
              // Regular action buttons
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy message</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share message</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerate}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="sr-only">Regenerate response</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="sr-only">Like message</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDislike}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span className="sr-only">Dislike message</span>
                </Button>

                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
