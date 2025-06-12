"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import { MessageCircle, Search, MoreHorizontal, Star, Calendar, Send, Paperclip, Smile } from "lucide-react"

// Mock chat data for specialist
const specialistChats = [
  {
    id: 1,
    clientName: "Sarah M.",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you so much for the astrology reading! It was incredibly insightful.",
    timestamp: "2024-01-24T15:30:00Z",
    unreadCount: 0,
    isOnline: true,
    service: "Astrology Reading",
    rating: 5,
    messages: [
      {
        id: 1,
        text: "Hi Elena! I'm looking forward to our session tomorrow.",
        sender: "client",
        timestamp: "2024-01-24T14:00:00Z",
      },
      {
        id: 2,
        text: "Hello Sarah! I'm excited to work with you. I've prepared some questions based on your birth chart.",
        sender: "specialist",
        timestamp: "2024-01-24T14:15:00Z",
      },
      {
        id: 3,
        text: "That sounds wonderful! I'm particularly interested in career guidance.",
        sender: "client",
        timestamp: "2024-01-24T14:30:00Z",
      },
      {
        id: 4,
        text: "Perfect! We'll focus on your 10th house and current planetary transits affecting your career path.",
        sender: "specialist",
        timestamp: "2024-01-24T15:00:00Z",
      },
      {
        id: 5,
        text: "Thank you so much for the astrology reading! It was incredibly insightful.",
        sender: "client",
        timestamp: "2024-01-24T15:30:00Z",
      },
    ],
  },
  {
    id: 2,
    clientName: "Michael R.",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hi Elena, I wanted to follow up on our last session. Could we schedule another one?",
    timestamp: "2024-01-24T10:15:00Z",
    unreadCount: 2,
    isOnline: false,
    service: "Life Coaching",
    rating: null,
    messages: [
      {
        id: 1,
        text: "Hi Elena, I wanted to follow up on our last session. Could we schedule another one?",
        sender: "client",
        timestamp: "2024-01-24T10:15:00Z",
      },
      {
        id: 2,
        text: "I've been implementing the strategies we discussed and seeing great progress!",
        sender: "client",
        timestamp: "2024-01-24T10:16:00Z",
      },
    ],
  },
  {
    id: 3,
    clientName: "Jessica L.",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The meditation techniques you taught me have been really helpful. Thank you!",
    timestamp: "2024-01-23T18:45:00Z",
    unreadCount: 0,
    isOnline: true,
    service: "Meditation Session",
    rating: 5,
    messages: [
      {
        id: 1,
        text: "The meditation techniques you taught me have been really helpful. Thank you!",
        sender: "client",
        timestamp: "2024-01-23T18:45:00Z",
      },
    ],
  },
]

export default function SpecialistMessagesPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { t } = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    if (!isAuthenticated || !user?.isSpecialist) {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  const filteredChats = specialistChats.filter(
    (chat) =>
      chat.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.service.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedChatData = specialistChats.find((chat) => chat.id === selectedChat)

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

  const truncateMessage = (message: string, maxLength = 60) => {
    return message.length > maxLength ? message.substring(0, maxLength) + "..." : message
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-current text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  if (!isAuthenticated || !user?.isSpecialist) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 mr-3 text-amber-600" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Messages</h1>
              <p className="text-muted-foreground">Communicate with your clients</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            {specialistChats.reduce((sum, chat) => sum + chat.unreadCount, 0)} unread
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border ${
                        selectedChat === chat.id ? "bg-amber-50 dark:bg-amber-900/20" : ""
                      }`}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={chat.clientAvatar || "/placeholder.svg"}
                            alt={chat.clientName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {chat.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-foreground truncate text-sm">{chat.clientName}</h3>
                            <span className="text-xs text-muted-foreground">{formatTimestamp(chat.timestamp)}</span>
                          </div>

                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {chat.service}
                            </Badge>
                            {chat.rating && (
                              <div className="flex items-center space-x-1">{renderStars(chat.rating)}</div>
                            )}
                          </div>

                          <p
                            className={`text-xs ${chat.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
                          >
                            {truncateMessage(chat.lastMessage, 40)}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${chat.isOnline ? "text-green-600" : "text-muted-foreground"}`}>
                              {chat.isOnline ? "Online" : "Offline"}
                            </span>
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-amber-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No conversations found</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {selectedChatData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={selectedChatData.clientAvatar || "/placeholder.svg"}
                            alt={selectedChatData.clientName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {selectedChatData.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{selectedChatData.clientName}</h3>
                          <p className="text-sm text-muted-foreground">{selectedChatData.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChatData.messages?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "specialist" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === "specialist"
                              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "specialist" ? "text-amber-100" : "text-muted-foreground"
                            }`}
                          >
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="pr-10"
                        />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-amber-500 to-orange-600"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">Choose a client from the list to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
