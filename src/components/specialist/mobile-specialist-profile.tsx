"use client"

import React, {useEffect, useRef, useState} from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Share,
  MessagesSquare,
  ChevronDown,
  ImageUp,
  MonitorPlayIcon as TvMinimalPlay,
  Users,
  MapPinHouse
} from 'lucide-react'
import { InstagramServiceCard } from "@/src/components/instagram-service-card"
import { BackButton } from "@/src/components/ui/button-back"
import { PentagramIcon } from "@/src/components/icons/icon-pentagram"
import { useLikes } from "@/src/hooks/use-likes"
import { IconPractice } from "@/src/components/icons/icon-practice"
import {formatCompactNumber, formatNumber} from "@/src/utils/format"
import { Certificates } from "./certificates"
import { Bullets } from "./bullets"
import { AboutSkillsSection } from "./about-skills-section"
import Image from "next/image";
import {cn} from "@/src/lib/utils";
import {PracticeBlockSection} from "@/src/components/specialist/practice";
import {ModeToggleBar} from "@/src/components/profile/mode-toggle-bar";
import {SpecialistData} from "@/src/components/specialist/types/common";
import { EnhancedInput } from "@/src/components/enhanced-input"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/src/components/ui/skeleton"
import {PracticePlaceholder} from "@/src/components/practice-placeholder";
import {LocationInput} from "@/src/components/location-input";
import {Specialist} from "@/src/types/specialist";
import {SpecialistStatsCard} from "@/src/components/specialist/specilist-stats";

interface MobileSpecialistProfileProps {
  specialist: Specialist
}

export default function MobileSpecialistProfile({ specialist }: MobileSpecialistProfileProps) {
  const router = useRouter()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const { isLiked, toggleLike } = useLikes()

  const [shouldShowToggle, setShouldShowToggle] = useState(false)
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
      setShouldShowToggle(height > 130)
    }
  }, [draftData.experience])

  useEffect(() => {
    const changed = JSON.stringify(draftData) !== JSON.stringify(savedData)
    setHasChanges(changed)
  }, [draftData, savedData])

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      value: string | string[] | any
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

      if (hasChanges) {
        await handlePublish()
      }

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
      <main className="min-h-screen w-full relative">
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
                <div className="flex items-center justify-between mb-4 px-4 relative">
                  <div className="flex-1">
                    <BackButton className="text-neutral-700 opacity-80" />
                  </div>

                  <div className="flex flex-row gap-6 items-center pt-2.5 pr-6">
                    {isEditable ? (
                        <>
                          <ModeToggleBar
                              isEditMode={isEditMode}
                              onModeToggle={handleModeToggle}
                              onPublish={handlePublish}
                              isSaving={isSaving}
                              hasChanges={hasChanges}
                          />
                        </>
                    ) : (
                        <>
                          <button
                              type="button"
                              onClick={handleLikeClick}
                              className={`
                                                rounded-sm flex h-9 w-9 items-center justify-center transition-colors duration-200 shadow-sm aspect-square p-0 border-none 
                                                ${
                                  liked
                                      ? "bg-colors-custom-accent hover:bg-violet-700 text-white"
                                      : "bg-white hover:bg-violet-50 dark:hover:bg-violet-700 text-gray-700 opacity-80"
                              }
                                            `}
                              title="Сохранить в избранное"
                          >
                            <PentagramIcon size={24} />
                          </button>

                          <button
                              type="button"
                              onClick={handleReply}
                              className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                              title="Написать специалисту"
                          >
                            <MessagesSquare size={24} />
                          </button>
                        </>
                    )}

                    {!isEditMode && (
                        <button
                            type="button"
                            onClick={handleShare}
                            className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                            title="Поделиться"
                        >
                          <Share size={24} />
                        </button>)}
                  </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white relative">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                        className="w-full rounded-sm p-1 overflow-hidden relative aspect-[4/5]"
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
                          className="w-full h-full rounded-sm object-cover"
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
                        <div className="absolute bottom-3 right-3 bg-colors-neutral-150 rounded-sm p-1 w-[78px] h-[84px] gap-3">
                          <div className="flex flex-row items-center gap-1 text-colors-custom-accent w-full border p-1 rounded-sm h-[36px]">
                            <PentagramIcon size={24} />
                            <div className="ml-auto text-sm">{formatCompactNumber(specialist.likes)}</div>
                          </div>

                          <div className="flex flex-row items-center gap-1 w-full border h-[36px] p-1 rounded-sm mt-1">
                            <IconPractice width={22} height={20} />
                            <div className="ml-auto text-sm">{formatCompactNumber(specialist.practices)}</div>
                          </div>
                        </div>
                    )}
                  </div>

                  {/* Info block */}
                  <div className="px-4 pt-2">
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
                          <div className="text-mobilebase font-bold text-neutral-900 leading-relaxed">{draftData.name}</div>
                          <div className="text-mobilebase text-neutral-700 opacity-80 line-clamp-2 leading-relaxed mt-2">
                            {draftData.description}
                          </div>
                          {draftData.location && (
                              <div className="flex items-center mt-3 text-neutral-600">
                                <MapPinHouse className="w-4 h-4 mr-1" />
                                <div className="text-base font-normal">{draftData.location}</div>
                              </div>
                          )}
                        </>
                    )}
                  </div>
                </div>

                {/* About and Skills Section */}
                <div className="bg-white rounded-b-sm shadow-md">
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

                {/* Services, Experience and Certificates */}
                <div className="bg-colors-neutral-150 rounded-sm shadow-md p-4">
                  {!isEditMode && draftData.services.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex bg-white rounded-sm ">
                          <button
                              onClick={() => setFormat('video')}
                              className={`flex items-center gap-1 w-[30px] h-[30px] p-1 rounded-sm text-sm transition-colors justify-center ${
                                  format === 'video'
                                      ? 'bg-colors-custom-accent text-white shadow-sm'
                                      : 'text-gray-600 hover:text-gray-800'
                              }`}
                          >
                            <TvMinimalPlay size={16} />
                          </button>
                          <button
                              onClick={() => setFormat('inPerson')}
                              className={`flex items-center gap-1  w-[30px] h-[30px] p-1 rounded-sm text-sm transition-colors justify-center ${
                                  format === 'inPerson'
                                      ? 'bg-colors-custom-accent text-white shadow-sm'
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
                      onInputChange={handleInputChange}
                      specialist={specialist}
                  />

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
                  <div className="mt-4 space-y-4">
                    {(draftData.education.length === 0 && draftData.certificates.length === 0 && !isEditMode && isEditable) ? (
                        <div className="mx-6 mb-2 items-center justify-center flex flex-col">
                          <PracticePlaceholder width={120} height={120} iconClassName="text-gray-400" />
                          <div className="text-gray-400 text-center">Образование и сертификаты не добавлены</div>
                        </div>
                    ) : (
                        <>
                          {draftData.education.length > 0 && (
                              <Certificates
                                  title="Образование"
                                  items={draftData.education}
                                  isEditMode={isEditMode}
                                  onInputChange={handleInputChange}
                                  errors={errors}
                                  fieldKey="education"
                              />
                          )}
                          {draftData.certificates.length > 0 && (
                              <Certificates
                                  title="Сертификаты"
                                  items={draftData.certificates}
                                  isEditMode={isEditMode}
                                  onInputChange={handleInputChange}
                                  errors={errors}
                                  fieldKey="certificates"
                              />
                          )}
                        </>
                    )}
                  </div>

                  <div className="h-24"/>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </main>
  )
}
