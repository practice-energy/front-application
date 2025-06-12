"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { SpecialistCard } from "@/components/specialist-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { ProfileButton } from "@/components/profile-button"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar"
import { AirbnbCalendar } from "@/components/airbnb-calendar"
import { SlotBasedTimeAvailability } from "@/components/slot-based-time-availability"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  specialists?: any[]
}

const mockSpecialists = [
  {
    id: 1,
    name: "Dr. Sarah Williams",
    title: "Wellness & Nutrition Expert",
    rating: 4.95,
    location: "Los Angeles, CA",
    reviews: 203,
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Nutrition", "Wellness", "Yoga"],
    isNew: false,
  },
  {
    id: 2,
    name: "Jean-Pierre Dubois",
    title: "Creative Arts Mentor",
    rating: 4.7,
    location: "Paris, France",
    reviews: 156,
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Art Therapy", "Creative Writing", "Design"],
    isNew: true,
  },
  {
    id: 3,
    name: "Priya Sharma",
    title: "Tech Career Advisor",
    rating: 4.92,
    location: "Bangalore, India",
    reviews: 78,
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Career Coaching", "Tech Skills", "Remote Work"],
    isNew: false,
  },
  {
    id: 4,
    name: "Marcus Thompson",
    title: "Life Coach & Mentor",
    rating: 4.88,
    location: "New York, NY",
    reviews: 145,
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Life Coaching", "Personal Growth", "Mindfulness"],
    isNew: false,
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    title: "Language Learning Expert",
    rating: 4.85,
    location: "Barcelona, Spain",
    reviews: 89,
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Language Learning", "Cultural Exchange", "Communication"],
    isNew: true,
  },
  {
    id: 6,
    name: "Dr. Ahmed Hassan",
    title: "Mental Health Counselor",
    rating: 4.93,
    location: "Dubai, UAE",
    reviews: 167,
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Mental Health", "Stress Management", "Therapy"],
    isNew: false,
  },
]

