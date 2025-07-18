"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Images, MapPin, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/modals/auth-modal"
import { useTranslations } from "@/hooks/use-translations"
import { Mufi } from "@/components/mufi/index"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { AboutSection } from "@/components/about-section"
import { SquareImageGallery } from "@/components/square-image-gallery"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { getSpecialistById, findChatBySpecialistId, addMessageToChat, mockChatData } from "@/services/mock-data"
import { ShareSpecialistModal } from "@/components/modals/share-specialist-modal"
import { cn } from "@/lib/utils"
import { BackButton } from "@/components/ui/button-back"
import { notFound } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import type { Chat, Message } from "@/types/chats"

export default function SpecialistPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useTranslations()
  const { id } = params
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedDate] = useState<Date>(new Date())
  const [selectedTime] = useState<string | null>(null)
  const [selectedService] = useState<any>(null)
  const [isAnimating] = useState(false)

  // Refs for scrolling
  const servicesRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const [shareModalOpen, setShareModalOpen] = useState(false)

  // Find the specialist by ID
  const specialist = getSpecialistById(id)

  // If specialist not found, show not-found page
  if (!specialist) {
    notFound()
  }

  // Handle service card click - navigate to service page
  const handleServiceCardClick = (service: any) => {
    router.push(`/service/${service.id}`)
  }

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
        avatar: specialist.avatar || "placeholder.jpg",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        messages: [userMessage],
        isAI: false,
        hasNew: false,
        createdAt: Date.now(),
        description: "",
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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-[144px] relative">
        <div
          className="flex-1 overflow-hidden"
          style={{
            transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
          }}
          data-animating={isAnimating ? "true" : "false"}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
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

            {/* Instagram-style centered card - Made wider with max-w-4xl */}
            <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl mx-auto">
              {/* Photo Gallery - Using the updated component */}
              {specialist.images.length > 0 ? (
                  <SquareImageGallery
                      images={specialist.images}
                      alt={specialist.name}
                      ratioWidth={4}
                      ratioHeight={5}
                      orientation="vertical"
                  />
              ) : (
                  <div className="text-center py-12 text-muted-foreground dark:text-gray-400">
                    <Images className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Еще нет фото</p>
                  </div>
              )}

              {/* Specialist header with improved photo gallery layout */}
              <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="text-left">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{specialist.name}</h1>
                    <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-3">{specialist.title}</h2>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        {/* Location icon and text */}
                        <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{specialist.location}</span>
                      </div>
                      <div className="flex items-center">
                        {/* Review count text */}
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                          {specialist.practices} практик
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="px-6 pb-6 space-y-8">
                <AboutSection
                  title={`${t("specialistProfile.about")} ${specialist.name}`}
                  description={specialist.description}
                  fullDescription={specialist.description}
                  education={specialist.education}
                  experience={specialist.experience}
                  showEducationExperience={true}
                />

                {/* Available Sessions Section */}
                <div ref={servicesRef}>
                  <h3 className="text-xl font-bold mb-6 dark:text-gray-100">Available Sessions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specialist.services.map((service) => (
                      <InstagramServiceCard
                        key={service.id}
                        service={service}
                        onClick={() => handleServiceCardClick(service)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 dark:to-transparent pt-16">
          <div className="pb-6">
            <Mufi
              onSearch={handleSearch}
              showHeading={false}
              dynamicWidth={true}
              placeholder={"Найти специалистов..."}
              chatTitle={specialist.name}
            />
          </div>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />

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
