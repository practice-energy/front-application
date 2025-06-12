"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, MapPin, Calendar, ChevronLeft, ChevronRight, MessageCircle, ArrowUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { useTranslations } from "@/hooks/use-translations"
import { DateSelection } from "@/components/date-selection"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SlotBasedTimeAvailability } from "@/components/slot-based-time-availability"
import { SpecialistPhotoGallery } from "@/components/specialist-photo-gallery"

// Mock feedback data
const feedbacks = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    text: "Elena's astrology reading was incredibly insightful. She helped me understand patterns in my life that I never noticed before. Highly recommend!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Michael R.",
    rating: 5,
    date: "1 month ago",
    text: "Amazing life coaching session. Elena has a gift for asking the right questions and helping you find your own answers. Very grateful for her guidance.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Jessica L.",
    rating: 4,
    date: "3 weeks ago",
    text: "The meditation guidance was exactly what I needed. Elena created a safe space for me to explore my inner world. Will definitely book again.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "David K.",
    rating: 5,
    date: "1 week ago",
    text: "Professional, compassionate, and incredibly knowledgeable. Elena's spiritual consultation gave me clarity on my life path.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Maria S.",
    rating: 5,
    date: "2 months ago",
    text: "The birth chart analysis was detailed and accurate. Elena explained everything in a way that was easy to understand and apply to my life.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "James T.",
    rating: 4,
    date: "3 weeks ago",
    text: "Great experience overall. Elena is very intuitive and provided valuable insights during our life coaching session.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Mock data for specialists
