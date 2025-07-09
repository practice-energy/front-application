"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import { useDoubleTap } from "@/hooks/use-double-tap"
import { useLikes } from "@/hooks/use-likes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Specialist } from "@/types/common"
import { PentagramIcon } from "@/components/ui/icon-pentagram"

interface InstagramSpecialistCardProps {
  specialist: Specialist
  onClick?: () => void
}

export function InstagramSpecialistCard({ specialist, onClick }: InstagramSpecialistCardProps) {
  const router = useRouter()
  const { isLiked, toggleLike } = useLikes()
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)

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

  return (
    <div className="w-full min-w-[250px] max-w-sm mx-auto">
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

            {/* Sparkles Button */}
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
              <PentagramIcon
                size={20}
                className={cn(liked ? "text-white" : "text-gray-600 dark:text-gray-400")}
              />
            </Button>
          </div>

          {/* Reviews */}
          <div className="flex items-left justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <div className="flex items-left">
              <UserGroupIcon className="h-4 w-4 mr-1" />
              <span>{specialist.reviewCount}</span>
              <p className="ml-1">практик</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
