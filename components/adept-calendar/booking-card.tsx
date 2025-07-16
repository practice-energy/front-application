"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Video, MapPin, Clock, CheckCircle } from "lucide-react"
import type { Booking } from "@/types/booking"
import { BookingDetailsModal } from "./booking-details-modal"

interface BookingCardProps {
  booking: Booking
  slotHeight: number
}

export function BookingCard({ booking, slotHeight }: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const FormatIcon = booking.format === "video" ? Video : MapPin

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
        return <CheckCircle className="h-3 w-3" />
      case "waiting":
        return <Clock className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors w-full shadow-sm"
        style={{ height: `${booking.slots * slotHeight - 4}px` }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start gap-3 h-full">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={booking.specialist.photo || "/placeholder-user.jpg"} alt={booking.specialist.name} />
            <AvatarFallback className="text-sm">{booking.specialist.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{booking.service.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{booking.specialist.name}</p>
                </div>

                {booking.status && (
                  <Badge
                    variant="secondary"
                    className={`ml-2 text-xs px-2 py-1 flex items-center gap-1 ${getStatusColor(booking.status)}`}
                  >
                    {getStatusIcon(booking.status)}
                    {booking.status === "confirmed" ? "Подтверждено" : "Ожидание"}
                  </Badge>
                )}
              </div>

              {booking.slots > 1 && booking.service.description && (
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{booking.service.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FormatIcon className="h-3 w-3" />
                {booking.format === "video" ? "Видео" : "Очно"}
              </div>

              <div className="text-xs text-gray-400">{booking.duration} мин</div>
            </div>
          </div>
        </div>
      </div>

      <BookingDetailsModal booking={booking} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
