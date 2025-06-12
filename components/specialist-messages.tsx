"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageCircle, Calendar, Clock, CreditCard, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Message {
  id: string
  timestamp: string
  content: string
  name: string
  avatar: string
  isOnline: boolean
  service: string
}

interface SpecialistMessagesProps {
  messages: Message[]
}

const SpecialistMessages: React.FC<SpecialistMessagesProps> = ({ messages }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [activeTab, setActiveTab] = useState("inbox")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [bookingForm, setBookingForm] = useState({
    service: "",
    date: "",
    time: "",
    duration: "60 minutes",
    type: "video" as "video" | "in-person",
    location: "",
    notes: "",
    price: 120,
  })

  const handleScheduleSession = (client: any) => {
    setSelectedClient(client)
    setBookingForm({
      service: client.service || "",
      date: "",
      time: "",
      duration: "60 minutes",
      type: "video",
      location: "",
      notes: "",
      price: 120,
    })
    setShowScheduleDialog(true)
  }

  const handleCreateBooking = () => {
    console.log("Creating booking:", bookingForm)
    setShowScheduleDialog(false)
    setSelectedClient(null)
    setBookingForm({
      service: "",
      date: "",
      time: "",
      duration: "60 minutes",
      type: "video",
      location: "",
      notes: "",
      price: 120,
    })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const handleNavigateToChat = (messageId: string) => {
    window.location.href = `/specialist-messages/${messageId}`
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className="p-4">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={message.avatar || "/placeholder.svg"}
                alt={message.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-200 dark:ring-amber-800"
              />
              {message.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold">{message.name}</div>
              <p className="text-sm text-muted-foreground">{message.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleNavigateToChat(message.id)}>
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScheduleSession(message)}
                      className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Schedule Session Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Schedule Session
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground mt-1">
                  Create a new booking for your client
                </DialogDescription>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </DialogHeader>

          {/* Client Info Card */}
          {selectedClient && (
            <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={selectedClient.avatar || "/placeholder.svg"}
                    alt={selectedClient.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-200 dark:ring-amber-800"
                  />
                  {selectedClient.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">{selectedClient.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    >
                      {selectedClient.service}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-6 py-4">
            {/* Service and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service" className="text-sm font-semibold text-foreground flex items-center">
                  <User className="h-4 w-4 mr-2 text-amber-600" />
                  Service Type
                </Label>
                <Select
                  value={bookingForm.service}
                  onValueChange={(value) => setBookingForm({ ...bookingForm, service: value })}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 transition-colors">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="astrology">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Astrology Reading</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="life-coaching">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Life Coaching</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="meditation">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Meditation Session</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="spiritual">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>Spiritual Consultation</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-semibold text-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-600" />
                  Duration & Price
                </Label>
                <Select
                  value={bookingForm.duration}
                  onValueChange={(value) => {
                    const prices = {
                      "30 minutes": 50,
                      "45 minutes": 75,
                      "60 minutes": 100,
                      "90 minutes": 150,
                      "120 minutes": 200,
                    }
                    setBookingForm({
                      ...bookingForm,
                      duration: value,
                      price: prices[value as keyof typeof prices] || 100,
                    })
                  }}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 minutes">
                      <div className="flex items-center justify-between w-full">
                        <span>30 minutes</span>
                        <Badge className="ml-2 bg-amber-100 text-amber-700">50 Centi</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="45 minutes">
                      <div className="flex items-center justify-between w-full">
                        <span>45 minutes</span>
                        <Badge className="ml-2 bg-amber-100 text-amber-700">75 Centi</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="60 minutes">
                      <div className="flex items-center justify-between w-full">
                        <span>60 minutes</span>
                        <Badge className="ml-2 bg-amber-100 text-amber-700">100 Centi</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="90 minutes">
                      <div className="flex items-center justify-between w-full">
                        <span>90 minutes</span>
                        <Badge className="ml-2 bg-amber-100 text-amber-700">150 Centi</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="120 minutes">
                      <div className="flex items-center justify-between w-full">
                        <span>120 minutes</span>
                        <Badge className="ml-2 bg-amber-100 text-amber-700">200 Centi</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-semibold text-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-600" />
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                  className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Session Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold text-foreground flex items-center">
                <User className="h-4 w-4 mr-2 text-amber-600" />
                Session Type
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBookingForm({ ...bookingForm, type: "video" })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    bookingForm.type === "video"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        bookingForm.type === "video"
                          ? "bg-amber-100 dark:bg-amber-900/40"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <User
                        className={`h-4 w-4 ${
                          bookingForm.type === "video" ? "text-amber-600 dark:text-amber-400" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium">Video Call</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setBookingForm({ ...bookingForm, type: "in-person" })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    bookingForm.type === "in-person"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        bookingForm.type === "in-person"
                          ? "bg-amber-100 dark:bg-amber-900/40"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Calendar
                        className={`h-4 w-4 ${
                          bookingForm.type === "in-person" ? "text-amber-600 dark:text-amber-400" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium">In-Person</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Location (if in-person) */}
            {bookingForm.type === "in-person" && (
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold text-foreground">
                  Meeting Location
                </Label>
                <Input
                  id="location"
                  value={bookingForm.location}
                  onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                  placeholder="Enter meeting location"
                  className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 transition-colors"
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold text-foreground">
                Session Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                placeholder="Add any special notes or preparation instructions for this session..."
                rows={3}
                className="border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 transition-colors resize-none"
              />
            </div>

            {/* Price Summary */}
            <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">Session Total</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Payment via Centi Wallet</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{bookingForm.price}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Centi</p>
                </div>
              </div>
            </Card>
          </div>

          <DialogFooter className="pt-6 border-t border-border">
            <div className="flex space-x-3 w-full">
              <Button
                variant="outline"
                onClick={() => setShowScheduleDialog(false)}
                className="flex-1 h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBooking}
                className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!bookingForm.service || !bookingForm.date || !bookingForm.time}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Create Booking
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SpecialistMessages
