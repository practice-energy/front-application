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
import { Calendar, Clock, User, Check, X, Edit, MessageCircle, Video, MapPin, CreditCard, Filter } from "lucide-react"
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
}

export default function BookingsPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { t } = useTranslations()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editedBooking, setEditedBooking] = useState<Booking | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (!isAuthenticated || !user?.isSpecialist) {
      router.push("/")
    } else {
      // Mock data - in real app, fetch from API
      setBookings([
        {
          id: "1",
          clientName: "Sarah Johnson",
          service: "Astrology Reading",
          date: "2025-01-28",
          time: "14:00",
          duration: "60 minutes",
          price: 120,
          status: "pending",
          type: "video",
          notes: "First time client, interested in career guidance",
          clientEmail: "sarah.j@email.com",
          clientPhone: "+1 (555) 123-4567",
        },
        {
          id: "2",
          clientName: "Michael Chen",
          service: "Life Coaching Session",
          date: "2025-01-29",
          time: "10:00",
          duration: "90 minutes",
          price: 180,
          status: "confirmed",
          type: "in-person",
          location: "Downtown Office, 123 Main St",
          notes: "Follow-up session, working on goal setting",
          clientEmail: "m.chen@email.com",
        },
        {
          id: "3",
          clientName: "Emma Wilson",
          service: "Meditation Session",
          date: "2025-01-30",
          time: "16:30",
          duration: "45 minutes",
          price: 90,
          status: "pending",
          type: "video",
          notes: "Beginner level, anxiety management focus",
          clientEmail: "emma.w@email.com",
        },
        {
          id: "4",
          clientName: "David Rodriguez",
          service: "Spiritual Consultation",
          date: "2025-01-25",
          time: "11:00",
          duration: "75 minutes",
          price: 150,
          status: "completed",
          type: "video",
          notes: "Regular client, monthly check-in",
          clientEmail: "david.r@email.com",
        },
      ])
    }
  }, [isAuthenticated, user, router])

  const handleApprove = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "confirmed" as const } : booking)),
    )
  }

  const handleDecline = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "declined" as const } : booking)),
    )
  }

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking)
    setEditedBooking({ ...booking })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editedBooking) {
      setBookings((prev) => prev.map((booking) => (booking.id === editedBooking.id ? editedBooking : booking)))
      setEditDialogOpen(false)
      setSelectedBooking(null)
      setEditedBooking(null)
    }
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

  const filteredBookings = bookings.filter((booking) => {
    const statusFilter = filterStatus === "all" ? booking.status !== "completed" : booking.status === filterStatus
    return statusFilter
  })

  if (!isAuthenticated || !user?.isSpecialist) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("specialist.bookings")}</h1>
            <p className="text-muted-foreground mt-1">{t("specialist.manageBookings")}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("specialist.activeBookings")}</SelectItem>
                <SelectItem value="pending">{t("specialist.pending")}</SelectItem>
                <SelectItem value="confirmed">{t("specialist.confirmed")}</SelectItem>
                <SelectItem value="completed">{t("specialist.completed")}</SelectItem>
                <SelectItem value="declined">{t("specialist.declined")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Stats */}
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
              >
                {bookings.filter((b) => b.status === "pending").length} {t("specialist.pending")}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                {bookings.filter((b) => b.status === "confirmed").length} {t("specialist.confirmed")}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => router.push(`/booking/${booking.id}`)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="h-7 w-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-foreground">{booking.clientName}</h3>
                        <Badge className={`${getStatusColor(booking.status)} font-medium`}>
                          {t(`specialist.${booking.status}`)}
                        </Badge>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium text-foreground">{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {booking.time} ({booking.duration})
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium text-foreground">{booking.price} Centi</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{t("specialist.service")}</p>
                            <p className="text-sm text-muted-foreground">{booking.service}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{t("specialist.sessionType")}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              {booking.type === "video" ? (
                                <>
                                  <Video className="h-4 w-4 mr-1" /> {t("specialist.videoCall")}
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-4 w-4 mr-1" /> {t("specialist.inPerson")}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{t("specialist.email")}</p>
                            <p className="text-sm text-muted-foreground">{booking.clientEmail}</p>
                          </div>
                          {booking.clientPhone && (
                            <div>
                              <p className="text-sm font-medium text-foreground">{t("specialist.phone")}</p>
                              <p className="text-sm text-muted-foreground">{booking.clientPhone}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {booking.location && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-foreground mb-1">{t("specialist.location")}</p>
                          <p className="text-sm text-muted-foreground">{booking.location}</p>
                        </div>
                      )}

                      {booking.notes && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <p className="text-sm font-medium text-foreground mb-1">{t("specialist.notes")}</p>
                          <p className="text-sm text-muted-foreground">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {booking.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApprove(booking.id)
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t("specialist.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDecline(booking.id)
                          }}
                          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4 mr-1" />
                          {t("specialist.decline")}
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(booking)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {t("common.edit")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/specialist-messages/${booking.id}`)
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {t("specialist.message")}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">{t("specialist.noBookingsFound")}</h3>
            <p className="text-muted-foreground">
              {filterStatus === "all"
                ? t("specialist.noBookingsYet")
                : t("specialist.noBookingsFiltered", { status: filterStatus })}
            </p>
          </div>
        )}

        {/* Edit Booking Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("specialist.editBooking")}</DialogTitle>
              <DialogDescription>
                {t("specialist.editBookingDesc", { clientName: selectedBooking?.clientName })}
              </DialogDescription>
            </DialogHeader>

            {editedBooking && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">{t("booking.date")}</Label>
                    <Input
                      id="date"
                      type="date"
                      value={editedBooking.date}
                      onChange={(e) => setEditedBooking({ ...editedBooking, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">{t("booking.time")}</Label>
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
                    <Label htmlFor="duration">{t("booking.duration")}</Label>
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
                    <Label htmlFor="price">{t("booking.price")} (Centi)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editedBooking.price}
                      onChange={(e) => setEditedBooking({ ...editedBooking, price: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="type">{t("specialist.sessionType")}</Label>
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
                      <SelectItem value="video">{t("specialist.videoCall")}</SelectItem>
                      <SelectItem value="in-person">{t("specialist.inPerson")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editedBooking.type === "in-person" && (
                  <div>
                    <Label htmlFor="location">{t("specialist.location")}</Label>
                    <Input
                      id="location"
                      value={editedBooking.location || ""}
                      onChange={(e) => setEditedBooking({ ...editedBooking, location: e.target.value })}
                      placeholder={t("specialist.enterLocation")}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">{t("specialist.notes")}</Label>
                  <Textarea
                    id="notes"
                    value={editedBooking.notes || ""}
                    onChange={(e) => setEditedBooking({ ...editedBooking, notes: e.target.value })}
                    placeholder={t("specialist.addNotes")}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-amber-500 to-orange-600">
                {t("common.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
