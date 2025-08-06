"use client"

import { MapPin, TimerReset, MonitorPlayIcon as TvMinimalPlay, Users } from 'lucide-react'
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Format } from "@/types/common"
import Image from "next/image"
import { AboutContentsSection } from "@/components/service/about-contents-section"
import { IconPractice } from "@/components/icons/icon-practice"
import { useEffect, useState, useRef } from "react"
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
import { PracticeServiceRestrictions } from "@/components/service/components/practice-service-restrictions"
import type { Service } from "@/types/service"
import type { CalendarRestrictions } from "@/types/calendar-event"
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {AddEntityButton} from "@/components/add-entity-button";
import { ServiceFormatItem } from "@/components/service/service-format-item"

interface ServiceCardProps {
  service: Service
  bookingSlots: BookingSlot[]
  isAuthenticated: boolean
  isEditMode: boolean
  onInputChange: (field: keyof ServiceData, value: string | string[] | Format[] | any) => void
  onPhotosUpload?: (photos: File[]) => Promise<void>
  errors?: Record<string, string>
}

// Helper function to create File from URL
const createFileFromUrl = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
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
  const [editingRestrictionId, setEditingRestrictionId] = useState<string | null>(null)
  const [formatTags, setFormatTags] = useState<"video" | "in-person">(
      service.format.includes("video") ? "video" : "in-person"
  )

  // Состояние для форматов услуг
  const [serviceFormats, setServiceFormats] = useState([
    {
      format: "video" as Format,
      duration: 30,
      practices: [
        { id: "1", count: 4, duration: 30, price: 5000 },
        { id: "2", count: 4, duration: 60, price: 7500 }
      ],
      totalPrice: 50000,
      isActive: true,
      isEditMode: false
    },
    {
      format: "in-person" as Format,
      duration: 60,
      practices: [
        { id: "3", count: 2, duration: 60, price: 8000 }
      ],
      totalPrice: 16000,
      isActive: false,
      isEditMode: false
    }
  ])

  const calendarBottomRef = useRef<HTMLDivElement>(null)
  const restrictionBottomRef = useRef<HTMLDivElement>(null)

  // Initialize restrictions from service or create default
  const [restrictions, setRestrictions] = useState<CalendarRestrictions>(
    service.calendarRestrictions || {
      gmt: "GMT+3",
      commons: {
        Mon: { isActive: true, intervals: [] },
        Tue: { isActive: true, intervals: [] },
        Wed: { isActive: true, intervals: [] },
        Thu: { isActive: true, intervals: [] },
        Fri: { isActive: true, intervals: [] },
        Sat: { isActive: false, intervals: [] },
        Sun: { isActive: false, intervals: [] },
      },
      restrictions: [],
    },
  )

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

  const handleRestrictionsUpdate = (newRestrictions: CalendarRestrictions) => {
    setRestrictions(newRestrictions)
    onInputChange("calendarRestrictions", newRestrictions)
  }

  const handleFormatUpdate = (formatIndex: number, data: any) => {
    const newFormats = [...serviceFormats]
    newFormats[formatIndex] = { ...newFormats[formatIndex], ...data }
    setServiceFormats(newFormats)
  }

  const handleFormatEditToggle = (formatIndex: number) => {
    const newFormats = [...serviceFormats]
    newFormats[formatIndex].isEditMode = !newFormats[formatIndex].isEditMode
    setServiceFormats(newFormats)
  }

  const handleFormatStatusToggle = (formatIndex: number) => {
    const newFormats = [...serviceFormats]
    newFormats[formatIndex].isActive = !newFormats[formatIndex].isActive
    setServiceFormats(newFormats)
  }

  // Scroll to calendar bottom when calendar opens
  useEffect(() => {
    if (selectedDate && calendarBottomRef.current) {
      calendarBottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [selectedDate])

  // Scroll to restriction bottom when editing restriction
  useEffect(() => {
    if (editingRestrictionId && restrictionBottomRef.current) {
      restrictionBottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [editingRestrictionId])

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
    <div className="rounded-sm shadow-md overflow-hidden mb-28">
      <div className={cn(
          "relative rounded-b-sm shadow-md ",
          isEditMode ? "bg-white" : "bg-colors-neutral-150"
        )}
      >
        <div className="rounded-b-sm ">
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
                className="rounded-sm"
              />
            )}
          </div>

          <div className="flex flex-row">
            <div className="p-6 flex flex-col w-2/3">
              {/* Title and price row */}
                {isEditMode ? (
                    <input
                        value={service.title}
                        onChange={(e) => onInputChange("title", e.target.value)}
                        placeholder="Практис"
                        type="input"
                        className={cn(
                            "border-none focus:border-none focus:outline-none focus:ring-0", // Основные стили
                            "text-neutral-900 w-full text-[36px] h-[36px] font-bold p-3 px-1", // Текстовые стили
                        )}
                    />
                ) : (
                    <div className="flex items-center w-full py-3">
                    <div className="text-2xl font-bold text-neutral-900  flex-1">{service.title}</div>
                    </div>
                )}

              {/* Description */}
              {isEditMode ? (
                  <EnhancedInput
                      value={service.description || ""}
                      onChange={(e) => onInputChange("description", e.target.value)}
                      placeholder="Введите описание"
                      type="input"
                      className="mt-4 text-sm"
                  />
              ) : (
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>
              )}

              {/* Location */}
              {service.location &&
                  // booked?.length === 0 &&
                  !isEditMode && (
                  <div className="flex items-center text-neutral-600 pt-5">
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
            </div>
            <div className="p-6 space-y-4 flex flex-col ml-auto">
              <div className="flex items-center text-neutral-900 pb-2">
                {isEditMode ? (
                    <div className="flex flex-col space-y-4">
                      {serviceFormats.map((formatData, index) => (
                        <ServiceFormatItem
                          key={`${formatData.format}-${index}`}
                          format={formatData.format}
                          duration={formatData.duration}
                          practices={formatData.practices}
                          totalPrice={formatData.totalPrice}
                          isActive={formatData.isActive}
                          isEditMode={formatData.isEditMode}
                          onUpdate={(data) => handleFormatUpdate(index, data)}
                          onEditToggle={() => handleFormatEditToggle(index)}
                          onStatusToggle={() => handleFormatStatusToggle(index)}
                        />
                      ))}
                    </div>
                ) : (
                    <>
                      <div className="flex flex-col  font-bold  text-[36px] ">
                        <div className="ml-auto flex flex-row items-center">
                          {formatNumber(
                              (formatTags === "video" ? service.priceVideo : service.priceInPerson)) || 0
                          }
                          <RubleIcon size={48} bold={false} />
                        </div>
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>

          {/* Tags row */}
          {!isEditMode && (
              <div className="flex items-center gap-6 flex-wrap rounded-sm px-6 py-2">
                {service.format.length > 1 && (
                    <div className="flex flex-row border border-violet-600 rounded-sm ">
                      <button className={cn("flex flex-row gap-1 items-center p-1 px-2 rounded-r-sm",
                          formatTags === "video" ? "bg-violet-600 text-white" : "text-neutral-900",
                      )}
                              onClick={() => setFormatTags("video")}
                      >
                        <TvMinimalPlay size={16}/>
                        <p>Онлайн</p>
                      </button>
                      <button className={cn("flex flex-row gap-1 items-center p-1 px-2 rounded-l-sm",
                          formatTags === "in-person" ? "bg-violet-600 text-white" : "text-neutral-900",
                      )}
                              onClick={() => setFormatTags("in-person")}
                      >
                        <Users size={16}/>
                        <p>Очно</p>
                      </button>
                    </div>
                )}
                <div className="inline-flex h-[36px] shadow-sm items-center justify-start rounded-sm p-1 px-2 gap-1 bg-white">
                  <TimerReset size={16} />
                  <div className="text-gray-600 text-simple font-normal">{(
                      formatTags === "video" ? service.durationVideo : service.durationInPerson) || 0}</div>
                </div>
                {service.tags.map((tag) => <div>
                  <div className="inline-flex w-min-[106px] h-[36px] shadow-sm items-center justify-start rounded-sm px-2 gap-1 bg-white">
                    <div className="items-center mx-auto flex flex-row gap-1">
                      <p className="text-neutral-700 text-xs" >{tag}</p>
                    </div>
                  </div>
                </div>)}
                <div className="inline-flex h-[36px] shadow-sm items-center justify-start rounded-sm p-1.5 px-2 gap-1 bg-white">
                  <IconPractice width={20} height={18} />
                  {service.practiceVideo || 0}
                </div>
              </div>
          )}

          {!isEditMode && (
              <div className="px-6 space-y-2">
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
                          price: booking.format === "in-person" ? service.priceInPerson : service.priceVideo,
                          description: service.description,
                        }}
                        duration={booking.duration}
                        format={booking.format}
                        location={service.location}
                        key={booking.id}
                    />
                ))}
              </div>
          )}

          <AboutContentsSection
            contents={service.contents}
            included={service.includes}
            onContentsChange={(e) => {
              onInputChange("contents", e)
            }}
            onAddIncluded={handleAddIncluded}
            onIncludedChange={handleIncludedChange}
            onRemoveIncluded={handleRemoveIncluded}
            isEditMode={isEditMode}
          />

          {/* Bookings section */}
          {isAuthenticated &&
            // TODO
            // booked?.length === 0 &&
            !isEditMode && (
                <div>
                  <div className="flex flex-row justify-between items-center px-6 pt-3 bg-white rounded-sm">
                    <div className="text-base font-bold text-neutral-900">
                      Выбрать свой слот
                    </div>
                  </div>
                  <div className=" relative flex flex-row px-4 pb-3 bg-white">
                    <div className="w-80 flex-shrink-0">
                      <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    </div>
                    <BookingSection selectedDate={selectedDate} bookingSlots={bookingSlots} />
                    <div className="absolute bottom-2 left-0 right-0 h-2 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                    <div ref={calendarBottomRef} />
                  </div>
                </div>
            )}

          {/* Practice Service Restrictions - only in edit mode */}
          {isEditMode && (
            <div className="bg-white rounded-sm shadow-sm px-6 pb-4">
              <PracticeServiceRestrictions
                restrictions={restrictions}
                onUpdate={handleRestrictionsUpdate}
                editingRestrictionId={editingRestrictionId}
                setEditingRestrictionId={setEditingRestrictionId}
              />
              <div ref={restrictionBottomRef} />
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