const allSpecialists = [
  {
    id: 1,
    images: [
      "/placeholder.svg?height=600&width=600&text=Main+Profile+Photo",
      "/placeholder.svg?height=300&width=300&text=Session+Photo+1",
      "/placeholder.svg?height=300&width=300&text=Session+Photo+2",
      "/placeholder.svg?height=300&width=300&text=Office+Space",
      "/placeholder.svg?height=300&width=300&text=Certification",
      "/placeholder.svg?height=300&width=300&text=Workshop+Photo+1",
      "/placeholder.svg?height=300&width=300&text=Workshop+Photo+2",
      "/placeholder.svg?height=300&width=300&text=Client+Session",
      "/placeholder.svg?height=300&width=300&text=Meditation+Space",
    ],
    name: "Elena Rodriguez",
    title: "Spiritual Guide & Life Coach",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 127,
    specialties: ["Astrology", "Life Coaching", "Meditation"],
    isNew: true,
    bio: "With over 15 years of experience in spiritual guidance and life coaching, I help clients find clarity, purpose, and balance. My approach combines traditional astrological wisdom with modern coaching techniques to create personalized paths for growth and transformation.",
    education: ["Certified Life Coach, International Coach Federation", "Master's in Psychology, Stanford University"],
    experience: [
      "Senior Life Coach at Mindful Living Center (2015-Present)",
      "Spiritual Guide at Wellness Collective (2010-2015)",
    ],
    services: [
      {
        id: 1,
        name: "Personal Astrology Reading",
        duration: "60 minutes",
        price: 120,
        images: [
          "/placeholder.svg?height=400&width=600&text=Astrology+Chart",
          "/placeholder.svg?height=400&width=600&text=Astrology+Session",
          "/placeholder.svg?height=400&width=600&text=Astrology+Tools",
        ],
        description:
          "Comprehensive birth chart analysis and personal insights to help you understand your life path, strengths, challenges, and opportunities for growth.",
      },
      {
        id: 2,
        name: "Life Coaching Session",
        duration: "50 minutes",
        price: 95,
        images: [
          "/placeholder.svg?height=400&width=600&text=Coaching+Session",
          "/placeholder.svg?height=400&width=600&text=Goal+Setting",
          "/placeholder.svg?height=400&width=600&text=Personal+Development",
        ],
        description:
          "Goal-setting and personal development guidance to help you overcome obstacles, clarify your vision, and create actionable steps toward your desired future.",
      },
      {
        id: 3,
        name: "Meditation Guidance",
        duration: "45 minutes",
        price: 80,
        images: [
          "/placeholder.svg?height=400&width=600&text=Meditation+Space",
          "/placeholder.svg?height=400&width=600&text=Mindfulness+Practice",
          "/placeholder.svg?height=400&width=600&text=Breathing+Techniques",
        ],
        description:
          "Personalized meditation techniques and practice sessions tailored to your specific needs, helping you develop mindfulness and inner peace.",
      },
      {
        id: 4,
        name: "Spiritual Consultation",
        duration: "90 minutes",
        price: 180,
        images: [
          "/placeholder.svg?height=400&width=600&text=Spiritual+Guidance",
          "/placeholder.svg?height=400&width=600&text=Energy+Healing",
          "/placeholder.svg?height=400&width=600&text=Spiritual+Tools",
        ],
        description:
          "Deep spiritual guidance and energy healing to address soul-level questions, spiritual awakening experiences, and connection to your higher purpose.",
      },
      {
        id: 5,
        name: "Birth Chart Analysis",
        duration: "75 minutes",
        price: 150,
        images: [
          "/placeholder.svg?height=400&width=600&text=Birth+Chart",
          "/placeholder.svg?height=400&width=600&text=Natal+Analysis",
          "/placeholder.svg?height=400&width=600&text=Astrological+Mapping",
        ],
        description:
          "Detailed natal chart interpretation and life path insights that reveal your unique cosmic blueprint and help you navigate life's journey with greater awareness.",
      },
    ],
    workHours: {
      start: 9, // 9 AM
      end: 17, // 5 PM
    },
    availability: {
      monday: ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      tuesday: ["10:00", "11:00", "13:00", "15:00", "16:00"],
      wednesday: ["9:00", "11:00", "14:00", "16:00"],
      thursday: ["10:00", "13:00", "15:00", "16:00"],
      friday: ["9:00", "11:00", "14:00"],
    },
    bookedSlots: {
      monday: ["12:00-13:00", "13:00-14:00"],
      tuesday: ["9:00-10:00", "14:00-15:00"],
      wednesday: ["10:00-11:00", "12:00-14:00", "15:00-16:00"],
      thursday: ["9:00-10:00", "11:00-13:00", "14:00-15:00"],
      friday: ["10:00-11:00", "12:00-14:00", "15:00-17:00"],
    },
  },
  {
    id: 2,
    images: [
      "/placeholder.svg?height=600&width=600&text=Main+Business+Photo",
      "/placeholder.svg?height=300&width=300&text=Consulting+Session",
      "/placeholder.svg?height=300&width=300&text=Workshop+Leading",
      "/placeholder.svg?height=300&width=300&text=Office+Space",
      "/placeholder.svg?height=300&width=300&text=Business+Presentation",
      "/placeholder.svg?height=300&width=300&text=Team+Meeting",
      "/placeholder.svg?height=300&width=300&text=Strategy+Session",
      "/placeholder.svg?height=300&width=300&text=Client+Meeting",
    ],
    name: "Marcus Chen",
    title: "Business Strategy Consultant",
    location: "New York, NY",
    rating: 4.8,
    reviews: 89,
    specialties: ["Business Strategy", "Leadership", "Finance"],
    isNew: false,
    bio: "I'm a strategic business consultant with expertise in helping startups and established companies optimize their operations and growth strategies. My background in finance and leadership development allows me to provide comprehensive guidance for businesses at any stage.",
    education: ["MBA, Harvard Business School", "BS in Economics, University of Pennsylvania"],
    experience: [
      "Senior Consultant at McKinsey & Company (2018-Present)",
      "Investment Banking Associate at Goldman Sachs (2014-2018)",
    ],
    services: [
      {
        id: 1,
        name: "Business Strategy Consultation",
        duration: "90 minutes",
        price: 250,
        images: [
          "/placeholder.svg?height=400&width=600&text=Strategy+Planning",
          "/placeholder.svg?height=400&width=600&text=Business+Analysis",
          "/placeholder.svg?height=400&width=600&text=Growth+Planning",
        ],
        description:
          "Comprehensive business planning and strategy development to optimize your operations, identify growth opportunities, and overcome challenges.",
      },
      {
        id: 2,
        name: "Leadership Development",
        duration: "60 minutes",
        price: 180,
        images: [
          "/placeholder.svg?height=400&width=600&text=Leadership+Training",
          "/placeholder.svg?height=400&width=600&text=Executive+Coaching",
          "/placeholder.svg?height=400&width=600&text=Team+Building",
        ],
        description:
          "Executive coaching and leadership skills enhancement to help you become a more effective leader and build high-performing teams.",
      },
      {
        id: 3,
        name: "Financial Planning Review",
        duration: "75 minutes",
        price: 200,
        images: [
          "/placeholder.svg?height=400&width=600&text=Financial+Analysis",
          "/placeholder.svg?height=400&width=600&text=Investment+Planning",
          "/placeholder.svg?height=400&width=600&text=Budget+Strategy",
        ],
        description:
          "Financial analysis and investment planning guidance to optimize your capital allocation and improve financial performance.",
      },
      {
        id: 4,
        name: "Startup Mentoring",
        duration: "45 minutes",
        price: 120,
        images: [
          "/placeholder.svg?height=400&width=600&text=Startup+Guidance",
          "/placeholder.svg?height=400&width=600&text=Pitch+Preparation",
          "/placeholder.svg?height=400&width=600&text=Funding+Strategy",
        ],
        description:
          "Guidance for early-stage entrepreneurs and startups on business models, funding strategies, and growth planning.",
      },
      {
        id: 5,
        name: "Market Analysis",
        duration: "120 minutes",
        price: 350,
        images: [
          "/placeholder.svg?height=400&width=600&text=Market+Research",
          "/placeholder.svg?height=400&width=600&text=Competitive+Analysis",
          "/placeholder.svg?height=400&width=600&text=Industry+Trends",
        ],
        description:
          "Comprehensive market research and competitive analysis to identify opportunities, threats, and positioning strategies.",
      },
    ],
    workHours: {
      start: 8, // 8 AM
      end: 18, // 6 PM
    },
    availability: {
      monday: ["8:00", "9:00", "10:00", "14:00", "15:00", "16:00", "17:00"],
      tuesday: ["9:00", "11:00", "13:00", "15:00", "16:00", "17:00"],
      wednesday: ["8:00", "10:00", "12:00", "14:00", "16:00", "17:00"],
      thursday: ["9:00", "11:00", "13:00", "15:00", "17:00"],
      friday: ["8:00", "10:00", "12:00", "15:00", "16:00"],
    },
    bookedSlots: {
      monday: ["11:00-14:00"],
      tuesday: ["8:00-9:00", "10:00-11:00", "14:00-15:00"],
      wednesday: ["9:00-10:00", "11:00-12:00", "13:00-14:00", "15:00-16:00"],
      thursday: ["8:00-9:00", "10:00-11:00", "12:00-13:00", "14:00-15:00", "16:00-17:00"],
      friday: ["9:00-10:00", "11:00-12:00", "13:00-15:00", "17:00-18:00"],
    },
  },
]

