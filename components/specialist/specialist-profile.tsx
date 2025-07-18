"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Share, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/use-translations"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { BackButton } from "@/components/ui/button-back"
import type { Specialist } from "@/types/common"
import { PentagramIcon } from "@/components/icons/icon-pentagram"
import { cn } from "@/lib/utils"

interface SpecialistProfileProps {
  specialist: Specialist
}

export default function SpecialistProfile({ specialist }: SpecialistProfileProps) {
  const router = useRouter()
  const { t } = useTranslations()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const handleServiceCardClick = (service: any) => {
    router.push(`/service/${service.id}`)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-[144px] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with Back Button and Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <BackButton className="text-gray-600 dark:text-gray-300" />
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="outline"
              className="h-10 w-10 p-0 rounded-lg border-gray-300 dark:border-gray-600 bg-transparent"
              onClick={() => setShareModalOpen(true)}
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-10 px-3 rounded-lg border-gray-300 dark:border-gray-600 flex items-center gap-2 bg-transparent"
            >
              <PentagramIcon className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">{specialist.likes || 1024}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-10 px-3 rounded-lg border-gray-300 dark:border-gray-600 flex items-center gap-2 bg-transparent"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{specialist.practices || 304}</span>
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Profile Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Image */}
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src={specialist.images?.[0] || "/placeholder.svg?height=400&width=300"}
                    alt={specialist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{specialist.name}</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{specialist.title}</p>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-6">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{specialist.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <PentagramIcon className="h-5 w-5 text-purple-600" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {specialist.likes || 1024}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-gray-500" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {specialist.practices || 304}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="px-8 pb-8 space-y-8">
            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">О мастере</h2>
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                <p className={cn("transition-all duration-300", !showFullDescription && "line-clamp-3")}>
                  {specialist.description}
                </p>
                {specialist.description && specialist.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-purple-600 hover:text-purple-700 mt-2 text-sm font-medium"
                  >
                    {showFullDescription ? "Скрыть" : "Раскрыть больше"}
                  </button>
                )}
              </div>
            </div>

            {/* Skills Section */}
            {specialist.skills && specialist.skills.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Навыки</h2>
                <div className="space-y-2">
                  {specialist.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-400">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Практис</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialist.services.map((service) => (
                  <InstagramServiceCard
                    key={service.id}
                    service={service}
                    onClick={() => handleServiceCardClick(service)}
                  />
                ))}
              </div>
            </div>

            {/* Experience Section */}
            {specialist.experience && specialist.experience.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Опыт</h2>
                <div className="space-y-2">
                  {specialist.experience.map((exp, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education and Certificates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Education Section */}
              {specialist.education && specialist.education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Образование</h2>
                  <div className="space-y-4">
                    {specialist.education.map((edu, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Хогвартс, Слизерен</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates Section */}
              {specialist.certificates && specialist.certificates.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Сертификаты</h2>
                  <div className="space-y-4">
                    {specialist.certificates.map((cert, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Хогвартс, Слизерен</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{cert.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
