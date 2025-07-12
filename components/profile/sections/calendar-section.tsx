"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, X, Check, Video, Users } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { mockBookings } from "@/services/booking-data"
import type { Booking } from "@/types/booking"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export function CalendarSection() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all")
  const [isLoading, setIsLoading] = useState(false)

  // Add these handler functions after the existing state declarations
  const handleApprove = (bookingId: string) => {
    // Implement approval logic
    console.log("Approving booking:", bookingId)
  }

  const handleRebook = (bookingId: string) => {
    // Implement rebooking logic
    console.log("Rebooking:", bookingId)
  }

  const handleCancel = (bookingId: string) => {
    // Implement cancellation logic
    console.log("Canceling booking:", bookingId)
  }

  const handleSpecialistClick = (specialistId: string) => {
    router.push(`/specialist/${specialistId}`)
  }

  const handleServiceClick = (serviceId: string) => {
    router.push(`/service/${serviceId}`)
  }

  // Convert unix timestamp to time string
  const formatDuration = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return format(date, "HH:mm")
  }

  // Group bookings by date
  const groupedBookings = useMemo(() => {
    const filtered =
        selectedFilter === "all" ? mockBookings : mockBookings.filter((booking) => booking.status === selectedFilter)

    const grouped = filtered.reduce(
        (acc, booking) => {
          const date = booking.date
          if (!acc[date.toDateString()]) {
            acc[date.toDateString()] = []
          }
          acc[date.toDateString()].push(booking)
          return acc
        },
        {} as Record<string, Booking[]>,
    )

    // Sort dates
    const sortedDates = Object.keys(grouped).sort()
    const result: { date: string; bookings: Booking[] }[] = []

    sortedDates.forEach((date) => {
      result.push({
        date,
        bookings: grouped[date].sort((a, b) => a.date.getTime()),
      })
    })

    return result
  }, [selectedFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-violet-100 text-violet-800"
      case "completed":
        return "bg-violet-100 text-violet-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Предстоящий"
      case "completed":
        return "Завершен"
      case "cancelled":
        return "Отменен"
      default:
        return status
    }
  }

  const CalendarSkeleton = () => (
      <div className="space-y-6">
        {[...Array(3)].map((_, dateIndex) => (
            <div key={dateIndex} className="space-y-3">
              {/* Date Header Skeleton */}
              <Skeleton className="h-6 w-48 rounded-sm" />

              {/* Bookings Skeleton */}
              <div className="space-y-3">
                {[...Array(2)].map((_, cardIndex) => (
                    <Card key={cardIndex} className="w-full  justify-center max-w-[600px]"> {/* Кратно 3 */}
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3">
                          {/* Top row - photo and status */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              {/* Specialist Photo Skeleton */}
                              <Skeleton className="w-12 h-12 rounded-sm" />
                              {/* Name Skeleton - теперь слева от фото */}
                              <Skeleton className="h-5 w-32 rounded-sm" />
                            </div>
                            {/* Status Skeleton */}
                            <Skeleton className="h-6 w-20 rounded-sm" />
                          </div>

                          {/* Service Skeleton */}
                          <Skeleton className="h-5 w-48 rounded-sm" />

                          {/* Details Skeleton */}
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-4 w-16 rounded-sm" />
                            <Skeleton className="h-4 w-12 rounded-sm" />
                            <Skeleton className="h-5 w-16 rounded-sm" />
                          </div>

                          {/* Location Skeleton */}
                          <Skeleton className="h-4 w-40 rounded-sm" />

                          {/* Action Buttons Skeleton */}
                          <div className="flex justify-between pt-2">
                            <Skeleton className="h-9 w-24 rounded-sm" />
                            <Skeleton className="h-9 w-24 rounded-sm" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
        ))}
      </div>
  )

  if (isLoading) {
    return <CalendarSkeleton />
  }

  return (
      <div className="space-y-6">
        <div className="space-y-6">
          {groupedBookings.length === 0 ? (
              <div className="flex justify-center">
                <Card className="w-full max-w-[600px]"> {/* Кратно 3 */}
                  <CardContent className="flex flex-col items-center justify-center">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Нет бронирований</h3>
                  </CardContent>
                </Card>
              </div>
          ) : (
              groupedBookings.map(({ date, bookings }) => (
                  <div key={date} className="space-y-3">
                    {/* Date Header */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {format(date, "d MMMM yyyy", { locale: ru })}
                    </h3>

                    {/* Bookings */}
                    <div className="space-y-3 justify-center items-center">
                      {bookings.map((booking) => (
                          <Card key={booking.id} className="w-full max-w-[600px] justify-center hover:shadow-md transition-shadow"> {/* Кратно 3 */}
                            <CardContent className="p-4">
                              <div className="flex flex-col gap-3">
                                {/* Top row - photo, name and status */}
                                <div className="flex justify-between items-start">
                                    <button
                                        onClick={() => handleSpecialistClick(booking.specialist.id)}
                                        className="shrink-0 flex items-center gap-3"
                                    >
                                      <img
                                          src={booking.specialist.photo || "/placeholder.svg?height=48&width=48"}
                                          alt={booking.specialist.name}
                                          className="w-12 h-12 rounded-sm object-cover hover:opacity-80 transition-opacity"
                                      />
                                      <div className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-purple-600 transition-colors text-left">
                                        {booking.specialist.name}
                                      </div>
                                    </button>

                                  <div>
                                    <Badge className={`text-xs px-2 py-1 rounded-sm gap-3 ${getStatusColor(booking.status)}`}>
                                      {getStatusText(booking.status)}
                                    </Badge>

                                    <Badge variant="outline" className="text-xs px-2 py-1 rounded-sm">
                                      {booking.format === "video" ? (
                                          <>
                                            <Video className="w-3 h-3 mr-1" />
                                            Видео
                                          </>
                                      ) : (
                                          <>
                                            <Users className="w-3 h-3 mr-1" />
                                            Очно
                                          </>
                                      )}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Service name */}
                                <button
                                    onClick={() => handleServiceClick(booking.service.id)}
                                    className="text-base font-semibold text-gray-900 dark:text-gray-100 hover:text-purple-600 transition-colors text-left"
                                >
                                  {booking.service.name}
                                </button>

                                {/* Time and format */}
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDuration(booking.duration)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>{format(booking.date, "HH:mm", { locale: ru })}</span>
                                  </div>
                                </div>

                                {/* Location */}
                                {booking.location && (
                                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                      <MapPin className="h-4 w-4" />
                                      <span>{booking.location}</span>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex justify-between pt-2">
                                  {booking.status === "upcoming" && booking.requiresConfirmation && (
                                      <Button
                                          onClick={() => handleApprove(booking.id)}
                                          size="sm"
                                          className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors px-3 py-1 rounded-md bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                                      >
                                        <Check className="w-4 h-4 inline mr-1" />
                                        Подтвердить
                                      </Button>
                                  )}

                                  {booking.status === "upcoming" && (
                                      <Button
                                          onClick={() => handleCancel(booking.id)}
                                          size="sm"
                                          variant="outline"
                                          className="text-gray-600 bg-transparent"
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Отменить
                                      </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                      ))}
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  )
}
