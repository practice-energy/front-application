"use client"

import type React from "react"

import { MapPin, TimerReset, MonitorPlayIcon as TvMinimalPlay, Users, MessagesSquare, Share } from 'lucide-react'
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Format } from "@/types/common"
import Image from "next/image"
import { AboutContentsSection } from "@/components/service/about-contents-section"
import { IconPractice } from "@/components/icons/icon-practice"
import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { CalendarWidget } from "@/components/adept-calendar/calendar-widget"
import type { BookingSlot } from "@/types/booking"
import { FeedbackSection } from "@/components/service/feedback-section"
import { PracticePlaceholder } from "../practice-placeholder"
import { formatNumber } from "@/utils/format"
import { useRouter, useSearchParams } from "next/navigation"
import { BackButton } from "@/components/ui/button-back"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { MobileBookingSection } from "@/components/service/mobile-booking-section"
import { useAuth } from "@/hooks/use-auth"
import { MobileBookingCard } from "@/components/service/mobile-booking-card"
import { ModeToggleBar } from "@/components/profile/mode-toggle-bar"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { CurrencyInput } from "@/components/currency-input"
import { EnhancedInput } from "@/components/enhanced-input"
import { LocationInput } from "@/components/location-input"
import { Bullets } from "@/components/specialist/bullets"
import { PhotoUpload } from "@/components/photo-upload"
import { PracticeServiceRestrictions } from "@/components/service/components/practice-service-restrictions"
import type { CalendarRestrictions } from "@/types/calendar-event"
import type { Service, FormatSettings } from "@/types/service"
import { cn } from "@/lib/utils"
import { ServiceFormatItem } from "@/components/service/service-format-item"

interface MobileServiceCardProps {
  service: Service
  bookingSlots: BookingSlot[]
  onModeToggle?: (mode: "view" | "edit") => void
  onPublish?: () => void
  isSaving?: boolean
  hasChanges?: boolean
  isEditable: boolean
  onServiceUpdate?: (updatedService: Service) => void
}

// Эмуляция загрузки файлов в хранилище
const uploadPhotosToStorage = async (photos: File[]): Promise<string[]> => {
  // Эмуляция задержки запроса
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Эмуляция возврата URL-ов загруженных фотографий
  return photos.map((photo, index) => `/uploaded-photos/${Date.now()}-${index}-${photo.name}`)
}

// Helper function to create File from URL
const createFileFromUrl = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}

