"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {Clock, PersonStanding, Share, SquareUserIcon, Video} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { useTranslations } from "@/hooks/use-translations"
import { AirbnbCalendar } from "@/components/airbnb-calendar"
import { SearchBar } from "@/components/search-bar/index"
import { AboutSection } from "@/components/about-section"
import { FeedbackSection } from "@/components/feedback-section"
import { SquareImageGallery } from "@/components/square-image-gallery"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { mockServices, findChatBySpecialistId, addMessageToChat, mockChatData } from "@/services/mock-data"
import { BackButton } from "@/components/ui/button-back"
import { cn } from "@/lib/utils"
import { ShareSpecialistModal } from "@/components/share-specialist-modal"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"
import {Badge} from "@/components/ui/badge";

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const { t } = useTranslations()
  const { isAuthenticated } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [, setSelectedTimeRange] = useState<string | null>(null)
  const [isAnimating] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  // Refs for scrolling
  const bookingRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Find the service by ID
  const service = mockServices.find((s) => s.id === id) || mockServices[0]
  const specialist = service.specialist

  // Handle search
  const handleSearch = (query: string, title?: string, files: File[] = [], isPractice?: boolean) => {
    if (!query.trim() && files.length === 0) return

    const existingChat = findChatBySpecialistId(specialist.id)

    if (existingChat) {
      const userMessage: Omit<Message, "id"> = {
        type: "user",
        content: query,
        timestamp: Date.now(),
        files: files,
      }
      addMessageToChat(existingChat, userMessage)
      window.dispatchEvent(new CustomEvent("chatUpdated", { detail: { chatId: existingChat.id } }))
      router.push(`/search/${existingChat.id}`)
    } else {
      const newChatId = uuidv4()
      const userMessage: Message = {
        id: uuidv4(),
        type: "user",
        content: query,
        timestamp: Date.now(),
        files: files,
      }

      const newChat: Chat = {
        id: newChatId,
        title: specialist.name,
        specialistId: specialist.id,
        serviceId: service.id,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        messages: [userMessage],
        searchQueries: [query],
        isAi: false,
        hasNew: true,
        createdAt: Date.now(),
      }

      window.dispatchEvent(
        new CustomEvent("addNewChatToSidebar", {
          detail: {
            chat: {
              ...newChat,
              description: query,
              isPractice: isPractice,
            },
          },
        }),
      )

      mockChatData.push(newChat)
      router.push(`/search/${newChatId}`)
    }
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div
          className="flex-1 bg-white dark:bg-gray-900 overflow-hidden relative pb-[144px]"
          style={{
            transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
          }}
          data-animating={isAnimating ? "true" : "false"}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 ">
            <div className="flex items-center justify-between gap-4">
              {/* Back button */}
              <BackButton className="mb-6 text-gray-600 dark:text-gray-300" />

              {/* Share button positioned absolutely in the header area */}
              <div className="items-end">
                <Button
                    size="sm"
                    className={cn(
                        "text-gray-600 dark:text-white",
                        "shadow-md hover:shadow-lg",
                        "backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 mb-6",
                    )}
                    onClick={() => setShareModalOpen(true)}
                >
                  <Share className="h-4 w-4 mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Service header below the gallery */}
              <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4">
                  {/* Photo Gallery at the very top */}
                  <SquareImageGallery
                    images={service.images}
                    alt={specialist.name}
                    ratioHeight={1}
                    ratioWidth={1}
                    borderRadius={8}
                  />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{service.title}</h1>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold transition-colors duration-300">
                        {service.price}
                      <RubleIcon size={18} bold={true} className="mb-0.5" />
                    </div>
                    {service.format &&(
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-violet-50 text-violet-600 text-base border border-violet-600"
                    >
                      service.format === "video" && (<div>
                        <Video/>
                        <span className="text-sm">Видео</span>
                      </div>)
                        service.format === "in-person" && (<div>
                        <SquareUserIcon/>
                        <span className="text-sm">Лично</span>
                      </div>)
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Service description */}
                <div className="space-y-6">
                  {/* About This Service Section */}
                  <AboutSection
                    title="About This Service"
                    description={service.description}
                    fullDescription={service.description}
                    includes={service.includes}
                    showIncludes={true}
                  />

                  {/* Client Feedback Section */}
                  <FeedbackSection feedbacks={service.reviews} title="Client Feedback" />

                  {/* Booking Section */}
                  <div ref={bookingRef} id="booking" className="pt-4">
                    <h3 className="text-xl font-bold mb-6 dark:text-gray-100">Book This Service</h3>

                    {/* Fluid Layout for Calendar and Time Slots */}
                    <div className="space-y-6">
                      {/* Calendar */}
                      <div>
                        <AirbnbCalendar
                          selectedDate={selectedDate}
                          onDateSelect={(date) => {
                            setSelectedDate(date)
                            setSelectedTime(null)
                            setSelectedTimeRange(null)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed SearchBar at the bottom of the screen with sidebar sync */}
        <div ref={searchRef} className="fixed bottom-0 left-0 right-0 py-4">
          <div className="px-6">
            <SearchBar
              onSearch={handleSearch}
              showHeading={false}
              dynamicWidth={true}
              placeholder="Забронировать услугу"
              chatTitle={specialist.name}
            />
          </div>
        </div>
      </main>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />

      {selectedTime && (
        <BookingConfirmation
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          bookingDetails={{
            specialist: specialist,
            service: service,
            date: selectedDate.toISOString(),
            time: selectedTime,
          }}
        />
      )}

      <ShareSpecialistModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        specialist={{
          id,
          name: specialist.name,
          title: specialist.title,
        }}
      />
    </>
  )
}
