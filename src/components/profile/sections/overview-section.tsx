"use client"

import type React from "react"
import type { ChangeEvent } from "react"
import { useState, useEffect, useRef } from "react"
import { useProfileStore } from "@/src/stores/profile-store"
import { ModeToggleBar } from "@/src/components/profile/mode-toggle-bar"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/src/components/ui/skeleton"
import {ImageUp, MapPinHouse, Share} from "lucide-react"
import { formatNumber } from "@/src/utils/format"
import { IconPractice } from "@/src/components/icons/icon-practice"
import { AboutSection } from "@/src/components/profile/about-section"
import type { Education, Experience } from "@/src/types/common"
import { Bullets } from "@/src/components/specialist/bullets"
import { Certificates } from "@/src/components/specialist/certificates"
import { BackButton } from "@/src/components/ui/button-back"
import { LocationInput } from "@/src/components/location-input"
import { EnhancedInput } from "@/src/components/enhanced-input"
import type { ProfileData } from "@/src/components/profile/types/common"
import { cn } from "@/src/lib/utils"
import { useIsMobile } from "@/src/components/ui/use-mobile"

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  const [savedData, setSavedData] = useState<ProfileData>({
    name: "",
    bio: "",
    location: "",
    experience: [],
    education: [],
    certificates: [],
    avatar: "",
  })

  const [draftData, setDraftData] = useState<ProfileData>({
    name: "",
    bio: "",
    location: "",
    experience: [],
    education: [],
    certificates: [],
    avatar: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      // Update draft data with temporary URL
      const tempUrl = URL.createObjectURL(file)
      handleInputChange("avatar", tempUrl)
    }
  }

  const handleAvatarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsHoveringAvatar(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setAvatarFile(file)
        const tempUrl = URL.createObjectURL(file)
        handleInputChange("avatar", tempUrl)
      }
    }
  }

  const handleAvatarDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsHoveringAvatar(true)
  }

  const handleAvatarDragLeave = () => {
    setIsHoveringAvatar(false)
  }

  const triggerAvatarInput = () => {
    avatarInputRef.current?.click()
  }

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
      // Simulate avatar upload if new file was selected
      if (avatarFile) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // In a real app, you would upload the file here and get the permanent URL
        const mockFileUrl = URL.createObjectURL(avatarFile)
        handleInputChange("avatar", mockFileUrl)
        setAvatarFile(null)
      }

      // Update saved data
      setSavedData(draftData)
      setHasChanges(false)
      setIsTransitioning(true)
      setIsEditMode(false)

      await new Promise((resolve) => setTimeout(resolve, 300))
      setIsTransitioning(false)
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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShareModalOpen(true)
  }

  const handleSkillChange = (index: number, value: string) => {
    const updatedItems = [...draftData.experience]
    updatedItems[index] = {
      description: value,
    }
    setDraftData((prev) => ({ ...prev, experience: updatedItems }))
  }

  const handleAddSkill = () => {
    const updatedItems = [
      ...draftData.experience,
      {
        description: "",
      },
    ]
    setDraftData((prev) => ({ ...prev, experience: updatedItems }))
  }

  const handleRemoveSkill = (index: number) => {
    const updatedItems = draftData.experience.filter((_, i) => i !== index)
    setDraftData((prev) => ({ ...prev, experience: updatedItems }))
  }

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        avatar: user.avatar || "",
        experience: user.experience || [],
        education: user.education || [],
        certificates: user.certifcates || [],
      }
      setSavedData(userData)
      setDraftData(userData)
    }
  }, [user])

  useEffect(() => {
    const changed = JSON.stringify(draftData) !== JSON.stringify(savedData)
    setHasChanges(changed)
  }, [draftData, savedData])

  useEffect(() => {
    // Рассчитываем высоту только для описания на мобильных устройствах
    const targetElement = expRef.current
    if (targetElement) {
      const height = targetElement.scrollHeight
      setContentHeight(height)
      setShouldShowToggle(height > 130)
    }
  }, [draftData.experience]) // Добавили isMobile в зависимости

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const currentData = isEditMode ? draftData : savedData

  if (isMobile) {
    return (
      <main className="min-h-screen w-full relative pt-3">
        <AnimatePresence mode="wait">
          {isTransitioning ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              <div className="flex items-center justify-between mb-4 px-4 relative">
                <div className="flex-1">
                  <BackButton className="text-neutral-700 opacity-80" />
                </div>

                <div className="flex flex-row gap-6 items-center pr-6 ">
                  <ModeToggleBar
                    isEditMode={isEditMode}
                    onModeToggle={handleModeToggle}
                    onPublish={handlePublish}
                    isSaving={isSaving}
                    hasChanges={hasChanges}
                  />

                  {/* Share Button */}
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={handleShare}
                      className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                      title="Поделиться"
                    >
                      <Share size={24} />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content Card */}
              <div className="bg-white relative">
                {/* Avatar */}
                <div className="relative">
                  <div
                    className="w-full rounded-sm overflow-hidden relative aspect-[4/5]"
                    onClick={isEditMode ? triggerAvatarInput : undefined}
                    onDragOver={isEditMode ? handleAvatarDragOver : undefined}
                    onDragLeave={isEditMode ? handleAvatarDragLeave : undefined}
                    onDrop={isEditMode ? handleAvatarDrop : undefined}
                    onMouseEnter={isEditMode ? () => setIsHoveringAvatar(true) : undefined}
                    onMouseLeave={isEditMode ? () => setIsHoveringAvatar(false) : undefined}
                  >
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarChange}
                      className="hidden"
                      accept="image/*"
                    />

                    <img
                      src={currentData.avatar || "/placeholder.svg"}
                      alt={currentData.name}
                      className="w-full h-full object-cover"
                    />

                    {isEditMode && isHoveringAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="flex flex-col items-center">
                          <ImageUp className="w-12 h-12 text-colors-neutral-150" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats block */}
                  {!isEditMode && (
                    <div className="absolute bottom-3 right-3 flex flex-row items-center gap-1  shadow-md  w-[100px] h-[36px] border rounded-sm  bg-colors-neutral-150  p-2">
                    <IconPractice width={20} height={18} />
                <div className="ml-auto">{formatNumber(user.practice || 0)}</div>
              </div>
                  )}
                </div>

                {/* Info block */}
                <div className="px-4 pt-2">
                  {isEditMode ? (
                    <>
                      <EnhancedInput
                        value={currentData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        error={errors.name}
                        required
                        placeholder="Введите имя"
                      />
                      <div className="mt-4">
                        <LocationInput
                          value={currentData.location}
                          onChange={(value) => handleInputChange("location", value)}
                          error={errors.location}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-mobilebase font-bold text-neutral-900 leading-relaxed">
                        {currentData.name}
                      </div>
                      {currentData.location && (
                        <div className="flex items-center mt-3 text-neutral-600">
                          <MapPinHouse className="w-4 h-4 mr-1" />
                          <div className="text-base font-normal">{currentData.location}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white rounded-b-sm shadow-md">
                <AboutSection
                  description={currentData.bio}
                  onInputChange={handleInputChange}
                  isEditMode={isEditMode}
                  errors={errors}
                />
              </div>

              {/* Experience and Certificates */}
              <div className="bg-colors-neutral-150 rounded-sm shadow-md p-4">
                <div className="relative">
                  <div className="mt-4">
                    <Bullets
                      title="Опыт"
                      items={currentData.experience.map((exp) => exp.description)}
                      isEditMode={isEditMode}
                      onChange={handleSkillChange}
                      onAdd={handleAddSkill}
                      onRemove={handleRemoveSkill}
                    />
                  </div>
                </div>

                {/* Education and Certificates */}
                <div className="mt-4 space-y-4">
                  {currentData.education.length === 0 && currentData.certificates.length === 0 && !isEditMode ? (
                    // <div className="mx-6 mb-2 items-center justify-center flex flex-col">
                    //   <PracticePlaceholder width={120} height={120} iconClassName="text-gray-400" />
                    //   <div className="text-gray-400 text-center">Образование и сертификаты не добавлены</div>
                    // </div>
                      <></>
                  ) : (
                    <>
                      {(currentData.education.length > 0 || isEditMode) && (
                        <Certificates
                          title="Образование"
                          items={currentData.education}
                          isEditMode={isEditMode}
                          onInputChange={handleInputChange}
                          errors={errors}
                          fieldKey="education"
                        />
                      )}
                      {(currentData.certificates.length > 0 || isEditMode) && (
                        <Certificates
                          title="Сертификаты"
                          items={currentData.certificates}
                          isEditMode={isEditMode}
                          onInputChange={handleInputChange}
                          errors={errors}
                          fieldKey="certificates"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    )
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
                  <BackButton className="text-neutral-700 opacity-80" />
                </div>

                <div className="flex flex-row gap-6 items-center pt-2.5 mr-6">
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
                  <div className="absolute -top-20 left-6">
                    <div
                      className="w-[250px] h-[312.5px] rounded-sm shadow-md overflow-hidden relative"
                      onClick={isEditMode ? triggerAvatarInput : undefined}
                      onDragOver={isEditMode ? handleAvatarDragOver : undefined}
                      onDragLeave={isEditMode ? handleAvatarDragLeave : undefined}
                      onDrop={isEditMode ? handleAvatarDrop : undefined}
                      onMouseEnter={isEditMode ? () => setIsHoveringAvatar(true) : undefined}
                      onMouseLeave={isEditMode ? () => setIsHoveringAvatar(false) : undefined}
                    >
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                        accept="image/*"
                      />

                      <img
                        src={currentData.avatar || "/placeholder.svg"}
                        alt={currentData.name}
                        className={cn("w-full h-full object-cover transition-opacity")}
                      />

                      {isEditMode && isHoveringAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="flex flex-col items-center">
                            <ImageUp className="w-12 h-12 text-colors-neutral-150 opacity-50" />
                          </div>
                        </div>
                      )}
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
                          />
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-neutral-900 leading-relaxed">{user.name}</div>
                      )}

                      {currentData.location && !isEditMode && (
                        <div className="flex items-center mt-4 text-neutral-600">
                          <MapPinHouse className="w-4 h-4 mr-1" />
                          <span>{currentData.location}</span>
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
                    <div className="pt-4">
                      <Bullets
                        title="Опыт"
                        items={currentData.experience.map((exp) => exp.description)}
                        isEditMode={isEditMode}
                        onChange={handleSkillChange}
                        onAdd={handleAddSkill}
                        onRemove={handleRemoveSkill}
                      />
                    </div>
                  </div>

                  {/* Секция "Образование и сертификаты" */}
                  <div className="mt-6">
                    {/* Определяем, какие секции нужно показывать */}
                    {(currentData.education?.length > 0 || currentData?.certificates.length > 0) && !isEditMode && (
                      <div
                        className={`grid ${!currentData.education?.length || !currentData?.certificates.length ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-6`}
                      >
                        {/* Образование - показываем если есть данные */}
                        {currentData.education?.length > 0 && (
                          <div className={!currentData?.certificates?.length ? "w-full" : ""}>
                            <Certificates
                              title="Образование"
                              items={currentData.education}
                              isEditMode={false}
                              onInputChange={handleInputChange}
                              errors={errors}
                              fieldKey={"education"}
                            />
                          </div>
                        )}

                        {/* Сертификаты - показываем если есть данные */}
                        {currentData?.certificates.length > 0 && (
                          <div className={!currentData.education?.length ? "w-full" : ""}>
                            <Certificates
                              title="Сертификаты"
                              items={currentData.certificates}
                              isEditMode={false}
                              onInputChange={handleInputChange}
                              errors={errors}
                              fieldKey={"certificates"}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {isEditMode && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Certificates
                            title="Образование"
                            items={currentData.education}
                            isEditMode={isEditMode}
                            onInputChange={handleInputChange}
                            errors={errors}
                            fieldKey={"education"}
                          />
                        </div>

                        <div>
                          <Certificates
                            title="Сертификаты"
                            items={currentData.certificates}
                            isEditMode={isEditMode}
                            onInputChange={handleInputChange}
                            errors={errors}
                            fieldKey={"certificates"}
                          />
                        </div>
                      </div>
                    )}
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
