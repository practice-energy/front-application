"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import { Copy, Share, Reply } from "lucide-react"
import { useDoubleTap } from "@/hooks/use-double-tap"
import { useLikes } from "@/hooks/use-likes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Specialist } from "@/types/common"
import { PentagramIcon } from "@/components/icons/icon-pentagram"
import { ShareSpecialistModal } from "@/components/share-specialist-modal"

interface InstagramSpecialistCardProps {
  specialist: Specialist
  onClick?: () => void
  showActionButtons?: boolean // New prop to show action buttons in chat context
}

export function InstagramSpecialistCard({
  specialist,
  onClick,
  showActionButtons = false,
}: InstagramSpecialistCardProps) {
  const router = useRouter()
  const { isLiked, toggleLike } = useLikes()
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const liked = isLiked("specialist", specialist.id)

  const handleDoubleTap = () => {
    toggleLike("specialist", specialist.id)
    setShowLikeAnimation(true)
    setTimeout(() => setShowLikeAnimation(false), 1000)
  }

  const doubleTapHandler = useDoubleTap({ onDoubleTap: handleDoubleTap })

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/specialist/${specialist.id}`)
    }
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike("specialist", specialist.id)
  }

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = `${window.location.origin}/specialist/${specialist.id}`
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
    setShareModalOpen(true)
  }

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/search/${specialist.id}`)
  }

  return (
    <>
      <div className="flex items-start gap-[24px] w-full max-w-md mx-auto">
        {/* Карточка специалиста */}
        <div className="w-full min-w-[240px] max-w-sm relative">
          <div
              className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600"
              onClick={handleCardClick}
              onTouchEnd={doubleTapHandler}
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
              <img
                  src={specialist.avatar || "/placeholder.svg?height=300&width=300"}
                  alt={specialist.name}
                  className="w-full h-full object-cover"
              />

              {/* Double Tap Like Animation */}
              {showLikeAnimation && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-violet-600 rounded-sm p-2">
                      <PentagramIcon size={64} weight="fill" className="text-white animate-ping" />
                    </div>
                  </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  {/* Name */}
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1 transition-colors duration-300">
                    {specialist.name}
                  </h3>

                  {/* Title */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-1 transition-colors duration-300">
                    {specialist.title}
                  </p>
                </div>

                {/* Sparkles Button - only show when not in chat context */}
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
                      <PentagramIcon size={20} className={cn(liked ? "text-white" : "text-gray-600 dark:text-gray-400")} />
                    </Button>
                )}
              </div>

              {/* Reviews */}
              <div className="flex items-left justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <div className="flex items-left">
                  <span>{specialist.reviewCount}</span>
                  <p className="ml-1">практик</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - теперь справа от карточки */}
        {showActionButtons && (
            <div className="flex flex-col gap-3">
              {/* Star Button */}
              <Button
                  type="button"
                  size="sm"
                  onClick={handleLikeClick}
                  className={`
          rounded-sm h-9 w-9 flex items-center justify-center transition-colors duration-200 shadow-md
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
                <PentagramIcon size={16} className={cn(liked ? "text-white" : "text-gray-600 dark:text-gray-400")} />
              </Button>

              {/* Reply Button */}
              <Button
                  type="button"
                  size="sm"
                  onClick={handleReply}
                  className="rounded-sm h-9 w-9 flex items-center justify-center border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
                  title="Написать специалисту"
              >
                <Reply size={16} className="text-gray-600 dark:text-gray-400" />
              </Button>

              {/* Share Button */}
              <Button
                  type="button"
                  size="sm"
                  onClick={handleShare}
                  className="rounded-sm h-9 w-9 flex items-center justify-center border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
                  title="Поделиться"
              >
                <Share size={16} className="text-gray-600 dark:text-gray-400" />
              </Button>

              {/* Copy Button */}
              <Button
                  type="button"
                  size="sm"
                  onClick={handleCopyLink}
                  className="rounded-sm h-9 w-9 flex items-center justify-center border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-colors duration-200"
                  title="Копировать ссылку"
              >
                <Copy size={16} className="text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareSpecialistModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        specialist={{
          id: specialist.id.toString(),
          name: specialist.name,
          title: specialist.title || "",
          image: specialist.avatar,
        }}
      />
    </>
  )
}
