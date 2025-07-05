"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircleMore, Wind, Lightbulb, Heart, HandIcon as Hands } from "lucide-react"

export function SpecialistDashboardFeedbacks() {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
            <MessageCircleMore className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Client Feedbacks</h2>
            <p className="text-sm text-gray-500">View emotional experiences and reviews from your clients</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200">
          {clientFeedbacks.length} reviews
        </Badge>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-6">
        {clientFeedbacks.map((feedback) => (
          <Card key={feedback.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              {/* Session Details Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative flex-shrink-0">
                  <img
                    src={feedback.avatar || "/placeholder.svg"}
                    alt={feedback.client}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 tracking-tight truncate">
                        {feedback.service}
                      </h3>
                      <p className="text-gray-600">with {feedback.client}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="inline-flex items-center px-3 py-1 bg-violet-600 text-white rounded-full text-sm font-semibold">
                        {feedback.price} Centi
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-violet-600" />
                      <span className="text-sm font-medium text-gray-700">{formatDate(feedback.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{feedback.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotions */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Emotions Experienced:</h4>
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
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-sm border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Client's Journey:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed italic">"{feedback.review}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
