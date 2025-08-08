"use client"

import React, { type ChangeEvent, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Share, MessagesSquare, ImageUp, MonitorPlayIcon as TvMinimalPlay, Users, MapPinIcon as MapPinHouse } from 'lucide-react'
import { BackButton } from "@/components/ui/button-back"
import type {Education, Experience} from "@/types/common"
import { PentagramIcon } from "@/components/icons/icon-pentagram"
import { useLikes } from "@/hooks/use-likes"
import { Certificates } from "./certificates"
import { Bullets } from "./bullets"
import { AboutSkillsSection } from "./about-skills-section"
import { cn } from "@/lib/utils"
import { useProfileStore } from "@/stores/profile-store"
import { ModeToggleBar } from "@/components/profile/mode-toggle-bar"
import { EnhancedInput } from "@/components/enhanced-input"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import {SpecialistData} from "@/components/specialist/types/common";
import {LocationInput} from "@/components/location-input";
import {PracticeBlockSection} from "@/components/specialist/practice";
import {Service} from "@/types/service";
import {Specialist} from "@/types/specialist";
import {SpecialistStatsCard} from "@/components/specialist/specilist-stats";
import { ShareSpecialistModal } from "@/components/modals/share-specialist-modal"

interface SpecialistProfileProps {
  specialist: Specialist
}

