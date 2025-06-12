"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Send, Plus, MoreVertical } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  sender: "user" | "specialist"
  timestamp: Date
}

type Conversation = {
  id: string
  specialistId: string
  specialistName: string
  specialistAvatar?: string
  lastMessage: string
  lastMessageTime: Date
  unread: number
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    specialistId: "101",
    specialistName: "Dr. Anna Smith",
    specialistAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Yes, that time works for me.",
    lastMessageTime: new Date(2023, 5, 15, 14, 30),
    unread: 2,
  },
  {
    id: "2",
    specialistId: "102",
    specialistName: "Michael Johnson",
    specialistAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'll send you the details shortly.",
    lastMessageTime: new Date(2023, 5, 14, 9, 15),
    unread: 0,
  },
  {
    id: "3",
    specialistId: "103",
    specialistName: "Sarah Williams",
    lastMessage: "Looking forward to our session!",
    lastMessageTime: new Date(2023, 5, 13, 16, 45),
    unread: 0,
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      content: "Hello! I'd like to schedule a session for next week.",
      sender: "user",
      timestamp: new Date(2023, 5, 15, 14, 15),
    },
    {
      id: "m2",
      content: "Hi there! I'd be happy to help you schedule a session. What day works best for you?",
      sender: "specialist",
      timestamp: new Date(2023, 5, 15, 14, 20),
    },
    {
      id: "m3",
      content: "Would Tuesday at 2pm work?",
      sender: "user",
      timestamp: new Date(2023, 5, 15, 14, 25),
    },
    {
      id: "m4",
      content: "Yes, that time works for me.",
      sender: "specialist",
      timestamp: new Date(2023, 5, 15, 14, 30),
    },
  ],
  "2": [
    {
      id: "m5",
      content: "Hi Michael, I have some questions about the upcoming session.",
      sender: "user",
      timestamp: new Date(2023, 5, 14, 9, 0),
    },
    {
      id: "m6",
      content: "Of course, what would you like to know?",
      sender: "specialist",
      timestamp: new Date(2023, 5, 14, 9, 5),
    },
    {
      id: "m7",
      content: "What should I prepare before our meeting?",
      sender: "user",
      timestamp: new Date(2023, 5, 14, 9, 10),
    },
    {
      id: "m8",
      content: "I'll send you the details shortly.",
      sender: "specialist",
      timestamp: new Date(2023, 5, 14, 9, 15),
    },
  ],
  "3": [
    {
      id: "m9",
      content: "Hello Sarah, I've booked our session for Friday.",
      sender: "user",
      timestamp: new Date(2023, 5, 13, 16, 30),
    },
    {
      id: "m10",
      content: "Great! I've received the booking confirmation.",
      sender: "specialist",
      timestamp: new Date(2023, 5, 13, 16, 40),
    },
    {
      id: "m11",
      content: "Perfect, see you then!",
      sender: "user",
      timestamp: new Date(2023, 5, 13, 16, 42),
    },
    {
      id: "m12",
      content: "Looking forward to our session!",
      sender: "specialist",
      timestamp: new Date(2023, 5, 13, 16, 45),
    },
  ],
}

export function ChatsSection() {
  const [activeConversation, setActiveConversation] = useState<string | null>("1")
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredConversations = mockConversations.filter((conv) =>
    conv.specialistName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation) return

    // In a real app, you would send this to an API
    console.log("Sending message:", newMessage, "to conversation:", activeConversation)
    setNewMessage("")
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Messages</h1>
        <p className="text-gray-500">Chat with specialists</p>
      </div>

      <div className="flex h-full border rounded-lg overflow-hidden">
        {/* Conversation List */}
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search conversations"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-gray-100",
                    activeConversation === conversation.id && "bg-violet-50",
                  )}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        {conversation.specialistAvatar ? (
                          <AvatarImage
                            src={conversation.specialistAvatar || "/placeholder.svg"}
                            alt={conversation.specialistName}
                          />
                        ) : (
                          <AvatarFallback>
                            {conversation.specialistName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{conversation.specialistName}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[180px]">{conversation.lastMessage}</div>
                      </div>
                    </div>
                    <div className="text-xs text-right">
                      <div className="text-gray-500">{formatTime(conversation.lastMessageTime)}</div>
                      {conversation.unread > 0 && (
                        <div className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center mt-1 ml-auto">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    {mockConversations.find((c) => c.id === activeConversation)?.specialistAvatar ? (
                      <AvatarImage
                        src={
                          mockConversations.find((c) => c.id === activeConversation)?.specialistAvatar ||
                          "" ||
                          "/placeholder.svg"
                        }
                        alt={mockConversations.find((c) => c.id === activeConversation)?.specialistName || ""}
                      />
                    ) : (
                      <AvatarFallback>
                        {mockConversations
                          .find((c) => c.id === activeConversation)
                          ?.specialistName.split(" ")
                          .map((n) => n[0])
                          .join("") || ""}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {mockConversations.find((c) => c.id === activeConversation)?.specialistName}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={20} />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages[activeConversation]?.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          message.sender === "user"
                            ? "bg-violet-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none",
                        )}
                      >
                        <div>{message.content}</div>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            message.sender === "user" ? "text-violet-200" : "text-gray-500",
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col p-4 text-center">
              <div className="text-gray-400 mb-4">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-gray-500 mb-4">Choose a conversation from the list or start a new one</p>
              <Button>
                <Plus size={18} className="mr-2" />
                New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Missing icon component
function MessageSquare(props: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}
