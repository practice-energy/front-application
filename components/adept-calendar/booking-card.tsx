"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle } from "lucide-react"
import { BookingDetailsModal } from "./booking-details-modal"
import type { Booking } from "@/types/booking"

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const startTime = new Date(booking.startTime)
  const endTime = new Date(booking.endTime)
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) // hours
  const isMultiSlot = duration > 1

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-3 h-3" />
      case "waiting":
        return <Clock className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <>
      <div
        className="absolute inset-x-1 inset-y-1 bg-white rounded-lg border shadow-sm p-2 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start gap-2 h-full">
          {/* Avatar */}
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={booking.specialist.photo || "/placeholder.svg"} alt={booking.specialist.name} />
            <AvatarFallback>
              {booking.specialist.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{booking.service.name}</p>
                <p className="text-xs text-gray-500 truncate">{booking.specialist.name}</p>
              </div>

              {/* Status badge */}
              {booking.status && (
                <Badge
                  variant="secondary"
                  className={`ml-2 flex items-center gap-1 text-xs ${getStatusColor(booking.status)}`}
                >
                  {getStatusIcon(booking.status)}
                  {booking.status === "confirmed" ? "Подтв." : "Ожид."}
                </Badge>
              )}
            </div>

            {/* Time and format info */}
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span>
                {startTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                {" - "}
                {endTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span>•</span>
              <span>{booking.format}</span>
            </div>

            {/* Description for multi-slot bookings */}
            {isMultiSlot && booking.service.description && (
              <p className="mt-1 text-xs text-gray-600 line-clamp-2">{booking.service.description}</p>
            )}
          </div>
        </div>
      </div>

      <BookingDetailsModal booking={booking} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
