"use client"

import { MapPin, TimerReset, MonitorPlayIcon as TvMinimalPlay, Users } from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import type { Service } from "@/types/common"
import Image from "next/image"
import { AboutContentsSection } from "@/components/service/about-contents-section"
import { IconPractice } from "@/components/icons/icon-practice"
import React, { useState } from "react"
import { CalendarWidget } from "@/components/adept-calendar/calendar-widget"
import type { BookingSlot } from "@/types/booking"
import { BookingSection } from "@/components/service/booking-section"
import {FeedbackSection} from "@/components/service/feedback-section";

interface ServiceCardProps {
  service: Service
  bookingSlots: BookingSlot[]
}

export function ServiceCard({ service, bookingSlots }: ServiceCardProps) {
  const mainImage = service.images[0]
  const thumbnails = service.images
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <div className="rounded-sm shadow-md overflow-hidden md:w-[845px]">
      <div className="bg-colors-neutral-150 relative rounded-b-sm shadow-md ">
        <div className="rounded-b-sm bg-white">
            {/* Black background photo section */}
            <div className="bg-neutral-800 p-6 flex gap-6 rounded-sm">
                {/* Main image */}
                <div className="flex-1">
                    {mainImage ? (
                        <Image
                            src={mainImage || "/placeholder.svg"}
                            alt={service.title}
                            className="object-cover rounded-sm"
                            width={640}
                            height={640}
                        />
                    ) : (
                        <div className="w-full h-64 bg-gray-800 rounded-sm flex items-center justify-start">
                            <span className="text-gray-400">Нет фото</span>
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {thumbnails.length > 1 && (
                    <div className="flex flex-col justify-between">
                        {thumbnails.map((image, index) => (
                            <Image
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`${service.title} ${index + 2}`}
                                className="object-cover rounded-sm"
                                width={160}
                                height={160}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* White background content section */}
            <div className="bg-white dark:bg-gray-800 p-6 space-y-4">
                {/* Title and price row */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex-1">{service.title}</h1>
                    <div className="flex items-center text-lg font-bold text-gray-900 dark:text-gray-100">
                        {service.price}
                        <RubleIcon size={18} bold={false} className="mb-0.5 ml-1" />
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{service.description}</p>

                {/* Location */}
                {service.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{service.location}</span>
                    </div>
                )}

                {/* Tags row */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="inline-flex w-[96px] h-[36px] shadow-sm items-center justify-start rounded-sm p-1 gap-1 bg-white">
                        <TimerReset size={16} />
                        <div className="text-gray-600 text-simple font-normal">{service.duration}</div>
                    </div>
                    <div className="inline-flex w-[96px] h-[36px] shadow-sm items-center justify-start rounded-sm p-1.5 gap-1 bg-white">
                        {service.format === "video" ? (
                            <>
                                <TvMinimalPlay size={16} />
                                <p className="text-gray-600">Видео</p>
                            </>
                        ) : (
                            <>
                                <Users size={16} />
                                <p className="text-gray-600">Очная</p>
                            </>
                        )}
                    </div>
                    <div className="inline-flex h-[36px] shadow-sm items-center justify-start rounded-sm p-1.5 gap-1 bg-white">
                        <IconPractice width={20} height={18} />
                        {service.practice}
                    </div>
                </div>
            </div>
            <AboutContentsSection description={service.description} contents={service.includes} />

            {/* Bookings section */}
            <div className="flex flex-row px-6 pb-3">
                <div className="w-80 flex-shrink-0">
                    <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </div>
                <BookingSection selectedDate={selectedDate} bookingSlots={bookingSlots} />
            </div>
        </div>

        <div className="relative px-6 pt-6 pb-4">
          <FeedbackSection feedbacks={service.reviews}/>
        </div>
      </div>
    </div>
  )
}
