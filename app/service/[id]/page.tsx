"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Clock, Calendar, MessageCircle, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { useTranslations } from "@/hooks/use-translations"
import { SlotBasedTimeAvailability } from "@/components/slot-based-time-availability"
import { AirbnbCalendar } from "@/components/airbnb-calendar"

// Mock service data
const allServices = [
  {
    id: 1,
    name: "Personal Astrology Reading",
    duration: "60 minutes",
    price: 120,
    images: [
      "/placeholder.svg?height=600&width=600&text=Astrology+Chart+Main",
      "/placeholder.svg?height=400&width=600&text=Astrology+Session",
      "/placeholder.svg?height=400&width=600&text=Astrology+Tools",
      "/placeholder.svg?height=400&width=600&text=Birth+Chart",
      "/placeholder.svg?height=400&width=600&text=Consultation+Room",
    ],
    description:
      "Comprehensive birth chart analysis and personal insights to help you understand your life path, strengths, challenges, and opportunities for growth.",
    fullDescription:
      "Dive deep into your cosmic blueprint with a comprehensive personal astrology reading. This session includes a detailed analysis of your birth chart, exploring the positions of planets, houses, and aspects at the time of your birth. We'll discuss your sun, moon, and rising signs, as well as how planetary transits are currently affecting your life. This reading provides valuable insights into your personality, relationships, career path, and spiritual journey.",
    includes: [
      "Complete birth chart analysis",
      "Personality and character insights",
      "Current planetary transits",
      "Relationship compatibility guidance",
      "Career and life path direction",
      "Written summary report",
    ],
    specialist: {
      id: 1,
      name: "Elena Rodriguez",
      title: "Spiritual Guide & Life Coach",
      image: "/placeholder.svg?height=100&width=100&text=Elena",
      rating: 4.9,
      reviews: 127,
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
  },
  {
    id: 2,
    name: "Life Coaching Session",
    duration: "50 minutes",
    price: 95,
    images: [
      "/placeholder.svg?height=600&width=800&text=Coaching+Session+Main",
      "/placeholder.svg?height=400&width=600&text=Goal+Setting",
      "/placeholder.svg?height=400&width=600&text=Personal+Development",
      "/placeholder.svg?height=400&width=600&text=Coaching+Tools",
      "/placeholder.svg?height=400&width=600&text=Progress+Tracking",
    ],
    description:
      "Goal-setting and personal development guidance to help you overcome obstacles, clarify your vision, and create actionable steps toward your desired future.",
    fullDescription:
      "Transform your life with personalized coaching designed to help you achieve your goals and unlock your potential. This session focuses on identifying your core values, setting meaningful objectives, and creating a clear action plan. We'll work together to overcome limiting beliefs, develop new habits, and build the confidence you need to succeed.",
    includes: [
      "Goal clarification and setting",
      "Action plan development",
      "Obstacle identification and solutions",
      "Confidence building techniques",
      "Progress tracking methods",
      "Follow-up resources and exercises",
    ],
    specialist: {
      id: 1,
      name: "Elena Rodriguez",
      title: "Spiritual Guide & Life Coach",
      image: "/placeholder.svg?height=100&width=100&text=Elena",
      rating: 4.9,
      reviews: 127,
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
  },
]

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useTranslations()
  const { isAuthenticated } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: "user" | "specialist" }[]>([
    { text: "Hello! How can I help you with this service?", sender: "specialist" },
  ])

  // Refs for scrolling
  const bookingRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)

  // Find the service by ID
  const service = allServices.find((s) => s.id === Number(params.id)) || allServices[0]
  const specialist = service.specialist

  // Scroll to sections
  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToMessage = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Get day of week
  const getDayOfWeek = () => {
    return selectedDate
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase() as keyof typeof specialist.availability
  }

  // Get booked slots for selected date
  const getBookedSlots = () => {
    const dayOfWeek = getDayOfWeek()
    return specialist.bookedSlots[dayOfWeek] || []
  }

  // Handle time selection from availability diagram
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)

    // Calculate end time based on service duration
    const durationMinutes = Number.parseInt(service.duration.split(" ")[0])
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
    // Parse the time
    const [hours, minutes] = time.split(":").map(Number)
    const timeValue = hours + minutes / 60

    // Get duration in hours
    const durationHours = Number.parseInt(service.duration.split(" ")[0]) / 60

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

    if (selectedTime) {
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
            text: `Thank you for your message about ${service.name}. I'll get back to you as soon as possible.`,
            sender: "specialist",
          },
        ])
      }, 1000)
    }
  }

  // Render time availability diagram
  const renderTimeAvailabilityDiagram = () => {
    return (
      <SlotBasedTimeAvailability
        selectedDate={selectedDate}
        selectedService={service}
        specialist={specialist}
        onTimeSelect={handleTimeSelect}
        selectedTime={selectedTime}
        onBooking={handleBooking}
      />
    )
  }

  return (
    <>
      <main className="pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Button variant="ghost" className="mt-4 mb-6 pl-0 text-gray-600" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{service.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-violet-600">${service.price}</span>
                  </div>
                </div>
              </div>

              {/* Image gallery */}
              <div className="space-y-4">
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <img
                    src={service.images[selectedImageIndex] || "/placeholder.svg"}
                    alt={`${service.name} - image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation arrows */}
                  {service.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={() =>
                          setSelectedImageIndex((prev) => (prev === 0 ? service.images.length - 1 : prev - 1))
                        }
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={() =>
                          setSelectedImageIndex((prev) => (prev === service.images.length - 1 ? 0 : prev + 1))
                        }
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Thumbnail navigation */}
                {service.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {service.images.map((image, index) => (
                      <button
                        key={index}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? "border-violet-500" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${service.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service description */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">{service.description}</p>
                  <p className="text-gray-600 leading-relaxed">{service.fullDescription}</p>
                </div>

                {/* What's included */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {service.includes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-violet-600 text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Booking Section */}
              <div ref={bookingRef} id="booking" className="pt-4">
                <h3 className="text-xl sm:text-2xl font-bold mb-6">Book This Service</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Calendar on the left */}
                  <div className="h-full">
                    <AirbnbCalendar
                      selectedDate={selectedDate}
                      onDateSelect={(date) => {
                        setSelectedDate(date)
                        setSelectedTime(null)
                        setSelectedTimeRange(null)
                      }}
                    />
                  </div>

                  {/* Time Availability on the right */}
                  <div className="h-full">{selectedDate && renderTimeAvailabilityDiagram()}</div>
                </div>
              </div>

              {/* Message Section */}
              <div ref={messageRef} id="message" className="bg-gray-50 rounded-xl p-6">
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

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="p-6">
                  {/* Specialist info */}
                  <div className="text-center mb-6">
                    <img
                      src={service.specialist.image || "/placeholder.svg"}
                      alt={service.specialist.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="font-bold text-lg">{service.specialist.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{service.specialist.title}</p>
                    <div className="flex items-center justify-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                      <span className="font-medium">{service.specialist.rating}</span>
                      <span className="text-gray-600 ml-1">({service.specialist.reviews})</span>
                    </div>
                  </div>

                  {/* Service details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-gray-100">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{service.duration}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-gray-100">
                      <span className="text-gray-600">Price</span>
                      <span className="font-bold text-xl text-violet-600">${service.price}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" onClick={scrollToBooking}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book This Service
                    </Button>
                    <Button variant="outline" className="w-full" onClick={scrollToMessage}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Specialist
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />

      {selectedTime && (
        <BookingConfirmation
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          bookingDetails={{
            specialist: {
              name: specialist.name,
              image: specialist.image,
              title: specialist.title,
            },
            service: service,
            date: selectedDate.toISOString(),
            time: selectedTime,
          }}
        />
      )}
    </>
  )
}
