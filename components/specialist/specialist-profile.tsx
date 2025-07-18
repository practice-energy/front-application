"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/use-translations"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { AboutSection } from "@/components/about-section"
import { SquareImageGallery } from "@/components/square-image-gallery"
import { BackButton } from "@/components/ui/button-back"
import type { Specialist } from "@/types/common"
import { PentagramIcon } from "@/components/icons/icon-pentagram"

interface SpecialistProfileProps {
  specialist: Specialist
}

export default function SpecialistProfile({ specialist }: SpecialistProfileProps) {
  const router = useRouter()
  const { t } = useTranslations()
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const handleServiceCardClick = (service: any) => {
    router.push(`/service/${service.id}`)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-[144px] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with Back Button and Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <BackButton className="mb-6 text-gray-600 dark:text-gray-300" />
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              className="text-gray-600 dark:text-white shadow-md hover:shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 mb-6"
              onClick={() => setShareModalOpen(true)}
            >
              <Share className="h-4 w-4 mr-2" />
              {t("share")}
            </Button>
            <Button
              size="sm"
              className="text-gray-600 dark:text-white shadow-md hover:shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 mb-6"
            >
              <PentagramIcon className="h-4 w-4 mr-2" />
              {specialist.likes}
            </Button>
            <Button
              size="sm"
              className="text-gray-600 dark:text-white shadow-md hover:shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 mb-6"
            >
              {t("write_to_specialist")}
            </Button>
          </div>
        </div>

        {/* Instagram-style centered card */}
        <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-4xl mx-auto">
          {/* Photo Gallery */}
          {specialist.images.length > 0 ? (
            <SquareImageGallery
              images={specialist.images}
              alt={specialist.name}
              ratioWidth={4}
              ratioHeight={5}
              orientation="vertical"
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground dark:text-gray-400">{t("no_photos_yet")}</div>
          )}

          {/* Specialist header */}
          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{specialist.name}</h1>
                <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-3">{specialist.title}</h2>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{specialist.location}</span>
                  </div>
                  <div className="flex items-center">
                    <PentagramIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{specialist.practices} практик</span>
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
            <div>
              <h3 className="text-xl font-bold mb-6 dark:text-gray-100">{t("available_sessions")}</h3>
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
    </main>
  )
}
