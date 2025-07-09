"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, User, CreditCard, CheckCircle } from "lucide-react"
import { useTranslations } from "@/hooks/use-translations"
import {Service, Specialist} from "@/types/common";

interface BookingConfirmationProps {
  isOpen: boolean
  onClose: () => void
  bookingDetails: {
    specialist: Specialist
    service: Service
    date: string
    time: string
  }
}

export function BookingConfirmation({ isOpen, onClose, bookingDetails }: BookingConfirmationProps) {
  const { t } = useTranslations()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleConfirmBooking = async () => {
    setIsConfirming(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConfirming(false)
    setIsConfirmed(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const generateBookingReference = () => {
    return `BK${Date.now().toString().slice(-6)}`
  }

  if (isConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("booking.bookingSuccessful")}</h2>
            <p className="text-gray-600 mb-6">{t("booking.bookingConfirmed")}</p>

            <Card className="p-4 bg-gray-50 mb-6">
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{t("booking.bookingReference")}:</span>
                  <span className="font-mono">{generateBookingReference()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("booking.date")}:</span>
                  <span>{formatDate(bookingDetails.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t("booking.time")}:</span>
                  <span>{bookingDetails.time}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <h3 className="font-semibold text-gray-900">{t("booking.whatNext")}</h3>
              <p>• {t("booking.specialistWillContact")}</p>
              <p>• {t("booking.sessionReminder")}</p>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                {t("booking.backToHome")}
              </Button>
              <Button
                onClick={() => (window.location.href = "/profile?section=calendar")}
                className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600"
              >
                {t("booking.viewBookings")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("booking.confirmation")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">{t("booking.bookingDetails")}</h3>

            {/* Specialist Info */}
            <Card className="p-4 mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={bookingDetails.specialist.avatar || "/placeholder.svg"}
                  alt={bookingDetails.specialist.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{bookingDetails.specialist.name}</h4>
                  <p className="text-sm text-gray-600">{bookingDetails.specialist.title}</p>
                </div>
              </div>
            </Card>

            {/* Booking Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{t("booking.service")}:</span>
                </div>
                <span className="text-sm">{bookingDetails.service.title}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{t("booking.date")}:</span>
                </div>
                <span className="text-sm">{formatDate(bookingDetails.date)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{t("booking.time")}:</span>
                </div>
                <span className="text-sm">{bookingDetails.time}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{t("booking.duration")}:</span>
                </div>
                <span className="text-sm">{bookingDetails.service.duration}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{t("booking.price")}:</span>
                </div>
                <Badge className="bg-violet-100 text-violet-700">{bookingDetails.service.price} Centi</Badge>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">{t("booking.paymentMethod")}:</span>
              </div>
              <span className="text-sm">Centi Wallet</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <span className="font-semibold">{t("booking.totalCost")}:</span>
              <span className="font-semibold text-violet-600">{bookingDetails.service.price} Centi</span>
            </div>
          </Card>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirmBooking}
            disabled={isConfirming}
            className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700"
          >
            {isConfirming ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("common.loading")}
              </div>
            ) : (
              t("booking.confirmBooking")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