export function MobileServiceCard({
  service,
  bookingSlots,
  onModeToggle,
  onPublish,
  isSaving,
  hasChanges,
  isEditable,
  onServiceUpdate,
}: MobileServiceCardProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const searchParams = useSearchParams()

  const [isEditMode, setIsEditMode] = useState(searchParams.get("mode") === "edit" && isEditable)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const specialist = service.specialist
  const booked = service.bookings
  const { isAuthenticated } = useAuth()

  const [editPhotos, setEditPhotos] = useState<File[]>([])

  // Initialize restrictions from service or create default
  const [restrictions, setRestrictions] = useState<CalendarRestrictions>(service.calendarRestrictions || CalendarRestrictions.createDefault())
  const [editingRestrictionId, setEditingRestrictionId] = useState<string | null>(null)

  const calendarBottomRef = useRef<HTMLDivElement>(null)
  const restrictionBottomRef = useRef<HTMLDivElement>(null)

  const [format, setFormat] = useState<"video" | "in-person">(
    service.settings.video.enabled ? "video" : "in-person"
  )

  // Состояние для форматов услуг
  const [serviceFormats, setServiceFormats] = useState({
    video: {
      ...service.settings.video,
      isEditMode: false
    },
    inPerson: {
      ...service.settings.inPerson,
      isEditMode: false
    }
  })

  // Инициализация editPhotos из service.images при входе в режим редактирования
  useEffect(() => {
    if (isEditMode && service.images.length > 0 && editPhotos.length === 0) {
      const initializePhotos = async () => {
        try {
          const photoFiles = await Promise.all(
            service.images.map((url, index) => createFileFromUrl(url, `photo-${index}.jpg`)),
          )
          setEditPhotos(photoFiles)
        } catch (error) {
          console.error("Failed to initialize photos:", error)
          // Если не удалось загрузить, просто оставляем пустой массив
          setEditPhotos([])
        }
      }

      initializePhotos()
    } else if (!isEditMode) {
      setEditPhotos([])
    }
  }, [isEditMode, service.images])

  const handlePhotosUpload = async (photos: File[]) => {
    try {
      // Загружаем фотографии в хранилище
      const uploadedUrls = await uploadPhotosToStorage(photos)

      // Обновляем service с новыми URL
      const updatedService = { ...service, images: uploadedUrls }
      onServiceUpdate?.(updatedService)

      console.log("Photos uploaded successfully:", uploadedUrls)
    } catch (error) {
      console.error("Failed to upload photos:", error)
    }
  }

  // Передаем фотографии для загрузки на сервер через пропс
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePublish = async () => {
    if (!validateForm()) return

    setIsTransitioning(true)
    try {
      if (isEditMode && (window as any).uploadServicePhotos) {
        await (window as any).uploadServicePhotos()
      }

      if (onPublish) {
        await onPublish()
      }

      setIsEditMode(false)
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
      await new Promise((resolve) => setTimeout(resolve, 300))
      setIsTransitioning(false)
    }

    setIsTransitioning(true)
    setIsEditMode(mode === "edit")
    if (onModeToggle) {
      await onModeToggle(mode)
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsTransitioning(false)
  }

  const handlePhotosChange = (photos: File[]) => {
    setEditPhotos(photos)
    // Обновляем состояние в service data - создаем временные URL для превью
    const photoUrls = photos.map((photo) => URL.createObjectURL(photo))
    handleInputChange("images", photoUrls)
  }

  const handleInputChange = (field: keyof Service, value: string | string[] | Format[] | any) => {
    const updatedService = { ...service, [field]: value }
    onServiceUpdate?.(updatedService)
    
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleRestrictionsUpdate = (newRestrictions: CalendarRestrictions) => {
    setRestrictions(newRestrictions)
    handleInputChange("calendarRestrictions", newRestrictions)
  }

  // Обработчики для форматов
  const handleFormatUpdate = (formatType: "video" | "inPerson", data: Partial<FormatSettings>) => {
    const newFormats = {
      ...serviceFormats,
      [formatType]: {
        ...serviceFormats[formatType],
        ...data
      }
    }
    setServiceFormats(newFormats)
    
    // Обновляем основные данные сервиса
    const updatedService = {
      ...service,
      settings: {
        video: formatType === "video" ? newFormats.video : serviceFormats.video,
        inPerson: formatType === "inPerson" ? newFormats.inPerson : serviceFormats.inPerson
      }
    }
    onServiceUpdate?.(updatedService)
  }

  const handleFormatEditToggle = (formatType: "video" | "inPerson") => {
    setServiceFormats(prev => ({
      ...prev,
      [formatType]: {
        ...prev[formatType],
        isEditMode: !prev[formatType].isEditMode
      }
    }))
  }

  const handleFormatStatusToggle = (formatType: "video" | "inPerson") => {
    const newFormats = {
      ...serviceFormats,
      [formatType]: {
        ...serviceFormats[formatType],
        enabled: !serviceFormats[formatType].enabled
      }
    }
    setServiceFormats(newFormats)
    
    // Обновляем основные данные сервиса
    const updatedService = {
      ...service,
      settings: {
        video: formatType === "video" ? newFormats.video : serviceFormats.video,
        inPerson: formatType === "inPerson" ? newFormats.inPerson : serviceFormats.inPerson
      }
    }
    onServiceUpdate?.(updatedService)
  }

  // Scroll to restriction bottom when editing restriction
  useEffect(() => {
    if (editingRestrictionId && restrictionBottomRef.current) {
      restrictionBottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [editingRestrictionId])

  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (navigator.share) {
        navigator
          .share({
            title: service.title,
            text: service.description,
            url: window.location.href,
          })
          .catch(console.error)
      }
    },
    [service.title, service.description],
  )

  const handleReply = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      router.push(`/search/${specialist.id}`)
    },
    [router, specialist.id],
  )

  const handleToProfile = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      router.push(`/specialist/${specialist.id}`)
    },
    [router, specialist.id],
  )

  const handleIncludedChange = (index: number, value: string) => {
    const updatedSkills = [...service.includes]
    updatedSkills[index] = value
    handleInputChange("includes", updatedSkills)
  }

  const handleAddIncluded = () => {
    const updatedSkills = [...service.includes, ""]
    handleInputChange("includes", updatedSkills)
  }

  const handleRemoveIncluded = (index: number) => {
    const updatedSkills = service.includes.filter((_, i) => i !== index)
    handleInputChange("includes", updatedSkills)
  }

  const memoizedImages = useMemo(() => {
    return service.images && service.images.length > 0 ? service.images : []
  }, [service.images])

  return (
    <div>
      <div className="w-full bg-colors-neutral-150">
        {/* Header with Back Button and Action Buttons */}
        <div className="flex items-center justify-between p-4 top-0 bg-white z-10 border-b">
          <BackButton className="text-neutral-700 opacity-80" />

          <div className="flex gap-6">
            {isEditable && (
              <ModeToggleBar
                isEditMode={isEditMode}
                onModeToggle={handleModeToggle}
                onPublish={handlePublish}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />
            )}

            {!isEditable && !isEditMode && (
              <button
                onClick={handleToProfile}
                className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm"
                title="Профиль специалиста"
              >
                {specialist.avatar ? (
                  <Image
                    src={specialist.avatar || "/placeholder.svg"}
                    alt={specialist.name}
                    width={36}
                    height={36}
                    className="rounded-sm"
                  />
                ) : (
                  <PracticePlaceholder width={36} height={36} className="rounded-sm" />
                )}
              </button>
            )}

            {!isEditable && (
              <button
                onClick={handleReply}
                className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm"
                title="Написать специалисту"
              >
                <MessagesSquare size={20} />
              </button>
            )}

            {!isEditMode && (
              <button
                onClick={handleShare}
                className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm"
                title="Поделиться"
              >
                <Share size={20} />
              </button>
            )}
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
              <div className="flex justify-center items-center h-[400px]">
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
              {/* Image Swiper */}
              <div className="w-full bg-neutral-700">
                {isEditMode ? (
                  <div className="p-2">
                    <PhotoUpload
                      photos={editPhotos}
                      onPhotosChange={handlePhotosChange}
                      maxPhotos={3}
                      description="Загрузите новые фотографии для замены текущих"
                      showTitle={false}
                      className="bg-neutral-700 rounded-none rounded-b-sm"
                      bgClassName="bg-neutral-700 rounded-none rounded-b-sm text-neutral-100"
                    />
                  </div>
                ) : (
                  <>
                    {memoizedImages.length > 0 ? (
                      <Swiper spaceBetween={0} slidesPerView={1} className="w-full">
                        {memoizedImages.map((image, index) => (
                          <SwiperSlide key={`${image}-${index}`}>
                            <div className="aspect-square w-full relative">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`${service.title} ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <div className="aspect-square w-full relative">
                        <PracticePlaceholder className="w-full h-full" width={600} height={600} />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Content Section */}
              <div className="bg-colors-neutral-150 p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="text-gray-900 flex-1 pr-2">
                    {isEditMode ? (
                      <EnhancedInput
                        value={service.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Название"
                        type="input"
                        className="text-neutral-900 flex-1 w-min-2/3"
                      />
                    ) : (
                      <div className="text-2xl font-semibold">{service.title}</div>
                    )}
                  </div>
                  <div className="flex items-center font-bold text-gray-900">
                    {!isEditMode && (
                      <div className="flex flex-col font-bold text-[24px]">
                        <div className="ml-auto flex flex-row items-center">
                          {(() => {
                            const currentPractice = format === "video" ? service.settings.video : service.settings.inPerson;
                            const price = currentPractice?.practices?.reduce((sum, p) => sum + p.price, 0) || 0;
                            return formatNumber(price);
                          })()}
                          <RubleIcon size={28} className="mb-1 ml-1" bold={false} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {isEditMode && (<div className="flex flex-col space-y-4">
                  <ServiceFormatItem
                      format={"video"}
                      practices={serviceFormats.video.practices}
                      totalPrice={serviceFormats.video.practices.reduce((sum, p) => sum + p.price, 0)}
                      isActive={serviceFormats.video.enabled}
                      isEditMode={serviceFormats.video.isEditMode}
                      onUpdate={(data) => handleFormatUpdate("video", data)}
                      onEditToggle={() => handleFormatEditToggle("video")}
                      onStatusToggle={() => handleFormatStatusToggle("video")}
                  />
                  <ServiceFormatItem
                      format={"in-person"}
                      practices={serviceFormats.inPerson.practices}
                      totalPrice={serviceFormats.inPerson.practices.reduce((sum, p) => sum + p.price, 0)}
                      isActive={serviceFormats.inPerson.enabled}
                      isEditMode={serviceFormats.inPerson.isEditMode}
                      onUpdate={(data) => handleFormatUpdate("inPerson", data)}
                      onEditToggle={() => handleFormatEditToggle("inPerson")}
                      onStatusToggle={() => handleFormatStatusToggle("inPerson")}
                  />
                </div>)}

                {isEditMode ? (
                  <EnhancedInput
                    value={service.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Введите описание"
                    type="input"
                    className="mt-4 text-sm"
                  />
                ) : (
                  <p className="text-gray-700">{service.description}</p>
                )}

                {!isEditMode && booked?.length === 0 && (
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-row border border-violet-600 rounded-sm bg-white shadow-sm">
                      <button className={cn("flex flex-row gap-1 items-center p-1 px-2 rounded-r-sm",
                        format === "video" ? "bg-violet-600 text-white" : "text-neutral-900",
                      )}
                        onClick={() => setFormat("video")}
                      >
                        <TvMinimalPlay size={14}/>
                        <p className="text-sm">Онлайн</p>
                      </button>
                      <button className={cn("flex flex-row gap-1 items-center p-1 px-2 rounded-l-sm",
                        format === "in-person" ? "bg-violet-600 text-white" : "text-neutral-900",
                      )}
                        onClick={() => setFormat("in-person")}
                      >
                        <Users size={14}/>
                        <p className="text-sm">Очно</p>
                      </button>
                    </div>

                    <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm">
                      <TimerReset size={14} />
                      <span className="text-sm text-gray-600">
                        {(format === "video" ? service.settings.video.score : service.settings.inPerson.score) || 0}
                      </span>
                    </div>

                    {service.tags?.map((tag, index) => (
                      <div key={index} className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm">
                        <p className="text-sm text-gray-600">{tag}</p>
                      </div>
                    ))}

                    <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm ml-auto">
                      <IconPractice width={16} height={14} />
                      <span className="text-sm">
                        {(format === "video" ? service.settings.video.score : service.settings.inPerson.score) || 0}
                      </span>
                    </div>
                  </div>
                )}

                {service.location && booked?.length === 0 && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    {isEditMode ? (
                      <input
                        type="text"
                        value={service.location || ""}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      <span>{service.location}</span>
                    )}
                  </div>
                )}

                {isEditMode && (
                  <LocationInput
                    value={service.location || ""}
                    onChange={(value) => handleInputChange("location", value)}
                    error={errors?.location}
                  />
                )}

                {!isEditMode && (
                  <>
                    {booked?.map((booking) => (
                      <MobileBookingCard
                        key={booking.id}
                        startTime={booking.startTime.toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        endTime={booking.endTime.toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        specialist={{
                          id: specialist.id,
                          name: specialist.name,
                          avatar: specialist.avatar,
                        }}
                        service={{
                          id: booking.id,
                          name: service.title,
                          price: booking.price,
                          description: service.description,
                        }}
                        duration={booking.duration}
                        format={booking.format}
                        location={service.location}
                      />
                    ))}
                  </>
                )}
              </div>

              <div>
                <AboutContentsSection
                  contents={service.contents}
                  included={service.includes}
                  onContentsChange={(e) => {
                    handleInputChange("contents", e)
                  }}
                  onAddIncluded={handleAddIncluded}
                  onIncludedChange={handleIncludedChange}
                  onRemoveIncluded={handleRemoveIncluded}
                  isEditMode={isEditMode}
                />
              </div>

              <div className="relative">
                {/* Секция "Опыт" */}
                <div className="overflow-hidden transition-all duration-500 ease-in-out flex">
                  <div className="px-4">
                    <Bullets
                      title="Наполнение"
                      items={service.includes}
                      isEditMode={isEditMode}
                      onChange={handleIncludedChange}
                      onAdd={handleAddIncluded}
                      onRemove={handleRemoveIncluded}
                    />
                  </div>
                </div>
              </div>

              {/* Practice Service Restrictions - only in edit mode */}
              {isEditMode && (
                <div className="bg-colors-neutral-150 px-4 py-6">
                  <PracticeServiceRestrictions
                    restrictions={restrictions}
                    onUpdate={handleRestrictionsUpdate}
                    editingRestrictionId={editingRestrictionId}
                    setEditingRestrictionId={setEditingRestrictionId}
                  />
                  <div ref={restrictionBottomRef} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isTransitioning && (
        <div className="bg-colors-neutral-150 pt-2">
          {isAuthenticated &&
            // TODO
            // booked?.length === 0 &&
            !isEditMode && (
              <>
                <div className="mb-4 px-4">
                  <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} isCollapsible={true} />
                </div>
                <MobileBookingSection selectedDate={selectedDate} bookingSlots={bookingSlots} />
              </>
            )}

          {!isEditMode && (
            <div className="relative px-2 pt-6 pb-4">
              <FeedbackSection feedbacks={service.reviews} />
            </div>
          )}

          <div className="h-4"></div>
        </div>
      )}
    </div>
  )
}
