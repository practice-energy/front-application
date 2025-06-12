"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, MessageCircle } from "lucide-react"
import { ScheduleSessionDialog } from "@/components/schedule-session-dialog"
import { BookingSessionDialog } from "@/components/booking-session-dialog"
import { useToast } from "@/hooks/use-toast"

interface Meeting {
  id: string
  title: string
  specialist: string
  date: string
  time: string
  duration: string
  type: "video" | "in-person"
  location?: string
  status: "upcoming" | "completed" | "cancelled"
  price: number
}

export function ProfileCalendar() {
  const { toast } = useToast()
  const [filter, setFilter] = useState<"upcoming" | "all" | "completed" | "cancelled">("all")
  const [rescheduleDialog, setRescheduleDialog] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [bookingDialog, setBookingDialog] = useState(false)
  const [selectedSpecialistForBooking, setSelectedSpecialistForBooking] = useState<string>("")
  const router = useRouter()

  const meetings: Meeting[] = [
    {
      id: "1",
      title: "Astrology Reading",
      specialist: "Elena Rodriguez",
      date: "2024-01-28",
      time: "14:00",
      duration: "60 minutes",
      type: "video",
      status: "upcoming",
      price: 120,
    },
    {
      id: "2",
      title: "Life Coaching Session",
      specialist: "Marcus Thompson",
      date: "2024-01-25",
      time: "10:00",
      duration: "45 minutes",
      type: "video",
      status: "completed",
      price: 95,
    },
    {
      id: "3",
      title: "Meditation Session",
      specialist: "Sarah Chen",
      date: "2024-01-30",
      time: "16:30",
      duration: "30 minutes",
      type: "in-person",
      location: "Wellness Center, Downtown",
      status: "upcoming",
      price: 75,
    },
    {
      id: "4",
      title: "Spiritual Consultation",
      specialist: "David Kumar",
      date: "2024-01-20",
      time: "11:00",
      duration: "90 minutes",
      type: "video",
      status: "cancelled",
      price: 150,
    },
  ]

  const filteredMeetings = meetings.filter((meeting) => {
    if (filter === "all") return true
    return meeting.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handleMessage = (specialistName: string) => {
    // Find specialist ID based on name (in real app, this would be stored)
    const specialistId =
      specialistName === "Elena Rodriguez"
        ? "1"
        : specialistName === "Marcus Thompson"
          ? "2"
          : specialistName === "Sarah Chen"
            ? "3"
            : "4"
    router.push(`/messages/${specialistId}`)
  }

  const handleReschedule = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setRescheduleDialog(true)
  }

  const handleLeaveReview = (meetingId: string) => {
    router.push(`/review/${meetingId}`)
  }

  const handleRescheduleBooking = (bookingData: any) => {
    console.log("Rescheduling booking:", bookingData)
    setRescheduleDialog(false)
    setSelectedMeeting(null)
    // In real app, this would update the meeting
  }

  const handleCancel = (meetingId: string) => {
    // Show confirmation dialog
    if (confirm("Cancel this meeting?")) {
      // In real app, this would call an API to cancel the meeting
      console.log("Cancelling meeting:", meetingId)
      toast({
        title: "Meeting canceled",
        description: "Your meeting has been successfully canceled",
        duration: 3000,
      })
      // Update meeting status in state or refetch data
      // For now, just reload - in real app would update state
      window.location.reload()
    }
  }

  const handleBookAgain = (meeting: Meeting) => {
    setSelectedSpecialistForBooking(meeting.specialist)
    setBookingDialog(true)
  }

  const handleNewBooking = (bookingData: any) => {
    console.log("Creating new booking:", bookingData)
    setBookingDialog(false)
    setSelectedSpecialistForBooking("")
    // In real app, this would create a new booking
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Filter Tabs - Apply Airbnb-inspired styling */}
      <div className="flex space-x-1 bg-gray-50 p-1 rounded-lg" style={{ borderColor: "#F3F4F6" }}>
        {[
          { key: "all", label: "All Sessions" },
          { key: "upcoming", label: "Upcoming" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key ? "text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
            style={{
              backgroundColor: filter === tab.key ? "#8B5CF6" : "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <Card className="p-8 text-center" style={{ backgroundColor: "#FFFFFF", borderColor: "#F3F4F6" }}>
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
            <p className="text-muted-foreground">
              {filter === "all" ? "You haven't booked any sessions yet." : `No ${filter} sessions found.`}
            </p>
          </Card>
        ) : (
          filteredMeetings.map((meeting) => (
            <Card key={meeting.id} className="p-6" style={{ backgroundColor: "#FFFFFF", borderColor: "#F3F4F6" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{meeting.title}</h3>
                    <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{meeting.specialist}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{meeting.price} Centi</p>
                  <p className="text-sm text-muted-foreground">{meeting.duration}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(meeting.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{formatTime(meeting.time)}</span>
                </div>
                {meeting.type === "in-person" && meeting.location && (
                  <div className="flex items-center space-x-2 text-muted-foreground md:col-span-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{meeting.location}</span>
                  </div>
                )}
              </div>

              <div
                className="flex items-center justify-between pt-4"
                style={{ borderTopColor: "#F3F4F6", borderTopWidth: "1px" }}
              >
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {meeting.type === "video" ? "Video Call" : "In-Person"}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  {meeting.status === "upcoming" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleMessage(meeting.specialist)}>
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleReschedule(meeting)}>
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(meeting.id)}
                        style={{ backgroundColor: "#8B5CF6", color: "white", borderColor: "#8B5CF6" }}
                        className="hover:opacity-90"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {meeting.status === "completed" && (
                    <Button variant="outline" size="sm" onClick={() => handleLeaveReview(meeting.id)}>
                      Leave Review
                    </Button>
                  )}
                  {meeting.status === "cancelled" && (
                    <Button variant="outline" size="sm" onClick={() => handleBookAgain(meeting)}>
                      Book Again
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Reschedule Dialog */}
      {selectedMeeting && (
        <ScheduleSessionDialog
          open={rescheduleDialog}
          onOpenChange={setRescheduleDialog}
          client={{
            id: "current-user",
            name: "You",
            service: selectedMeeting.title,
          }}
          specialist={{
            id: "specialist-1",
            name: selectedMeeting.specialist,
            services: [
              { name: selectedMeeting.title, duration: selectedMeeting.duration, price: selectedMeeting.price },
            ],
          }}
          isReschedule={true}
          onCreateBooking={handleRescheduleBooking}
        />
      )}

      {/* Booking Dialog */}
      <BookingSessionDialog
        open={bookingDialog}
        onOpenChange={setBookingDialog}
        specialistName={selectedSpecialistForBooking}
        onCreateBooking={handleNewBooking}
      />
    </div>
  )
}
