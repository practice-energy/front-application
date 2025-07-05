"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClockIcon } from "@heroicons/react/24/outline"
import { useDoubleTap } from "@/hooks/use-double-tap"
import { useLikes } from "@/hooks/use-likes"
import { RubleIcon } from "@/components/ui/ruble-sign"
import {cn} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface Service {
  id: string
  name: string
  duration: string
  price: number
  images: string[]
  description: string
}

interface InstagramServiceCardProps {
  service: Service
  onClick?: () => void
}

export function InstagramServiceCard({ service, onClick }: InstagramServiceCardProps) {
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

  // Truncate long text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
      <div className="w-full min-w-[250px] max-w-sm mx-auto">
        <div
            className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600"
            onClick={handleCardClick}
            onTouchEnd={doubleTapHandler}
        >
          {/* Image Container - 4:5 aspect ratio */}
          <div className="relative aspect-square overflow-hidden">
            <img
                src={service.images[0] || "/placeholder.svg?height=320&width=320"}
                alt={service.name}
                className="w-full h-full object-cover"
            />

            {/* Double Tap Like Animation */}
            {showLikeAnimation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-violet-600 rounded-sm p-1">
                    <Image
                        src="/star-pentagram-icon.svg"
                        alt="Star"
                        width={64}
                        height={64}
                        className="h-16 w-16 animate-ping filter invert"
                    />
                  </div>
                </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              {/* Service Name - truncated */}
              <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300 flex-1 pr-2">
                {truncateText(service.name, 50)}
              </h3>

              {/* Star Button */}
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
                <Sparkles
                    width={20}
                    height={20}
                    className={cn(
                        "bold",
                        liked ? "filter brightness-0 invert" : "dark:filter dark:brightness-0 dark:invert")}
                />
              </Button>
            </div>

            {/* Duration and Price - moved price to left with gap-3 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{service.duration}</span>
              </div>
              <div className="text-lg font-bold text-violet-600 dark:text-violet-400 transition-colors duration-300">
                {service.price}
                <RubleIcon
                    size={18}
                    bold={true}
                    className="text-violet-700 dark:text-violet-400"
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed transition-colors duration-300">
              {truncateText(service.description, 80)}
            </p>
          </div>
        </div>
      </div>
  )
}
