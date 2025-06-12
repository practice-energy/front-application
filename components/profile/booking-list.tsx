"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { FolderOpen } from "lucide-react"
import { BookingCard } from "./booking-card"
import type { Booking, BookingStatus } from "@/types/booking"

interface BookingListProps {
  bookings: Booking[]
  onApprove?: (bookingId: string) => void
  onCancel?: (bookingId: string) => void
  onReview?: (bookingId: string) => void
}

export function BookingList({ bookings, onApprove, onCancel, onReview }: BookingListProps) {
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("upcoming")

  // Group bookings by status and sort by date
  const groupedBookings = useMemo(() => {
    const groups = {
      upcoming: bookings.filter((b) => b.status === "upcoming").sort((a, b) => a.date.getTime() - b.date.getTime()),
      completed: bookings.filter((b) => b.status === "completed").sort((a, b) => b.date.getTime() - a.date.getTime()),
      cancelled: bookings.filter((b) => b.status === "cancelled").sort((a, b) => b.date.getTime() - a.date.getTime()),
    }
    return groups
  }, [bookings])

  const getTabCount = (status: BookingStatus) => {
    return groupedBookings[status].length
  }

  const renderEmptyState = (status: BookingStatus) => {
    const messages = {
      upcoming: {
        title: "No upcoming bookings",
        description: "You don't have any upcoming sessions scheduled. Book a session to get started!",
      },
      completed: {
        title: "No completed sessions",
        description: "Your completed sessions will appear here after you've attended them.",
      },
      cancelled: {
        title: "No cancelled bookings",
        description: "Any cancelled bookings will appear here.",
      },
    }

    return (
      <Card className="bg-white">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{messages[status].title}</h3>
          <p className="text-gray-600 text-center max-w-md">{messages[status].description}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingStatus)}>
        <TabsList className="grid w-full grid-cols-3 lg:w-96 bg-gray-100">
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-700 relative"
          >
            Upcoming
            {getTabCount("upcoming") > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                {getTabCount("upcoming")}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-700 relative"
          >
            Completed
            {getTabCount("completed") > 0 && (
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                {getTabCount("completed")}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-700 relative"
          >
            Cancelled
            {getTabCount("cancelled") > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {getTabCount("cancelled")}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {groupedBookings.upcoming.length === 0 ? (
            renderEmptyState("upcoming")
          ) : (
            <div className="space-y-4">
              {groupedBookings.upcoming.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onApprove={onApprove} onCancel={onCancel} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {groupedBookings.completed.length === 0 ? (
            renderEmptyState("completed")
          ) : (
            <div className="space-y-4">
              {groupedBookings.completed.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onReview={onReview} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {groupedBookings.cancelled.length === 0 ? (
            renderEmptyState("cancelled")
          ) : (
            <div className="space-y-4">
              {groupedBookings.cancelled.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
