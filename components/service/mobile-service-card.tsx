"use client"

import { MapPin, TimerReset, MonitorPlayIcon as TvMinimalPlay, Users, MessagesSquare, Share } from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Service, Format } from "@/types/common"
import Image from "next/image"
import { AboutContentsSection } from "@/components/service/about-contents-section"
import { IconPractice } from "@/components/icons/icon-practice"
import {useState, useCallback, useMemo, useEffect} from "react"
import { CalendarWidget } from "@/components/adept-calendar/calendar-widget"
import type {Booking, BookingSlot} from "@/types/booking"
import { FeedbackSection } from "@/components/service/feedback-section"
import { PracticePlaceholder } from "../practice-placeholder"
import { formatNumber } from "@/utils/format"
import { useRouter, useSearchParams } from "next/navigation"
import { BackButton } from "@/components/ui/button-back"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { MobileBookingSection } from "@/components/service/mobile-booking-section"
import {useAuth} from "@/hooks/use-auth"
import {MobileBookingCard} from "@/components/service/mobile-booking-card"
import { ModeToggleBar } from "@/components/profile/mode-toggle-bar"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import {CurrencyInput} from "@/components/currency-input";
import {EnhancedInput} from "@/components/enhanced-input";
import {LocationInput} from "@/components/location-input";
import {Bullets} from "@/components/specialist/bullets";
import {PhotoUpload} from "@/components/photo-upload";

interface MobileServiceCardProps {
  service: Service
  bookingSlots: BookingSlot[]
  onModeToggle?: (mode: "view" | "edit") => void
  onPublish?: () => void
  isSaving?: boolean
  hasChanges?: boolean
  isEditable: boolean
}

// Эмуляция загрузки файлов в хранилище
const uploadPhotosToStorage = async (photos: File[]): Promise<string[]> => {
  // Эмуляция задержки запроса
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Эмуляция возврата URL-ов загруженных фотографий
  return photos.map((photo, index) => `/uploaded-photos/${Date.now()}-${index}-${photo.name}`)
}

