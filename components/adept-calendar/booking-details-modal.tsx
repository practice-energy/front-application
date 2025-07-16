"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle } from "lucide-react"
import type { Booking } from "@/types/booking"

interface BookingDetailsModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
}

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  const startTime = new Date(booking.startTime)
  const endTime = new Date(booking.endTime)
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) // hours

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
        return <CheckCircle className="w-4 h-4" />
      case "waiting":
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "Подтверждено"
      case "waiting":
        return "Ожидает подтверждения"
      default:
        return "Неизвестно"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Детали бронирования</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          {booking.status && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Статус:</span>
              <Badge variant="secondary" className={`flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                {getStatusText(booking.status)}
              </Badge>
            </div>
          )}

          <Separator />

          {/* Service info */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">{booking.service.name}</h3>
            {booking.service.description && <p className="text-sm text-gray-600">{booking.service.description}</p>}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Цена: {booking.service.price} ₽</span>
              <span>•</span>
              <span>Длительность: {duration}ч</span>
            </div>
          </div>

          <Separator />

          {/* Specialist info */}
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={booking.specialist.photo || "/placeholder.svg"} alt={booking.specialist.name} />
              <AvatarFallback>
                {booking.specialist.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{booking.specialist.name}</h4>
              <p className="text-sm text-gray-600">{booking.specialist.specialization}</p>
              <div className="mt-2 space-y-1">
                {booking.specialist.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>{booking.specialist.phone}</span>
                  </div>
                )}
                {booking.specialist.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{booking.specialist.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {startTime.toLocaleDateString("ru-RU", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>
                {startTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                {" - "}
                {endTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{booking.format}</span>
            </div>
            {booking.client && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span>{booking.client.name}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Закрыть
            </Button>
            {booking.status === "waiting" && <Button className="flex-1">Подтвердить</Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
