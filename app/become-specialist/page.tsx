"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import {
  ArrowRight,
  Star,
  Users,
  Calendar,
  Sparkles,
  Check,
  Plus,
  X,
  GripVertical,
  Award,
  TrendingUp,
} from "lucide-react"
import { useTranslations } from "@/hooks/use-translations"

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
    experience: [""] as string[],
    education: [""] as string[],
    photos: [] as File[],
  })

  // Handle authentication check only once
  useEffect(() => {
    if (user?.isSpecialist) {
      // If user is already a specialist, redirect to dashboard
      router.push("/specialist-dashboard")
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => {
      if (prev.specialties.includes(specialty)) {
        return {
          ...prev,
          specialties: prev.specialties.filter((s) => s !== specialty),
        }
      }
      return {
        ...prev,
        specialties: [...prev.specialties, specialty],
      }
    })
  }

  const handleExperienceChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addExperienceItem = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, ""],
    }))
  }

  const removeExperienceItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const handleEducationChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addEducationItem = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, ""],
    }))
  }

  const removeEducationItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 5) {
      setStep(step + 1)
    } else {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user to be a specialist
      updateUser({
        isSpecialist: true,
        specialistProfile: {
          id: Date.now().toString(),
          title: formData.title,
          specialties: formData.specialties,
          status: "pending",
        },
      })

      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  const handleAuthModalClose = () => {
    setAuthModalOpen(false)
    if (!isAuthenticated) {
      router.push("/")
    }
  }

  const specialties = [
    "Астрология",
    "Таро и оракулы",
    "Нумерология",
    "Медитация и визуализация",
    "Энергетические практики",
    "Рейки и целительство",
    "Магия",
    "Предназначение",
    "К��рма и реинкарнация",
    "Алхимия внутренняя",
    "Внутренняя алхимия",
    "Шаманизм",
    "Нумерология",
    "Древние учения",
    "Подсознание",
    "Ангелология",
    "Синхроничности и знаки",
    "Кристаллы и минералы",
    "Символизм и геометрия",
    "Манифестация",
    "Теневая работа",
    "Астральные путешествия",
    "Родовая система и предки",
    "Хьюман-дизайн",
    "Квантовые практики",
    "Тета-хиллинг",
  ]

  // Show loading state while checking authentication
  if (!isAuthenticated && authModalOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100">
        <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto"></div>
          </div>
        </main>
        <AuthModal isOpen={authModalOpen} onClose={handleAuthModalClose} mode="login" />
      </div>
    )
  }

  // Show success state after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100">
        <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Check className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                {t("specialist.applicationSubmitted")}
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">{t("specialist.applicationSubmittedDesc")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="cursor-pointer border-2 border-gray-300 hover:border-violet-400 hover:bg-violet-50 transition-all duration-300 h-12 px-8"
                >
                  {t("common.back")} to Home
                </Button>
                <Button
                  onClick={() => router.push("/profile")}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8"
                >
                  {t("header.myProfile")}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-12">
        {isAuthenticated ? (
          <div className="space-y-12">
            {/* Hero Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-4">
                <Award className="h-4 w-4 mr-2" />
                Join our community
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Become a Specialist</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Share your expertise and help others on their journey
              </p>
            </div>

            {/* Main Form Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-900">Select Your Specialties</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">Choose the areas where you can help others</p>
                      </div>

                      {/* Specialty Grid */}
                      <div className="flex flex-wrap justify-center gap-3">
                        {specialties.map((specialty) => {
                          const isSelected = formData.specialties.includes(specialty)
                          return (
                            <button
                              key={specialty}
                              type="button"
                              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                                isSelected
                                  ? "bg-violet-500 text-white border-violet-500"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                              }`}
                              onClick={() => handleSpecialtyToggle(specialty)}
                            >
                              {specialty}
                            </button>
                          )
                        })}
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="customSpecialty" className="text-sm font-medium text-gray-700">
                          Add Custom Specialty
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="customSpecialty"
                            value={formData.customSpecialty}
                            onChange={(e) => setFormData((prev) => ({ ...prev, customSpecialty: e.target.value }))}
                            placeholder="Enter your specialty..."
                            className="flex-1 text-sm"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (formData.customSpecialty.trim()) {
                                handleSpecialtyToggle(formData.customSpecialty.trim())
                                setFormData((prev) => ({ ...prev, customSpecialty: "" }))
                              }
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Selection Summary */}
                      {formData.specialties.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gray-600 rounded-md flex items-center justify-center">
                              <Sparkles className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-medium text-gray-800 text-sm">
                              {formData.specialties.length} specialt{formData.specialties.length === 1 ? "y" : "ies"}{" "}
                              selected
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {formData.specialties.map((specialty) => (
                              <span
                                key={specialty}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-200"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
                        <p className="text-lg text-gray-600">Tell us about your expertise and background</p>
                      </div>

                      <div className="space-y-6">
                        {/* Professional Title */}
                        <div className="space-y-3">
                          <Label htmlFor="title" className="text-lg font-semibold text-gray-800 flex items-center">
                            {t("specialist.professionalTitle")}
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Spiritual Guide & Life Coach"
                            className="h-12 text-base border-2 border-gray-200 focus:border-violet-400 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                            required
                          />
                        </div>

                        {/* Bio */}
                        <div className="space-y-3">
                          <Label htmlFor="bio" className="text-lg font-semibold text-gray-800">
                            {t("specialist.professionalBio")}
                          </Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell potential clients about yourself, your approach, and your experience..."
                            className="text-base border-2 border-gray-200 focus:border-violet-400 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                            rows={5}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8">
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900">Add Your Experience</h2>
                        <p className="text-lg text-gray-600">Share your professional journey</p>
                      </div>

                      {/* Experience - Keep as is */}
                      <div>
                        <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                          {t("specialist.experience")}
                        </Label>
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 space-y-3">
                          {formData.experience.map((item, index) => (
                            <div
                              key={index}
                              className="group bg-white rounded-lg border border-gray-200 p-3 hover:border-violet-300 hover:shadow-sm transition-all duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                  <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"></div>
                                </div>
                                <Input
                                  value={item}
                                  onChange={(e) => handleExperienceChange(index, e.target.value)}
                                  placeholder="Add your work experience..."
                                  className="flex-1 border-0 bg-transparent focus:ring-0 focus:border-0 p-0 text-gray-700"
                                />
                                {formData.experience.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeExperienceItem(index)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addExperienceItem}
                            className="w-full flex items-center justify-center space-x-2 text-violet-600 border-violet-300 hover:bg-violet-50 border-dashed py-3 rounded-lg"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Experience</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-8">
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900">Add Education and Certificates</h2>
                        <p className="text-lg text-gray-600">Showcase your qualifications</p>
                      </div>

                      {/* Education - Keep as is */}
                      <div>
                        <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                          {t("specialist.education")}
                        </Label>
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 space-y-3">
                          {formData.education.map((item, index) => (
                            <div
                              key={index}
                              className="group bg-white rounded-lg border border-gray-200 p-3 hover:border-violet-300 hover:shadow-sm transition-all duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                  <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"></div>
                                </div>
                                <Input
                                  value={item}
                                  onChange={(e) => handleEducationChange(index, e.target.value)}
                                  placeholder="Add your education or certification..."
                                  className="flex-1 border-0 bg-transparent focus:ring-0 focus:border-0 p-0 text-gray-700"
                                />
                                {formData.education.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeEducationItem(index)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addEducationItem}
                            className="w-full flex items-center justify-center space-x-2 text-violet-600 border-violet-300 hover:bg-violet-50 border-dashed py-3 rounded-lg"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Education</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-8">
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900">Upload Photos</h2>
                        <p className="text-lg text-gray-600">Add photos to showcase your practice</p>
                        <p className="text-sm text-violet-600 font-medium">Maximum 5 photos allowed</p>
                      </div>

                      <div className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []).slice(0, 5) // Limit to 5 files
                              setFormData((prev) => ({ ...prev, photos: files }))
                            }}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label htmlFor="photo-upload" className="cursor-pointer">
                            <div className="space-y-4">
                              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto">
                                <Plus className="h-8 w-8 text-violet-600" />
                              </div>
                              <div>
                                <p className="text-lg font-medium text-gray-900">Upload Photos</p>
                                <p className="text-sm text-gray-500 mt-1">Maximum 5 photos</p>
                              </div>
                            </div>
                          </label>
                        </div>

                        {formData.photos.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm text-gray-600">{formData.photos.length} of 5 photos uploaded</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {formData.photos.map((photo, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(photo) || "/placeholder.svg"}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        photos: prev.photos.filter((_, i) => i !== index),
                                      }))
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Form Navigation */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    {step > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(step - 1)}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm"
                      >
                        Back
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    <Button
                      type="submit"
                      className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 text-sm"
                      disabled={
                        isSubmitting ||
                        (step === 1 && formData.specialties.length === 0) ||
                        (step === 2 && !formData.title.trim())
                      }
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Loading...
                        </div>
                      ) : step < 5 ? (
                        <>
                          Next
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Why Join Our Platform?</h2>
                  <p className="text-gray-600">Join thousands of specialists growing their practice</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Users,
                      title: "Reach More Clients",
                      desc: "Connect with people seeking your expertise",
                    },
                    {
                      icon: Calendar,
                      title: "Easy Scheduling",
                      desc: "Manage your appointments effortlessly",
                    },
                    {
                      icon: Star,
                      title: "Build Reputation",
                      desc: "Grow your practice with client reviews",
                    },
                    {
                      icon: TrendingUp,
                      title: "Growth Tools",
                      desc: "Analytics and insights to improve",
                    },
                  ].map((benefit, index) => (
                    <div key={index} className="text-center p-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <benefit.icon className="h-6 w-6 text-gray-600" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-600 rounded-3xl blur-xl opacity-20"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10">
                <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{t("specialist.loginRequired")}</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t("specialist.loginRequiredDesc")}</p>
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {t("specialist.loginSignUp")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <AuthModal isOpen={authModalOpen} onClose={handleAuthModalClose} mode="login" />
    </div>
  )
}
