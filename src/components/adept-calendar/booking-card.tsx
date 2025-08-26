"use client"

import { useState } from "react"
import type { Booking } from "@/src/types/booking"
import { cn } from "@/src/lib/utils"
import { useIsMobile } from "@/src/hooks/use-mobile"
import {ActivityStatus} from "@/src/components/ui/activity-status";
import {IconPractice} from "@/src/components/icons/icon-practice";
import {PracticePlaceholder} from "@/src/components/practice-placeholder";
import {BookingFormatIcon} from "@/src/components/booking-format";
import {BookingRepeatedIcon} from "@/src/components/booking-repeatable";
import {formatNumber} from "@/src/utils/format";
import {RubleIcon} from "@/src/components/ui/ruble-sign";
import {ChatButton} from "@/src/components/chat-button";
import { useRouter } from "next/navigation"

interface BookingCardProps {
  booking: Booking
  slotHeight: number
}

export function BookingCard({ booking, slotHeight }: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useIsMobile()
  const router = useRouter()

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const handleCardClick = () => {
    router.push(`/service/${booking.service.id}`)
  }

  const handleChatClick = () => {
    if (booking.chatId) {
      router.push(`/search/${booking.chatId}`)
    }
  }

  // Функция для получения цвета границы на основе статуса
  const getBackgroundColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "border border-orange-200"
      case "confirmed":
        return "border border-teal-200"
      case "request":
        return "border border-gray-200"
      case "declined":
        return "border border-neutral-200"
      case "new":
        return "border border-violet-200"
      case "outOfPractice":
        return "border border-neutral-200"
      case "activePractice":
        return "border border-teal-200"
      case "payed":
        return "border border-teal-200"
      case "unpayed":
        return "border border-neutral-300"
      case "finalized":
        return "border border-neutral-900"
      default:
        return "border border-violet-500"
    }
  }

  // Карточка для 1 слота (как на фото - верхняя карточка)
  if (booking.slots === 1) {
    return (
      <div
        className={cn(
          "relative rounded-sm transition-colors cursor-pointer bg-white shadow-sm w-full p-1",
          "hover:shadow-sm",
          getBackgroundColor(booking.status)
        )}
        style={{ height: `${booking.slots * slotHeight}px` }}
        onClick={handleCardClick}
      >
        {/* Основное содержимое: Аватар, текст и иконки */}
        <div className="flex items-center justify-between h-full">
          {/* Левая часть: Аватар и текст */}
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              {!booking.specialist.avatar ? (
                <IconPractice
                  width={isMobile ? 32 : 36}
                  height={isMobile ? 32 : 36}
                  className="rounded-sm"
                />
              ) : (
                <PracticePlaceholder
                  width={isMobile ? 32 : 36}
                  height={isMobile ? 32 : 36}
                  className="rounded-sm bg-colors-neutral-150"
                  iconClassName="text-gray-400"
                />
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className={cn("font-medium  line-clamp-1 text-base")}>
                {booking.service.title}
              </div>
              <div className="text-sm font-medium text-neutral-900 line-clamp-1">
                {booking.specialist.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-col ml-auto">
            {/* Статус в правом верхнем углу */}
            <ActivityStatus status={booking.status as any} className="ml-auto" dotClassName={isMobile ? "h-4 w-4" : "h-5 w-5"} showTitle={false} />
            {/* Правая часть: Иконки */}
            <div className="flex items-end gap-1">
              <ChatButton
                  onClick={handleChatClick}
                  hasUpdates={false}
              />
              <BookingFormatIcon format={booking.format} size={isMobile ? 14 : 16}/>
              <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={isMobile ? 14 : 16}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Карточка для 2 слотов (как на фото - средняя карточка)
  if (booking.slots === 2) {
    return (
      <div
        className={cn(
          "relative rounded-sm transition-colors cursor-pointer bg-white shadow-sm w-full p-1",
          "hover:shadow-sm",
          getBackgroundColor(booking.status)
        )}
        style={{ height: `${booking.slots * slotHeight}px` }}
        onClick={handleCardClick}
      >
        {/* Верхняя строка: Title и статус */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <div className={cn("font-medium truncate flex-1 pr-1 text-base")}>
            {booking.service.title}
          </div>
          <ActivityStatus status={booking.status as any} dotClassName={isMobile ? "h-4 w-4" : "h-5 w-5"} showTitle={false} />
        </div>

        {/* Средняя строка: Цена */}
        <div className="flex justify-end mb-2">
          <div className={cn("font-semibold text-neutral-700 text-base")}>
            {formatNumber(booking.price)} ₽
          </div>
        </div>

        {/* Нижняя строка: Аватар, имя и иконки */}
        <div className="flex items-end  justify-between">
          {/* Левая часть: Аватар и имя */}
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              {!booking.specialist.avatar ? (
                <IconPractice
                  width={isMobile ? 32 : 36}
                  height={isMobile ? 32 : 36}
                  className="rounded-sm"
                />
              ) : (
                <PracticePlaceholder
                  width={isMobile ? 32 : 36}
                  height={isMobile ? 32 : 36}
                  className="rounded-sm bg-colors-neutral-150"
                  iconClassName="text-gray-400"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn("text-neutral-700  font-medium truncate text-base")}>
                {booking.specialist.name}
              </div>
            </div>
          </div>

          {/* Правая часть: Иконки */}
          <div className="flex items-end gap-1">
            <ChatButton
              onClick={handleChatClick}
              hasUpdates={false}
            />
            <BookingFormatIcon format={booking.format} size={isMobile ? 14 : 16}/>
            <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={isMobile ? 14 : 16}/>
          </div>
        </div>
      </div>
    )
  }

  // Карточка для 3+ слотов (как на фото - нижняя карточка)
  return (
    <div
      className={cn(
        "relative rounded-sm transition-colors cursor-pointer bg-white shadow-sm w-full p-1",
        "hover:shadow-sm",
        getBackgroundColor(booking.status)
      )}
      style={{ height: `${booking.slots * slotHeight}px` }}
      onClick={handleCardClick}
    >
      {/* Верхняя строка: Title и статус */}
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <div className={cn("font-medium truncate flex-1 pr-1 text-base")}>
          {booking.service.title}
        </div>
        <ActivityStatus status={booking.status as any} dotClassName={isMobile ? "h-4 w-4" : "h-5 w-5"} showTitle={false} />
      </div>

      {/* Средняя строка: Описание */}
      <div className="mb-2 flex flex-row">
        <div className={cn("text-gray-500 line-clamp-2 text-sm")}>
          {booking.service.description}
        </div>
        <div className={cn("font-semibold text-neutral-700 whitespace-nowrap text-base")}>
          {formatNumber(booking.price)} ₽
        </div>
      </div>

      {/* Нижняя строка: Аватар, имя и иконки */}
      <div className="flex items-end justify-between">
        {/* Левая часть: Аватар и имя */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            {!booking.specialist.avatar ? (
              <IconPractice
                width={isMobile ? 32 : 36}
                height={isMobile ? 32 : 36}
                className="rounded-sm"
              />
            ) : (
              <PracticePlaceholder
                width={isMobile ? 32 : 36}
                height={isMobile ? 32 : 36}
                className="rounded-sm bg-colors-neutral-150"
                iconClassName="text-gray-400"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={cn("text-neutral-700 truncate text-base font-medium")}>
              {booking.specialist.name}
            </div>
          </div>
        </div>

        {/* Правая часть: Иконки */}
        <div className="flex items-end gap-1">
          <ChatButton
            onClick={handleChatClick}
            hasUpdates={false}
          />
          <BookingFormatIcon format={booking.format} size={isMobile ? 14 : 16}/>
          <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={isMobile ? 14 : 16}/>
        </div>
      </div>
    </div>
  )
}
