"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Video, MapPin } from "lucide-react"
import type { Booking } from "@/types/booking"

interface BookingCardProps {
  booking: Booking
  slotHeight: number
}

export function BookingCard({ booking, slotHeight }: BookingCardProps) {
  const formatIcon = booking.format === "video" ? Video : MapPin
  const FormatIcon = formatIcon

  return (
    <div
      className="bg-violet-600 hover:bg-violet-50 hover:border-violet-600 border border-violet-600 rounded-sm p-2 flex flex-col gap-2 transition-colors cursor-pointer group w-full"
      style={{ height: `${booking.slots * slotHeight - 4}px` }}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={booking.specialist.photo || "/placeholder.svg"} alt={booking.specialist.name} />
          <AvatarFallback className="text-xs">{booking.specialist.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-white group-hover:text-violet-600 font-medium text-xs truncate">
            {booking.service.name}
          </div>
          <div className="text-violet-200 group-hover:text-violet-500 text-xs">{booking.specialist.name}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className="bg-white/20 text-white group-hover:bg-violet-100 group-hover:text-violet-600 text-xs px-1 py-0"
        >
          <FormatIcon className="h-3 w-3 mr-1" />
          {booking.format === "video" ? "Видео" : "Очно"}
        </Badge>
        {booking.paymentStatus === "paid" && (
          <div className="text-xs text-violet-200 group-hover:text-violet-500">100%</div>
        )}
        {booking.paymentStatus === "pending" && (
          <div className="text-xs text-violet-200 group-hover:text-violet-500">0%</div>
        )}
      </div>
    </div>
  )
}
