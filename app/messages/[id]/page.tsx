"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Paperclip, MoreVertical, Calendar, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { BookingBubble } from "@/components/booking-bubble"

// Mock chat data
const chats = [
  {
    id: 1,
    specialistName: "Elena Rodriguez",
    specialistAvatar: "/placeholder.svg?height=40&width=40",
    specialty: "Astrology",
    title: "Spiritual Guide & Life Coach",
    isOnline: true,
    services: [
      { name: "Personal Astrology Reading", duration: "60 minutes", price: 120 },
      { name: "Life Coaching Session", duration: "50 minutes", price: 95 },
      { name: "Meditation Guidance", duration: "45 minutes", price: 80 },
    ],
    messages: [
      {
        id: 1,
        text: "Hello! How can I help you today?",
        sender: "specialist",
        timestamp: "2024-01-24T14:30:00Z",
      },
      {
        id: 2,
        text: "I'm interested in booking an astrology reading session. Could you tell me more about what to expect?",
        sender: "user",
        timestamp: "2024-01-24T14:32:00Z",
      },
      {
        id: 3,
        text: "Of course! In an astrology reading, I'll analyze your birth chart which is a map of the sky at the moment you were born. This reveals patterns and potentials in your life. We'll discuss your strengths, challenges, and current transits affecting you.",
        sender: "specialist",
        timestamp: "2024-01-24T14:35:00Z",
      },
    ],
  },
  {
    id: 2,
    specialistName: "Dr. Sarah Williams",
    specialistAvatar: "/placeholder.svg?height=40&width=40",
    specialty: "Nutrition",
    title: "Nutrition Specialist",
    isOnline: false,
    services: [
      { name: "Nutrition Consultation", duration: "60 minutes", price: 100 },
      { name: "Meal Planning Session", duration: "45 minutes", price: 75 },
    ],
    messages: [
      {
        id: 1,
        text: "Welcome! I'm Dr. Williams. How can I assist with your nutrition goals today?",
        sender: "specialist",
        timestamp: "2024-01-23T09:30:00Z",
      },
      {
        id: 2,
        text: "Hi Dr. Williams! I've been trying to improve my energy levels throughout the day. I think my diet might be the issue.",
        sender: "user",
        timestamp: "2024-01-23T09:32:00Z",
      },
    ],
  },
]

