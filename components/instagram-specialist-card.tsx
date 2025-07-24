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
import {IconPractice} from "@/components/icons/icon-practice";

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

  const liked = isLiked(specialist.id)

  const handleDoubleTap = () => {
    toggleLike(specialist.id)
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
    toggleLike(specialist.id)
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
              className="bg-colors-neutral-150 w-[300px] rounded-sm shadow-sm border border-gray-100  overflow-hidden cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-gray-100"
              onClick={handleCardClick}
              onTouchEnd={doubleTapHandler}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden">
              <img
                  src={specialist.avatar || "/placeholder.svg?height=300&width=300"}
                  alt={specialist.name}
                  className="w-full h-[340px] object-cover"
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

            <div className="px-2 pt-3.5 h-[158px] w-[300px]">
              <div className="flex gap-3">
                {/* Левая колонка - имя и должность */}
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">
                    {specialist.name}
                  </p>
                  <p className="text-neutral-900 opacity-80 leading-relaxed line-clamp-2 pt-2" style={{ minHeight: 'calc(2 * 1rem * 1.725)' }}>
                    {specialist.title}
                  </p>
                </div>

                {/* Правая колонка - метрики (55x55) */}
                <div className="w-[55px] h-[55px] flex flex-col items-start justify-center font-bold text-sm gap-[11px] mr-2 pt-1.5">
                  {/* Блок лайков */}
                  <div className="flex items-center gap-1 text-violet-600">
                    <PentagramIcon size={20} />
                    {specialist.likes}
                  </div>

                  {/* Блок практик */}
                  <div className="flex items-center gap-1">
                    <IconPractice
                        width={20}
                        height={18}
                    />
                    {specialist.practices}
                  </div>
                </div>
              </div>
              <div className="flex items-left mt-[30px] text-neutral-700 opacity-80 gap-1.5">
                <MapPinHouse
                    width={18}
                    height={18}
                />
                {specialist.location}
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
          rounded-sm flex h-9 w-9 items-center justify-center transition-colors duration-200 shadow-sm aspect-square p-0 border-none 
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
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                  title="Написать специалисту"
              >
                <Reply size={24} />
              </button>

              {/* Share Button */}
              <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                  title="Написать специалисту"
              >
                <Share size={24} />
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
