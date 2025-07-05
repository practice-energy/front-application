"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, Edit, Trash2, Users, MapPin } from "lucide-react"

interface Appointment {
  id: string
  title: string
  client: string
  service: string
  date: Date
  startTime: string
  endTime: string
  status: "confirmed" | "pending" | "cancelled"
  notes?: string
  location?: string
}

export function SpecialistScheduleSection() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Astrology Reading",
      client: "Sarah M.",
      service: "Astrology Reading",
      date: new Date(2024, 0, 25),
      startTime: "14:00",
      endTime: "15:00",
      status: "confirmed",
      notes: "First-time client, interested in career guidance",
      location: "Online",
    },
    {
      id: "2",
      title: "Life Coaching",
      client: "Michael R.",
      service: "Life Coaching Session",
      date: new Date(2024, 0, 26),
      startTime: "10:00",
      endTime: "10:45",
      status: "pending",
      notes: "Follow-up session",
      location: "In-person",
    },
    {
      id: "3",
      title: "Meditation Session",
      client: "Jessica L.",
      service: "Meditation Session",
      date: new Date(2024, 0, 28),
      startTime: "15:00",
      endTime: "15:30",
      status: "confirmed",
      location: "Online",
    },
  ])

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getWeekDays = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => apt.date.toDateString() === date.toDateString())
  }

  const handleAppointmentDrop = (appointment: Appointment, newDate: Date, newTime: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointment.id ? { ...apt, date: newDate, startTime: newTime } : apt)),
    )
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)

    if (viewMode === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    }

    setCurrentDate(newDate)
  }

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate)
    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`)

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">{formatDate(currentDate)}</h3>
        </div>

        <Card className="p-4">
          <div className="space-y-2">
            {timeSlots.map((time) => {
              const appointmentsAtTime = dayAppointments.filter((apt) => apt.startTime === time)

              return (
                <div
                  key={time}
                  className="flex items-center space-x-4 p-2 border-b border-gray-100 min-h-[60px]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (draggedAppointment) {
                      handleAppointmentDrop(draggedAppointment, currentDate, time)
                      setDraggedAppointment(null)
                    }
                  }}
                >
                  <div className="w-16 text-sm text-gray-500 font-medium">{formatTime(time)}</div>
                  <div className="flex-1">
                    {appointmentsAtTime.map((appointment) => (
                      <div
                        key={appointment.id}
                        draggable
                        onDragStart={() => setDraggedAppointment(appointment)}
                        className="bg-violet-100 border border-violet-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
                        onClick={() => {
                          setSelectedAppointment(appointment)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-violet-900">{appointment.title}</p>
                            <p className="text-sm text-violet-700">with {appointment.client}</p>
                            <p className="text-xs text-violet-600">
                              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              appointment.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : appointment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)
    const timeSlots = Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`)

    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="grid grid-cols-8 gap-2">
            {/* Time column header */}
            <div className="text-center font-medium text-gray-500 text-sm">Time</div>

            {/* Day headers */}
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="text-center">
                <div className="font-medium text-gray-900">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className="text-sm text-gray-500">{day.getDate()}</div>
              </div>
            ))}

            {/* Time slots and appointments */}
            {timeSlots.map((time) => (
              <>
                {/* Time label */}
                <div key={`time-${time}`} className="text-sm text-gray-500 font-medium py-2">
                  {formatTime(time)}
                </div>

                {/* Day columns */}
                {weekDays.map((day) => {
                  const dayAppointments = getAppointmentsForDate(day).filter((apt) => apt.startTime === time)

                  return (
                    <div
                      key={`${day.toISOString()}-${time}`}
                      className="min-h-[60px] border border-gray-100 rounded p-1"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (draggedAppointment) {
                          handleAppointmentDrop(draggedAppointment, day, time)
                          setDraggedAppointment(null)
                        }
                      }}
                    >
                      {dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          draggable
                          onDragStart={() => setDraggedAppointment(appointment)}
                          className="bg-violet-100 border border-violet-200 rounded p-2 cursor-move hover:shadow-md transition-shadow text-xs"
                          onClick={() => {
                            setSelectedAppointment(appointment)
                            setIsEditModalOpen(true)
                          }}
                        >
                          <p className="font-medium text-violet-900 truncate">{appointment.client}</p>
                          <p className="text-violet-700 truncate">{appointment.service}</p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  const renderMonthView = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    while (current <= lastDay || days.length < 42) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day) => {
              const dayAppointments = getAppointmentsForDate(day)
              const isCurrentMonth = day.getMonth() === month
              const isToday = day.toDateString() === new Date().toDateString()

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] border rounded-lg p-2 ${
                    isCurrentMonth ? "bg-white" : "bg-gray-50"
                  } ${isToday ? "ring-2 ring-violet-500" : ""}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>
                    {day.getDate()}
                  </div>

                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-violet-100 text-violet-800 text-xs p-1 rounded cursor-pointer hover:bg-violet-200 transition-colors"
                        onClick={() => {
                          setSelectedAppointment(appointment)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <p className="font-medium truncate">{appointment.client}</p>
                        <p className="truncate">{formatTime(appointment.startTime)}</p>
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 mr-3 text-violet-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
            <p className="text-gray-600">Manage your appointments and availability</p>
          </div>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Appointment
        </Button>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h3 className="text-xl font-semibold">
            {viewMode === "month"
              ? currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : viewMode === "week"
                ? `Week of ${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : formatDate(currentDate)}
          </h3>

          <Button variant="outline" onClick={() => navigateDate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
            Day
          </Button>
          <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => setViewMode("week")}>
            Week
          </Button>
          <Button variant={viewMode === "month" ? "default" : "outline"} size="sm" onClick={() => setViewMode("month")}>
            Month
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "day" && renderDayView()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "month" && renderMonthView()}

      {/* Appointment Details Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{selectedAppointment.client}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Service</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">{selectedAppointment.service}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">{selectedAppointment.date.toLocaleDateString()}</div>
                </div>

                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{formatTime(selectedAppointment.startTime)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{formatTime(selectedAppointment.endTime)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge
                    variant="secondary"
                    className={
                      selectedAppointment.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : selectedAppointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }
                  >
                    {selectedAppointment.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{selectedAppointment.location || "Not specified"}</span>
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">{selectedAppointment.notes}</div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Appointment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
