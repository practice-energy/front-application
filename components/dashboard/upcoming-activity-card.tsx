"use client"

import { Repeat2, TimerReset, User, MessagesSquare } from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import Image from "next/image"
import { ActivityStatus } from "@/components/ui/activity-status"
import { useRouter } from "next/navigation"
import { IconPractice } from "@/components/icons/icon-practice"
import { ActionButtonsRow, ActionButtonsRowConfirmed, ActionButtonsRowFinalize } from "@/components/action-button"
import {BookingFormatIcon} from "@/components/booking-format";
import {BookingRepeatedIcon} from "@/components/booking-repeatable";
import {formatNumber} from "@/utils/format";

interface UpcomingActivityCardProps {
  startTime: string
  endTime: string
  client: {
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
  practiceCount: number
  duration: number
  format: "video" | "in-person"
  isBackToBack?: boolean
  isRepeat?: boolean
  status?: "waiting" | "confirmed" | "request" | "declined" | "new" | undefined
}

export function UpcomingActivityCard({
                                       startTime,
                                       endTime,
                                       client,
                                       service,
                                       duration,
                                       format,
                                       isBackToBack = false,
                                       isRepeat = false,
                                       status = "waiting",
                                       practiceCount
                                     }: UpcomingActivityCardProps) {
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
        <div className={`flex items-start gap-4 p-1 rounded-sm border border-gray-100 hover:bg-violet-600 hover:bg-opacity-5 w-full h-[88px] ${
            isPastEvent ? "opacity-70" : ""
        }`}>
          {/* 1. Левая колонка - время и аватар (как было) */}
          <div className="flex flex-col items-center ">
            <div className={`text-sm font-medium ${isBackToBack ? "text-pink-500" : ""}`}>{startTime}</div>
            {client.avatar ? (
                <Image
                    src={client.avatar}
                    alt={client.name}
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
          <div className="flex-1 ml-4 pt-0.5 min-w-0"> {/* ml-4 = 18px отступ */}
            {/* Название сервиса (2 строки максимум) */}
            <div className="text-sm font-medium leading-tight line-clamp-2 h-10 mb-1">
              {service.name}
            </div>

            {/* Клиент и описание (2 строки) */}
            <div className="flex items-start h-10">
              <div className="text-sm text-gray-900 leading-tight w-1/3 line-clamp-2">
                {client.name}
              </div>
              <div className="text-sm text-gray-600 leading-tight w-2/3 ml-3 line-clamp-2">
                {service.description}
              </div>
            </div>
          </div>

          {/* 3. Правая колонка - статус, цена и т.д. */}
          <div className="flex flex-col items-end w-[100px] gap-1">
            {/* 1 строка - статус или практики */}
            <div className="w-full flex justify-end">
              {isPastEvent ? (
                  <div className="flex items-center text-sm">
                    <span className="mr-1">+{practiceCount}</span>
                    <IconPractice width={18} height={18} />
                  </div>
              ) : (
                  <ActivityStatus status={status} />
              )}
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
              <BookingRepeatedIcon isRepeated={isRepeat}/>
              <BookingFormatIcon format={format} />
            </div>
          </div>
        </div>
      </div>
  )
}