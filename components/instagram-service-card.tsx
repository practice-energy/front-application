"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {TimerReset} from "lucide-react"
import { useDoubleTap } from "@/hooks/use-double-tap"
import { useLikes } from "@/hooks/use-likes"
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Service } from "@/types/common"
import {formatNumber} from "@/utils/format";

interface InstagramServiceCardProps {
  service: Service
  onClick?: () => void
  specialistId?: string // ID of specialist for reply functionality
}

export function InstagramServiceCard({
                                       service,
                                       onClick,
                                       specialistId,
                                     }: InstagramServiceCardProps) {
  const router = useRouter()
  const { isLiked, toggleLike } = useLikes()
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)

  const liked = isLiked(service.id)

  const handleDoubleTap = () => {
    toggleLike(service.id)
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

  return (
      <div className="relative md:w-[240px]">
        <div
            className="w-full h-full bg-white  rounded-sm shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600"
            onClick={handleCardClick}
            onTouchEnd={doubleTapHandler}
        >
          {/* Image Container - 4:5 aspect ratio */}
          <div className="relative w-full overflow-hidden">
            <img
                src={service.images[0] || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="px-1.5 pb-1.5 bg-colors-neutral-150 h-full">
            {/* First row: Title on left, Price on right */}
            <div className="flex justify-between items-center mb-1.5">
              <div className="font-bold text-base text-gray-900 line-clamp-1 flex-1">
                {service.title}
              </div>
              <div className="text-[18px]  font-semibold whitespace-nowrap ">
                {formatNumber(service.price)}
                <RubleIcon size={20} bold={false} className="inline mb-0.5" />
              </div>
            </div>

            {/* Second row: Duration with icon */}
            <div className="flex items-center gap-1 mb-1.5">
              <TimerReset className="text-gray-500 w-[14px] h-[14px]" size={14}/>
              <span className="text-xs text-neutral-700 ">
              {service.duration}
            </span>
            </div>

            {/* Third row: Description */}
            <div className="text-xs text-neutral-900 opacity-80 line-clamp-1">
              {service.description}
            </div>
          </div>
        </div>
      </div>
  )
}
