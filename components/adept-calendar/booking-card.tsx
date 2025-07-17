"use client"

import { useState } from "react"
import type { Booking } from "@/types/booking"
import { BookingDetailsModal } from "../modals/booking-details-modal"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface BookingCardProps {
  booking: Booking
  slotHeight: number
}

export function BookingCard({ booking, slotHeight }: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div
        className="bg-white rounded-sm p-1.5 cursor-pointer hover:bg-violet-50 transition-colors w-full shadow-sm"
        style={{ height: `${booking.slots * slotHeight - 4}px` }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col items-start gap-3 h-full">
          <div className="flex items-start gap-3 h-full">
            <div className="flex-shrink-0">
              <Image
                  src={booking.specialist.photo || "/placeholder.jpg"}
                  alt={booking.specialist.name}
                  width={74}
                  height={74}
                  className={cn("rounded-sm object-cover bg-white")}
              />
            </div>

            {/* Two columns layout */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Row 1: Title and Status */}
              <div className="flex items-center justify-between mt-1.5">
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate flex-1">
                  {booking.service.name}
                </h3>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  {booking.status && (
                      <div
                          className={cn(
                              "w-4 h-4 rounded-sm flex-shrink-0",
                              booking.status === "waiting" && "bg-pink-500",
                              booking.status === "confirmed" && "bg-green-300",
                          )}
                      />
                  )}
                </div>
              </div>

              {/* Row 2: Specialist name */}
              <div className="flex items-start">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-1 w-full">
                    {booking.specialist.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service description under photo */}
          {booking.slots > 1 && booking.service.description && (
              <p className="text-xs text-gray-500 line-clamp-5">{booking.service.description}</p>
          )}
        </div>
      </div>

      <BookingDetailsModal booking={booking} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