export default function SpecialistPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useTranslations()
  const { isAuthenticated } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: "user" | "specialist" }[]>([
    { text: "Hello! How can I help you today?", sender: "specialist" },
  ])
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Refs for scrolling
  const bookingRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const feedbackScrollRef = useRef<HTMLDivElement>(null)

  // Find the specialist by ID
  const specialist = allSpecialists.find((s) => s.id === Number(params.id)) || allSpecialists[0]

  // Create looped feedback array
  const loopedFeedbacks = [...feedbacks, ...feedbacks, ...feedbacks]

  // Auto-scroll feedback
  useEffect(() => {
    const scrollContainer = feedbackScrollRef.current
    if (!scrollContainer || isAutoScrollPaused) return

    let scrollPosition = 0
    const scrollSpeed = 0.5
    const cardWidth = 320 + 16 // card width + gap

    const autoScroll = () => {
      if (!isAutoScrollPaused) {
        scrollPosition += scrollSpeed
        if (scrollPosition >= cardWidth * feedbacks.length) {
          scrollPosition = 0
        }
        scrollContainer.scrollLeft = scrollPosition
      }
    }

    const interval = setInterval(autoScroll, 16) // ~60fps

    return () => clearInterval(interval)
  }, [isAutoScrollPaused])

  // Get day of week
  const getDayOfWeek = () => {
    return selectedDate
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase() as keyof typeof specialist.availability
  }

  // Get available times for selected date
  const getAvailableTimes = () => {
    const dayOfWeek = getDayOfWeek()
    return specialist.availability[dayOfWeek] || []
  }

  // Get booked slots for selected date
  const getBookedSlots = () => {
    const dayOfWeek = getDayOfWeek()
    return specialist.bookedSlots[dayOfWeek] || []
  }

  // Scroll to sections
  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToMessage = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle time selection from availability diagram
  const handleTimeSelect = (time: string) => {
    if (!selectedService) return

    setSelectedTime(time)

    // Calculate end time based on service duration
    const durationMinutes = Number.parseInt(selectedService.duration.split(" ")[0])
    const [hours, minutes] = time.split(":").map(Number)

    const startTime = new Date()
    startTime.setHours(hours, minutes, 0, 0)

    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + durationMinutes)

    const endTimeStr = `${endTime.getHours().toString().padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`
    setSelectedTimeRange(`${time}-${endTimeStr}`)
  }

  // Check if a time slot is available
  const isTimeSlotAvailable = (time: string) => {
    if (!selectedService) return false

    // Parse the time
    const [hours, minutes] = time.split(":").map(Number)
    const timeValue = hours + minutes / 60

    // Get duration in hours
    const durationHours = Number.parseInt(selectedService.duration.split(" ")[0]) / 60

    // Check if the time slot fits within work hours
    if (timeValue + durationHours > specialist.workHours.end) {
      return false
    }

    // Check if the time slot overlaps with any booked slots
    const bookedSlots = getBookedSlots()
    for (const slot of bookedSlots) {
      const [bookedStart, bookedEnd] = slot.split("-")

      const [bsHours, bsMinutes] = bookedStart.split(":").map(Number)
      const [beHours, beMinutes] = bookedEnd.split(":").map(Number)

      const bookedStartValue = bsHours + bsMinutes / 60
      const bookedEndValue = beHours + beMinutes / 60

      // Check for overlap
      if (
        (timeValue >= bookedStartValue && timeValue < bookedEndValue) ||
        (timeValue + durationHours > bookedStartValue && timeValue < bookedEndValue)
      ) {
        return false
      }
    }

    return true
  }

  // Handle booking
  const handleBooking = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true)
      return
    }

    if (selectedTime && selectedService) {
      setBookingModalOpen(true)
    }
  }

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setAuthModalOpen(true)
      return
    }

    if (message.trim()) {
      setChatMessages([...chatMessages, { text: message, sender: "user" }])
      setMessage("")

      // Mock response after a short delay
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            text: `Thank you for your message. I'll get back to you as soon as possible.`,
            sender: "specialist",
          },
        ])
      }, 1000)
    }
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-current text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  // Render time availability diagram
  const renderTimeAvailabilityDiagram = () => {
    if (!selectedService) return null

    return (
      <SlotBasedTimeAvailability
        selectedDate={selectedDate}
        selectedService={selectedService}
        specialist={specialist}
        onTimeSelect={handleTimeSelect}
        selectedTime={selectedTime}
        onBooking={handleBooking}
      />
    )
  }

  // Handle gallery image click
  const handleGalleryImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setGalleryOpen(true)
  }

  // Handle service card click to navigate to service page
  const handleServiceCardClick = (serviceId: number) => {
    router.push(`/service/${serviceId}`)
  }

  return (
    <>
      <main className="pb-8 overflow-x-hidden">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Button variant="ghost" className="mt-4 mb-2 pl-0 text-gray-600" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main content - responsive width */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Specialist header with fixed photo gallery layout */}
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  {/* Photo Gallery - Using the new component */}
                  <SpecialistPhotoGallery
                    images={specialist.images}
                    name={specialist.name}
                    onImageClick={handleGalleryImageClick}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mr-3">{specialist.name}</h1>
                      {specialist.isNew && (
                        <Badge className="bg-violet-600 text-white mt-2 sm:mt-0 mx-auto sm:mx-0 w-fit">
                          {t("common.new")}
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl text-gray-700 mb-2">{specialist.title}</h2>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
                      <div className="flex items-center justify-center sm:justify-start">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-gray-600">{specialist.location}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start">
                        <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                        <span className="font-medium">{specialist.rating}</span>
                        <span className="text-gray-600 ml-1">
                          ({specialist.reviews} {t("specialist.practices")})
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {specialist.specialties.map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-violet-50 text-violet-700 border border-violet-200"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Bio description */}
                    <div className="text-center sm:text-left">
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{specialist.bio}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-6">
                    {t("specialistProfile.about")} {specialist.name}
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold mb-4">
                        {t("specialistProfile.educationCredentials")}
                      </h4>
                      <ul className="space-y-2">
                        {specialist.education.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-violet-600 text-xs">•</span>
                            </div>
                            <span className="text-sm sm:text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-semibold mb-4">{t("specialistProfile.experience")}</h4>
                      <ul className="space-y-2">
                        {specialist.experience.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-violet-600 text-xs">•</span>
                            </div>
                            <span className="text-sm sm:text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Booking Section */}
                <div ref={bookingRef}>
                  <h3 className="text-xl sm:text-2xl font-bold mb-6">Book a Session</h3>

                  <div className="space-y-6">
                    {/* Service Cards - Grid Layout */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">{t("specialistProfile.services")}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {specialist.services.map((service, index) => (
                          <Card
                            key={index}
                            className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-200 hover:border-violet-300"
                            onClick={() => handleServiceCardClick(service.id)}
                          >
                            <div className="flex flex-col h-full">
                              {/* Image - Smaller for grid */}
                              <div className="relative w-full h-48 overflow-hidden">
                                <img
                                  src={service.images[0] || "/placeholder.svg"}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Content - Compact for grid */}
                              <div className="p-4 flex-1 flex flex-col">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-lg mb-2 text-gray-900">{service.name}</h5>
                                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{service.description}</p>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                  <div className="flex flex-col">
                                    <span className="text-violet-600 font-bold text-xl">${service.price}</span>
                                    <span className="text-gray-500 text-sm">{service.duration}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Date Selection */}
                    {selectedService && (
                      <DateSelection
                        selectedDate={selectedDate}
                        onDateSelect={(date) => {
                          setSelectedDate(date)
                          setSelectedTime(null)
                          setSelectedTimeRange(null)
                        }}
                      />
                    )}

                    {/* Time Availability Diagram */}
                    {selectedService && selectedDate && renderTimeAvailabilityDiagram()}
                  </div>
                </div>

                {/* Feedback Section - Auto-scroll without arrow buttons */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-6">{t("specialistProfile.clientFeedback")}</h3>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                    <div
                      ref={feedbackScrollRef}
                      className="flex space-x-4 overflow-x-hidden pb-4 scroll-smooth"
                      style={{ scrollBehavior: "smooth" }}
                      onMouseEnter={() => setIsAutoScrollPaused(true)}
                      onMouseLeave={() => setIsAutoScrollPaused(false)}
                    >
                      {loopedFeedbacks.map((feedback, index) => (
                        <div
                          key={`${feedback.id}-${index}`}
                          className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-center mb-3">
                            <img
                              src={feedback.avatar || "/placeholder.svg"}
                              alt={feedback.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-gray-900 truncate">{feedback.name}</h5>
                                <span className="text-sm text-gray-500 flex-shrink-0 ml-2">{feedback.date}</span>
                              </div>
                              <div className="flex items-center mt-1">{renderStars(feedback.rating)}</div>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{feedback.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simple Message Section */}
                <div ref={messageRef} className="bg-gray-50 rounded-xl p-6">
                  {/* Simple Chat Messages */}
                  <div className="bg-white rounded-lg border mb-4 max-h-60 overflow-y-auto">
                    <div className="p-4 space-y-3">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${
                              msg.sender === "user" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Simple Message Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!message.trim()}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Fixed sidebar card */}
            <div className="hidden lg:block lg:w-72 lg:flex-shrink-0">
              <div className="fixed w-72">
                <Card className="p-4 sm:p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                      <img
                        src={specialist.images[0] || "/placeholder.svg"}
                        alt={specialist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg">{specialist.name}</h3>
                    <p className="text-gray-600 text-sm">{specialist.title}</p>
                    <div className="flex items-center justify-center mt-2">
                      <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                      <span className="font-medium">{specialist.rating}</span>
                      <span className="text-gray-600 ml-1">({specialist.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" onClick={scrollToBooking}>
                      <Calendar className="h-4 w-4 mr-2" />
                      {t("specialistProfile.bookSession")}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={scrollToMessage}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t("specialistProfile.sendMessage")}
                    </Button>
                  </div>

                  <div className="mt-6 pt-4">
                    <div className="flex flex-wrap gap-1">
                      {specialist.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-violet-50 text-violet-700 border border-violet-200"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Photo Gallery Modal */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          <div className="relative h-[80vh]">
            <img
              src={specialist.images[selectedImageIndex] || "/placeholder.svg"}
              alt={`${specialist.name} photo ${selectedImageIndex + 1}`}
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {specialist.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${selectedImageIndex === index ? "bg-white" : "bg-white/50"}`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setGalleryOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? specialist.images.length - 1 : prev - 1))}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={() => setSelectedImageIndex((prev) => (prev === specialist.images.length - 1 ? 0 : prev + 1))}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />

      {selectedService && selectedTime && (
        <BookingConfirmation
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          bookingDetails={{
            specialist: {
              name: specialist.name,
              image: specialist.images[0],
              title: specialist.title,
            },
            service: selectedService,
            date: selectedDate.toISOString(),
            time: selectedTime,
          }}
        />
      )}
    </>
  )
}
