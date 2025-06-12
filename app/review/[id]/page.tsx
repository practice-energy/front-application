"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Video,
  ArrowLeft,
  CheckCircle,
  Wind,
  Lightbulb,
  HelpCircle,
  Heart,
  HandIcon as Hands,
  Waves,
  ArrowRight,
  SkipBackIcon as Skip,
  User,
} from "lucide-react"

// Mock session data - in real app this would come from API
const getSessionData = (id: string) => ({
  id: Number.parseInt(id),
  specialistName: "Dr. Sarah Williams",
  specialistAvatar: "/placeholder.svg?height=80&width=80",
  service: "Nutrition Consultation",
  date: "2024-01-22",
  time: "10:00 AM",
  duration: "45 minutes",
  price: "95 Centi",
  type: "video",
})

const emotionRatings = [
  {
    value: 1,
    icon: Wind,
    label: "Relief",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Felt a sense of release and calm",
  },
  {
    value: 2,
    icon: Lightbulb,
    label: "Inspiration",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    description: "Gained new insights and motivation",
  },
  {
    value: 3,
    icon: HelpCircle,
    label: "Confusion",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Left with questions to explore",
  },
  {
    value: 4,
    icon: Heart,
    label: "Vulnerability",
    color: "text-pink-500",
    bgColor: "bg-pink-200",
    borderColor: "border-pink-200",
    description: "Opened up and felt emotionally exposed",
  },
  {
    value: 5,
    icon: Hands,
    label: "Gratitude",
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Deeply thankful for the experience",
  },
  {
    value: 6,
    icon: Waves,
    label: "Mild Anxiety",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Feeling slightly unsettled or nervous",
  },
]

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedEmotions, setSelectedEmotions] = useState<number[]>([])
  const [hoverEmotion, setHoverEmotion] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const session = getSessionData(params.id)

  const toggleEmotion = (emotionValue: number) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotionValue) ? prev.filter((e) => e !== emotionValue) : [...prev, emotionValue],
    )
  }

  const handleNextStep = () => {
    if (selectedEmotions.length > 0) {
      setCurrentStep(2)
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(1)
  }

  const handleSubmit = async (withReview = true) => {
    if (selectedEmotions.length === 0) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Redirect back to calendar after 2 seconds
    setTimeout(() => {
      router.push("/profile?section=calendar")
    }, 2000)
  }

  const handleSkipReview = () => {
    handleSubmit(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="p-12 text-center border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Review Submitted!</h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Thank you for sharing your emotional experience. Your feedback helps other users and specialists
              understand the impact of their services.
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <span className="ml-2 text-sm font-medium">Redirecting to calendar...</span>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calendar
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              {currentStep === 1 ? "Share Your Experience" : "Tell Your Story"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {currentStep === 1
                ? "Your feedback helps create better therapeutic experiences"
                : "Add details about your journey (optional)"}
            </p>
          </div>

          {/* Session Details */}
          <Card className="p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background"></div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{session.service}</h3>
                    <p className="text-muted-foreground">with {session.specialistName}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-semibold">
                      {session.price}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{session.time}</p>
                      <p className="text-xs text-muted-foreground">{session.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    <Video className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Video Call</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step Content */}
          <Card className="p-8">
            {currentStep === 1 ? (
              /* Step 1: Emotion Selection */
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-3">What emotions did you experience?</h2>
                  <p className="text-muted-foreground text-lg">
                    Select all that resonate with your experience - emotions are complex and layered
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {emotionRatings.map((emotion) => {
                    const IconComponent = emotion.icon
                    const isSelected = selectedEmotions.includes(emotion.value)

                    return (
                      <div key={emotion.value} className="group">
                        <button
                          type="button"
                          onClick={() => toggleEmotion(emotion.value)}
                          className={`w-full p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                            isSelected
                              ? `${emotion.borderColor} ${emotion.bgColor} shadow-lg scale-105`
                              : "border-border bg-card hover:border-muted-foreground hover:shadow-md"
                          }`}
                        >
                          <IconComponent
                            className={`h-8 w-8 mx-auto mb-3 transition-all duration-300 ${
                              isSelected ? emotion.color : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          />
                          <span
                            className={`text-sm font-semibold block transition-colors ${
                              isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          >
                            {emotion.label}
                          </span>
                        </button>
                      </div>
                    )
                  })}
                </div>

                {selectedEmotions.length > 0 && (
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Selected emotions:</p>
                        <p className="text-muted-foreground">
                          {selectedEmotions
                            .map((value) => emotionRatings.find((e) => e.value === value)?.label)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1 Navigation */}
                <div className="flex justify-between items-center pt-6">
                  <Button type="button" variant="outline" onClick={() => router.back()} className="px-8 py-3">
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={selectedEmotions.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Step 2: Written Review */
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-3">Share Your Journey</h2>
                  <p className="text-muted-foreground text-lg">
                    Add details about your experience - this step is completely optional
                  </p>
                </div>

                <div>
                  <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="What emotions came up for you? How did the specialist help you navigate them? What insights or breakthroughs did you experience? Your story can help others on their journey..."
                    rows={8}
                    maxLength={1000}
                    className="resize-none text-base leading-relaxed"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">Share as much or as little as feels comfortable</p>
                    <p className="text-sm text-muted-foreground">{review.length}/1000 characters</p>
                  </div>
                </div>

                {/* Step 2 Navigation */}
                <div className="flex justify-between items-center pt-6">
                  <Button type="button" variant="outline" onClick={handlePreviousStep} className="px-8 py-3">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSkipReview}
                      disabled={isSubmitting}
                      className="px-8 py-3"
                    >
                      <Skip className="h-4 w-4 mr-2" />
                      Skip & Submit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSubmit(true)}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
