"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import {
  Calendar,
  Clock,
  User,
  Check,
  X,
  Edit,
  MessageCircle,
  Video,
  MapPin,
  CreditCard,
  ArrowLeft,
  Phone,
  Mail,
  FileText,
  Star,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Booking {
  id: string
  clientName: string
  clientAvatar?: string
  service: string
  date: string
  time: string
  duration: string
  price: number
  status: "pending" | "confirmed" | "declined" | "completed"
  type: "video" | "in-person"
  location?: string
  notes?: string
  clientEmail: string
  clientPhone?: string
  clientRating?: number
  sessionNotes?: string
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { t } = useTranslations()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedBooking, setEditedBooking] = useState<Booking | null>(null)
  const [sessionNotes, setSessionNotes] = useState("")
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState("")
  const [rescheduleTime, setRescheduleTime] = useState("")

  useEffect(() => {
    if (!isAuthenticated || !user?.isSpecialist) {
      router.push("/")
    } else {
      // Mock data - in real app, fetch from API based on params.id
      const mockBookings = [
        {
          id: "1",
          clientName: "Sarah Johnson",
          clientAvatar: "/placeholder.svg?height=80&width=80",
          service: "Astrology Reading",
          date: "2025-01-28",
          time: "14:00",
          duration: "60 minutes",
          price: 120,
          status: "pending" as const,
          type: "video" as const,
          notes:
            "First time client, interested in career guidance. Has been feeling uncertain about career direction and wants insights into potential paths.",
          clientEmail: "sarah.j@email.com",
          clientPhone: "+1 (555) 123-4567",
          clientRating: 5,
          sessionNotes: "",
        },
        {
          id: "2",
          clientName: "Michael Chen",
          service: "Life Coaching Session",
          date: "2025-01-29",
          time: "10:00",
          duration: "90 minutes",
          price: 180,
          status: "confirmed" as const,
          type: "in-person" as const,
          location: "Downtown Office, 123 Main St",
          notes: "Follow-up session, working on goal setting and accountability systems.",
          clientEmail: "m.chen@email.com",
          clientPhone: "+1 (555) 234-5678",
          clientRating: 4,
        },
        {
          id: "3",
          clientName: "Emma Wilson",
          service: "Meditation Session",
          date: "2025-01-30",
          time: "16:30",
          duration: "45 minutes",
          price: 90,
          status: "pending" as const,
          type: "video" as const,
          notes: "Beginner level, anxiety management focus. Looking for practical techniques to manage daily stress.",
          clientEmail: "emma.w@email.com",
          clientRating: 5,
        },
      ]

      const foundBooking = mockBookings.find((b) => b.id === params.id)
      if (foundBooking) {
        setBooking(foundBooking)
        setSessionNotes(foundBooking.sessionNotes || "")
      } else {
        router.push("/bookings")
      }
    }
  }, [isAuthenticated, user, router, params.id])

  const handleApprove = () => {
    if (booking) {
      setBooking({ ...booking, status: "confirmed" })
    }
  }

  const handleDecline = () => {
    if (booking) {
      setBooking({ ...booking, status: "declined" })
    }
  }

  const handleEdit = () => {
    if (booking) {
      setEditedBooking({ ...booking })
      setEditDialogOpen(true)
    }
  }

  const handleSaveEdit = () => {
    if (editedBooking) {
      setBooking(editedBooking)
      setEditDialogOpen(false)
      setEditedBooking(null)
    }
  }

  const handleSaveSessionNotes = () => {
    if (booking) {
      setBooking({ ...booking, sessionNotes })
    }
  }

  const handleReschedule = () => {
    setRescheduleDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      case "declined":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-current text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (!isAuthenticated || !user?.isSpecialist || !booking) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/bookings")} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Booking Details</h1>
            <p className="text-muted-foreground mt-1">Manage this appointment</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Main Booking Card */}
          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    {booking.clientAvatar ? (
                      <img
                        src={booking.clientAvatar || "/placeholder.svg"}
                        alt={booking.clientName}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-semibold text-foreground">{booking.clientName}</h2>
                      <Badge className={`${getStatusColor(booking.status)} font-medium`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    {booking.clientRating && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">{renderStars(booking.clientRating)}</div>
                        <span className="text-sm text-muted-foreground">Client Rating</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {booking.status === "pending" && (
                    <>
                      <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white">
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDecline}
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>

              {/* Session Details */}
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Session Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{formatDate(booking.date)}</p>
                        <p className="text-sm text-muted-foreground">Session Date</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          {booking.time} ({booking.duration})
                        </p>
                        <p className="text-sm text-muted-foreground">Time & Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{booking.price} Centi</p>
                        <p className="text-sm text-muted-foreground">Session Fee</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{booking.service}</p>
                        <p className="text-sm text-muted-foreground">Service Type</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {booking.type === "video" ? (
                        <Video className="h-5 w-5 mr-3 text-muted-foreground" />
                      ) : (
                        <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          {booking.type === "video" ? "Video Call" : "In-Person"}
                        </p>
                        <p className="text-sm text-muted-foreground">Session Format</p>
                      </div>
                    </div>
                    {booking.location && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{booking.location}</p>
                          <p className="text-sm text-muted-foreground">Meeting Location</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Client Contact */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Client Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{booking.clientEmail}</p>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                    </div>
                  </div>
                  {booking.clientPhone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{booking.clientPhone}</p>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Notes */}
              {booking.notes && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Client Notes</h3>
                  <p className="text-foreground">{booking.notes}</p>
                </div>
              )}

              {/* Session Notes */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Session Notes</h3>
                <Textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Add notes about this session, client progress, or follow-up items..."
                  rows={4}
                  className="mb-3"
                />
                <Button onClick={handleSaveSessionNotes} size="sm">
                  Save Notes
                </Button>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push(`/specialist-messages/${booking.id}`)}
              className="bg-gradient-to-r from-amber-500 to-orange-600"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Client
            </Button>
            {booking.type === "video" && booking.status === "confirmed" && (
              <Button variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>
            )}
            <Button variant="outline" onClick={handleReschedule}>
              <Calendar className="h-4 w-4 mr-2" />
              Reschedule
            </Button>
          </div>
        </div>

        {/* Edit Booking Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Booking Details</DialogTitle>
              <DialogDescription>Update the booking information for {booking.clientName}</DialogDescription>
            </DialogHeader>

            {editedBooking && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={editedBooking.date}
                      onChange={(e) => setEditedBooking({ ...editedBooking, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={editedBooking.time}
                      onChange={(e) => setEditedBooking({ ...editedBooking, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      value={editedBooking.duration}
                      onValueChange={(value) => setEditedBooking({ ...editedBooking, duration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30 minutes">30 minutes</SelectItem>
                        <SelectItem value="45 minutes">45 minutes</SelectItem>
                        <SelectItem value="60 minutes">60 minutes</SelectItem>
                        <SelectItem value="90 minutes">90 minutes</SelectItem>
                        <SelectItem value="120 minutes">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price (Centi)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editedBooking.price}
                      onChange={(e) => setEditedBooking({ ...editedBooking, price: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="type">Session Type</Label>
                  <Select
                    value={editedBooking.type}
                    onValueChange={(value: "video" | "in-person") =>
                      setEditedBooking({ ...editedBooking, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editedBooking.type === "in-person" && (
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedBooking.location || ""}
                      onChange={(e) => setEditedBooking({ ...editedBooking, location: e.target.value })}
                      placeholder="Enter meeting location"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editedBooking.notes || ""}
                    onChange={(e) => setEditedBooking({ ...editedBooking, notes: e.target.value })}
                    placeholder="Add any additional notes..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-amber-500 to-orange-600">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reschedule Booking Dialog */}
        <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reschedule Booking</DialogTitle>
              <DialogDescription>
                Select a new date and time for the session with {booking.clientName}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="reschedule-date">New Date</Label>
                <Input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="reschedule-time">New Time</Label>
                <Input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (rescheduleDate && rescheduleTime && booking) {
                    setBooking({ ...booking, date: rescheduleDate, time: rescheduleTime })
                    setRescheduleDialogOpen(false)
                    setRescheduleDate("")
                    setRescheduleTime("")
                  }
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-600"
                disabled={!rescheduleDate || !rescheduleTime}
              >
                Reschedule Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
