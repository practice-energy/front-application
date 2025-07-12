"use client"

import { useState, useEffect } from "react"
import { useProfileStore } from "@/stores/profile-store"
import { ModeToggleBar } from "@/components/profile/mode-toggle-bar"
import { PersonalInfoCard } from "@/components/profile/personal-info-card"
import { ExperienceCard } from "@/components/profile/experience-card"
import { EducationCard } from "@/components/profile/education-card"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface ExperienceItem {
  description: string
  certificate?: File | null
}

interface ProfileData {
  first_name: string
  last_name: string
  bio: string
  location: string
  photos: File[]
  experience: ExperienceItem[]
  education: ExperienceItem[]
}

export function OverviewSection() {
  const { user } = useProfileStore()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Saved data (what's displayed in View mode)
  const [savedData, setSavedData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    photos: [],
    experience: [],
    education: [],
  })

  // Draft data (what's being edited in Edit mode)
  const [draftData, setDraftData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    photos: [],
    experience: [],
    education: [],
  })

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize data when user loads
  useEffect(() => {
    if (user) {
      const userData = {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        bio: user.bio || "",
        location: user.location || "",
        photos: user.photos || [],
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

  const handleInputChange = (field: keyof ProfileData, value: string | string[] | File[] | ExperienceItem[]) => {
    setDraftData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!draftData.first_name.trim()) {
      newErrors.first_name = "First name is required"
    }
    if (!draftData.last_name.trim()) {
      newErrors.last_name = "Last name is required"
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

  return (
      <div className="w-full">
        <ModeToggleBar
            isEditMode={isEditMode}
            onModeToggle={handleModeToggle}
        />

        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {isTransitioning ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                >
                  <Skeleton className="h-[400px] w-full rounded-sm" />
                  <Skeleton className="h-[300px] w-full rounded-sm" />
                  <Skeleton className="h-[300px] w-full rounded-sm" />
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                  <PersonalInfoCard
                      data={currentData}
                      isEditMode={isEditMode}
                      onInputChange={handleInputChange}
                      errors={errors}
                  />

                  <EducationCard
                      data={currentData.education}
                      isEditMode={isEditMode}
                      onEducationChange={(education) => handleInputChange("education", education)}
                  />

                  <ExperienceCard
                      data={currentData.experience}
                      isEditMode={isEditMode}
                      onExperienceChange={(experience) => handleInputChange("experience", experience)}
                  />
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  )
}
