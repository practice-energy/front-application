"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/modals/auth-modal"
import { ArrowRight, Check, Award } from "lucide-react"
import { useTranslations } from "@/hooks/use-translations"
import { SpecialtySelectionStep } from "@/components/become-specialist/specialty-selection-step"
import { ProfileInfoStep } from "@/components/become-specialist/profile-info-step"
import { ExperienceStep } from "@/components/become-specialist/experience-step"
import { EducationStep } from "@/components/become-specialist/education-step"
import { PhotosStep } from "@/components/become-specialist/photos-step"

interface ExperienceItem {
  description: string
  certificate?: File | null
}

// Mock data loaded from user profile
const mockProfileExperience: ExperienceItem[] = [
  {
    description: "5 years of professional tarot reading with over 500 satisfied clients",
  },
  {
    description: "Certified astrologer from International Astrology Association (2019)",
  },
]

const mockProfileEducation: ExperienceItem[] = [
  {
    description: "Bachelor's degree in Psychology, Moscow State University (2015-2019)",
  },
  {
    description: "Certificate in Tarot Reading, European School of Divination (2020)",
  },
]

export default function BecomeSpecialistPage() {
  const router = useRouter()
  const { isAuthenticated, user, updateUser } = useAuth()
  const { t } = useTranslations()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    specialties: [] as string[],
    customSpecialty: "",
    title: "",
    bio: "",
    experience: [] as ExperienceItem[],
    education: [] as ExperienceItem[],
    photos: [] as File[],
  })

  // Initialize form with empty experience/education if none exists
  useEffect(() => {
    if (formData.experience.length === 0) {
      setFormData((prev) => ({
        ...prev,
        experience: [...mockProfileExperience, { description: "", certificate: null, isEditable: true }],
      }))
    }
    if (formData.education.length === 0) {
      setFormData((prev) => ({
        ...prev,
        education: [...mockProfileEducation, {description: "", certificate: null, isEditable: true}],
      }))
    }
  }, [])

  useEffect(() => {
    if (user?.isSpecialist) {
      router.push("/specialist-dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 5) {
      setStep(step + 1)
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      updateUser({
        isSpecialist: true,
        specialistProfile: {
          id: Date.now().toString(),
          title: formData.title,
          specialties: formData.specialties,
          status: "pending",
          // Include other form data as needed
        },
      })

      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-sm shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t("specialist.loginRequired")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t("specialist.loginRequiredDesc")}</p>
          <Button
            onClick={() => setAuthModalOpen(true)}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            {t("specialist.loginSignUp")}
          </Button>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode="login" />
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-sm shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {t("specialist.applicationSubmitted")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t("specialist.applicationSubmittedDesc")}</p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/profile")}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              {t("header.myProfile")}
            </Button>
            <Button onClick={() => router.push("/")} variant="outline" className="w-full">
              {t("common.back")} to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-sm shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Step 1: Specialties */}
            {step === 1 && (
              <SpecialtySelectionStep
                specialties={formData.specialties}
                customSpecialty={formData.customSpecialty}
                onSpecialtiesChange={(specialties) => setFormData((prev) => ({ ...prev, specialties }))}
                onCustomSpecialtyChange={(customSpecialty) => setFormData((prev) => ({ ...prev, customSpecialty }))}
              />
            )}

            {/* Step 2: Profile Info */}
            {step === 2 && (
              <ProfileInfoStep
                title={formData.title}
                bio={formData.bio}
                onTitleChange={(title) => setFormData((prev) => ({ ...prev, title }))}
                onBioChange={(bio) => setFormData((prev) => ({ ...prev, bio }))}
              />
            )}

            {/* Step 3: Education */}
            {step === 3 && (
                <EducationStep
                    education={formData.education}
                    onEducationChange={(education) => setFormData((prev) => ({ ...prev, education }))}
                />
            )}

            {/* Step 4: Experience */}
            {step === 4 && (
                <ExperienceStep
                    experience={formData.experience}
                    onExperienceChange={(experience) => setFormData((prev) => ({ ...prev, experience }))}
                />
            )}

            {/* Step 5: Photos */}
            {step === 5 && (
              <PhotosStep
                photos={formData.photos}
                onPhotosChange={(photos) => setFormData((prev) => ({ ...prev, photos }))}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-gray-200 dark:border-gray-700">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={isSubmitting}>
                  {t("common.back")}
                </Button>
              ) : (
                <div></div>
              )}

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  (step === 1 && formData.specialties.length === 0) ||
                  (step === 2 && !formData.title.trim())
                }
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 text-violet-600 dark:text-violet-400 mr-2"></span>
                    {t("common.loading")}
                  </span>
                ) : step < 5 ? (
                  <span className="flex items-center">
                    {t("common.next")}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                ) : (
                  t("specialist.submitApplication")
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
