"use client"

import {Repeat2, TimerReset, User, MessagesSquare, MapPin, TvMinimalPlay} from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import Image from "next/image"
import { ActivityStatus } from "@/components/ui/activity-status"
import { useRouter } from "next/navigation"
import { IconPractice } from "@/components/icons/icon-practice"
import { ActionButtonsRow, ActionButtonsRowConfirmed, ActionButtonsRowFinalize } from "@/components/action-button"
import {BookingFormatIcon} from "@/components/booking-format";
import {BookingRepeatedIcon} from "@/components/booking-repeatable";
import {formatNumber} from "@/utils/format";
import React from "react";

interface MobileBookingCardProps {
    startTime: string
    endTime: string
    specialist: {
        id: string
        name: string
        avatar?: string
    }
    service: {
        id: string
        name: string
        price: number
        description: string
    }
    duration: number
    format: "video" | "in-person"
    isRepeat?: boolean
    location?: string
    status?: "waiting" | "confirmed" | "request" | "declined" | "new" | undefined
}

export function MobileBookingCard({
                                startTime,
                                endTime,
                                specialist,
                                service,
                                duration,
                                format,
                                isRepeat = false,
                                status = "waiting",
                                      location
                            }: MobileBookingCardProps) {
    const router = useRouter()
    const now = new Date()
    const endDateTime = new Date(endTime)
    const isPastEvent = now > endDateTime

    const handleChatClick = () => {
        // Логика открытия чата
    }

    return (
        <div className="flex flex-col w-full gap-1.5">
            {/* Кнопки действий */}
            {isPastEvent ? (
                <ActionButtonsRowFinalize
                    onPractice={() => {}}
                    onBurn={() => {}}
                />
            ) : status === "waiting" ? (
                <ActionButtonsRow
                    onRegenerate={() => {}}
                    onBurn={() => {}}
                    onConfirm={() => {}}
                />
            ) : status === "confirmed" ? (
                <ActionButtonsRowConfirmed
                    onRegenerate={() => {}}
                    onBurn={() => {}}
                />
            ) : null}

            {/* Карточка активности */}
            <div className={`flex items-start gap-4 p-1 rounded-sm border bg-white w-full h-[88px] ${
                isPastEvent ? "opacity-70" : ""
            }`}>
                {/* 1. Левая колонка - время и аватар (как было) */}
                <div className="flex flex-col items-center ">
                    <div className={`text-sm font-medium `}>{startTime}</div>
                    {specialist.avatar ? (
                        <Image
                            src={specialist.avatar}
                            alt={specialist.name}
                            width={36}
                            height={36}
                            className="rounded-sm object-cover my-0.5"
                        />
                    ) : (
                        <IconPractice width={36} height={36} className="my-0.5"/>
                    )}
                    <div className="text-sm text-gray-500">{endTime}</div>
                </div>

                {/* 2. Центральная колонка - сервис и клиент */}
                <div className="flex-1 ml-1 pt-0.5 min-w-0"> {/* ml-4 = 18px отступ */}
                    {/* Название сервиса (2 строки максимум) */}
                    <div className="text-sm font-medium leading-tight line-clamp-2 h-8 mb-0.5">
                        {service.name}
                    </div>

                    <div className="text-sm text-gray-900 leading-tight line-clamp-1 h-4 mb-0.5">
                        {specialist.name}
                    </div>

                    {format === "in-person" ?  (
                        <div className="flex items-center text-violet-500 text-sm line-clamp-1">
                            <MapPin className="h-[18px] w-[18px] mr-2" />
                            <div className="text-sm line-clamp-1">{location}</div>
                        </div>
                    ) : (
                        <div className="flex items-center text-violet-500 text-sm line-clamp-1">
                            <TvMinimalPlay className="h-[18px] w-[18px] mr-2" />
                            <div className="text-sm line-clamp-1">Видео-чат с Мастером</div>
                        </div>
                    )}
                </div>

                {/* 3. Правая колонка - статус, цена и т.д. */}
                <div className="flex flex-col items-end w-[100px] gap-1">
                    {/* 1 строка - статус или практики */}
                    <div className="w-full flex justify-end">
                        <ActivityStatus status={status} />
                    </div>

                    {/* 2 строка - кнопка чата и цена */}
                    <div className="w-full flex items-center justify-between">
                        <button
                            onClick={handleChatClick}
                            className="bg-white rounded-sm transition-colors w-6 h-6 p-1 text-gray-600 shadow-sm"
                        >
                            <MessagesSquare size={16} />
                        </button>
                        <div className="flex items-center text-base">
                            <span>{formatNumber(service.price)}</span>
                            <RubleIcon size={16} bold={false} />
                        </div>
                    </div>

                    {/* 3 строка - формат и длительность */}
                    <div className="w-full flex flex-row items-center justify-between gap-1 mt-1 min-w-[70px]">
                        <div className="flex items-center flex-row text-sm text-gray-500">
                            <TimerReset size={14} className="mr-1" />
                            <span>{duration}</span>
                        </div>
                        <div className="ml-auto mt-[1px]">
                            <BookingRepeatedIcon isRepeated={isRepeat}/>
                        </div>
                        <BookingFormatIcon format={format} />
                    </div>
                </div>
            </div>
        </div>
    )
}
