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
  ArrowLeft,
  User,
  Star,
  Calendar,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  Heart,
  Shield,
} from "lucide-react"

interface ClientProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  about: string
  location?: string
  memberSince: string
  timeOnPlatform: string
  totalSessions: number
  averageRating: number
  totalReviews: number
  preferredServices: string[]
  lastActive: string
  isVerified: boolean
  sessionHistory: {
    id: string
    service: string
    date: string
    rating: number
    review?: string
  }[]
}

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { t } = useTranslations()
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user?.isSpecialist) {
      router.push("/")
    } else {
      // Mock client profile data
      const mockProfile: ClientProfile = {
        id: params.id,
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 123-4567",
        avatar: "/placeholder.svg?height=120&width=120",
        about:
          "I'm passionate about personal growth and spiritual development. I've been exploring astrology and meditation for the past few years and love connecting with practitioners who can guide me on my journey.",
        location: "San Francisco, CA",
        memberSince: "2023-01-15T00:00:00Z",
        timeOnPlatform: "1 year 2 months",
        totalSessions: 12,
        averageRating: 4.8,
        totalReviews: 8,
        preferredServices: ["Astrology Reading", "Meditation", "Life Coaching"],
        lastActive: "2024-01-24T15:30:00Z",
        isVerified: true,
        sessionHistory: [
          {
            id: "1",
            service: "Astrology Reading",
            date: "2024-01-20T14:00:00Z",
            rating: 5,
            review: "Amazing session! Elena provided incredible insights into my career path.",
          },
          {
            id: "2",
            service: "Meditation Session",
            date: "2024-01-10T16:00:00Z",
            rating: 5,
            review: "Very calming and helpful techniques for managing stress.",
          },
          {
            id: "3",
            service: "Life Coaching",
            date: "2023-12-15T10:00:00Z",
            rating: 4,
            review: "Good session, helped me clarify my goals.",
          },
        ],
      }

      setClientProfile(mockProfile)
    }
  }, [isAuthenticated, user, router, params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Active now"
    } else if (diffInHours < 24) {
      return `Active ${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Active ${diffInDays} days ago`
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-current text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const handleScheduleSession = () => {
    setShowScheduleDialog(true)
  }

  const handleCreateBooking = (bookingData: any) => {
    alert("Booking created successfully!")
    console.log("Creating booking:", bookingData)
    setShowScheduleDialog(false)
  }

  if (!isAuthenticated || !user?.isSpecialist || !clientProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Client Profile</h1>
            <p className="text-muted-foreground mt-1">View client information and session history</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Main Profile Card */}
          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    {clientProfile.avatar ? (
                      <img
                        src={clientProfile.avatar || "/placeholder.svg"}
                        alt={`${clientProfile.firstName} ${clientProfile.lastName}`}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>
                  {clientProfile.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {clientProfile.firstName} {clientProfile.lastName}
                    </h2>
                    {clientProfile.isVerified && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.floor(clientProfile.averageRating))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {clientProfile.averageRating} ({clientProfile.totalReviews} reviews)
                      </span>
                    </div>
                    <Badge variant="secondary">{clientProfile.totalSessions} sessions</Badge>
                  </div>

                  <p className="text-muted-foreground mb-4">{formatLastActive(clientProfile.lastActive)}</p>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => router.push(`/specialist-messages/${clientProfile.id}`)}
                      className="bg-gradient-to-r from-amber-500 to-orange-600"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" onClick={handleScheduleSession}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Session
                    </Button>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
                <p className="text-foreground">{clientProfile.about}</p>
              </div>

              {/* Contact & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{clientProfile.email}</p>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                      </div>
                    </div>
                    {clientProfile.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{clientProfile.phone}</p>
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                        </div>
                      </div>
                    )}
                    {clientProfile.location && (
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{clientProfile.location}</p>
                          <p className="text-sm text-muted-foreground">Location</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Platform Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{formatDate(clientProfile.memberSince)}</p>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{clientProfile.timeOnPlatform}</p>
                        <p className="text-sm text-muted-foreground">Time on Platform</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{clientProfile.totalSessions} sessions</p>
                        <p className="text-sm text-muted-foreground">Total Sessions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferred Services */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Preferred Services</h3>
                <div className="flex flex-wrap gap-2">
                  {clientProfile.preferredServices.map((service, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Session History */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Session History</h3>
              <div className="space-y-4">
                {clientProfile.sessionHistory.map((session) => (
                  <div key={session.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground">{session.service}</h4>
                        <p className="text-sm text-muted-foreground">{formatDate(session.date)}</p>
                      </div>
                      <div className="flex items-center space-x-1">{renderStars(session.rating)}</div>
                    </div>
                    {session.review && <p className="text-sm text-muted-foreground mt-2 italic">"{session.review}"</p>}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Schedule Session Dialog */}
        <ScheduleSessionDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          client={{
            id: clientProfile.id,
            name: `${clientProfile.firstName} ${clientProfile.lastName}`,
            avatar: clientProfile.avatar,
            service: clientProfile.preferredServices[0],
            isOnline: true,
            isVerified: clientProfile.isVerified,
            totalSessions: clientProfile.totalSessions,
          }}
          onCreateBooking={handleCreateBooking}
        />
      </main>
    </div>
  )
}
