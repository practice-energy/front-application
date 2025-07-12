"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Trash2, Video, MapPin, Zap, Clock, DollarSign } from "lucide-react"
import { mockServices } from "@/services/mock-data"
import type { Service } from "@/types/common"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { Skeleton } from "@/components/ui/skeleton"
import { EnhancedInput } from "@/components/enhanced-input"
import { AboutSection } from "@/components/about-section"
import { SquareImageGallery } from "@/components/square-image-gallery"
import { ModeToggleBar } from "@/components/profile/mode-toggle-bar"
import { cn } from "@/lib/utils"

interface EditableService extends Service {
  isActive?: boolean
  serviceType?: "video-call" | "in-person" | "instant"
}

const SERVICE_TYPES = [
  { id: "video-call", label: "Видеозвонок", icon: Video },
  { id: "in-person", label: "Очно", icon: MapPin },
  { id: "instant", label: "Мгновенно", icon: Zap },
] as const

export default function ServiceEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { id } = params

  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Find service or create new one
  const originalService = id === "new" ? null : mockServices.find((s) => s.id === id)

  const [savedData, setSavedData] = useState<EditableService>(() => {
    if (originalService) {
      return {
        ...originalService,
        isActive: true,
        serviceType: "video-call",
      }
    }
    return {
      id: "new",
      title: "",
      description: "",
      price: 0,
      duration: "60 мин",
      category: "",
      images: [],
      includes: [],
      specialist: mockServices[0].specialist,
      tags: [],
      reviews: [],
      isActive: true,
      serviceType: "video-call",
    }
  })

  const [draftData, setDraftData] = useState<EditableService>(savedData)

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(draftData) !== JSON.stringify(savedData)
    setHasChanges(changed)
  }, [draftData, savedData])

  // Auto-enable edit mode for new services
  useEffect(() => {
    if (id === "new") {
      setIsEditMode(true)
    }
  }, [id])

  const handleInputChange = (field: keyof EditableService, value: any) => {
    setDraftData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!draftData.title?.trim()) newErrors.title = "Название услуги обязательно"
    if (!draftData.description?.trim()) newErrors.description = "Описание услуги обязательно"
    if (!draftData.price || draftData.price <= 0) newErrors.price = "Цена должна быть больше 0"
    if (!draftData.duration?.trim()) newErrors.duration = "Продолжительность обязательна"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSavedData(draftData)
      setHasChanges(false)

      if (id === "new") {
        // Redirect to the new service page
        router.push(`/service-edit/${Date.now()}`)
      }
    } catch (error) {
      console.error("Failed to save service:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleModeToggle = async (mode: "view" | "edit") => {
    if (mode === "view") {
      if (!validateForm()) return
      if (hasChanges) {
        await handleSave()
      }
    }
    setIsEditMode(mode === "edit")
  }

  const handleBack = () => {
    if (hasChanges) {
      const confirmed = window.confirm("У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?")
      if (!confirmed) return
    }
    router.push("/specialist-dashboard?section=services")
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Вы уверены, что хотите удалить эту услугу?")
    if (!confirmed) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/specialist-dashboard?section=services")
    } catch (error) {
      console.error("Failed to delete service:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleIncludesChange = (newIncludes: string[]) => {
    setDraftData((prev) => ({ ...prev, includes: newIncludes }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <ModeToggleBar
        isEditMode={isEditMode}
        onModeToggle={handleModeToggle}
        hasErrors={Object.keys(errors).length > 0}
        errors={errors}
        hasChanges={hasChanges}
        isSaving={isSaving}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Назад
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {id === "new" ? "Новая услуга" : draftData.title || "Редактирование услуги"}
                </h1>
                {id !== "new" && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={draftData.isActive ? "default" : "secondary"}>
                      {draftData.isActive ? "Активна" : "Неактивна"}
                    </Badge>
                    {draftData.serviceType && (
                      <Badge variant="outline">
                        {SERVICE_TYPES.find((t) => t.id === draftData.serviceType)?.label}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {id !== "new" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 bg-transparent border-red-200 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            )}
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 space-y-8">
              {/* Photo Gallery */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Фотографии услуги</h3>
                <SquareImageGallery
                  images={draftData.images}
                  alt={draftData.title}
                  ratioHeight={1}
                  ratioWidth={1}
                  borderRadius={8}
                />
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold dark:text-gray-100">Основная информация</h3>

                {/* Service Title */}
                <EnhancedInput
                  label="Название услуги"
                  value={draftData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={!isEditMode}
                  error={errors.title}
                  required
                  placeholder="Введите название услуги"
                />

                {/* Service Type Selection */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Тип услуги</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {SERVICE_TYPES.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          type="button"
                          disabled={!isEditMode}
                          onClick={() => handleInputChange("serviceType", type.id)}
                          className={cn(
                            "p-4 rounded-sm border-2 transition-all duration-200 flex flex-col items-center gap-2",
                            draftData.serviceType === type.id
                              ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                            !isEditMode && "opacity-60 cursor-not-allowed",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-6 w-6",
                              draftData.serviceType === type.id
                                ? "text-violet-600 dark:text-violet-400"
                                : "text-gray-500 dark:text-gray-400",
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm font-medium",
                              draftData.serviceType === type.id
                                ? "text-violet-600 dark:text-violet-400"
                                : "text-gray-700 dark:text-gray-300",
                            )}
                          >
                            {type.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price Input */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Цена *
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={draftData.price}
                        onChange={(e) => handleInputChange("price", Number(e.target.value))}
                        disabled={!isEditMode}
                        className={cn("pr-8", errors.price && "border-red-500")}
                        placeholder="0"
                      />
                      <RubleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                    {!isEditMode && draftData.serviceType && (
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">
                          {SERVICE_TYPES.find((t) => t.id === draftData.serviceType)?.label}
                        </span>
                      </div>
                    )}
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>

                  {/* Duration Input */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Продолжительность *
                    </Label>
                    <Input
                      value={draftData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      disabled={!isEditMode}
                      placeholder="например: 60 мин"
                      className={errors.duration ? "border-red-500" : ""}
                    />
                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                  </div>
                </div>

                {/* Category */}
                <EnhancedInput
                  label="Категория"
                  value={draftData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  disabled={!isEditMode}
                  placeholder="Выберите категорию"
                />
              </div>

              {/* Description and Includes */}
              <div>
                <AboutSection
                  title="Описание услуги"
                  description={draftData.description}
                  fullDescription={draftData.description}
                  includes={draftData.includes}
                  showIncludes={true}
                  showEducationExperience={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
