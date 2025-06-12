"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import { ScheduleSessionDialog } from "@/components/schedule-session-dialog"
import { Send, Calendar, User, MoreVertical, BlocksIcon as Block, Trash2, ArrowLeft, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Message {
  id: number
  text: string
  sender: "client" | "specialist"
  timestamp: string
}

interface Client {
  id: string
  name: string
  avatar?: string
  service: string
  isOnline: boolean
  isBlocked?: boolean
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
}

export default function SpecialistChatPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { t } = useTranslations()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [client, setClient] = useState<Client | null>(null)
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for other clients
  const [otherClients] = useState<Client[]>([
    {
      id: "1",
      name: "Sarah M.",
      avatar: "/placeholder.svg?height=40&width=40",
      service: "Astrology Reading",
      isOnline: true,
      lastMessage: "Thank you so much for the session!",
      lastMessageTime: "2024-01-24T15:30:00Z",
      unreadCount: 0,
    },
    {
      id: "2",
      name: "Michael R.",
      avatar: "/placeholder.svg?height=40&width=40",
      service: "Life Coaching",
      isOnline: false,
      lastMessage: "Could we schedule another session?",
      lastMessageTime: "2024-01-24T10:15:00Z",
      unreadCount: 2,
    },
    {
      id: "3",
      name: "Jessica L.",
      avatar: "/placeholder.svg?height=40&width=40",
      service: "Meditation Session",
      isOnline: true,
      lastMessage: "The techniques have been really helpful!",
      lastMessageTime: "2024-01-23T18:45:00Z",
      unreadCount: 0,
    },
    {
      id: "4",
      name: "David K.",
      avatar: "/placeholder.svg?height=40&width=40",
      service: "Spiritual Consultation",
      isOnline: false,
      lastMessage: "Looking forward to our session tomorrow.",
      lastMessageTime: "2024-01-22T09:20:00Z",
      unreadCount: 1,
    },
  ])

  useEffect(() => {
    if (!isAuthenticated || !user?.isSpecialist) {
      router.push("/")
    } else {
      // Find current client
      const currentClient = otherClients.find((c) => c.id === params.id)
      if (currentClient) {
        setClient(currentClient)
      }

      // Mock messages
      const mockMessages = [
        {
          id: 1,
          text: "Hi Elena! I'm really looking forward to our session. I have some questions about my career path.",
          sender: "client" as const,
          timestamp: "2024-01-24T14:00:00Z",
        },
        {
          id: 2,
          text: "Hello! Thank you for reaching out. I'm excited to help you with your astrology reading.",
          sender: "specialist" as const,
          timestamp: "2024-01-24T14:15:00Z",
        },
        {
          id: 3,
          text: "Perfect! I'd love to explore that with you. Would you like to schedule a session?",
          sender: "specialist" as const,
          timestamp: "2024-01-24T14:30:00Z",
        },
      ]

      setMessages(mockMessages)
    }
  }, [isAuthenticated, user, router, params.id, otherClients])

  const handleSendMessage = () => {
    if (newMessage.trim() && client && !client.isBlocked) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage.trim(),
        sender: "specialist",
        timestamp: new Date().toISOString(),
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleScheduleSession = () => {
    setShowScheduleDialog(true)
  }

  const handleCreateBooking = (bookingData: any) => {
    console.log("Creating booking:", bookingData)
    alert("Booking created successfully!")
    setShowScheduleDialog(false)
  }

  const handleBlockClient = () => {
    if (client) {
      setClient({ ...client, isBlocked: true })
      setShowBlockDialog(false)
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setShowClearDialog(false)
  }

  const handleViewProfile = () => {
    router.push(`/client-profile/${client?.id}`)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatLastMessageTime = (timestamp: string) => {
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

  const filteredClients = otherClients.filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (!isAuthenticated || !user?.isSpecialist || !client) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Client List */}
          <div className="w-80 flex-shrink-0">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Client Messages</h2>
                  <Button variant="ghost" size="icon" onClick={() => router.push("/specialist-dashboard")}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {filteredClients.map((clientItem) => (
                  <div
                    key={clientItem.id}
                    onClick={() => router.push(`/specialist-messages/${clientItem.id}`)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                      clientItem.id === params.id
                        ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={clientItem.avatar || "/placeholder.svg"}
                          alt={clientItem.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {clientItem.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground truncate">{clientItem.name}</h3>
                          {clientItem.unreadCount && clientItem.unreadCount > 0 && (
                            <Badge className="bg-amber-500 text-white text-xs min-w-[20px] h-5">
                              {clientItem.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {clientItem.service}
                          </Badge>
                        </div>
                        {clientItem.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">{clientItem.lastMessage}</p>
                        )}
                        {clientItem.lastMessageTime && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatLastMessageTime(clientItem.lastMessageTime)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="flex-1">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={client.avatar || "/placeholder.svg"}
                        alt={client.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {client.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    <div className="cursor-pointer" onClick={handleViewProfile}>
                      <h3 className="font-semibold text-foreground hover:text-amber-600 transition-colors">
                        {client.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">{client.service}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleScheduleSession} disabled={client.isBlocked}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleViewProfile}>
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setShowClearDialog(true)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setShowBlockDialog(true)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Block className="h-4 w-4 mr-2" />
                          Block Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {client.isBlocked && (
                  <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      You have blocked this client. You cannot send messages.
                    </p>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
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
                  <div className="flex-1 relative">
                    <Input
                      placeholder={client.isBlocked ? "Cannot send messages to blocked client" : "Type your message..."}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className=""
                      disabled={client.isBlocked}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-amber-500 to-orange-600"
                    disabled={!newMessage.trim() || client.isBlocked}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Schedule Session Dialog */}
        <ScheduleSessionDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          client={client}
          onCreateBooking={handleCreateBooking}
        />

        {/* Block Client Dialog */}
        <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block Client</DialogTitle>
              <DialogDescription>
                Are you sure you want to block {client.name}? You won't be able to receive messages from them.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBlockClient}>
                Block Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Clear Chat Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear Chat</DialogTitle>
              <DialogDescription>
                Are you sure you want to clear all messages in this chat? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleClearChat}>
                Clear Chat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
