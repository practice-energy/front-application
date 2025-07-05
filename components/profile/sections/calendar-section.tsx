"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, User, Check, X, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Booking } from "@/types/booking"
import { mockBookings } from "@/services/booking-data"

interface CalendarSectionProps {
  className?: string
}

interface MeetingCard {
  id: string
  service: {
    id: string
    name: string
    photo?: string
  }
  specialist: {
    id: string
    name: string
    photo: string
  }
  date: string
  time: string
  duration: number
  format: "video" | "in-person"
  status: "upcoming" | "completed" | "cancelled"
  price: number
  requiresConfirmation?: boolean
}

// Convert booking to meeting card format
function convertBookingToMeetingCard(booking: Booking): MeetingCard {
  try {
    return {
      id: booking.id,
      service: {
        id: booking.serviceId || booking.id,
        name: booking.service?.name || "Unknown Service",
        photo: undefined, // No actual photos in mock data
      },
      specialist: {
        id: booking.specialist?.id || "unknown",
        name: booking.specialist?.name || "Unknown Specialist",
        photo: booking.specialist?.photo || "/placeholder.svg?height=40&width=40",
      },
      date: booking.date ? booking.date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      time: booking.date
        ? booking.date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "12:00 PM",
      duration: booking.duration || 60,
      format: booking.format || "video",
      status: booking.status || "upcoming",
      price: booking.service?.price || 0,
      requiresConfirmation: booking.requiresConfirmation || false,
    }
  } catch (error) {
    console.error("Error converting booking:", booking, error)
    // Return a fallback meeting card
    return {
      id: booking.id || Math.random().toString(),
      service: {
        id: "fallback-service",
        name: "Service Session",
      },
      specialist: {
        id: "fallback-specialist",
        name: "Specialist",
        photo: "/placeholder.svg?height=40&width=40",
      },
      date: new Date().toISOString().split("T")[0],
      time: "12:00 PM",
      duration: 60,
      format: "video",
      status: "upcoming",
      price: 50,
    }
  }
}

// Loading skeleton component
function MeetingCardSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Header skeleton - MOVED TO TOP */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        </div>
      </div>

      {/* Photo placeholder skeleton */}
      <div className="w-full h-80 md:h-96 bg-gray-200 dark:bg-gray-700"></div>

      {/* Content skeleton */}
      <div className="p-4 pt-2 space-y-3">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Instagram-style meeting card component