// Mock services data
const mockServices = [
  {
    id: 1,
    name: "Personal Astrology Reading",
    duration: "60 minutes",
    price: 120,
    image: "/placeholder.svg?height=400&width=600&text=Astrology+Chart",
    description: "Comprehensive birth chart analysis and personal insights to help you understand your life path.",
    specialist: {
      id: 1,
      name: "Elena Rodriguez",
      title: "Spiritual Guide & Life Coach",
      image: "/placeholder.svg?height=100&width=100&text=Elena",
      rating: 4.9,
      reviews: 127,
      workHours: { start: 9, end: 17 },
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
  },
  {
    id: 2,
    name: "Life Coaching Session",
    duration: "50 minutes",
    price: 95,
    image: "/placeholder.svg?height=400&width=600&text=Coaching+Session",
    description: "Goal-setting and personal development guidance to help you overcome obstacles.",
    specialist: {
      id: 1,
      name: "Elena Rodriguez",
      title: "Spiritual Guide & Life Coach",
      image: "/placeholder.svg?height=100&width=100&text=Elena",
      rating: 4.9,
      reviews: 127,
      workHours: { start: 9, end: 17 },
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
  },
  {
    id: 3,
    name: "Meditation Guidance",
    duration: "45 minutes",
    price: 80,
    image: "/placeholder.svg?height=400&width=600&text=Meditation+Space",
    description: "Personalized meditation techniques and practice sessions tailored to your specific needs.",
    specialist: {
      id: 1,
      name: "Elena Rodriguez",
      title: "Spiritual Guide & Life Coach",
      image: "/placeholder.svg?height=100&width=100&text=Elena",
      rating: 4.9,
      reviews: 127,
      workHours: { start: 9, end: 17 },
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
  },
  {
    id: 4,
    name: "Business Strategy Consultation",
    duration: "90 minutes",
    price: 250,
    image: "/placeholder.svg?height=400&width=600&text=Strategy+Planning",
    description: "Comprehensive business planning and strategy development to optimize your operations.",
    specialist: {
      id: 2,
      name: "Marcus Chen",
      title: "Business Strategy Consultant",
      image: "/placeholder.svg?height=100&width=100&text=Marcus",
      rating: 4.8,
      reviews: 89,
      workHours: { start: 8, end: 18 },
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
  },
]

// Memoized components for better performance
const MessageItem = React.memo(
  ({
    message,
    onSpecialistClick,
  }: {
    message: Message
    onSpecialistClick: (id: number) => void
  }) => {
    const handleSpecialistClick = useCallback(
      (specialistId: number) => {
        onSpecialistClick(specialistId)
      },
      [onSpecialistClick],
    )

    if (message.type === "user") {
      return (
        <div className="flex justify-end">
          <div className="flex items-start space-x-3 max-w-2xl">
            <div className="bg-violet-600 text-white rounded-2xl rounded-tr-md px-4 py-3">
              <p className="text-sm">{message.content}</p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      )
    }

    return (
      <div className="flex justify-start">
        <div className="flex items-start space-x-3 max-w-4xl w-full">
          <Avatar className="w-8 h-8 mt-1">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-violet-100 text-violet-600">AI</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            {/* Text Response */}
            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-800 leading-relaxed">{message.content}</p>
            </div>

            {/* Specialist Cards */}
            {message.specialists && message.specialists.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-violet-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Рекомендуемые специалисты</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {message.specialists.map((specialist) => (
                    <div key={specialist.id} className="transform hover:scale-105 transition-transform cursor-pointer">
                      <SpecialistCard specialist={specialist} onClick={() => handleSpecialistClick(specialist.id)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
)

const LoadingMessage = React.memo(() => (
  <div className="flex justify-start">
    <div className="flex items-start space-x-3">
      <Avatar className="w-8 h-8 mt-1">
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback className="bg-violet-100 text-violet-600">AI</AvatarFallback>
      </Avatar>
      <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <span className="text-sm text-gray-500">Поиск специалистов...</span>
        </div>
      </div>
    </div>
  </div>
))

export default function SearchPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Booking modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingConfirmationOpen, setBookingConfirmationOpen] = useState(false)

  // Memoized handlers for better performance
  const handleSpecialistClick = useCallback(
    (specialistId: number) => {
      router.push(`/specialist/${specialistId}`)
    },
    [router],
  )

  const handleViewProfile = useCallback(() => {
    router.push("/profile")
  }, [router])

  const handleBookService = useCallback(() => {
    if (!isAuthenticated) {
      setAuthModalOpen(true)
      return
    }
    setBookingModalOpen(true)
  }, [isAuthenticated])

  const handleServiceSelect = useCallback((service: any) => {
    setSelectedService(service)
    setSelectedTime(null) // Reset time when service changes
  }, [])

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time)
  }, [])

  const handleBooking = useCallback(() => {
    if (!isAuthenticated) {
      setAuthModalOpen(true)
      return
    }

    if (selectedTime && selectedService) {
      setBookingModalOpen(false)
      setBookingConfirmationOpen(true)
    }
  }, [isAuthenticated, selectedTime, selectedService])

  const updateChatTitle = useCallback(
    (query: string) => {
      const chatId = params.id as string
      const title = query.length > 30 ? `${query.substring(0, 30)}...` : query

      // Emit event to update chat title in sidebar
      window.dispatchEvent(
        new CustomEvent("chatTitleUpdated", {
          detail: { chatId, title },
        }),
      )
    },
    [params.id],
  )

  const handleSearch = useCallback(
    async (query: string, category?: string) => {
      if (!query.trim()) return

      // Update chat title in sidebar if this is the first message
      if (messages.length === 0) {
        updateChatTitle(query)
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: query,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        // Randomly select 3-4 specialists
        const numSpecialists = Math.floor(Math.random() * 2) + 3 // 3-4 specialists
        const shuffled = [...mockSpecialists].sort(() => 0.5 - Math.random())
        const selectedSpecialists = shuffled.slice(0, numSpecialists)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: `Вот результаты поиска по запросу "${query}". Я нашел ${numSpecialists} специалистов, которые могут помочь вам в этой области. Каждый из них имеет высокий рейтинг и большой опыт работы.`,
          timestamp: new Date(),
          specialists: selectedSpecialists,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1500)
    },
    [messages.length, updateChatTitle],
  )

  // Optimized scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Listen for sidebar state changes with animation synchronization
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      const { isCollapsed, isAnimating: sidebarAnimating } = event.detail
      setSidebarCollapsed(isCollapsed)
      setIsAnimating(true)

      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }

      // Set timeout to match animation duration
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false)
      }, ANIMATION_DURATION)
    }

    const handleAnimationComplete = () => {
      setIsAnimating(false)
    }

    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener)
    window.addEventListener("sidebarAnimationComplete", handleAnimationComplete as EventListener)

    // Check initial sidebar state from localStorage or default to collapsed
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState))
    } else {
      setSidebarCollapsed(true)
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
      window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener)
      window.removeEventListener("sidebarAnimationComplete", handleAnimationComplete as EventListener)
    }
  }, [])

  // Listen for chat history loading from sidebar
  useEffect(() => {
    const handleLoadChatHistory = (event: CustomEvent) => {
      const { chatId, messages: chatMessages, title } = event.detail
      const currentChatId = params.id as string

      if (chatId === currentChatId) {
        setMessages(chatMessages || [])
      }
    }

    window.addEventListener("loadChatHistory", handleLoadChatHistory as EventListener)

    return () => {
      window.removeEventListener("loadChatHistory", handleLoadChatHistory as EventListener)
    }
  }, [params.id])

  // Update messages in sidebar when they change
  useEffect(() => {
    const chatId = params.id as string
    window.dispatchEvent(
      new CustomEvent("chatMessagesUpdated", {
        detail: { chatId, messages },
      }),
    )
  }, [messages, params.id])

  // Memoized message list for performance
  const messageList = useMemo(
    () =>
      messages.map((message) => (
        <div key={message.id} className="space-y-4">
          <MessageItem message={message} onSpecialistClick={handleSpecialistClick} />
        </div>
      )),
    [messages, handleSpecialistClick],
  )

  return (
    <div className="flex h-screen flex-col">
      {/* Header with action buttons */}
      <div
        className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-end"
        style={{
          transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
        }}
      >
        <div className="flex items-center space-x-3">
          {/* Book Service Button - Icon only */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleBookService}>
            <Calendar className="h-4 w-4" />
          </Button>

          {/* View Profile Button - Icon only */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleViewProfile}>
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content - Grey background for scrollable area */}
      <div
        className="flex-1 bg-gray-100 overflow-hidden relative"
        style={{
          transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
        }}
        data-animating={isAnimating ? "true" : "false"}
      >
        {/* Messages Area with padding for fixed search bar */}
        <ScrollArea className="h-full px-6 py-4 pb-24">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg mb-4">Начните поиск специалистов</div>
                <div className="text-gray-400 text-sm">Введите ваш запрос в поле поиска ниже</div>
              </div>
            )}

            {messageList}

            {/* Loading Message */}
            {isLoading && <LoadingMessage />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Fixed Search Bar at Bottom with Dynamic Width */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10"
          style={{
            transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
          }}
        >
          <SearchBar onSearch={handleSearch} showHeading={false} dynamicWidth={true} />
        </div>
      </div>

      {/* Book Service Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book a Service</DialogTitle>
            <DialogDescription>Choose a service and schedule your appointment</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Service Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose a Service</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockServices.map((service) => (
                  <Card
                    key={service.id}
                    className={`overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedService?.id === service.id
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:border-violet-300"
                    }`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="flex flex-col h-full">
                      {/* Image */}
                      <div className="relative w-full h-32 overflow-hidden">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h5 className="font-semibold text-lg mb-2 text-gray-900">{service.name}</h5>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-violet-600 font-bold text-xl">${service.price}</span>
                            <span className="text-gray-500 text-sm">{service.duration}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{service.specialist.name}</p>
                            <p className="text-xs text-gray-500">{service.specialist.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            {selectedService && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Calendar */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Date</h3>
                  <AirbnbCalendar
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                      setSelectedDate(date)
                      setSelectedTime(null)
                    }}
                  />
                </div>

                {/* Time Availability */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose Time</h3>
                  <SlotBasedTimeAvailability
                    selectedDate={selectedDate}
                    selectedService={selectedService}
                    specialist={selectedService.specialist}
                    onTimeSelect={handleTimeSelect}
                    selectedTime={selectedTime}
                    onBooking={handleBooking}
                  />
                </div>
              </div>
            )}

            {/* Book Button */}
            {selectedService && selectedTime && (
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleBooking} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-2">
                  Book Session - ${selectedService.price}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />

      {/* Booking Confirmation Modal */}
      {selectedService && selectedTime && (
        <BookingConfirmation
          isOpen={bookingConfirmationOpen}
          onClose={() => setBookingConfirmationOpen(false)}
          bookingDetails={{
            specialist: {
              name: selectedService.specialist.name,
              image: selectedService.specialist.image,
              title: selectedService.specialist.title,
            },
            service: selectedService,
            date: selectedDate.toISOString(),
            time: selectedTime,
          }}
        />
      )}
    </div>
  )
}
