"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageCircle, Search, MoreHorizontal } from "lucide-react"

// Mock chat data
const chats = [
  {
    id: 1,
    specialistName: "Elena Rodriguez",
    specialistAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for the session today! I've sent you some additional resources for your astrology journey.",
    timestamp: "2024-01-24T15:30:00Z",
    unreadCount: 0,
    isOnline: true,
    specialty: "Astrology",
  },
  {
    id: 2,
    specialistName: "Dr. Sarah Williams",
    specialistAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hi! I wanted to follow up on your nutrition plan. How are you feeling with the new dietary changes?",
    timestamp: "2024-01-24T10:15:00Z",
    unreadCount: 2,
    isOnline: false,
    specialty: "Nutrition",
  },
  {
    id: 3,
    specialistName: "Marcus Chen",
    specialistAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The market analysis document is ready for review. Would you like to schedule a follow-up call?",
    timestamp: "2024-01-23T18:45:00Z",
    unreadCount: 1,
    isOnline: true,
    specialty: "Business Strategy",
  },
  {
    id: 4,
    specialistName: "Kai Nakamura",
    specialistAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Remember to practice the breathing technique we discussed. Daily consistency is key for mindfulness.",
    timestamp: "2024-01-22T09:20:00Z",
    unreadCount: 0,
    isOnline: false,
    specialty: "Meditation",
  },
]

export function ProfileChats() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChat, setSelectedChat] = useState<number | null>(null)

  const filteredChats = chats.filter(
    (chat) =>
      chat.specialistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 mr-3 text-violet-600" />
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>
        <Badge variant="secondary" className="bg-violet-100 text-violet-700">
          {chats.reduce((sum, chat) => sum + chat.unreadCount, 0)} unread
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Chat list */}
      <div className="space-y-2">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <Card
              key={chat.id}
              className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                selectedChat === chat.id ? "border-violet-300 bg-violet-50" : ""
              }`}
              onClick={() => {
                window.location.href = `/messages/${chat.id}`
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.specialistAvatar || "/placeholder.svg"}
                    alt={chat.specialistName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 truncate">{chat.specialistName}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {chat.specialty}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-violet-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">{formatTimestamp(chat.timestamp)}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className={`text-sm ${chat.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600"}`}>
                    {truncateMessage(chat.lastMessage)}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No conversations found" : "No messages yet"}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start a conversation with a specialist to see your messages here"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
