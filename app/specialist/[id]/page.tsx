"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Images, MapPin, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { useTranslations } from "@/hooks/use-translations"
import { SearchBar } from "@/components/search-bar"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { AboutSection } from "@/components/about-section"
import { SquareImageGallery } from "@/components/square-image-gallery"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { getSpecialistById } from "@/services/mock-data"
import { ShareSpecialistModal } from "@/components/share-specialist-modal"
import { cn } from "@/lib/utils"
import { BackButton } from "@/components/ui/button-back"
import { notFound } from "next/navigation"

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
  const handleSearch = (query: string, category?: string) => {
    router.push(`/search/${specialist.id}?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ""}`)
  }

  return (
      <>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-[144px] relative">
          {/* Share button positioned absolutely in the header area */}
          <div className="absolute top-4 right-4 z-20">
            <Button
                variant="outline"
                size="sm"
                className={cn(
                    "text-gray-600 dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "shadow-md hover:shadow-lg",
                    "backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
                )}
                onClick={() => setShareModalOpen(true)}
            >
              <Share className="h-4 w-4 mr-2" />
              Поделиться
            </Button>
          </div>

          <div
              className="flex-1 overflow-hidden"
              style={{
                transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
              }}
              data-animating={isAnimating ? "true" : "false"}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
              {/* Back button */}
              <BackButton className="mb-6 text-gray-600 dark:text-gray-300" />

              {/* Instagram-style centered card - Made wider with max-w-4xl */}
              <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl mx-auto">
                {/* Specialist header with improved photo gallery layout */}
                <div className="p-6 space-y-6">
                  <div className="flex flex-col gap-4">
                    {/* Photo Gallery - Using the updated component */}
                    {specialist.images.length > 0 ? (
                        <SquareImageGallery
                            images={specialist.images}
                            alt="Profile photos"
                            ratioWidth={4}
                            ratioHeight={5}
                            orientation="vertical"
                            thumbnailsPerView={5}
                            borderRadius={8}
                        />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground dark:text-gray-400">
                          <Images className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No photos provided yet</p>
                        </div>
                    )}

                    <div className="text-left">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{specialist.name}</h1>
                      <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-3">{specialist.title}</h2>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          {location && <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />}
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{specialist.location}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{specialist.reviewCount} practices</span>
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

        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 dark:to-transparent pt-16">
            <div className="pb-6">
              <SearchBar
                  onSearch={handleSearch}
                  showHeading={false}
                  dynamicWidth={true}
                  placeholder={"Найти специалистов..."}
              />
            </div>
          </div>
        </div>

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
