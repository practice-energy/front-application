"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Video, MapPin, Clock, CheckCircle, Calendar, User, ChevronDown, ChevronUp } from "lucide-react"
import { CalendarWidget } from "../adept-calendar/calendar-widget"
import { TimeSlotGrid } from "../adept-calendar/time-slot-grid"
import type { Booking } from "@/types/booking"

interface BookingDetailsModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
}

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState<Date>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showRescheduleConfirm, setShowRescheduleConfirm] = useState(false)

  const FormatIcon = booking.format === "video" ? Video : MapPin

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

  const isDescriptionLong = booking.service.description && booking.service.description.split("\n").length > 5

  const handleReschedule = () => {
    setIsRescheduling(true)
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
    setShowRescheduleConfirm(true)
  }

  const confirmReschedule = () => {
    // Handle reschedule logic here
    console.log("Rescheduling to:", selectedRescheduleDate, selectedTimeSlot)
    setShowRescheduleConfirm(false)
    setIsRescheduling(false)
    onClose()
  }

  const confirmCancel = () => {
    // Handle cancel logic here
    console.log("Cancelling booking:", booking.id)
    setShowCancelConfirm(false)
    onClose()
  }

  const resetModal = () => {
    setIsRescheduling(false)
    setSelectedTimeSlot(null)
    setIsDescriptionExpanded(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Затемнение фона */}
        <div className="fixed inset-0 bg-black/80 transition-opacity" onClick={handleClose} />

        {/* Main Modal */}
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full max-w-md bg-white rounded-sm shadow-md overflow-hidden">
            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {!isRescheduling ? (
                  <>
                    {/* Service Info - Card-like content */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                              src={booking.specialist.photo || "/placeholder.jpg"}
                              alt={booking.specialist.name}
                          />
                          <AvatarFallback>{booking.specialist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">{booking.service.name}</h3>
                          {booking.status && (
                              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                <div
                                    className={cn(
                                        "w-4 h-4 rounded-sm flex-shrink-0",
                                        booking.status === "waiting" && "bg-pink-500",
                                        booking.status === "confirmed" && "bg-green-300",
                                    )}
                                />
                              </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {booking.specialist.name}
                        </p>
                      </div>
                    </div>

                    {/* Expandable Description */}
                    {booking.service.description && (
                        <div className="relative">
                          <div
                              className={cn(
                                  "text-sm text-gray-600 leading-relaxed transition-all duration-300",
                                  !isDescriptionExpanded && isDescriptionLong && "max-h-20 overflow-hidden",
                              )}
                          >
                            {booking.service.description}
                          </div>

                          {!isDescriptionExpanded && isDescriptionLong && (
                              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                          )}

                          {isDescriptionLong && (
                              <button
                                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                  className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 mt-2"
                              >
                                {isDescriptionExpanded ? (
                                    <>
                                      Скрыть <ChevronUp className="h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                      Показать больше <ChevronDown className="h-4 w-4" />
                                    </>
                                )}
                              </button>
                          )}
                        </div>
                    )}

                    {/* Session Duration and Date */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">Продолжительность: {booking.duration} минут</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">{formatDate(booking.date)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <FormatIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">
                      {booking.format === "video" ? "Видеозвонок" : "Очная встреча"}
                    </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={handleReschedule}>
                        Перебронировать
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => setShowCancelConfirm(true)}>
                        Отменить
                      </Button>
                    </div>
                  </>
              ) : (
                  <>
                    {/* Rescheduling Interface */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Выберите новое время</h3>

                      {/* Calendar Widget */}
                      <CalendarWidget selectedDate={selectedRescheduleDate} onDateSelect={setSelectedRescheduleDate} />

                      {/* Time Slot Grid */}
                      <TimeSlotGrid
                          selectedDate={selectedRescheduleDate}
                          bookingSlots={booking.slots}
                          onTimeSlotSelect={handleTimeSlotSelect}
                      />

                      <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => setIsRescheduling(false)}
                        >
                          Назад
                        </Button>
                      </div>
                    </div>
                  </>
              )}
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)} />
              <div className="relative bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Отменить бронирование?</h3>
                  <p className="text-gray-600">
                    Вы уверены, что хотите отменить это бронирование? Это действие нельзя отменить.
                  </p>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
                      Нет, оставить
                    </Button>
                    <Button variant="destructive" onClick={confirmCancel}>
                      Да, отменить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Reschedule Confirmation Modal */}
        {showRescheduleConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRescheduleConfirm(false)} />
              <div className="relative bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Подтвердить перебронирование</h3>
                  <p className="text-gray-600">
                    Вы хотите перенести бронирование на {selectedRescheduleDate.toLocaleDateString("ru-RU")} в{" "}
                    {selectedTimeSlot}?
                  </p>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setShowRescheduleConfirm(false)}>
                      Отмена
                    </Button>
                    <Button onClick={confirmReschedule}>Подтвердить</Button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}
