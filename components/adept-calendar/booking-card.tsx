"use client"

import { useState } from "react"
import type { Booking } from "@/types/booking"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useMobile } from "@/hooks/use-mobile"

interface BookingCardProps {
  booking: Booking
  slotHeight: number
}

export function BookingCard({ booking, slotHeight }: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useMobile()

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (isMobile) {
    return (
      <div
        className="bg-violet-500 rounded-sm cursor-pointer flex items-center justify-center text-white font-medium"
        style={{ height: `${booking.slots * slotHeight}px` }}
        onClick={() => setIsModalOpen(true)}
      >
        {formatTime(booking.startTime)}
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          "relative rounded-sm transition-colors cursor-pointer w-full pb-0.5",
          "pl-0 py-0.5 px-1",
          "hover:bg-violet-600 hover:shadow-sm hover:bg-opacity-5",
        )}
        style={{ height: `${booking.slots * slotHeight}px` }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className={cn("flex items-start w-full, hover:bg-opacity-100 gap-3")}>
          {/* Profile Image - spans all three rows */}
          <div className={cn("flex-shrink-0 flex items-center p-1")}>
            {!booking.service.avatar ? (
              <Image
                src="/practice-logo.svg"
                alt={booking.service.title}
                width={45}
                height={45}
                className={cn("rounded-sm object-cover bg-none items-center")}
              />
            ) : (
              <Image
                src={booking.service.avatar || "/placeholder.svg"}
                alt={booking.service.title}
                width={45}
                height={45}
                className={cn("rounded-sm object-cover items-center")}
              />
            )}
          </div>

          {/* Two columns layout */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Row 1: Title  */}
            <div className="flex items-center justify-between mt-1.5">
              <h3 className="text-base font-medium truncate flex-1">{booking.service.title}</h3>
              <div className="flex items-center gap-1 flex-shrink-0 pl-1">
                {booking.status && (
                  <div
                    className={cn(
                      "w-4 h-4 rounded-sm flex-shrink-0",
                      booking.status === "waiting" && "bg-pink-500",
                      booking.status === "confirmed" && "bg-teal-400",
                      booking.status === "request" && "bg-neutral-300",
                    )}
                  />
                )}
              </div>
            </div>

            {/* Row 2: Description (multi-line) and New Message Indicator */}
            <div className="flex items-start">
              {/* Описание - занимает всё доступное пространство */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-gray-600 leading-relaxed line-clamp-1 w-full">{booking.specialist.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
