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
import {Pentagram, PentagramIcon} from "@/components/icons/icon-pentagram"

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

  return (
    <div className="w-[240px] h-[330px] relative">
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
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            {/* Service Name - truncated */}
            <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300 flex-1 pr-2 line-clamp-1 truncate leading-relaxed">
            </h3>
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
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1 truncate leading-relaxed transition-colors duration-300">
            service.description
          </p>
        </div>
      </div>
    </div>
  )
}
