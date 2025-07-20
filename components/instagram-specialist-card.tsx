"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {Copy, Share, Reply, MapPinHouse} from "lucide-react"
import { useDoubleTap } from "@/hooks/use-double-tap"
import { useLikes } from "@/hooks/use-likes"
import type { Specialist } from "@/types/common"
import { PentagramIcon } from "@/components/icons/icon-pentagram"
import { ShareSpecialistModal } from "@/components/modals/share-specialist-modal"
import Image from "next/image.js"

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
      <div className="flex items-start w-full max-w-md mx-auto">
        {/* Карточка специалиста */}
        <div className="relative">
          <div
              className="bg-neutral-50 w-[300px] rounded-sm shadow-sm border border-gray-100  overflow-hidden cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-gray-100"
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
            <div className="px-2 pt-3 h-[170px]">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex flex-row mb-2">
                    {/* Name */}
                    <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1 transition-colors duration-300 mr-1">
                      {specialist.name}
                    </h3>
                    <div className="ml-auto flex items-center gap-1 text-violet-600">
                      <PentagramIcon size={18}/>
                      <span>{specialist.likes}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 leading-relaxed line-clamp-2 w-full" style={{ minHeight: 'calc(2 * 1rem * 1.725)' }}>
                      {specialist.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-left justify-between text-sm transition-colors duration-300 mt-1.5 space-y-1.5">
                <div className="flex items-left">
                  <Image
                      src="/practice-logo.svg"
                      alt="Practices"
                      width={20}
                      height={20}
                  />
                  <span className="ml-1.5 text-bold">{specialist.practices}</span>
                  <p className="ml-1">Практис</p>
                </div>
              </div>

              <div>
                <div className="flex items-left mt-3 pb-0.5 opacity-80">
                  <MapPinHouse
                      width={20}
                      height={20}
                  />
                  <span className="ml-1.5">{specialist.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - теперь справа от карточки */}
        {showActionButtons && (
            <div className="flex flex-col gap-3 pl-8 pr-10">
              {/* Star Button */}
              <button
                  type="button"
                  onClick={handleLikeClick}
                  className={`
          rounded-sm flex h-9 w-9 items-center justify-center transition-colors duration-200 shadow-md aspect-square p-0 border-none 
          ${
                      liked
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "bg-white hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-700 opacity-80"
                  }
          active:bg-violet-600 dark:active:bg-violet-600
          active:text-white dark:active:text-white
          active:border-violet-600 dark:active:border-violet-600
          text-black dark:text-white
          focus:outline-none
        `}
                  title="Сохранить в избранное"
              >
                <PentagramIcon size={24}/>
              </button>

              {/* Reply Button */}
              <button
                  type="button"
                  onClick={handleReply}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-md transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                  title="Написать специалисту"
              >
                <Reply size={24} />
              </button>

              {/* Share Button */}
              <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-md transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                  title="Написать специалисту"
              >
                <Share size={24} />
              </button>

              {/* Copy Button */}
              <button
                  type="button"
                  onClick={handleCopyLink}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-md transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                  title="Написать специалисту"
              >
                <Copy size={24} />
              </button>
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
