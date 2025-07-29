"use client"

import type React from "react"

import {
  MapPin,
  TimerReset,
  MonitorPlayIcon as TvMinimalPlay,
  Users,
  MessagesSquare,
  Share,
  Edit,
  X,
  Check,
} from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Format, Service } from "@/types/common"
import Image from "next/image"
import { AboutContentsSection } from "@/components/service/about-contents-section"
import { IconPractice } from "@/components/icons/icon-practice"
import { useState, useCallback, useMemo, useEffect } from "react"
import { CalendarWidget } from "@/components/adept-calendar/calendar-widget"
import type { BookingSlot } from "@/types/booking"
import { FeedbackSection } from "@/components/service/feedback-section"
import { PracticePlaceholder } from "../practice-placeholder"
import { formatNumber } from "@/utils/format"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/ui/button-back"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { MobileBookingSection } from "@/components/service/mobile-booking-section"
import { Included } from "@/components/service/included"
import { useAuth } from "@/hooks/use-auth"
import { MobileBookingCard } from "@/components/service/mobile-booking-card"
import type { ServiceData } from "@/components/service/types/common"
import { LocationInput } from "@/components/location-input"
import { EnhancedInput } from "@/components/enhanced-input"
import { CurrencyInput } from "@/components/currency-input"
import { PhotoUpload } from "@/components/photo-upload"

interface MobileServiceCardProps {
  service: Service
  bookingSlots: BookingSlot[]
  isEditMode?: boolean
  onInputChange?: (field: keyof ServiceData, value: string | string[] | Format[] | any) => void
  onPhotosUpload?: (photos: File[]) => Promise<void>
  onEditToggle?: () => void
  onSave?: () => void
  errors?: Record<string, string>
  isOwner?: boolean
}

// Функция для создания File объектов из URL
const createFileFromUrl = async (url: string, filename: string): Promise<File> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  } catch (error) {
    // Если не удается загрузить, создаем пустой файл
    return new File([""], filename, { type: "image/jpeg" })
  }
}

