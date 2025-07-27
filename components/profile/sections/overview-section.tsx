"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useProfileStore } from "@/stores/profile-store"
import { ModeToggleBar } from "@/components/profile/mode-toggle-bar"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Share } from "lucide-react"
import { formatNumber } from "@/utils/format"
import { IconPractice } from "@/components/icons/icon-practice"
import { AboutSection } from "@/components/profile/about-section"
import type { Education, Experience } from "@/types/common"
import { Skills } from "@/components/specialist/skills"
import { Certificates } from "@/components/specialist/certificates"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import { BackButton } from "@/components/ui/button-back"
import { LocationInput } from "@/components/location-input"
import { EnhancedInput } from "@/components/enhanced-input"
import type { ProfileData } from "@/components/profile/types/common"

export function OverviewSection() {
  const { user } = useProfileStore()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowToggle, setShouldShowToggle] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const expRef = useRef<HTMLDivElement>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    // Рассчитываем высоту только для описания на мобильных устройствах
    const targetElement = expRef.current
    if (targetElement) {
      const height = targetElement.scrollHeight
      setContentHeight(height)
      setShouldShowToggle(height > 130)
    }
  })

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  // Saved data (what's displayed in View mode)
  const [savedData, setSavedData] = useState<ProfileData>({
    name: "",
    bio: "",
    location: "",
    experience: [],
    education: [],
  })

  // Draft data (what's being edited in Edit mode)
  const [draftData, setDraftData] = useState<ProfileData>({
    name: "",
    bio: "",
    location: "",
    experience: [],
    education: [],
  })

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize data when user loads
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        // avatar: user.avatar,
        experience: user.experience || [],
        education: user.education || [],
      }
      setSavedData(userData)
      setDraftData(userData)
    }
  }, [user])

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(draftData) !== JSON.stringify(savedData)
    setHasChanges(changed)
  }, [draftData, savedData])

  const currentData = isEditMode ? draftData : savedData

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | string[] | File[] | Experience[] | Education[],
  ) => {
    setDraftData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!draftData.name.trim()) {
      newErrors.name = "Name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePublish = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update saved data to new published state
      setSavedData(draftData)
      setHasChanges(false)
      handleModeToggle("view")

      console.log("Saving profile data:", draftData)
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleModeToggle = async (mode: "view" | "edit") => {
    if (mode === "view") {
      // Validate before switching to view mode
      if (!validateForm()) {
        return // ModeToggleBar will handle the error display
      }

      setIsTransitioning(true)

      if (hasChanges) {
        await handlePublish()
      }

      // Small delay for smoother transition
      await new Promise((resolve) => setTimeout(resolve, 300))
      setIsTransitioning(false)
    }

    setIsTransitioning(true)

    setIsEditMode(mode === "edit")

    // Small delay for smoother transition
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsTransitioning(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShareModalOpen(true)
  }

  return (
    <main className="min-h-screen  relative">
      <div className="w-full mx-auto px-4 sm:px-6 py-8 md:w-[845px]">
        <AnimatePresence mode="wait">
          {isTransitioning ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Skeleton className="h-[900px] w-full rounded-sm" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header with Back Button and Action Buttons */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="flex-1">
                  <BackButton className="text-neutral-700 opacity-80" text={"назад"} />
                </div>

                <div className="flex flex-row gap-6 items-center pt-2.5 mr-6">
                  {/* Message Button */}
                  <ModeToggleBar isEditMode={isEditMode} onModeToggle={handleModeToggle} onPublish={handlePublish} />

                  {/* Share Button */}
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={handleShare}
                      className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                      title="Написать специалисту"
                    >
                      <Share size={24} />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content Card */}
              <div className="bg-white rounded-t-sm shadow-md relative min-h-[350px] ">
                {/* Черная шапка (фон) */}
                <div className="h-[104px] bg-neutral-800 w-full rounded-t-sm " />

                {/* Основной контент */}
                <div className="relative px-6 pt-6">
                  {/* Аватар, накладывающийся на шапку */}
                  <div className="absolute -top-20 left-6">
                    <div className="w-[250px] h-[312.5px] rounded-sm shadow-md overflow-hidden">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Блок с информацией справа от аватара и квадратный фрейм */}
                  <div className="ml-[286px] pt-6 flex justify-between items-start ">
                    <div className="pr-4">
                      {isEditMode ? (
                        <div className="pb-4">
                          <EnhancedInput
                            value={currentData.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            error={errors.name}
                            required
                            placeholder="Введите имя"
                            showEditIcon
                          />
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-neutral-900 leading-relaxed">{user.name}</div>
                      )}

                      {user.location && !isEditMode && (
                        <div className="flex items-center mt-4 text-neutral-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{user.location}</span>
                        </div>
                      )}

                      {isEditMode && (
                        <LocationInput
                          value={currentData.location}
                          onChange={(value) => handleInputChange("location", value)}
                          error={errors.location}
                        />
                      )}
                    </div>

                    {/* Блок практик */}
                    {!isEditMode && (
                      <div className="bg-colors-neutral-150  flex flex-row items-center gap-1  shadow-md shadow-violet-100 w-[100px] border h-full rounded-sm p-2">
                        <IconPractice width={20} height={18} />
                        <div className="ml-auto">{formatNumber(user.practice || 0)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-b-sm shadow-md relative">
                {/* Блок под шапкой с двумя колонками */}
                <AboutSection
                  description={currentData.bio}
                  onInputChange={handleInputChange}
                  isEditMode={isEditMode}
                  errors={errors}
                />
              </div>

              <div className="bg-colors-neutral-150 relative rounded-b-sm shadow-md ">
                <div className="relative px-6 pb-4">
                  <div className="relative">
                    {/* Секция "Опыт" */}
                    <div
                      className="overflow-hidden transition-all duration-500 ease-in-out flex"
                      style={{
                        height: isExpanded ? `${contentHeight}px` : shouldShowToggle ? `130px` : "auto",
                      }}
                      ref={expRef}
                    >
                      <div className="mt-4">
                        <Skills title="Опыт" items={user.experience.map((exp) => exp.description)} />
                      </div>
                    </div>
                  </div>

                  {/* Секция "Образование и сертификаты" */}
                  <div className="mt-6">
                    {/* Секция "Образование и сертификаты" */}
                    {(user.education.length === 0 || user?.certifcates.length === 0) && (
                      <div className="mx-6 mb-2 items-center justify-center flex flex-col">
                        <PracticePlaceholder width={120} height={120} iconClassName="text-gray-400" />
                        <div className="text-gray-400 text-center">Образование и сертификаты не добавлены</div>
                      </div>
                    )}

                    {/* Определяем, какие секции нужно показывать */}
                    {user.education?.length > 0 || user?.certifcates.length > 0 ? (
                      <div
                        className={`grid ${!user.education?.length || !user?.certifcates.length ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-6`}
                      >
                        {/* Образование - показываем если есть данные */}
                        {user.education?.length > 0 && (
                          <div className={!user?.certifcates?.length ? "w-full" : ""}>
                            <Certificates title="Образование" items={user.education} />
                          </div>
                        )}

                        {/* Сертификаты - показываем если есть данные */}
                        {user?.certifcates.length > 0 && (
                          <div className={!user.education?.length ? "w-full" : ""}>
                            <Certificates title="Сертификаты" items={user.certifcates} />
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
