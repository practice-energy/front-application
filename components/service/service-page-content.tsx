"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { MessagesSquare, Share } from "lucide-react"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { BackButton } from "@/components/ui/button-back"
import { ServiceCard } from "@/components/service/service-card"
import type { Service } from "@/types/common"
import {Booking, BookingSlot} from "@/types/booking";
import Image from "next/image";
import {PracticePlaceholder} from "@/components/practice-placeholder";
import {useAuth} from "@/hooks/use-auth";

interface ServicePageContentProps {
  service: Service
  bookingSlots: BookingSlot[]
}

export function ServicePageContent({ service, bookingSlots }: ServicePageContentProps) {
  const router = useRouter()
  const [isAnimating] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  // const { isAuthenticated } = useAuth()

  const specialist = service.specialist

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShareModalOpen(true)
  }

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/search/${specialist.id}`)
  }


  const handleToProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/specialist/${specialist.id}`)
  }


  return (
    <>
      <main className="min-h-screen relative">
        <div
          className="flex-1 overflow-hidden"
          style={{
            transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
          }}
          data-animating={isAnimating ? "true" : "false"}
        >
          <div className="max-w-4xl mx-auto py-8 px-6 ">
            {/* Header with Back Button and Action Buttons */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="flex-1">
                <BackButton className="text-neutral-700 opacity-80" text={"назад к профайл"} />
              </div>

              <div className="flex flex-row gap-3 items-center pt-2.5 pr-9">
                {/* Message Button */}
                <button
                    type="button"
                    onClick={handleToProfile}
                    className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                    title="Написать специалисту"
                >
                  {specialist.avatar ? (<Image
                      src={specialist.avatar}
                      alt={specialist.name}
                      width={36}
                      height={36}
                      className="rounded-sm"
                  />) : (<PracticePlaceholder
                      width={36}
                      height={36}
                      className="rounded-sm"
                  />)}
                </button>

                {/* Message Button */}
                <button
                  type="button"
                  onClick={handleReply}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                  title="Написать специалисту"
                >
                  <MessagesSquare size={24} />
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
            </div>

            {/* Service Card */}
            <ServiceCard service={service}  bookingSlots={bookingSlots} isAuthenticated={true}/>
          </div>
        </div>
      </main>
    </>
  )
}
