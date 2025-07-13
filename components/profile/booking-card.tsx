"use client"

import type React from "react"

import { useState } from "react"
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
import { Video, Clock, Calendar, Star, X, Check, Users } from "lucide-react"
import { format } from "date-fns"
import type { Booking } from "@/types/booking"
import { useRouter } from "next/navigation"

interface BookingCardProps {
  booking: Booking
  onApprove?: (bookingId: string) => void
  onCancel?: (bookingId: string) => void
  onReview?: (bookingId: string) => void
}

export function BookingCard({ booking, onApprove, onCancel, onReview }: BookingCardProps) {
  const router = useRouter()
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

  // Convert unix timestamp to time string
  const formatDuration = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return format(date, "HH:mm")
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
        <Badge variant="outline" className="text-xs px-2 py-1">
          <Video className="w-3 h-3 mr-1" />
          Видео
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="text-xs px-2 py-1">
          <Users className="w-3 h-3 mr-1" />
          Очно
        </Badge>
      )
    }
  }

  const handleServiceClick = () => {
    router.push(`/service/${booking.service.id}`)
  }

  const handleSpecialistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/specialist/${booking.specialist.id}`)
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
      <div className="flex justify-center">
        <Card className="group hover:shadow-md transition-all duration-200 bg-white border border-gray-200 w-full max-w-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Date section - moved to left edge */}
              <div className="flex flex-col items-start text-sm text-gray-600 min-w-0 mr-3">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatTime(booking.date)} ({formatDuration(booking.duration)})
                  </span>
                </div>
                <div className="mt-1">{getFormatBadge()}</div>
              </div>

              {/* Specialist Photo */}
              <button onClick={handleSpecialistClick} className="shrink-0">
                <img
                  src={booking.specialist.photo || "/placeholder.svg?height=48&width=48"}
                  alt={booking.specialist.name}
                  className="w-12 h-12 rounded-sm object-cover hover:opacity-80 transition-opacity"
                />
              </button>

              {/* Main Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleServiceClick}
                    className="text-base font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                  >
                    {booking.service.name}
                  </button>
                  <div className="flex items-center gap-2">
                    {getStatusBadge()}
                    {booking.status === "upcoming" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        onClick={handleCancelClick}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSpecialistClick}
                  className="text-sm text-gray-600 hover:text-purple-600 hover:underline transition-colors"
                >
                  {booking.specialist.name}
                </button>

                {/* Status-specific Actions */}
                {booking.status === "upcoming" && booking.requiresConfirmation && (
                  <div className="pt-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove}>
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="pt-2">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleReview}>
                      <Star className="w-4 h-4 mr-1" />
                      Leave Review
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