export default function MessagePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState<any>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [showClearDialog, setClearDialog] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showBookingBubble, setShowBookingBubble] = useState(false)

  // Add this state for existing sessions
  const [existingSessions] = useState([
    { time: "09:00", service: "Life Coaching", duration: "60 min" },
    { time: "14:00", service: "Astrology Reading", duration: "90 min" },
    { time: "16:30", service: "Meditation", duration: "45 min" },
  ])

  useEffect(() => {
    // Find chat by ID
    const foundChat = chats.find((c) => c.id === Number(params.id))
    if (foundChat) {
      setChat(foundChat)
    } else {
      router.push("/profile?section=chats")
    }
  }, [params.id, router])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat?.messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && chat && !isBlocked) {
      const newMessage = {
        id: chat.messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date().toISOString(),
      }

      setChat({
        ...chat,
        messages: [...chat.messages, newMessage],
      })
      setMessage("")
    }
  }

  const handleBookSession = () => {
    setShowBookingBubble(true)
    setShowBookingDialog(false)
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleProceedToBooking = () => {
    if (selectedService && selectedTime) {
      setShowBookingDialog(false)
      setShowBookingConfirmation(true)
    }
  }

  const handleViewProfile = () => {
    router.push(`/specialist/${chat.id}`)
  }

  const handleBlockSpecialist = () => {
    setIsBlocked(true)
    setShowBlockDialog(false)
  }

  const handleClearChat = () => {
    if (chat) {
      setChat({
        ...chat,
        messages: [],
      })
    }
    setClearDialog(false)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    }
  }

  // Get available times (mock data)
  const getAvailableTimes = () => {
    return ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"]
  }

  // Get next 7 days
  const getNextDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  // Group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {}

    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }))
  }

  if (!chat) {
    return null
  }

  const messageGroups = groupMessagesByDate(chat.messages)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="border-b border-border bg-background sticky top-16 sm:top-20 z-10">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/profile?section=chats")}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={chat.specialistAvatar || "/placeholder.svg"}
                      alt={chat.specialistName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-background rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2
                      className="font-semibold text-foreground cursor-pointer hover:text-amber-600 transition-colors"
                      onClick={handleViewProfile}
                    >
                      {chat.specialistName}
                    </h2>
                    <div className="flex items-center">
                      <Badge variant="secondary" className="text-xs">
                        {chat.specialty}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">{chat.isOnline ? "Online" : "Offline"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" onClick={handleBookSession} disabled={isBlocked}>
                  <Calendar className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleViewProfile}>View Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setClearDialog(true)}>Clear Chat</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400"
                      onClick={() => setShowBlockDialog(true)}
                    >
                      Block Specialist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {isBlocked && (
              <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  You have blocked this specialist. You cannot send messages.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
          <div className="space-y-6">
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                    {formatMessageDate(group.messages[0].timestamp)}
                  </div>
                </div>

                {group.messages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "specialist" && (
                      <img
                        src={chat.specialistAvatar || "/placeholder.svg"}
                        alt={chat.specialistName}
                        className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0 self-end"
                      />
                    )}
                    <div className="max-w-[75%]">
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <div
                        className={`text-xs text-muted-foreground mt-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                      >
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                    {msg.sender === "user" && <div className="w-8 h-8 ml-2 flex-shrink-0"></div>}
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <div className="border-t border-border bg-background px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Button type="button" variant="ghost" size="icon" disabled={isBlocked}>
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isBlocked ? "Cannot send messages to blocked specialist" : "Type a message..."}
                className="flex-1"
                disabled={isBlocked}
              />
              <Button
                type="submit"
                disabled={!message.trim() || isBlocked}
                className="bg-gradient-to-r from-amber-500 to-orange-600"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Booking Bubble */}
      {showBookingBubble && (
        <div className="mb-6">
          <BookingBubble
            services={chat.services || []}
            onClose={() => setShowBookingBubble(false)}
            onBooking={(bookingData) => {
              setSelectedService(bookingData.service)
              setSelectedDate(bookingData.date)
              setSelectedTime(bookingData.time)
              setShowBookingBubble(false)
              setShowBookingConfirmation(true)
            }}
            specialistName={chat.specialistName}
            specialistAvatar={chat.specialistAvatar}
          />
        </div>
      )}

      {/* Booking Selection Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book a Session with {chat.specialistName}</DialogTitle>
            <DialogDescription>Choose your service, date, and time</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Service Selection */}
            <div>
              <h4 className="font-medium mb-3">Select Service</h4>
              <div className="space-y-2">
                {chat.services?.map((service: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedService?.name === service.name
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        : "border-border hover:border-amber-300"
                    }`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium">{service.name}</h5>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                      <span className="font-medium text-amber-600">{service.price} Centi</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            {selectedService && (
              <div>
                <h4 className="font-medium mb-3">Select Date</h4>
                <div className="flex space-x-2 overflow-x-auto">
                  {getNextDays().map((date, index) => (
                    <Button
                      key={index}
                      variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
                      className={`flex-shrink-0 ${
                        selectedDate.toDateString() === date.toDateString()
                          ? "bg-gradient-to-r from-amber-500 to-orange-600"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedDate(date)
                        setSelectedTime(null)
                      }}
                    >
                      <div className="text-center">
                        <div className="text-xs">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div className="font-bold">{date.getDate()}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Time Selection */}
            {selectedService && selectedDate && (
              <div>
                <h4 className="font-medium mb-3">Select Time</h4>
                <div className="grid grid-cols-3 gap-2">
                  {getAvailableTimes().map((time, index) => (
                    <Button
                      key={index}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`${selectedTime === time ? "bg-gradient-to-r from-amber-500 to-orange-600" : ""}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && (
              <div>
                <h4 className="font-medium mb-3">Existing Sessions for {selectedDate.toLocaleDateString()}</h4>
                <div className="p-3 bg-muted rounded-lg">
                  {existingSessions.length > 0 ? (
                    <div className="space-y-2">
                      {existingSessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{session.time}</span>
                          <span className="text-muted-foreground">
                            {session.service} ({session.duration})
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No existing sessions for this date</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProceedToBooking}
              disabled={!selectedService || !selectedTime}
              className="bg-gradient-to-r from-amber-500 to-orange-600"
            >
              Proceed to Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation */}
      {selectedService && selectedTime && (
        <BookingConfirmation
          isOpen={showBookingConfirmation}
          onClose={() => setShowBookingConfirmation(false)}
          bookingDetails={{
            specialist: {
              name: chat.specialistName,
              image: chat.specialistAvatar,
              title: chat.title,
            },
            service: selectedService,
            date: selectedDate.toISOString(),
            time: selectedTime,
          }}
        />
      )}

      {/* Block Specialist Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Specialist</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {chat.specialistName}? You won't be able to receive messages from them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBlockSpecialist}>
              Block Specialist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Chat Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all messages in this chat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearChat}>
              Clear Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
