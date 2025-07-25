"use client"

import { MapPin, TimerReset, MonitorPlayIcon as TvMinimalPlay, Users, MessagesSquare, Share } from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Service } from "@/types/common"
import Image from "next/image"
import { AboutContentsSection } from "@/components/service/about-contents-section"
import { IconPractice } from "@/components/icons/icon-practice"
import type React from "react"
import { useState } from "react"
import { CalendarWidget } from "@/components/adept-calendar/calendar-widget"
import type { BookingSlot } from "@/types/booking"
import { BookingSection } from "@/components/service/booking-section"
import { FeedbackSection } from "@/components/service/feedback-section"
import { PracticePlaceholder } from "../practice-placeholder"
import { formatNumber } from "@/utils/format"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/ui/button-back"
import { useAuth } from "@/hooks/use-auth"

interface MobileServiceCardProps {
  service: Service
  bookingSlots: BookingSlot[]
}

export function MobileServiceCard({ service, bookingSlots }: MobileServiceCardProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const isAuthenticated = useAuth()
  const specialist = service.specialist

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Implement share functionality
    if (navigator.share) {
      navigator
        .share({
          title: service.title,
          text: service.description,
          url: window.location.href,
        })
        .catch(console.error)
    }
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
    <div className="w-full bg-white">
      {/* Header with Back Button and Action Buttons */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white z-10 border-b">
        <BackButton className="text-neutral-700 opacity-80" text="назад" />

        <div className="flex gap-2">
          <button
            onClick={handleToProfile}
            className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm"
            title="Профиль специалиста"
          >
            {specialist.avatar ? (
              <Image
                src={specialist.avatar || "/placeholder.svg"}
                alt={specialist.name}
                width={36}
                height={36}
                className="rounded-sm"
              />
            ) : (
              <PracticePlaceholder width={36} height={36} className="rounded-sm" />
            )}
          </button>

          <button
            onClick={handleReply}
            className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm"
            title="Написать специалисту"
          >
            <MessagesSquare size={20} />
          </button>

          <button
            onClick={handleShare}
            className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm"
            title="Поделиться"
          >
            <Share size={20} />
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full bg-neutral-800">
        {service.images && service.images.length > 0 ? (
          <div className="aspect-square w-full relative">
            <Image
              src={service.images[0] || "/placeholder.svg"}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-square w-full relative">
            <PracticePlaceholder className="w-full h-full" width={600} height={600} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="bg-white p-4 space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex-1 pr-2">{service.title}</h1>
          <div className="flex items-center text-2xl font-bold text-gray-900">
            {formatNumber(service.price)}
            <RubleIcon size={28} className="mb-0.5 ml-1" />
          </div>
        </div>

        <p className="text-gray-700">{service.description}</p>

        {service.location && (
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{service.location}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm">
            <TimerReset size={14} />
            <span className="text-sm text-gray-600">{service.duration}</span>
          </div>

          <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm">
            {service.format === "video" ? (
              <>
                <TvMinimalPlay size={14} />
                <span className="text-sm text-gray-600">Видео</span>
              </>
            ) : (
              <>
                <Users size={14} />
                <span className="text-sm text-gray-600">Очная</span>
              </>
            )}
          </div>

          <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm ml-auto">
            <IconPractice width={16} height={14} />
            <span className="text-sm">{service.practice}</span>
          </div>
        </div>
      </div>

      <AboutContentsSection description={service.description} contents={service.includes} />

      {isAuthenticated && (
        <div className="bg-colors-neutral-150 p-4">
          <div className="mb-4">
            <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </div>
          <BookingSection selectedDate={selectedDate} bookingSlots={bookingSlots} />
        </div>
      )}

      <div className="bg-colors-neutral-150 p-4">
        <FeedbackSection feedbacks={service.reviews} />
      </div>
    </div>
  )
}
