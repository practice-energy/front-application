"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MessagesSquare, Share, ImageUp, X, Plus } from "lucide-react"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import { BackButton } from "@/components/ui/button-back"
import { ServiceCard } from "@/components/service/service-card"
import type { Education, Experience, Format, Service } from "@/types/common"
import { BookingSlot } from "@/types/booking"
import Image from "next/image"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import { ModeToggleBar } from "@/components/profile/mode-toggle-bar"
import { SpecialistData } from "@/components/specialist/types/common"
import { ServiceData } from "@/components/service/types/common"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface ServicePageContentProps {
  service: Service
  bookingSlots: BookingSlot[]
  onModeToggle?: (mode: "view" | "edit") => void
  onPublish?: () => void
  isSaving?: boolean
  hasChanges?: boolean
  isEditable: boolean
}

export function ServicePageContent({
                                     service,
                                     bookingSlots,
                                     onModeToggle,
                                     onPublish,
                                     isSaving,
                                     hasChanges,
                                     isEditable
                                   }: ServicePageContentProps) {
  const router = useRouter()
  const [isAnimating] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const searchParams = useSearchParams()
  const [isEditMode, setIsEditMode] = useState((searchParams.get('mode') === 'edit' && isEditable))

  // Saved data (what's displayed in View mode)
  const [savedData, setSavedData] = useState<Service>(service)

  // Draft data (what's being edited in Edit mode)
  const [draftData, setDraftData] = useState<Service>(service)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const specialist = service.specialist

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShareModalOpen(true)
  }

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/search/${specialist.id}`)
  }

  const handleToProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/specialist/${specialist.id}`)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!draftData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!draftData.price || draftData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }
    if (!draftData.duration.trim()) {
      newErrors.duration = "Duration is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePublish = async () => {
    if (!validateForm()) return

    setIsTransitioning(true)
    try {
      setSavedData(draftData)

      if (onPublish) {
        await onPublish()
      }
    } finally {
      setIsTransitioning(false)
    }
  }

  const handleModeToggle = async (mode: "view" | "edit") => {
    if (mode === "view") {
      if (!validateForm()) {
        return
      }

      setIsTransitioning(true)
      await handlePublish()
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsTransitioning(false)
    }

    setIsTransitioning(true)
    setIsEditMode(mode === "edit")
    if (onModeToggle) {
      await onModeToggle(mode)
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsTransitioning(false)
  }

  const handleInputChange = (
      field: keyof ServiceData,
      value: string | string[] | Format[] | any
  ) => {
    setDraftData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
      <main className="min-h-screen relative">
        <div
            className="flex-1 overflow-hidden"
            style={{
              transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
            }}
            data-animating={isAnimating ? "true" : "false"}
        >
          <div className="max-w-[845px] mx-auto py-8 px-6">
            {/* Header with Back Button and Action Buttons */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="flex-1">
                <BackButton className="text-neutral-700 opacity-80" text={"назад к профайл"} />
              </div>

              <div className="flex flex-row gap-3 items-center pt-2.5 pr-9">
                {isEditable && (
                    <ModeToggleBar
                        isEditMode={isEditMode}
                        onModeToggle={handleModeToggle}
                        onPublish={handlePublish}
                        isSaving={isSaving}
                        hasChanges={hasChanges}
                    />
                )}

                {!isEditable && (
                    <button
                        type="button"
                        onClick={handleToProfile}
                        className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                        title="Написать специалисту"
                    >
                      {specialist.avatar ? (
                          <Image
                              src={specialist.avatar}
                              alt={specialist.name}
                              width={36}
                              height={36}
                              className="rounded-sm"
                          />
                      ) : (
                          <PracticePlaceholder
                              width={36}
                              height={36}
                              className="rounded-sm"
                          />
                      )}
                    </button>
                )}

                {/* Message Button */}
                {!isEditable && (
                    <button
                        type="button"
                        onClick={handleReply}
                        className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm transition-colors aspect-square duration-200 text-gray-700 opacity-80"
                        title="Написать специалисту"
                    >
                      <MessagesSquare size={24} />
                    </button>
                )}

                {/* Share Button */}
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

            <AnimatePresence mode="wait">
              {isTransitioning ? (
                  <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-center items-center h-[600px]">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </motion.div>
              ) : (
                  <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                  >
                    <ServiceCard
                        service={isEditMode ? draftData : savedData}
                        bookingSlots={bookingSlots}
                        isAuthenticated={true}
                        isEditMode={isEditMode}
                        onInputChange={handleInputChange}
                        errors={errors}
                    />
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
  )
}