export default function DesktopSpecialistProfile({ specialist }: SpecialistProfileProps) {
  const { user } = useProfileStore()
  const router = useRouter()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const { isLiked, toggleLike } = useLikes()

  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowToggle, setShouldShowToggle] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const expRef = useRef<HTMLDivElement>(null)
  const isEditable = true //user?.specialistProfile?.id === specialist.id
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [format, setFormat] = useState<'video' | 'inPerson'>('video')

  // Saved data (what's displayed in View mode)
  const [savedData, setSavedData] = useState<SpecialistData>({
    name: specialist.name || "",
    description: specialist.description || "",
    title: specialist.title || "",
    location: specialist.location || "",
    avatar: specialist.avatar || "",
    experience: specialist.experience || [],
    education: specialist.education || [],
    certificates: specialist.certificates || [],
    skills: specialist.skills || [],
    services: specialist.services || [],
  })

  // Draft data (what's being edited in Edit mode)
  const [draftData, setDraftData] = useState<SpecialistData>({
    name: specialist.name || "",
    description: specialist.description || "",
    title: specialist.title || "",
    location: specialist.location || "",
    avatar: specialist.avatar || "",
    experience: specialist.experience || [],
    education: specialist.education || [],
    certificates: specialist.certificates || [],
    skills: specialist.skills || [],
    services: specialist.services || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const targetElement = expRef.current
    if (targetElement) {
      const height = targetElement.scrollHeight
      setContentHeight(height)
      setShouldShowToggle(height > 130 ? 1 : 0)
    }
  }, [draftData.experience])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const liked = isLiked(specialist.id)

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(specialist.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShareModalOpen(true)
  }

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/search/${specialist.id}`)
  }

  useEffect(() => {
    const changed = JSON.stringify(draftData) !== JSON.stringify(savedData)
    setHasChanges(changed)
  }, [draftData, savedData])

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      const tempUrl = URL.createObjectURL(file)
      handleInputChange("avatar", tempUrl)
    }
  }

  const handleAvatarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsHoveringAvatar(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
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
      field: keyof SpecialistData,
      value: string | string[] | Experience[] | Education[] | Service[] | any
  ) => {
    setDraftData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...draftData.skills]
    updatedSkills[index] = value
    handleInputChange("skills", updatedSkills)
  }

  const handleAddSkill = () => {
    const updatedSkills = [...draftData.skills, ""]
    handleInputChange("skills", updatedSkills)
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = draftData.skills.filter((_, i) => i !== index)
    handleInputChange("skills", updatedSkills)
  }

  const handleExperienceChange = (index: number, value: string) => {
    const updatedExp = [...draftData.experience]
    updatedExp[index] = { ...updatedExp[index], description: value }
    handleInputChange("experience", updatedExp)
  }

  const handleAddExperience = () => {
    const updatedExp = [...draftData.experience, { description: "" }]
    handleInputChange("experience", updatedExp)
  }

  const handleRemoveExperience = (index: number) => {
    const updatedExp = draftData.experience.filter((_, i) => i !== index)
    handleInputChange("experience", updatedExp)
  }

  const getFilteredServices = () => {
    return draftData.services.filter(service => {
      if (format === 'video') {
        return service.settings?.video?.enabled
      } else {
        return service.settings?.inPerson?.enabled
      }
    })
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
        await new Promise(resolve => setTimeout(resolve, 1000))
        const mockFileUrl = URL.createObjectURL(avatarFile)
        handleInputChange("avatar", mockFileUrl)
        setAvatarFile(null)
      }

      // Update saved data
      setSavedData(draftData)
      setHasChanges(false)
      setIsTransitioning(true)
      setIsEditMode(false)

      await new Promise(resolve => setTimeout(resolve, 300))
      setIsTransitioning(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleModeToggle = async (mode: "view" | "edit") => {
    if (mode === "view") {
      if (!validateForm()) {
        return
      }

      setIsTransitioning(true)

      await new Promise(resolve => setTimeout(resolve, 300))
      setIsTransitioning(false)
    }

    setIsTransitioning(true)
    setIsEditMode(mode === "edit")
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsTransitioning(false)
  }

  if (!specialist) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
    )
  }

  return (
      <main className="min-h-screen relative">
        <div className="w-full mx-auto md:w-[845px]">
          <AnimatePresence mode="wait">
            {isTransitioning ? (
                <div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                </div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                  {/* Header with Back Button and Action Buttons */}
                  <div className="flex items-center justify-between relative mb-3">
                    <div className="flex-1">
                      <BackButton className="text-neutral-700 opacity-80" />
                    </div>

                    <div className="flex flex-row gap-6 items-center mr-6">
                      {isEditable ? (
                          <ModeToggleBar
                              isEditMode={isEditMode}
                              onModeToggle={handleModeToggle}
                              onPublish={handlePublish}
                              isSaving={isSaving}
                              hasChanges={hasChanges}
                          />
                      ) : (
                          <>
                            <button
                                type="button"
                                onClick={handleLikeClick}
                                className={`
                          rounded-sm flex h-9 w-9 items-center justify-center transition-colors duration-200 shadow-sm aspect-square p-0 border-none 
                          ${
                                    liked
                                        ? "bg-violet-600 hover:bg-violet-700 text-white"
                                        : "bg-white hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-700 opacity-80"
                                }
                        `}
                            >
                              <PentagramIcon size={24} />
                            </button>

                            <button
                                type="button"
                                onClick={handleReply}
                                className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                            >
                              <MessagesSquare size={24} />
                            </button>
                          </>
                      )}

                      <button
                          type="button"
                          onClick={handleShare}
                          className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                          title="Написать специалисту"
                      >
                        <Share size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Main Content Card */}
                  <div className="bg-white rounded-t-sm shadow-md relative min-h-[350px]">
                    {/* Header background */}
                    <div className="h-[104px] bg-neutral-800 w-full rounded-t-sm" />

                    {/* Main content */}
                    <div className="relative px-6 pt-6">
                      {/* Avatar */}
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
                              src={draftData.avatar || "/placeholder.svg"}
                              alt={draftData.name}
                              className={cn(
                                  "w-full h-full object-cover transition-opacity",
                              )}
                          />

                          {isEditMode && isHoveringAvatar && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <div className="flex flex-col items-center">
                                  <ImageUp className="w-12 h-12 text-colors-neutral-150" />
                                </div>
                              </div>
                          )}
                        </div>
                      </div>

                      {/* Info block */}
                      <div className={cn(
                          "ml-[286px] pt-6 flex justify-between items-start",
                          isEditMode && "w-full"
                      )}>
                        <div className={cn("pr-4",
                            isEditMode && "min-w-[450px]"
                        )}>
                          {isEditMode ? (
                              <>
                                <EnhancedInput
                                    value={draftData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    error={errors.name}
                                    required
                                    placeholder="Введите имя"
                                />
                                <EnhancedInput
                                    value={draftData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    placeholder="Введите описание"
                                    type="input"
                                    className="mt-4 text-sm"
                                />
                                <div className="mt-4">
                                  <LocationInput
                                      value={draftData.location}
                                      onChange={(value) => handleInputChange("location", value)}
                                      error={errors.location}
                                  />
                                </div>
                              </>
                          ) : (
                              <>
                                <div className="text-xl font-bold text-neutral-900 leading-relaxed">{draftData.name}</div>
                                <div className="text-sm text-neutral-700 opacity-80 line-clamp-2 leading-relaxed mt-6">
                                  {draftData.description}
                                </div>
                                {draftData.location && (
                                    <div className="flex items-center mt-4 text-neutral-600">
                                      <MapPinHouse className="w-4 h-4 mr-1" />
                                      <span>{draftData.location}</span>
                                    </div>
                                )}
                              </>
                          )}
                        </div>

                        {/* Stats block */}
                        {!isEditMode && (
                            <SpecialistStatsCard
                                likes={specialist.likes}
                                practices={specialist.practices}
                            />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* About and Skills Section */}
                  <div className="bg-white rounded-b-sm shadow-md relative overflow-y-auto">
                    <AboutSkillsSection
                        description={draftData.description}
                        skills={draftData.skills}
                        isEditMode={isEditMode}
                        onDescriptionChange={(value) => handleInputChange("description", value)}
                        onSkillChange={handleSkillChange}
                        onAddSkill={handleAddSkill}
                        onRemoveSkill={handleRemoveSkill}
                        errors={errors}
                    />
                  </div>

                  {/* Experience and Certificates Section */}
                  <div className="bg-colors-neutral-150 relative rounded-b-sm shadow-md">
                    <div className="relative px-6 pt-6 pb-4">
                      {/* Format Toggle */}
                      {!isEditMode && draftData.services.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex bg-white rounded-sm ">
                            <button
                                onClick={() => setFormat('video')}
                                className={`flex items-center gap-1 w-[30px] h-[30px] p-1 rounded-sm text-sm transition-colors justify-center ${
                                    format === 'video'
                                        ? 'bg-violet-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                              <TvMinimalPlay size={16} />
                            </button>
                            <button
                                onClick={() => setFormat('inPerson')}
                                className={`flex items-center gap-1  w-[30px] h-[30px] p-1 rounded-sm text-sm transition-colors justify-center ${
                                    format === 'inPerson'
                                        ? 'bg-violet-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                              <Users size={16} />
                            </button>
                          </div>
                          <span className="text-base font-bold text-neutral-700">Практис</span>
                        </div>
                      )}

                      <PracticeBlockSection
                          services={getFilteredServices()}
                          isEditMode={isEditMode}
                          errors={errors}
                          onInputChange={handleInputChange}
                          specialist={specialist}
                      />

                      {/* Experience */}
                      <div className="relative">
                        <div className="mt-4">
                          <Bullets
                              title="Опыт"
                              items={draftData.experience.map(exp => exp.description)}
                              isEditMode={isEditMode}
                              onChange={handleExperienceChange}
                              onAdd={handleAddExperience}
                              onRemove={handleRemoveExperience}
                          />
                        </div>
                      </div>

                      {/* Education and Certificates */}
                      <div className="mt-6">
                        {(draftData.education.length === 0 && draftData.certificates.length === 0 && !isEditMode && isEditable) ? (
                            <div className="mx-6 mb-2 items-center justify-center flex flex-col">
                              <PracticePlaceholder width={120} height={120} iconClassName="text-gray-400" />
                              <div className="text-gray-400 text-center">Образование и сертификаты не добавлены</div>
                            </div>
                        ) : (
                            <div className={cn(
                                "grid gap-6",
                                (!draftData.education.length || !draftData.certificates.length) ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                            )}>
                              <div className={!draftData.certificates.length ? "w-full" : ""}>
                                <Certificates
                                    title="Образование"
                                    items={draftData.education}
                                    isEditMode={isEditMode}
                                    onInputChange={handleInputChange}
                                    errors={errors}
                                    fieldKey="education"
                                />
                              </div>

                              <div className={!draftData.education.length ? "w-full" : ""}>
                                <Certificates
                                    title="Сертификаты"
                                    items={draftData.certificates}
                                    isEditMode={isEditMode}
                                    onInputChange={handleInputChange}
                                    errors={errors}
                                    fieldKey="certificates"
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
        <ShareSpecialistModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          specialist={specialist}
        />
      </main>
  )
}