export function MobileServiceCard({
                                    service,
                                    bookingSlots,
                                    onModeToggle,
                                    onPublish,
                                    isSaving,
                                    hasChanges,
                                    isEditable
                                  }: MobileServiceCardProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const searchParams = useSearchParams()

  const [isEditMode, setIsEditMode] = useState(searchParams.get("mode") === "edit" && isEditable)
  const [savedData, setSavedData] = useState<Service>(service)
  const [draftData, setDraftData] = useState<Service>(service)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const specialist = service.specialist
  const booked = service.bookings
  const { isAuthenticated } = useAuth()

  const [editPhotos, setEditPhotos] = useState<File[]>([])

  // Инициализация editPhotos из service.images при входе в режим редактирования
  useEffect(() => {
    if (isEditMode && draftData.images.length > 0 && editPhotos.length === 0) {
      const initializePhotos = async () => {
        try {
          const photoFiles = await Promise.all(
              draftData.images.map((url, index) =>
                  createFileFromUrl(url, `photo-${index}.jpg`)
              )
          );
          setEditPhotos(photoFiles);
        } catch (error) {
          console.error("Failed to initialize photos:", error);
          // Если не удалось загрузить, просто оставляем пустой массив
          setEditPhotos([]);
        }
      };

      initializePhotos();
    } else if (!isEditMode) {
      setEditPhotos([]);
    }
  }, [isEditMode, draftData.images]);

  const handlePhotosUpload = async (photos: File[]) => {
    try {
      // Загружаем фотографии в хранилище
      const uploadedUrls = await uploadPhotosToStorage(photos)

      // Обновляем draftData с новыми URL
      setDraftData((prev) => ({ ...prev, images: uploadedUrls }))

      console.log("Photos uploaded successfully:", uploadedUrls)
    } catch (error) {
      console.error("Failed to upload photos:", error)
    }
  }

  // Передаем фотографии для загрузки на сервер через пропс
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
      if (isEditMode && (window as any).uploadServicePhotos) {
        await (window as any).uploadServicePhotos()
      }

      setSavedData(draftData)

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
    setDraftData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleShare = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        if (navigator.share) {
          navigator
              .share({
                title: isEditMode ? draftData.title : savedData.title,
                text: isEditMode ? draftData.description : savedData.description,
                url: window.location.href,
              })
              .catch(console.error)
        }
      },
      [isEditMode, draftData, savedData],
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
    const updatedSkills = [...draftData.includes]
    updatedSkills[index] = value
    handleInputChange("includes", updatedSkills)
  }

  const handleAddIncluded = () => {
    const updatedSkills = [...draftData.includes, ""]
    handleInputChange("includes", updatedSkills)
  }

  const handleRemoveIncluded = (index: number) => {
    const updatedSkills = draftData.includes.filter((_, i) => i !== index)
    handleInputChange("includes", updatedSkills)
  }

  const memoizedImages = useMemo(() => {
    const images = isEditMode ? draftData.images : savedData.images
    return images && images.length > 0 ? images : []
  }, [isEditMode, draftData.images, savedData.images])

  return (
      <div>
        <div className="w-full bg-colors-neutral-150">
          {/* Header with Back Button and Action Buttons */}
          <div className="flex items-center justify-between p-4 sticky top-0 bg-white z-10 border-b">
            <BackButton className="text-neutral-700 opacity-80" text="назад" />

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
                                            alt={`${draftData.title} ${index + 1}`}
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
                                value={draftData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Название"
                                type="input"
                                className="text-neutral-900 flex-1 w-min-2/3"
                                showEditIcon
                            />
                        ) : (
                            <div className="text-2xl font-semibold">{draftData.title}</div>
                        )}
                      </div>
                      <div className="flex items-center font-bold text-gray-900">
                        {isEditMode ? (
                            <div className="mt-2">
                              <CurrencyInput
                                  value={draftData.price}
                                  onChange={(value) => handleInputChange("price", value)}
                                  placeholder="0"
                                  error={errors?.price}
                                  className="border border-gray-100 text-mobilebase max-w-1/3"
                                  iconSize={24}
                              />
                            </div>
                        ) : (
                            <div className="text-2xl">
                            {formatNumber(draftData.price)}
                              <RubleIcon size={28} className="mb-1 ml-1" bold={false}/>
                            </div>
                        )}
                      </div>
                    </div>

                    {isEditMode ? (
                        <EnhancedInput
                            value={draftData.description || ""}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Введите описание"
                            type="input"
                            className="mt-4 text-sm"
                            showEditIcon
                        />
                    ) : (
                        <p className="text-gray-700">{draftData.description}</p>
                    )}

                    {booked?.length === 0 && (
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm">
                            <TimerReset size={14} />
                            {isEditMode ? (
                                <input
                                    type="text"
                                    value={draftData.duration}
                                    onChange={(e) => handleInputChange("duration", e.target.value)}
                                    className="w-24 p-1 border rounded"
                                />
                            ) : (
                                <span className="text-sm text-gray-600">{draftData.duration}</span>
                            )}
                          </div>

                          <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm">
                            {!isEditMode && (
                                <>
                                  {
                                    draftData.format.map((f) => {
                                      return f === "video" ? (
                                          <>
                                            <TvMinimalPlay size={14} />
                                            <p className="text-gray-600">Видео</p>
                                          </>
                                      ) : (
                                          <>
                                            <Users size={14} />
                                            <p className="text-gray-600">Очная</p>
                                          </>
                                      )
                                    })
                                  }
                                </>
                            )}
                          </div>

                          <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm ml-auto">
                            <IconPractice width={16} height={14} />
                            <span className="text-sm">{draftData.practice}</span>
                          </div>
                        </div>
                    )}

                    {draftData.location && booked?.length === 0 && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2" />
                          {isEditMode ? (
                              <input
                                  type="text"
                                  value={draftData.location || ""}
                                  onChange={(e) => handleInputChange("location", e.target.value)}
                                  className="w-full p-1 border rounded"
                              />
                          ) : (
                              <span>{draftData.location}</span>
                          )}
                        </div>
                    )}

                    {isEditMode && (
                        <LocationInput
                            value={draftData.location || ""}
                            onChange={(value) => handleInputChange("location", value)}
                            error={errors?.location}
                        />
                    )}

                    {!isEditMode && (
                        <>
                          {booked?.map((booking) => (
                              <MobileBookingCard
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
                                    avatar: specialist.avatar
                                  }}
                                  service={{
                                    id: service.id,
                                    name: service.title,
                                    price: service.price,
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
                        contents={draftData.contents}
                        included={draftData.includes}
                        onContentsChange={(e) => {handleInputChange("contents", e)}}
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
                            items={draftData.includes}
                            isEditMode={isEditMode}
                            onChange={handleIncludedChange}
                            onAdd={handleAddIncluded}
                            onRemove={handleRemoveIncluded}
                        />
                      </div>
                    </div>
                  </div>
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