function InstagramMeetingCard({
  meeting,
  onApprove,
  onCancel,
  isVisible,
}: {
  meeting: MeetingCard
  onApprove?: (id: string) => void
  onCancel?: (id: string) => void
  isVisible: boolean
}) {
  const router = useRouter()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      case "cancelled":
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getFormatIcon = () => {
    if (meeting.format === "video") {
      return <Video className="w-4 h-4 text-violet-600 dark:text-violet-400" />
    } else {
      return <User className="w-4 h-4 text-violet-600 dark:text-violet-400" />
    }
  }

  const handleCardClick = () => {
    router.push(`/service/${meeting.service.id}`)
  }

  const handleSpecialistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/specialist/${meeting.specialist.id}`)
  }

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onApprove?.(meeting.id)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCancel?.(meeting.id)
  }

  const handleRebook = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/service/${meeting.service.id}#booking`)
  }

  // Only render content when visible (lazy loading)
  if (!isVisible) {
    return <MeetingCardSkeleton />
  }

  return (
    <div
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:scale-[1.01] transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={handleCardClick}
    >
      {/* Header with specialist info and status - MOVED TO TOP */}
      <div className="flex items-center justify-between p-4 pb-2">
        <button
          onClick={handleSpecialistClick}
          className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
        >
          <Avatar className="h-10 w-10 rounded-sm">
            <AvatarImage src={meeting.specialist.photo || "/placeholder.svg"} />
            <AvatarFallback className="rounded-sm">
              {meeting.specialist.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            {meeting.specialist.name}
          </span>
        </button>
        <span className={cn("rounded-full px-3 py-1 text-xs font-medium", getStatusColor(meeting.status))}>
          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
        </span>
      </div>

      {/* Photo placeholder */}
      <div className="w-full h-80 md:h-96 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {meeting.service.photo ? (
          <img
            src={meeting.service.photo || "/placeholder.svg"}
            alt={meeting.service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        {/* Service details */}
        <div className="text-center space-y-1 mb-4">
          <h3 className="text-lg font-bold text-center mt-2 dark:text-gray-100">{meeting.service.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {formatDate(meeting.date)} at {meeting.time}
          </p>
          <div className="flex justify-center items-center gap-1 mt-1">
            {getFormatIcon()}
            <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
              {meeting.format === "video" ? "Video call" : "In-person"} • {meeting.duration}min
            </span>
          </div>
        </div>

        {/* Footer with price and actions - Reorganized buttons */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-center">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${meeting.price}</span>
          </div>

          {meeting.status === "upcoming" && (
            <div className="flex justify-between items-center">
              {/* Approve/Rebook button - Left aligned */}
              <div>
                {meeting.requiresConfirmation ? (
                    <button
                        className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors px-3 py-1 rounded-md bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                        onClick={handleApprove}
                    >
                      <Check className="w-4 h-4 inline mr-1" />
                      Approve
                    </button>
                ) : (
                    <button
                        className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors px-3 py-1 rounded-md bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                        onClick={handleRebook}
                    >
                      Rebook
                    </button>
                )}
              </div>

              {/* Cancel button - Left aligned */}
              <button
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  onClick={handleCancel}
              >
                <X className="w-4 h-4 inline mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Custom hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([])
  const observer = useRef<IntersectionObserver>()

  const observe = useCallback(
    (element: Element) => {
      if (observer.current) {
        observer.current.observe(element)
      }
    },
    [observer],
  )

  const unobserve = useCallback(
    (element: Element) => {
      if (observer.current) {
        observer.current.unobserve(element)
      }
    },
    [observer],
  )

  useEffect(() => {
    if (typeof window !== "undefined" && window.IntersectionObserver) {
      observer.current = new IntersectionObserver((entries) => {
        setEntries(entries)
      }, options)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [options])

  return { entries, observe, unobserve }
}

export function CalendarSection({ className }: CalendarSectionProps) {
  const [meetings, setMeetings] = useState<MeetingCard[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())

  const { entries, observe, unobserve } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  })

  // Convert bookings to meeting cards
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        console.log("Loading mock bookings:", mockBookings) // Debug log
        const convertedMeetings = mockBookings.map(convertBookingToMeetingCard)
        console.log("Converted meetings:", convertedMeetings) // Debug log
        setMeetings(convertedMeetings)
        setLoading(false)
      } catch (error) {
        console.error("Error converting bookings:", error)
        // Fallback: create some basic mock data if conversion fails
        const fallbackMeetings: MeetingCard[] = [
          {
            id: "1",
            service: {
              id: "1",
              name: "Psychology Consultation",
            },
            specialist: {
              id: "1",
              name: "Dr. Anna Smith",
              photo: "/placeholder.svg?height=40&width=40",
            },
            date: new Date().toISOString().split("T")[0],
            time: "2:00 PM",
            duration: 60,
            format: "video",
            status: "upcoming",
            price: 85,
            requiresConfirmation: true,
          },
          {
            id: "2",
            service: {
              id: "2",
              name: "Life Coaching Session",
            },
            specialist: {
              id: "2",
              name: "Michael Johnson",
              photo: "/placeholder.svg?height=40&width=40",
            },
            date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
            time: "10:30 AM",
            duration: 45,
            format: "in-person",
            status: "upcoming",
            price: 65,
          },
          {
            id: "3",
            service: {
              id: "3",
              name: "Nutrition Consultation",
            },
            specialist: {
              id: "3",
              name: "Sarah Williams",
              photo: "/placeholder.svg?height=40&width=40",
            },
            date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
            time: "4:00 PM",
            duration: 60,
            format: "video",
            status: "completed",
            price: 75,
          },
        ]
        setMeetings(fallbackMeetings)
        setLoading(false)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Handle intersection observer entries
  useEffect(() => {
    if (entries.length === 0) return

    setVisibleCards((prevVisibleCards) => {
      const newVisibleCards = new Set(prevVisibleCards)
      let hasChanges = false

      entries.forEach((entry) => {
        const cardId = entry.target.getAttribute("data-card-id")
        if (cardId) {
          if (entry.isIntersecting && !newVisibleCards.has(cardId)) {
            newVisibleCards.add(cardId)
            hasChanges = true
          }
        }
      })

      return hasChanges ? newVisibleCards : prevVisibleCards
    })
  }, [entries])

  // Set up intersection observer for each card
  const cardRef = useCallback(
    (node: HTMLDivElement | null, cardId: string) => {
      if (node) {
        node.setAttribute("data-card-id", cardId)
        observe(node)
      }
    },
    [observe],
  )

  const handleApprove = (meetingId: string) => {
    setMeetings((prev) =>
      prev.map((meeting) => (meeting.id === meetingId ? { ...meeting, requiresConfirmation: false } : meeting)),
    )
  }

  const handleCancel = (meetingId: string) => {
    setMeetings((prev) =>
      prev.map((meeting) => (meeting.id === meetingId ? { ...meeting, status: "cancelled" as const } : meeting)),
    )
  }

  if (loading) {
    return (
      <div className={cn("w-full max-w-[935px] mx-auto px-4 lg:px-6 space-y-6 transition-all duration-300", className)}>
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <MeetingCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-[935px] mx-auto px-4 lg:px-6 space-y-6 transition-all duration-300", className)}>
      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No bookings yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Your appointments will appear here once you book a session.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
          <div className="space-y-6">
            {meetings.map((meeting) => (
              <div key={meeting.id} ref={(node) => cardRef(node, meeting.id)}>
                <InstagramMeetingCard
                  meeting={meeting}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  isVisible={visibleCards.has(meeting.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
