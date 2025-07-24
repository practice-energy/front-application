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
import { PracticePlaceholder } from "../practice-placeholder"
import {formatNumber} from "@/utils/format";

interface ServiceCardProps {
    service: Service
    bookingSlots: BookingSlot[]
}

export function ServiceCard({ service, bookingSlots }: ServiceCardProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const thumbnails = service.images
    const mainImage = thumbnails[selectedImageIndex]
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index)
    }

    return (
        <div className="rounded-sm shadow-md overflow-hidden md:w-[845px]">
            <div className="bg-colors-neutral-150 relative rounded-b-sm shadow-md ">
                <div className="rounded-b-sm bg-white">
                    {/* Black background photo section */}
                    <div className="bg-neutral-800 p-6 flex gap-6 rounded-t-sm">
                        {/* Main image */}
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

                        {/* Thumbnails */}
                        <div className="flex flex-col justify-between">
                            {thumbnails.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleThumbnailClick(index)}
                                    className={`rounded-sm overflow-hidden ${selectedImageIndex === index ? 'ring-1 ring-violet-600' : ''}`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${service.title} ${index + 2}`}
                                        className="object-cover"
                                        width={160}
                                        height={160}
                                    />
                                </button>
                            ))}

                            {Array.from({ length: Math.max(0, 3 - thumbnails.length) }).map((_, index) => (
                                <PracticePlaceholder
                                    key={`placeholder-${index}`}
                                    width={160}
                                    height={160}
                                    className="rounded-sm"
                                />
                            ))}
                        </div>
                    </div>

                    {/* White background content section */}
                    <div className="bg-white dark:bg-gray-800 p-6 space-y-4">
                        {/* Title and price row */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900  flex-1">{service.title}</h1>
                            <div className="flex items-center text-[36px] font-bold text-gray-900 ">
                                {formatNumber(service.price)}
                                <RubleIcon size={48} bold={false} className="mb-0.5 ml-1" />
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

                <div className="relative px-2 pt-6 pb-4">
                    <FeedbackSection feedbacks={service.reviews}/>
                </div>
            </div>
        </div>
    )
}