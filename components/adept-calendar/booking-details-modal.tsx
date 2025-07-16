"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, MapPin, Clock, CheckCircle, Calendar, User, CreditCard } from "lucide-react"
import type { Booking } from "@/types/booking"

interface BookingDetailsModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
}

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
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
        return <CheckCircle className="h-4 w-4" />
      case "waiting":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Детали бронирования</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={booking.specialist.photo || "/placeholder-user.jpg"} alt={booking.specialist.name} />
              <AvatarFallback>{booking.specialist.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{booking.service.name}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <User className="h-4 w-4" />
                {booking.specialist.name}
              </p>
              {booking.service.description && (
                <p className="text-sm text-gray-500 mt-2">{booking.service.description}</p>
              )}
            </div>
          </div>

          {/* Status and Format */}
          <div className="flex items-center justify-between">
            {booking.status && (
              <Badge className={`flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                {booking.status === "confirmed" ? "Подтверждено" : "Ожидание"}
              </Badge>
            )}

            <Badge variant="outline" className="flex items-center gap-1">
              <FormatIcon className="h-3 w-3" />
              {booking.format === "video" ? "Видеозвонок" : "Очная встреча"}
            </Badge>
          </div>

          {/* Date and Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900">{formatDate(booking.date)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900">{booking.duration} минут</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Оплата</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                {booking.paymentStatus === "paid"
                  ? "Оплачено"
                  : booking.paymentStatus === "pending"
                    ? "Ожидает оплаты"
                    : "Не оплачено"}
              </Badge>
              <span className="text-sm font-semibold">{booking.service.price} ₽</span>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Заметки</h4>
              <p className="text-sm text-blue-800">{booking.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Закрыть
            </Button>
            <Button className="flex-1">{booking.format === "video" ? "Присоединиться" : "Показать адрес"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
