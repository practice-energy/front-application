"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import { ScheduleSessionDialog } from "@/components/schedule-session-dialog"
import {
  Calendar,
  MessageCircle,
  Users,
  Star,
  TrendingUp,
  Settings,
  Edit,
  BarChart3,
  BookOpen,
  MessageSquare,
  Wind,
  Lightbulb,
  Heart,
  HandIcon as Hands,
  MessageCircleMore,
} from "lucide-react"
import { SpecialistServices } from "@/components/specialist-services"
import { SpecialistSchedule } from "@/components/specialist-schedule"
import { SpecialistProfileEdit } from "@/components/specialist-profile-edit"
import { SpecialistAnalytics } from "@/components/specialist-analytics"
import { SpecialistGreeting } from "@/components/specialist-greeting"

export default function SpecialistDashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { t } = useTranslations()
  const [activeTab, setActiveTab] = useState("overview")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated || !user?.isSpecialist) {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  const handleScheduleSession = (client: any) => {
    setSelectedClient(client)
    setShowScheduleDialog(true)
  }

  const handleCreateBooking = (bookingData: any) => {
    alert("Booking created successfully!")
    console.log("Creating booking:", bookingData)
    setShowScheduleDialog(false)
    setSelectedClient(null)
  }

  if (!isAuthenticated || !user?.isSpecialist) {
    return null
  }

  const stats = [
    { label: "Total Clients", value: "24", icon: Users, color: "text-blue-600" },
    { label: "This Month", value: "8", icon: Calendar, color: "text-green-600" },
    { label: "Rating", value: "4.9", icon: Star, color: "text-yellow-600" },
    { label: "Revenue", value: "2,840 Centi", icon: TrendingUp, color: "text-purple-600" },
  ]

  const recentBookings = [
    { id: 1, client: "Sarah M.", service: "Astrology Reading", date: "Today, 2:00 PM", status: "confirmed" },
    { id: 2, client: "Michael R.", service: "Life Coaching", date: "Tomorrow, 10:00 AM", status: "pending" },
    { id: 3, client: "Jessica L.", service: "Meditation Session", date: "Jan 28, 3:00 PM", status: "confirmed" },
  ]

  // Mock feedback data based on review structure
  const clientFeedbacks = [
    {
      id: 1,
      client: "Sarah M.",
      service: "Astrology Reading",
      date: "Jan 24, 2024",
      duration: "60 minutes",
      price: 120,
      emotions: [
        { label: "Relief", icon: Wind, color: "text-blue-500" },
        { label: "Inspiration", icon: Lightbulb, color: "text-yellow-500" },
        { label: "Gratitude", icon: Hands, color: "text-green-500" },
      ],
      review:
        "The astrology reading was incredibly insightful. Sarah helped me understand patterns in my life that I hadn't noticed before. I felt a deep sense of relief and inspiration after our session.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      client: "Michael R.",
      service: "Life Coaching",
      date: "Jan 22, 2024",
      duration: "45 minutes",
      price: 95,
      emotions: [
        { label: "Inspiration", icon: Lightbulb, color: "text-yellow-500" },
        { label: "Gratitude", icon: Hands, color: "text-green-500" },
      ],
      review:
        "Elena's coaching style is amazing. She helped me set clear goals and gave me practical steps to achieve them. I'm feeling much more motivated and focused now.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      client: "Jessica L.",
      service: "Meditation Session",
      date: "Jan 20, 2024",
      duration: "30 minutes",
      price: 75,
      emotions: [
        { label: "Relief", icon: Wind, color: "text-blue-500" },
        { label: "Gratitude", icon: Hands, color: "text-green-500" },
      ],
      review:
        "The meditation session was exactly what I needed. I felt so much calmer and more centered afterwards. Thank you for the peaceful experience.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      client: "David K.",
      service: "Spiritual Consultation",
      date: "Jan 18, 2024",
      duration: "90 minutes",
      price: 180,
      emotions: [
        { label: "Vulnerability", icon: Heart, color: "text-pink-500" },
        { label: "Inspiration", icon: Lightbulb, color: "text-yellow-500" },
        { label: "Gratitude", icon: Hands, color: "text-green-500" },
      ],
      review:
        "This was a transformative experience. I was able to open up about things I've never shared before. The guidance and insights I received will stay with me for a long time.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "profile", label: "Profile", icon: Edit },
    { id: "services", label: "Services", icon: Settings },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "greeting", label: "Greeting", icon: MessageSquare },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "feedbacks", label: "Feedbacks", icon: MessageCircleMore },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <SpecialistProfileEdit />
      case "services":
        return <SpecialistServices />
      case "schedule":
        return <SpecialistSchedule />
      case "greeting":
        return <SpecialistGreeting />
      case "messages":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-6 w-6 mr-3 text-violet-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Client Messages</h2>
                  <p className="text-gray-600">Manage conversations with your clients</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                3 unread
              </Badge>
            </div>

            {/* Sample messages for now */}
            <div className="space-y-4">
              {[
                {
                  id: "1",
                  name: "Sarah M.",
                  avatar: "/placeholder.svg?height=40&width=40",
                  content: "Thank you so much for the astrology reading! It was incredibly insightful.",
                  timestamp: "2024-01-24T15:30:00Z",
                  isOnline: true,
                  service: "Astrology Reading",
                },
                {
                  id: "2",
                  name: "Michael R.",
                  avatar: "/placeholder.svg?height=40&width=40",
                  content: "Hi Elena, I wanted to follow up on our last session. Could we schedule another one?",
                  timestamp: "2024-01-24T10:15:00Z",
                  isOnline: false,
                  service: "Life Coaching",
                },
              ].map((message) => (
                <Card key={message.id} className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={message.avatar || "/placeholder.svg"}
                        alt={message.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-200"
                      />
                      {message.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{message.name}</div>
                        <Badge variant="secondary" className="text-xs">
                          {message.service}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{message.content}</p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/specialist-messages/${message.id}`)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleScheduleSession(message)}
                          className="bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      case "feedbacks":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircleMore className="h-6 w-6 mr-3 text-violet-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Client Feedbacks</h2>
                  <p className="text-gray-600">View emotional experiences and reviews from your clients</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                {clientFeedbacks.length} reviews
              </Badge>
            </div>

            <div className="space-y-6">
              {clientFeedbacks.map((feedback) => (
                <Card key={feedback.id} className="p-6">
                  {/* Session Details Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="relative">
                      <img
                        src={feedback.avatar || "/placeholder.svg"}
                        alt={feedback.client}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{feedback.service}</h3>
                          <p className="text-muted-foreground">with {feedback.client}</p>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center px-3 py-1 bg-violet-600 text-white rounded-full text-sm font-semibold">
                            {feedback.price} Centi
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{formatDate(feedback.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                          <span className="text-sm font-medium">{feedback.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emotions */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Emotions Experienced:</h4>
                    <div className="flex flex-wrap gap-3">
                      {feedback.emotions.map((emotion, index) => {
                        const IconComponent = emotion.icon
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-2 px-3 py-2 bg-violet-50 border border-violet-200 rounded-full"
                          >
                            <IconComponent className={`h-4 w-4 ${emotion.color}`} />
                            <span className="text-sm font-medium text-violet-700">{emotion.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Review Text */}
                  {feedback.review && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Client's Journey:</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed italic">"{feedback.review}"</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )
      case "analytics":
        return <SpecialistAnalytics />
      default:
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Bookings</h3>
                  <Button variant="outline" size="sm" onClick={() => router.push("/bookings")}>
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/booking/${booking.id}`)}
                    >
                      <div>
                        <p className="font-medium">{booking.client}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/bookings")}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Bookings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("schedule")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Availability
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("messages")}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    View Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("services")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Services
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("greeting")}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Edit Greeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("feedbacks")}>
                    <MessageCircleMore className="h-4 w-4 mr-2" />
                    View Feedbacks
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("analytics")}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("specialist.dashboard")}</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user.name}!</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Application Status:</span>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                >
                  {user.specialistProfile?.status || "Pending Review"}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">We'll notify you once approved</span>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-violet-500 text-violet-600"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Schedule Session Dialog */}
        <ScheduleSessionDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          client={selectedClient}
          onCreateBooking={handleCreateBooking}
        />
      </main>
    </div>
  )
}
