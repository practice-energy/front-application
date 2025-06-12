"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Video, MapPin, Clock, Calendar, Star, X, Check } from "lucide-react"
import type { Booking } from "@/types/booking"

interface BookingCardProps {
  booking: Booking
  onApprove?: (bookingId: string) => void
  onCancel?: (bookingId: string) => void
  onReview?: (bookingId: string) => void
}

export function BookingCard({ booking, onApprove, onCancel, onReview }: BookingCardProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusBadge = () => {
    switch (booking.status) {
      case "upcoming":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">Cancelled</Badge>
      default:
        return null
    }
  }

  const getFormatBadge = () => {
    if (booking.format === "video") {
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
          <Video className="w-3 h-3 mr-1" />
          Video
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
          <MapPin className="w-3 h-3 mr-1" />
          In-person
        </Badge>
      )
    }
  }

  const handleCardClick = () => {
    // Navigate to service page
    console.log(`Navigating to service: ${booking.serviceId}`)
  }

  const handleSpecialistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(`Navigating to specialist: ${booking.specialist.id}`)
  }

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onApprove?.(booking.id)
  }

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = () => {
    onCancel?.(booking.id)
    setShowCancelDialog(false)
  }

  const handleReview = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReview?.(booking.id)
  }

  return (
    <>
      <Card
        className="group cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Specialist Info */}
            <div className="flex items-start gap-3 flex-1">
              <Avatar className="h-12 w-12 cursor-pointer" onClick={handleSpecialistClick}>
                <AvatarImage src={booking.specialist.photo || "/placeholder.svg"} />
                <AvatarFallback>
                  {booking.specialist.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <button
                  onClick={handleSpecialistClick}
                  className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors truncate block"
                >
                  {booking.specialist.name}
                </button>
                <h3 className="text-base font-semibold text-gray-900 mt-1 group-hover:text-purple-600 transition-colors">
                  {booking.service.name}
                </h3>

                {/* Date and Time */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(booking.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(booking.date)} ({booking.duration}min)
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {getStatusBadge()}
                  {getFormatBadge()}
                </div>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end gap-3 sm:min-w-[120px]">
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">${booking.service.price}</div>
              </div>

              {/* Status-specific Actions */}
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {booking.status === "upcoming" && (
                  <>
                    {booking.requiresConfirmation && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove}>
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleCancelClick}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                )}

                {booking.status === "completed" && (
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleReview}>
                    <Star className="w-4 h-4 mr-1" />
                    Leave Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your booking with {booking.specialist.name}? This action cannot be undone
              and may incur cancellation fees.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