export function MobileServiceCard({
  service,
  bookingSlots,
  isEditMode = false,
  onInputChange,
  onPhotosUpload,
  onEditToggle,
  onSave,
  errors,
  isOwner = false,
}: MobileServiceCardProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [editPhotos, setEditPhotos] = useState<File[]>([])
  const specialist = service.specialist
  const booked = service.bookings
  const { isAuthenticated } = useAuth()

  // Инициализация editPhotos из service.images при входе в режим редактирования
  useEffect(() => {
    if (isEditMode && service.images.length > 0) {
      const initializePhotos = async () => {
        const photoFiles = await Promise.all(
          service.images.map((url, index) => createFileFromUrl(url, `photo-${index}.jpg`)),
        )
        setEditPhotos(photoFiles)
      }
      initializePhotos()
    } else if (!isEditMode) {
      setEditPhotos([])
    }
  }, [isEditMode, service.images])

  // Мемоизируем обработчики событий чтобы избежать ререндеринга
  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // Implement share functionality
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

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onEditToggle?.()
    },
    [onEditToggle],
  )

  const handleCancel = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onEditToggle?.()
    },
    [onEditToggle],
  )

  const handleSave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSave?.()
    },
    [onSave],
  )

  // Мемоизируем вычисления для избежания ненужных пересчетов
  const memoizedImages = useMemo(() => {
    return service.images && service.images.length > 0 ? service.images : []
  }, [service.images])

  const memoizedIncludes = useMemo(() => {
    return service.includes || []
  }, [service.includes])

  const handleIncludedChange = (index: number, value: string) => {
    if (!onInputChange) return
    const updatedSkills = [...service.includes]
    updatedSkills[index] = value
    onInputChange("includes", updatedSkills)
  }

  const handleAddIncluded = () => {
    if (!onInputChange) return
    const updatedSkills = [...service.includes, ""]
    onInputChange("includes", updatedSkills)
  }

  const handleRemoveIncluded = (index: number) => {
    if (!onInputChange) return
    const updatedSkills = service.includes.filter((_, i) => i !== index)
    onInputChange("includes", updatedSkills)
  }

  const handlePhotosChange = (photos: File[]) => {
    setEditPhotos(photos)
    // Обновляем состояние в service data - создаем временные URL для превью
    if (onInputChange) {
      const photoUrls = photos.map((photo) => URL.createObjectURL(photo))
      onInputChange("images", photoUrls)
    }
  }

  // Передаем фотографии для загрузки на сервер через пропс
  const handleUploadPhotos = async () => {
    if (onPhotosUpload && editPhotos.length > 0) {
      await onPhotosUpload(editPhotos)
    }
  }

  // Экспортируем функцию для использования в родительском компоненте
  useEffect(() => {
    if (isEditMode && onPhotosUpload) {
      // Сохраняем ссылку на функцию загрузки в глобальном объекте для доступа из родителя
      ;(window as any).uploadServicePhotos = handleUploadPhotos
    }
  }, [editPhotos, onPhotosUpload, isEditMode])

  return (
    <div>
      <div className="w-full bg-colors-neutral-150">
        {/* Header with Back Button and Action Buttons */}
        <div className="flex items-center justify-between p-4 sticky top-0 bg-white z-10 border-b">
          <BackButton className="text-neutral-700 opacity-80" text="назад" />

          <div className="flex gap-2">
            {!isEditMode ? (
              // View mode buttons
              <>
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

                <button
                  onClick={handleReply}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm"
                  title="Написать специалисту"
                >
                  <MessagesSquare size={20} />
                </button>

                <button
                  onClick={handleShare}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm"
                  title="Поделиться"
                >
                  <Share size={20} />
                </button>

                {isOwner && (
                  <button
                    onClick={handleEdit}
                    className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-violet-50 shadow-sm"
                    title="Редактировать"
                  >
                    <Edit size={20} />
                  </button>
                )}
              </>
            ) : (
              // Edit mode buttons
              <>
                <button
                  onClick={handleCancel}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-red-50 shadow-sm"
                  title="Отменить"
                >
                  <X size={20} />
                </button>

                <button
                  onClick={handleSave}
                  className="rounded-sm h-9 w-9 flex items-center justify-center bg-white hover:bg-green-50 shadow-sm"
                  title="Сохранить"
                >
                  <Check size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Image Swiper / Photo Upload Section */}
        <div className="w-full bg-neutral-800">
          {!isEditMode ? (
            // View mode - показываем изображения
            memoizedImages.length > 0 ? (
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
            )
          ) : (
            // Edit mode - показываем PhotoUpload
            <div className="p-4">
              <PhotoUpload
                photos={editPhotos}
                onPhotosChange={handlePhotosChange}
                maxPhotos={3}
                description="Загрузите новые фотографии для замены текущих"
                showTitle={false}
              />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="bg-colors-neutral-150 p-4 space-y-4">
          <div className="flex items-start justify-between">
            {isEditMode ? (
              <EnhancedInput
                value={service.title}
                onChange={(e) => onInputChange && onInputChange("title", e.target.value)}
                placeholder="Название"
                type="input"
                className="text-xl font-bold text-gray-900 flex-1 pr-2"
                showEditIcon
              />
            ) : (
              <h1 className="text-xl font-bold text-gray-900 flex-1 pr-2">{service.title}</h1>
            )}

            <div className="flex items-center text-2xl font-bold text-gray-900">
              {isEditMode ? (
                <CurrencyInput
                  value={service.price}
                  onChange={(value) => onInputChange && onInputChange("price", value)}
                  placeholder="0"
                  error={errors?.price}
                  className="border border-gray-100 text-2xl"
                />
              ) : (
                <>
                  {formatNumber(service.price)}
                  <RubleIcon size={28} className="mb-0.5 ml-1" />
                </>
              )}
            </div>
          </div>

          {isEditMode ? (
            <EnhancedInput
              value={service.description || ""}
              onChange={(e) => onInputChange && onInputChange("description", e.target.value)}
              placeholder="Введите описание"
              type="input"
              className="text-gray-700"
              showEditIcon
            />
          ) : (
            <p className="text-gray-700">{service.description}</p>
          )}

          {booked?.length === 0 && !isEditMode && (
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm" key="duration">
                <TimerReset size={14} />
                <span className="text-sm text-gray-600">{service.duration}</span>
              </div>

              <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm" key="format">
                {service.format.map((f) => {
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
                })}
              </div>

              <div className="flex items-center h-8 px-2 gap-1 bg-white shadow-sm rounded-sm ml-auto" key="practice">
                <IconPractice width={16} height={14} />
                <span className="text-sm">{service.practice}</span>
              </div>
            </div>
          )}

          {service.location && booked?.length === 0 && !isEditMode && (
            <div className="flex items-center text-gray-600" key="location">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{service.location}</span>
            </div>
          )}

          {isEditMode && (
            <LocationInput
              value={service.location || ""}
              onChange={(value) => onInputChange && onInputChange("location", value)}
              error={errors?.location}
            />
          )}

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
        </div>

        <div className="relative">
          <AboutContentsSection
            description={service.description}
            contents={memoizedIncludes}
            included={service.includes}
            onAddIncluded={handleAddIncluded}
            onIncludedChange={handleIncludedChange}
            onRemoveIncluded={handleRemoveIncluded}
            isEditMode={isEditMode}
          />
        </div>
      </div>

      <div className="bg-colors-neutral-150 pt-2">
        <div className="relative">
          {/* Секция "Опыт" */}
          <div className="overflow-hidden transition-all duration-500 ease-in-out flex">
            <div className="mt-4 px-4">
              <Included title="Наполнение" items={memoizedIncludes} />
            </div>
          </div>
        </div>

        {isAuthenticated && booked?.length === 0 && !isEditMode && (
          <>
            <div className="mb-4 px-4">
              <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} isCollapsible={true} />
            </div>
            <MobileBookingSection selectedDate={selectedDate} bookingSlots={bookingSlots} />
          </>
        )}

        {!isEditMode && (
          <div className="bg-colors-neutral-150 pt-4">
            <FeedbackSection feedbacks={service.reviews} />
          </div>
        )}
      </div>
    </div>
  )
}
