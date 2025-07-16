"use client"

import React, { useState } from "react"
import type { Booking } from "@/types/booking"
import { BookingDetailsModal } from "./booking-details-modal"
import {cn} from "@/lib/utils";
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
        className="bg-white rounded-sm p-1.5 cursor-pointer hover:bg-violet-50 transition-colors w-full shadow-sm h-full"
        style={{ height: `${booking.slots * slotHeight - 4}px` }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start gap-3 h-full">
          <Image
              src={
            // booking.specialist.photo ||
                  "/placeholder.jpg"}
              alt={booking.specialist.name}
              width={74}
              height={74}
              className={cn("rounded-sm object-cover bg-white")}
          />

          {/* Two columns layout */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Row 1: Title and Status */}
            <div className="flex items-center justify-between mt-1.5">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate flex-1">{booking.service.name}</h3>
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

            {/* Row 2: Description (multi-line) and New Message Indicator */}
            <div className="flex items-start">  {/* Убрано justify-between */}
              {/* Описание - занимает всё доступное пространство */}
              <div className="flex-1 min-w-0 overflow-hidden">  {/* Добавлен overflow-hidden */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-1 w-full">
                  {booking.specialist.name}
                </p>
              </div>
              </div>
            </div>
          </div>
      </div>

      <BookingDetailsModal booking={booking} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
