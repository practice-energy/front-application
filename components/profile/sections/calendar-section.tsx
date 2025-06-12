"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { List, CalendarIcon, FolderOpen, Check, X, Star, Video, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockBookings } from "@/services/booking-data"
import { AirbnbCalendar } from "@/components/airbnb-calendar"
import type { Booking, BookingStatus, ViewMode } from "@/types/booking"

export function CalendarSection() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [activeTab, setActiveTab] = useState<BookingStatus>("upcoming")
  const [bookings, setBookings] = useState(mockBookings)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null)

  // Group bookings by status
  const groupedBookings = useMemo(() => {
    const groups = {
      upcoming: bookings.filter((b) => b.status === "upcoming").sort((a, b) => a.date.getTime() - b.date.getTime()),
      completed: bookings.filter((b) => b.status === "completed").sort((a, b) => b.date.getTime() - a.date.getTime()),
      cancelled: bookings.filter((b) => b.status === "cancelled").sort((a, b) => b.date.getTime() - a.date.getTime()),
    }
    return groups
  }, [bookings])

  // Get bookings for selected date
  const getSelectedDateBookings = () => {
    if (!selectedDate) return []
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date)
      return bookingDate.toDateString() === selectedDate.toDateString()
    })
  }

  // Event handlers
  const handleApprove = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, requiresConfirmation: false } : booking)),
    )
  }

  const handleCancel = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking)),
    )
    setCancellingBooking(null)
  }

  const handleCancelClick = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCancellingBooking(bookingId)
  }

  const handleReview = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(`Opening review modal for booking: ${bookingId}`)
  }

  const handleCardClick = (serviceId: string) => {
    // Navigate to service page
    window.location.href = `/service/${serviceId}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Render booking card in specialist services style
  const renderBookingCard = (booking: Booking) => {
    return (
      <Card
        key={booking.id}
        className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 overflow-hidden w-full"
        style={{ width: "280px" }}
        onClick={() => handleCardClick(booking.serviceId)}
      >
        <CardContent className="p-0">
          {/* Service image/photo at top */}
          <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
            <img
              src={booking.specialist.photo || "/placeholder.svg?height=160&width=280&query=service"}
              alt={booking.service.name}
              className="w-full h-full object-cover"
            />
            {/* Price badge */}
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-white text-gray-900 border border-gray-200 font-bold text-base px-3 py-1 shadow-sm">
                ${booking.service.price}
              </Badge>
            </div>
          </div>

          {/* Service details */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={booking.specialist.photo || "/placeholder.svg"} />
                <AvatarFallback>
                  {booking.specialist.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{booking.specialist.name}</span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
              {booking.service.name}
            </h3>

            {/* Date and time */}
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <Clock className="w-4 h-4" />
              <span>
                {formatDate(booking.date)} at {formatTime(booking.date)} ({booking.duration}min)
              </span>
            </div>

            {/* Format and status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                {booking.format === "video" ? (
                  <>
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>In-person</span>
                  </>
                )}
              </div>
              <Badge
                className={cn(
                  "text-xs font-medium",
                  booking.status === "upcoming" && "bg-violet-100 text-violet-700",
                  booking.status === "completed" && "bg-emerald-100 text-emerald-700",
                  booking.status === "cancelled" && "bg-gray-100 text-gray-700",
                )}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {booking.status === "upcoming" && (
                <>
                  {booking.requiresConfirmation && (
                    <Button
                      size="sm"
                      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white border border-violet-600"
                      onClick={(e) => handleApprove(booking.id, e)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-gray-600 border-gray-300 hover:bg-gray-50"
                    onClick={(e) => handleCancelClick(booking.id, e)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </>
              )}

              {booking.status === "completed" && (
                <Button
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600"
                  onClick={(e) => handleReview(booking.id, e)}
                >
                  <Star className="w-4 h-4 mr-1" />
                  Leave Review
                </Button>
              )}

              {booking.status === "cancelled" && (
                <div className="w-full text-center text-sm text-gray-500 py-2">No actions available</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render empty state
  const renderEmptyState = (status: BookingStatus) => {
    const messages = {
      upcoming: {
        title: "No upcoming bookings",
        description: "You don't have any upcoming sessions scheduled.",
      },
      completed: {
        title: "No completed sessions",
        description: "Your completed sessions will appear here.",
      },
      cancelled: {
        title: "No cancelled bookings",
        description: "Any cancelled bookings will appear here.",
      },
    }

    return (
      <Card className="bg-white col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{messages[status].title}</h3>
          <p className="text-gray-600 text-center max-w-md">{messages[status].description}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar & Bookings</h1>
          <p className="text-gray-600">Manage your sessions and appointments</p>
        </div>

        {/* View Toggle - Icons Only */}
        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={cn("p-2", viewMode === "list" && "bg-violet-600 hover:bg-violet-700 text-white")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("calendar")}
            className={cn("p-2", viewMode === "calendar" && "bg-violet-600 hover:bg-violet-700 text-white")}
          >
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Bookings Section */}
        <div className={cn("flex-1", viewMode === "calendar" ? "lg:w-2/3" : "w-full")}>
          {viewMode === "list" ? (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingStatus)}>
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger
                  value="upcoming"
                  className="data-[state=active]:bg-white data-[state=active]:text-violet-700 relative"
                >
                  Upcoming
                  {groupedBookings.upcoming.length > 0 && (
                    <Badge className="ml-2 bg-violet-100 text-violet-700 text-xs px-2 py-0.5">
                      {groupedBookings.upcoming.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-white data-[state=active]:text-violet-700 relative"
                >
                  Completed
                  {groupedBookings.completed.length > 0 && (
                    <Badge className="ml-2 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">
                      {groupedBookings.completed.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="data-[state=active]:bg-white data-[state=active]:text-violet-700 relative"
                >
                  Cancelled
                  {groupedBookings.cancelled.length > 0 && (
                    <Badge className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5">
                      {groupedBookings.cancelled.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-6">
                {groupedBookings.upcoming.length === 0 ? (
                  renderEmptyState("upcoming")
                ) : (
                  <div className="relative">
                    <div className="flex flex-wrap gap-4 max-h-[700px] overflow-y-auto p-1 pb-8">
                      {groupedBookings.upcoming.map((booking) => renderBookingCard(booking))}
                    </div>
                    {/* Blur bottom border */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {groupedBookings.completed.length === 0 ? (
                  renderEmptyState("completed")
                ) : (
                  <div className="relative">
                    <div className="flex flex-wrap gap-4 max-h-[700px] overflow-y-auto p-1 pb-8">
                      {groupedBookings.completed.map((booking) => renderBookingCard(booking))}
                    </div>
                    {/* Blur bottom border */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="mt-6">
                {groupedBookings.cancelled.length === 0 ? (
                  renderEmptyState("cancelled")
                ) : (
                  <div className="relative">
                    <div className="flex flex-wrap gap-4 max-h-[700px] overflow-y-auto p-1 pb-8">
                      {groupedBookings.cancelled.map((booking) => renderBookingCard(booking))}
                    </div>
                    {/* Blur bottom border */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            /* Calendar View - Show selected date bookings */
            <div className="space-y-6">
              {selectedDate ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h2>
                    <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                      View All
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="flex flex-wrap gap-4 max-h-[700px] overflow-y-auto p-1 pb-8">
                      {getSelectedDateBookings().length === 0 ? (
                        <Card className="bg-white col-span-full w-full">
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings for this date</h3>
                            <p className="text-gray-600 text-center">Select another date to view bookings.</p>
                          </CardContent>
                        </Card>
                      ) : (
                        getSelectedDateBookings().map((booking) => renderBookingCard(booking))
                      )}
                    </div>
                    {/* Blur bottom border */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                  </div>
                </>
              ) : (
                <div className="relative">
                  <div className="flex flex-wrap gap-4 max-h-[700px] overflow-y-auto p-1 pb-8">
                    {bookings.map((booking) => renderBookingCard(booking))}
                  </div>
                  {/* Blur bottom border */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Calendar Section - Only shown in calendar mode, fixed size */}
        {viewMode === "calendar" && (
          <div className="lg:w-1/3 lg:min-w-[320px]">
            <div className="lg:sticky lg:top-8">
              <Card className="bg-white">
                <CardContent className="p-4">
                  <div className="w-full" style={{ minWidth: "300px" }}>
                    <AirbnbCalendar
                      selectedDate={selectedDate || new Date()}
                      onDateSelect={(date) => setSelectedDate(date)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={!!cancellingBooking} onOpenChange={() => setCancellingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone and may incur cancellation
              fees.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancellingBooking(null)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={() => cancellingBooking && handleCancel(cancellingBooking)}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
