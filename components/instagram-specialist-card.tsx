"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Share,
  Reply,
  MapPinIcon as MapPinHouse,
  Eye,
  MapPinHouseIcon,
  MessageSquareReplyIcon,
  RefreshCcw
} from 'lucide-react'
import { useLikes } from "@/hooks/use-likes"
import { PentagramIcon } from "@/components/icons/icon-pentagram"
import { IconPractice } from "@/components/icons/icon-practice"
import { SpecialistFlipShareCard } from "@/components/specialist/specialist-flip-share-card"
import { Specialist } from "@/types/specialist"
import { cn } from "@/lib/utils"
import {PracticePlaceholder} from "@/components/practice-placeholder";

interface InstagramSpecialistCardProps {
  specialist: Specialist
  onClick?: () => void
  showActionButtons?: boolean
}

export function InstagramSpecialistCard({
                                          specialist,
                                          onClick,
                                          showActionButtons = false,
                                        }: InstagramSpecialistCardProps) {
  const router = useRouter()
  const { isLiked, toggleLike } = useLikes()
  const [isFlipped, setIsFlipped] = useState(false)
  const [copied, setCopied] = useState(false)

  const liked = isLiked(specialist.id)

  const handleCardClick = () => {
    if (!isFlipped && onClick) {
      onClick()
    } else if (!isFlipped) {
      router.push(`/specialist/${specialist.id}`)
    }
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(specialist.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFlipped(!isFlipped)
  }

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/search/${specialist.id}`)
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/specialist/${specialist.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSharePlatform = (platform: string) => {
    const url = `${window.location.origin}/specialist/${specialist.id}`
    const text = `Посмотрите на специалиста ${specialist.name}: ${specialist.title}`

    switch (platform) {
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`)
        break
    }
  }

  return (
      <div className="flex flex-row items-start w-full mx-auto">
        {/* Карточка специалиста с 3D переворотом */}
        <div className="relative flex-1 min-w-0 max-w-[300px]">
          <div
              className="relative w-full h-full"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
          >
            <div
                className={cn(
                    "relative w-full transition-transform duration-700 ease-in-out",
                    "transform-gpu backface-hidden",
                    isFlipped ? "rotate-y-180" : ""
                )}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
              {/* Передняя сторона карточки */}
              <div
                  className={cn(
                      "bg-colors-custom-specialistCardBg w-full rounded-sm shadow-custom hover:shadow-active overflow-hidden cursor-pointer transition-all duration-200",
                      "backface-hidden"
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                  onClick={handleCardClick}
              >
                {/* Image Container with 4:5 aspect ratio */}
                <div className="relative overflow-hidden pt-[125%]"> {/* 5/4 = 1.25 = 125% */}
                  {specialist.avatar !== "" ? ( <img
                      src={specialist.avatar}
                      alt={specialist.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                  />) : (<PracticePlaceholder
                      width={300}
                      height={375}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                  />)}
                </div>

                <div className="px-2 pt-3.5 max-h-[158px] w-full border-gray-100">
                  <div className="flex gap-3">
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-base text-neutral-700 line-clamp-1">
                        {specialist.name}
                      </p>
                      <p className="text-neutral-700 leading-relaxed line-clamp-2 pt-2" style={{ minHeight: 'calc(2 * 1rem * 1.725)' }}>
                        {specialist.title}
                      </p>
                    </div>

                    <div className="w-min-[76px] h-[92px] flex flex-col items-start ml-auto font-bold text-base gap-2 bg-colors-custom-specialistCardStatsBg/80 px-1 py-1.5 rounded-sm">
                      {/* Блок лайков */}
                      <div className="flex items-center gap-1 px-1 bg-colors-custom-specialistCardStatItemBg flex-1 w-full rounded-sm text-violet-600 justify-between shadow-custom-xs">
                        <PentagramIcon size={24} />
                        <p>{specialist.likes}</p>
                      </div>

                      {/* Блок практик */}
                      <div className="flex items-center pl-[5px] pr-1 bg-colors-custom-specialistCardStatItemBg flex-1 w-full rounded-sm gap-1 justify-between shadow-custom-xs">
                        <IconPractice
                            width={22}
                            height={20}
                        />
                        {specialist.practices}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-left mt-[20px] pb-2 text-neutral-700 gap-1.5">
                    <MapPinHouseIcon
                        width={18}
                        height={18}
                    />
                    {specialist.location}
                  </div>
                </div>
              </div>

              {/* Задняя сторона карточки */}
              <div
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
              >
                <div className="w-full flex justify-center">
                  <SpecialistFlipShareCard
                      specialist={specialist}
                      copied={copied}
                      onCopyLink={handleCopyLink}
                      onShare={handleSharePlatform}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - справа от карточки */}
        {showActionButtons && (
            <div className={cn(
                "flex flex-col gap-3 pl-8",
            )}>
              {/* Star Button */}
              <button
                  type="button"
                  onClick={handleLikeClick}
                  className={`
              rounded-sm flex h-9 w-9 items-center justify-center transition-colors duration-200 shadow-custom aspect-square p-0 border-none 
              ${
                      liked
                          ? "bg-violet-600  hover:shadow-active text-white"
                          : "bg-white hover:shadow-active  text-neutral-700"
                  }
              active:bg-violet-600 active:hover:shadow-active
              active:text-white 
              active:border-violet-600 
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
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white shadow-custom hover:shadow-active transition-colors aspect-square duration-200 text-neutral-700"
                  title="Написать специалисту"
              >
                <MessageSquareReplyIcon size={24} />
              </button>

              {/* Share/Eye Button */}
              <button
                  type="button"
                  onClick={handleShare}
                  className={cn(
                      "rounded-sm h-9 w-9 flex items-center justify-center shadow-custom hover:shadow-active transition-colors aspect-square duration-200",
                      isFlipped
                          ? "bg-violet-600  text-white"
                          : "bg-white  text-neutral-700"
                  )}
                  title={isFlipped ? "Вернуться к карточке" : "Поделиться"}
              >
                {isFlipped ? <Eye size={24} /> : <RefreshCcw size={24} />}
              </button>
            </div>
        )}
      </div>
  )
}
