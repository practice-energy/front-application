"use client"

import { MapPin, TimerReset, MonitorPlayIcon as TvMinimalPlay, Users } from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Format, Service } from "@/types/common"
import Image from "next/image"
import { AboutContentsSection } from "@/components/service/about-contents-section"
import { IconPractice } from "@/components/icons/icon-practice"
import { useEffect, useState } from "react"
import { CalendarWidget } from "@/components/adept-calendar/calendar-widget"
import type { BookingSlot } from "@/types/booking"
import { BookingSection } from "@/components/service/booking-section"
import { FeedbackSection } from "@/components/service/feedback-section"
import { PracticePlaceholder } from "../practice-placeholder"
import { formatNumber } from "@/utils/format"
import { BookingCard } from "@/components/service/booking-card"
import type { ServiceData } from "@/components/service/types/common"
import { LocationInput } from "@/components/location-input"
import { EnhancedInput } from "@/components/enhanced-input"
import { CurrencyInput } from "@/components/currency-input"
import { PhotoUpload } from "@/components/photo-upload"

interface ServiceCardProps {
  service: Service
  bookingSlots: BookingSlot[]
  isAuthenticated: boolean
  isEditMode: boolean
  onInputChange: (field: keyof ServiceData, value: string | string[] | Format[] | any) => void
  onPhotosUpload?: (photos: File[]) => Promise<void>
  errors?: Record<string, string>
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

export function ServiceCard({
  service,
  bookingSlots,
  isAuthenticated,
  isEditMode,
  onInputChange,
  onPhotosUpload,
  errors,
}: ServiceCardProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [editPhotos, setEditPhotos] = useState<File[]>([])

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

  const thumbnails = service.images
  const mainImage = thumbnails[selectedImageIndex]
  const booked = service.bookings
  const specialist = service.specialist

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleIncludedChange = (index: number, value: string) => {
    const updatedSkills = [...service.includes]
    updatedSkills[index] = value
    onInputChange("includes", updatedSkills)
  }

  const handleAddIncluded = () => {
    const updatedSkills = [...service.includes, ""]
    onInputChange("includes", updatedSkills)
  }

  const handleRemoveIncluded = (index: number) => {
    const updatedSkills = service.includes.filter((_, i) => i !== index)
    onInputChange("includes", updatedSkills)
  }

  const handlePhotosChange = (photos: File[]) => {
    setEditPhotos(photos)
    // Обновляем состояние в service data - создаем временные URL для превью
    const photoUrls = photos.map((photo) => URL.createObjectURL(photo))
    onInputChange("images", photoUrls)
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
    <div className="rounded-sm shadow-md overflow-hidden">
      <div className="bg-colors-neutral-150 relative rounded-b-sm shadow-md ">
        <div className="rounded-b-sm bg-white ">
          {/* Black background photo section */}
          <div className="bg-neutral-800 p-6 flex gap-2 rounded-sm">
            {/* Main image */}
            {!isEditMode && (
              <div className="flex-1">
                {mainImage ? (
                  <Image
                    src={mainImage || "/placeholder.svg"}
                    alt={service.title}
                    className="object-cover rounded-sm"
                    width={600}
                    height={600}
                  />
                ) : (
                  <PracticePlaceholder
                    key={`placeholder-main`}
                    width={600}
                    height={600}
                    className="object-cover rounded-sm"
                  />
                )}
              </div>
            )}

            {/* Thumbnails */}
            {!isEditMode && (
              <div className="flex flex-col justify-between">
                {thumbnails.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`rounded-sm overflow-hidden ${selectedImageIndex === index ? "ring-1 ring-violet-600" : ""}`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${service.title} ${index + 2}`}
                      className="object-cover"
                      width={160}
                      height={160}
                    />
                  </button>
                ))}

                {Array.from({ length: Math.max(0, 3 - thumbnails.length) }).map((_, index) => (
                  <PracticePlaceholder key={`placeholder-${index}`} width={160} height={160} className="rounded-sm" />
                ))}
              </div>
            )}

            {/* Photo Upload Section - только в режиме редактирования */}
            {isEditMode && (
              <PhotoUpload
                photos={editPhotos}
                onPhotosChange={handlePhotosChange}
                maxPhotos={3}
                description="Загрузите новые фотографии для замены текущих"
                showTitle={false}
              />
            )}
          </div>

          {/* White background content section */}
          <div className="bg-white dark:bg-gray-800 p-6 space-y-4">
            {/* Title and price row */}
            <div className="flex items-center justify-between">
              {isEditMode ? (
                <EnhancedInput
                  value={service.title}
                  onChange={(e) => onInputChange("title", e.target.value)}
                  placeholder="Название"
                  type="input"
                  className="text-2xl text-neutral-900 flex-1"
                  showEditIcon
                />
              ) : (
                <div className="text-2xl font-bold text-neutral-900  flex-1">{service.title}</div>
              )}

              <div className="flex items-center text-[36px] font-bold text-neutral-900 pb-2">
                {isEditMode ? (
                  <CurrencyInput
                    value={service.price}
                    onChange={(value) => onInputChange("price", value)}
                    placeholder="0"
                    error={errors?.price}
                    className="border border-gray-100"
                  />
                ) : (
                  <>
                    {formatNumber(service.price)}
                    <RubleIcon size={48} bold={false} className="mb-0.5 ml-1" />
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {isEditMode ? (
              <EnhancedInput
                value={service.description || ""}
                onChange={(e) => onInputChange("description", e.target.value)}
                placeholder="Введите описание"
                type="input"
                className="mt-4 text-sm"
                showEditIcon
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{service.description}</p>
            )}

            {/* Location */}
            {service.location && booked?.length === 0 && !isEditMode && (
              <div className="flex items-center text-neutral-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{service.location}</span>
              </div>
            )}

            {isEditMode && (
              <LocationInput
                value={service.location || ""}
                onChange={(value) => onInputChange("location", value)}
                error={errors?.location}
              />
            )}

            {/* Tags row */}
            {!isEditMode && (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex w-[96px] h-[36px] shadow-sm items-center justify-start rounded-sm p-1 gap-1 bg-white">
                  <TimerReset size={16} />
                  <div className="text-gray-600 text-simple font-normal">{service.duration}</div>
                </div>
                <div className="inline-flex w-[96px] h-[36px] shadow-sm items-center justify-start rounded-sm p-1.5 gap-1 bg-white">
                  {service.format.map((f, index) => {
                    return f === "video" ? (
                      <>
                        <TvMinimalPlay size={16} key={`video-${index}`} />
                        <p className="text-gray-600" key={`text-video-${index}`}>
                          Видео
                        </p>
                      </>
                    ) : (
                      <>
                        <Users size={16} key={`users-${index}`} />
                        <p className="text-gray-600" key={`text-users-${index}`}>
                          Очная
                        </p>
                      </>
                    )
                  })}
                </div>
                <div className="inline-flex h-[36px] shadow-sm items-center justify-start rounded-sm p-1.5 gap-1 ml-auto bg-white">
                  <IconPractice width={20} height={18} />
                  {service.practice}
                </div>
              </div>
            )}

            {!isEditMode && (
              <>
                {booked?.map((booking) => (
                  <BookingCard
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
                    key={booking.id}
                  />
                ))}
              </>
            )}
          </div>
          <AboutContentsSection
            contents={service.description}
            included={service.includes}
            onAddIncluded={handleAddIncluded}
            onIncludedChange={handleIncludedChange}
            onRemoveIncluded={handleRemoveIncluded}
            isEditMode={isEditMode}
          />

          {/* Bookings section */}
          {isAuthenticated && booked?.length === 0 && !isEditMode && (
            <div className=" relative flex flex-row px-6 pb-3">
              <div className="w-80 flex-shrink-0">
                <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              </div>
              <BookingSection selectedDate={selectedDate} bookingSlots={bookingSlots} />
              <div className="absolute bottom-2 left-0 right-0 h-2 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
            </div>
          )}
        </div>

        {!isEditMode && (
          <div className="relative px-2 pt-6 pb-4">
            <FeedbackSection feedbacks={service.reviews} />
          </div>
        )}
      </div>
    </div>
  )
}
