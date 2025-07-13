"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClockIcon } from "@heroicons/react/24/outline"
import { Copy, Share, Reply } from "lucide-react"
import { useDoubleTap } from "@/hooks/use-double-tap"
import { useLikes } from "@/hooks/use-likes"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Service } from "@/types/common"
import { Pentagram } from "@/components/icons/icon-pentagram"

interface InstagramServiceCardProps {
  service: Service
  onClick?: () => void
  showActionButtons?: boolean // New prop to show action buttons in chat context
  specialistId?: string // ID of specialist for reply functionality
}

export function InstagramServiceCard({
  service,
  onClick,
  showActionButtons = false,
  specialistId,
}: InstagramServiceCardProps) {
  const router = useRouter()
  const { isLiked, toggleLike } = useLikes()
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)

  const liked = isLiked("service", service.id)

  const handleDoubleTap = () => {
    toggleLike("service", service.id)
    setShowLikeAnimation(true)
    setTimeout(() => setShowLikeAnimation(false), 1000)
  }

  const doubleTapHandler = useDoubleTap({ onDoubleTap: handleDoubleTap })

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/service/${service.id}`)
    }
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike("service", service.id)
  }

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = `${window.location.origin}/service/${service.id}`
    try {
      await navigator.clipboard.writeText(link)
      // You could add a toast notification here
      console.log("Link copied to clipboard")
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // You can implement a service share modal similar to specialist modal
    const shareData = {
      title: service.title,
      text: `Check out this service: ${service.title}`,
      url: `${window.location.origin}/service/${service.id}`,
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      // Fallback to copying link
      handleCopyLink(e)
    }
  }

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (specialistId) {
      router.push(`/search/${specialistId}`)
    }
  }

  // Truncate long text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <div className="w-full min-w-[250px] max-w-sm mx-auto relative">
      <div
        className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600"
        onClick={handleCardClick}
        onTouchEnd={doubleTapHandler}
      >
        {/* Image Container - 4:5 aspect ratio */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={service.images[0] || "/placeholder.svg?height=320&width=320"}
            alt={service.title}
            className="w-full h-full object-cover"
          />

          {/* Double Tap Like Animation */}
          {showLikeAnimation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-violet-600 rounded-sm p-2">
                <Pentagram size={64} weight="fill" className="text-white animate-ping" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            {/* Service Name - truncated */}
            <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300 flex-1 pr-2">
              {truncateText(service.title, 50)}
            </h3>

            {/* Star Button - only show when not in chat context */}
            {!showActionButtons && (
              <Button
                type="button"
                size="sm"
                onClick={handleLikeClick}
                className={`
                  rounded-sm h-9 w-9 flex items-center justify-center border transition-colors duration-200
                  ${
                    liked
                      ? "bg-violet-600 border-violet-600 hover:bg-violet-500"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-violet-50 dark:hover:bg-violet-700"
                  }
                  active:bg-violet-600 dark:active:bg-violet-600
                  active:text-white dark:active:text-white
                  active:border-violet-600 dark:active:border-violet-600
                  text-black dark:text-white
                  focus:outline-none
                `}
              >
                <Pentagram
                  size={20}
                  weight={liked ? "fill" : "regular"}
                  className={cn(liked ? "text-white" : "text-gray-600 dark:text-gray-400")}
                />
              </Button>
            )}
          </div>

          {/* Duration and Price - moved price to left with gap-3 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{service.duration}</span>
            </div>
            <div className="text-lg font-bold transition-colors duration-300">
              {service.price}
              <RubleIcon size={18} bold={true} className="mb-0.5" />
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed transition-colors duration-300">
            {truncateText(service.description, 80)}
          </p>
        </div>
      </div>

      {/* Action Buttons - positioned on the right side when in chat context */}
      {showActionButtons && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Star Button */}
          <Button
            type="button"
            size="sm"
            onClick={handleLikeClick}
            className={`
              rounded-sm h-9 w-9 flex items-center justify-center border transition-colors duration-200 shadow-md
              ${
                liked
                  ? "bg-violet-600 border-violet-600 hover:bg-violet-500"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-violet-50 dark:hover:bg-violet-700"
              }
              active:bg-violet-600 dark:active:bg-violet-600
              active:text-white dark:active:text-white
              active:border-violet-600 dark:active:border-violet-600
              text-black dark:text-white
              focus:outline-none
            `}
            title="Сохранить в избранное"
          >
            <Pentagram
              size={16}
              weight={liked ? "fill" : "regular"}
              className={cn(liked ? "text-white" : "text-gray-600 dark:text-gray-400")}
            />
          </Button>

          {/* Reply Button - only show if specialistId is provided */}
          {specialistId && (
            <Button
              type="button"
              size="sm"
              onClick={handleReply}
              className="rounded-sm h-9 w-9 flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
              title="Написать специалисту"
            >
              <Reply size={16} className="text-gray-600 dark:text-gray-400" />
            </Button>
          )}

          {/* Share Button */}
          <Button
            type="button"
            size="sm"
            onClick={handleShare}
            className="rounded-sm h-9 w-9 flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
            title="Поделиться"
          >
            <Share size={16} className="text-gray-600 dark:text-gray-400" />
          </Button>

          {/* Copy Button */}
          <Button
            type="button"
            size="sm"
            onClick={handleCopyLink}
            className="rounded-sm h-9 w-9 flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
            title="Копировать ссылку"
          >
            <Copy size={16} className="text-gray-600 dark:text-gray-400" />
          </Button>
        </div>
      )}
    </div>
  )
}
