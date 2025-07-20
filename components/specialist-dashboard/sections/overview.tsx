"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslations } from "@/hooks/use-translations"
import { MapPin, Images, Share } from "lucide-react"
import { SquareImageGallery } from "@/components/square-image-gallery"
import { AboutSection } from "@/components/about-section"
import { useRouter } from "next/navigation"
import { ModeToggleBar } from "@/components/profile/mode-toggle-bar"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { PhotoUpload } from "@/components/photo-upload"
import { mockSpecialist } from "@/services/mock-data"
import ExperienceForm from "@/components/experience-item"
import { LocationInput } from "@/components/location-input"
import { EnhancedInput } from "@/components/enhanced-input"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { ShareSpecialistModal } from "@/components/modals/share-specialist-modal"
import {Specialist} from "@/types/common";

export default function Overview() {
  const router = useRouter()
  const { t } = useTranslations()
  const { isAuthenticated, user } = useAuth()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [savedData, setSavedData] = useState<Specialist>(mockSpecialist)
  const [draftData, setDraftData] = useState<Specialist>({
    ...mockSpecialist,
    photos: []
  })

  // Загрузка начальных файлов
  useEffect(() => {
    const createFileFromUrl = async (url: string): Promise<File> => {
      const response = await fetch(url)
      const blob = await response.blob()
      const filename = url.split('/').pop() || 'image.jpg'
      return new File([blob], filename, { type: blob.type })
    }

    const loadInitialFiles = async () => {
      const files = await Promise.all(
          mockSpecialist.images.map(url => createFileFromUrl(url))
      )
      setDraftData(prev => ({
        ...prev,
        imageFiles: files
      }))
    }

    loadInitialFiles()
  }, [])

  // Проверка аутентификации
  useEffect(() => {
    if (!isAuthenticated || (user && user.isSpecialist === false)) {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // Проверка изменений
  useEffect(() => {
    const imagesChanged = JSON.stringify(savedData.images) !==
        JSON.stringify(draftData.images)

    const filesChanged = (draftData.photos?.length || 0) > 0

    setHasChanges(imagesChanged || filesChanged)
  }, [draftData, savedData])

  const handleInputChange = (field: string, value: any) => {
    setDraftData(prev => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!draftData.name?.trim()) newErrors.name = "Name is required"
    if (!draftData.title?.trim()) newErrors.title = "Title is required"
    if (!draftData.location?.trim()) newErrors.location = "Location is required"

    const hasImages = (draftData.images?.length || 0) > 0 ||
        (draftData.photos?.length || 0) > 0
    if (!hasImages) newErrors.images = "At least one photo is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePublish = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    try {
      // Эмуляция загрузки на сервер
      const uploadedUrls = await Promise.all(
          (draftData.photos || []).map(async (file) => {
            await new Promise(resolve => setTimeout(resolve, 300))
            return URL.createObjectURL(file)
          })
      )

      const newSavedData = {
        ...draftData,
        images: uploadedUrls,
        imageFiles: undefined
      }

      setSavedData(newSavedData)
      setDraftData(newSavedData)
      setHasChanges(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleModeToggle = async (mode: "view" | "edit") => {
    if (mode === "view") {
      if (!validateForm()) return

      setIsTransitioning(true)
      await handlePublish()
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsTransitioning(false)
    }

    setIsTransitioning(true)
    setIsEditMode(mode === "edit")
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsTransitioning(false)
  }

  const currentData = isEditMode ? draftData : savedData
  const hasErrors = Object.keys(errors).length > 0

  if (isAuthenticated === null) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading user data...</div>
        </div>
    )
  }

  return (
      <>
        <ModeToggleBar
            isEditMode={isEditMode}
            onModeToggle={handleModeToggle}
            hasErrors={hasErrors}
            errors={errors}
            hasChanges={hasChanges}
            isSaving={isSaving}
        />

        <AnimatePresence mode="wait">
          {isTransitioning ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                  <Skeleton className="h-[300px] w-full rounded-sm" />
                  <Skeleton className="h-[200px] w-full rounded-sm" />
                  <Skeleton className="h-[250px] w-full rounded-sm" />
                </div>
              </motion.div>
          ) : (
              <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
              >
                <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
                  <div
                      style={{
                        transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
                      }}
                      data-animating={isTransitioning ? "true" : "false"}
                  >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                      <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 space-y-6">
                          <div className="flex flex-col gap-6">
                            <div className="space-y-3">
                              {isEditMode ? (
                                  <PhotoUpload
                                      photos={draftData.photos || []}
                                      onPhotosChange={(files) => setDraftData(prev => ({
                                        ...prev,
                                        photos: files
                                      }))}
                                      maxPhotos={5}
                                      showTitle={false}
                                  />
                              ) : (
                                  <div>
                                    {draftData.photos.length > 0 ? (
                                        <SquareImageGallery
                                            images={savedData.images}
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
                                          <p>No photos uploaded yet</p>
                                        </div>
                                    )}
                                  </div>
                              )}
                            </div>

                            {isEditMode ? (
                                <div className="space-y-6">
                                  <EnhancedInput
                                      label="Full Name"
                                      value={currentData.name || ""}
                                      onChange={(e) => handleInputChange("name", e.target.value)}
                                      error={errors.name}
                                      required
                                      placeholder="Enter your full name"
                                      showEditIcon
                                  />

                                  <EnhancedInput
                                      label="Professional Title"
                                      value={currentData.title || ""}
                                      onChange={(e) => handleInputChange("title", e.target.value)}
                                      error={errors.title}
                                      required
                                      placeholder="e.g., Spiritual Guide & Life Coach"
                                      showEditIcon
                                  />

                                  <LocationInput
                                      value={currentData.location || ""}
                                      onChange={(value) => handleInputChange("location", value)}
                                      error={errors.location}
                                      placeholder="Enter your city"
                                  />
                                </div>
                            ) : (
                                <div className="text-left">
                                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    {currentData.name}
                                  </h1>
                                  <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-4">{currentData.title}</h2>

                                  <div className="flex items-center space-x-6 mb-4">
                                    <div className="flex items-center">
                                      <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                      <span className="text-gray-600 dark:text-gray-300">{currentData.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                <span className="text-gray-600 dark:text-gray-300">
                                  {currentData.practices} practices
                                </span>
                                    </div>
                                  </div>
                                </div>
                            )}
                          </div>

                          {isEditMode ? (
                              <div className="space-y-6 border-gray-200 dark:border-gray-700">
                                <EnhancedInput
                                    type="textarea"
                                    label="Bio"
                                    value={currentData.description || ""}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Tell about your experience, approach, and philosophy"
                                    rows={6}
                                    maxLength={1000}
                                    showCharCount
                                    error={errors.description}
                                />

                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    Education
                                  </h3>
                                  <ExperienceForm
                                      items={currentData.education || []}
                                      onChange={(education) => handleInputChange("education", education)}
                                      showCertificates={true}
                                  />
                                </div>

                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    Experience
                                  </h3>
                                  <ExperienceForm
                                      items={currentData.experience || []}
                                      onChange={(experience) => handleInputChange("experience", experience)}
                                      showCertificates={false}
                                  />
                                </div>
                              </div>
                          ) : (
                              <div className="border-gray-200 dark:border-gray-700">
                                <AboutSection
                                    title={`About ${currentData.name || "Specialist"}`}
                                    description={currentData.description}
                                    education={currentData.education}
                                    experience={currentData.experience}
                                    showEducationExperience={true}
                                />
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </motion.div>
          )}
        </AnimatePresence>

        <ShareSpecialistModal
            open={shareModalOpen}
            onOpenChange={setShareModalOpen}
            specialist={currentData}
        />
      </>
  )
}
