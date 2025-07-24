"use client"

import { useState } from "react"
import type { Booking } from "@/types/booking"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {ActivityStatus} from "@/components/ui/activity-status";
import {IconPractice} from "@/components/icons/icon-practice";
import {PracticePlaceholder} from "@/components/practice-placeholder";
import {BookingFormatIcon} from "@/components/booking-format";
import {BookingRepeatedIcon} from "@/components/booking-repeatable";
import {formatNumber} from "@/utils/format";
import {RubleIcon} from "@/components/ui/ruble-sign";

interface BookingCardProps {
  booking: Booking
  slotHeight: number
}

export function BookingCard({ booking, slotHeight }: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useIsMobile()

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (isMobile) {
    return (
      <div
        className="bg-violet-600 rounded-sm cursor-pointer flex items-center justify-center text-white font-medium"
        style={{ height: `${booking.slots * slotHeight}px` }}
        onClick={() => setIsModalOpen(true)}
      >
        {formatTime(booking.date)}
      </div>
    )
  }

  if (booking.slots === 1) {
    return (
        <>
          <div
              className={cn(
                  "relative rounded-sm transition-colors cursor-pointer bg-opacity-100 shadow-sm border-0 w-full p-1 pb-0.5",
                  "pl-0 py-0.5 px-1",
                  "hover:bg-violet-50 hover:shadow-sm",
              )}
              style={{ height: `${booking.slots * slotHeight}px` }}
              onClick={() => setIsModalOpen(true)}
          >
            <div className={cn("flex items-start w-full, hover:bg-opacity-100 gap-3")}>
              {/* Profile Image - spans all three rows */}
              <div className={cn("flex-shrink-0 flex items-center ")}>
                {!booking.specialist.avatar ? (
                    <IconPractice
                        width={45}
                        height={45}
                        className={cn("rounded-sm object-cover bg-none items-center")}
                    />
                ) : (
                    <PracticePlaceholder
                        width={46}
                        height={46}
                        className={cn("bg-violet-100 rounded-sm items-center")}
                    />
                )}
              </div>

              {/* Two columns layout */}
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Row 1: Title  */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="text-sm font-medium truncate flex-1 pr-1">{booking.service.title}</div>
                  <BookingFormatIcon format={booking.format}/>
                  <ActivityStatus status={booking.status} dotClassName="h-5 w-5" showTitle={false} />
                </div>

                {/* Row 2: Description (multi-line) and New Message Indicator */}
                <div className="flex items-start mb-1">
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    {/* Имя специалиста - занимает всё доступное пространство */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="text-neutral-700 leading-relaxed line-clamp-1 text-sm truncate">
                        {booking.specialist.name}
                      </div>
                    </div>

                    {/* Правая часть - цена и иконка повторения */}
                    <div className="flex-shrink-0 flex items-center gap-1 ml-2 mt-0.5">
                      <div className="font-semibold text-neutral-700 whitespace-nowrap">
                        {formatNumber(booking.service.price)}
                        <RubleIcon size={22} bold={false} className="inline-block mb-0.5" />
                      </div>
                      <BookingRepeatedIcon
                          isRepeated={booking.isRepeat === true}
                          className="mb-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
    )
  }

  if (booking.slots === 2) {
    return (
        <div
            className={cn(
                "relative rounded-sm transition-colors cursor-pointer w-full",
                "px-1.5 py-1 hover:bg-violet-50 hover:shadow-sm",
            )}
            style={{height: `${booking.slots * slotHeight}px`}}
            onClick={() => setIsModalOpen(true)}
        >
          <div className="flex h-full">
            {/* Левая колонка */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Заголовок услуги */}
              <div className="line-clamp-2 text-sm font-medium">
                {booking.service.title}
              </div>

              {/* Аватар, имя и цена (выровнены по центру аватарки) */}
              <div className="flex items-center flex-1 mt-6">
                {/* Аватар (45x45) */}
                <div className="flex-shrink-0 relative h-[45px] flex items-center mb-1">
                  {!booking.specialist.avatar ? (
                      <IconPractice width={45} height={45} className="rounded-sm"/>
                  ) : (
                      <PracticePlaceholder
                          width={45}
                          height={45}
                          className="rounded-sm"
                      />
                  )}
                </div>

                {/* Имя и цена (центрированы относительно аватарки) */}
                <div className="flex items-center justify-between flex-1 min-w-0 ml-2 h-[45px]">
                  <div className="text-sm text-neutral-700 truncate flex items-center">
                    {booking.specialist.name}
                  </div>
                  <div className="font-semibold text-sm text-neutral-700 whitespace-nowrap flex">
                    {formatNumber(booking.service.price)}
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка */}
            <div className="flex flex-col items-end">
              {/* Статус */}
              <ActivityStatus
                  status={booking.status}
                  dotClassName="h-5 w-5"
                  showTitle={false}
              />

              {/* Формат и повторение */}
              <div className="flex items-center gap-1 mt-3">
                <BookingFormatIcon format={booking.format} size={18}/>
                <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={18}/>
              </div>

              {/* Рубль и повторение */}
              <div className="flex items-center gap-1 flex-1">
                <RubleIcon size={22} bold={false} className="mb-1.5"/>
                <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={18} className="mb-1.5"/>
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div
          className={cn(
              "relative rounded-sm transition-colors cursor-pointer w-full",
              "px-1.5 py-1 hover:bg-violet-50 hover:shadow-sm",
          )}
          style={{ height: `${booking.slots * slotHeight}px` }}
          onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col h-full">
          {/* Строка 1: Заголовок и статус (высота слота) */}
          <div
              className="flex justify-between items-start"
              style={{ height: `${slotHeight}px`, minHeight: `${slotHeight}px` }}
          >
            <div className="line-clamp-2 text-sm font-medium flex-1 pr-2">
              {booking.service.title}
            </div>
            <ActivityStatus
                status={booking.status}
                dotClassName="h-5 w-5"
                showTitle={false}
                className="ml-auto"
            />
          </div>

          {/* Строка 2 */}
          <div
              className="flex justify-between"
              style={{ height: `${slotHeight * (booking.slots-2)}px`, minHeight: `${slotHeight * (booking.slots-2)}px` }}
          >
            <div
                className="text-sm text-gray-500 flex-1 pr-2"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: booking.slots - 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
            >
              {booking.service.description}
            </div>
            <div className="flex gap-1">
              <BookingFormatIcon format={booking.format} size={18}/>
              <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={18}/>
            </div>
          </div>

          {/* Строка 3: Аватар, имя и цена (оставшееся пространство) */}
          <div className="flex items-center justify-between flex-1">
            <div className="flex items-center">
              {/* Аватар */}
              <div className="flex-shrink-0 mr-2">
                {!booking.specialist.avatar ? (
                    <IconPractice width={45} height={45} className="rounded-sm" />
                ) : (
                    <PracticePlaceholder
                        width={45}
                        height={45}
                        className="bg-violet-100 rounded-sm"
                    />
                )}
              </div>
              {/* Имя специалиста */}
              <div className="text-sm text-neutral-700 truncate">
                {booking.specialist.name}
              </div>
            </div>

            {/* Цена и иконки */}
            <div className="flex items-center">
              <div className="font-semibold text-sm text-neutral-700 whitespace-nowrap mr-1">
                {formatNumber(booking.service.price)}
              </div>
              <RubleIcon size={16} bold={false} className="mr-1"/>
              <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={18}/>
            </div>
          </div>
        </div>
      </div>
  )
}
