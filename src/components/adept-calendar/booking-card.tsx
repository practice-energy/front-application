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

  if (isMobile) {
    if (booking.slots === 1) {
      return (<>
        <div
            className={cn(
                "relative rounded-sm transition-colors cursor-pointer bg-opacity-100 shadow-sm border-0 w-full p-1 pb-0.5",
                "pl-0 py-1 px-1 bg-white",
                "hover:shadow-sm",
                getBackgroundColor(booking.status)
            )}
            style={{ height: `${booking.slots * slotHeight}px` }}
            onClick={() => setIsModalOpen(true)}
        >
          <div className={cn("flex items-start w-full, hover:bg-opacity-100 gap-0.5")}>
            {/* Profile Image - spans all three rows */}
            <div className={cn("flex-shrink-0 flex items-center ")}>
              {!booking.specialist.avatar ? (
                  <IconPractice
                      width={42}
                      height={42}
                      className={cn("rounded-sm object-cover bg-none items-center")}
                  />
              ) : (
                  <PracticePlaceholder
                      width={42}
                      height={42}
                      className={cn("bg-colors-neutral-150 rounded-sm items-center")}
                      iconClassName="text-gray-400"
                  />
              )}
            </div>

            {/* Two columns layout */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Row 1: Title  */}
              <div className="flex items-center justify-between gap-1">
                <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={14}/>
                <BookingFormatIcon format={booking.format} size={14}/>
                <ActivityStatus status={booking.status as any} dotClassName="h-4 w-4" showTitle={false} />
              </div>

              {/* Row 2: Description (multi-line) and New Message Indicator */}
              <div className="text-[9px] font-medium truncate flex-1 pr-1 mt-1">{booking.specialist.name}</div>
            </div>
          </div>
        </div>
      </>)
    }

    if (booking.slots === 2) {
      return (<>
        <div
            className={cn(
                "relative rounded-sm transition-colors cursor-pointer bg-opacity-100 shadow-sm border-0 w-full p-1 pb-0.5",
                "pl-0 py-1 px-1 bg-white",
                "hover:shadow-sm",
                getBackgroundColor(booking.status)
            )}
            style={{ height: `${booking.slots * slotHeight}px` }}
            onClick={() => setIsModalOpen(true)}
        >
          <div className={cn("flex items-start w-full, hover:bg-opacity-100 gap-0.5")}>
            {/* Profile Image - spans all three rows */}
            <div className={cn("flex-shrink-0 flex items-center ")}>
              {!booking.specialist.avatar ? (
                  <IconPractice
                      width={42}
                      height={42}
                      className={cn("rounded-sm object-cover bg-none items-center")}
                  />
              ) : (
                  <PracticePlaceholder
                      width={42}
                      height={42}
                      className={cn("bg-colors-neutral-150 rounded-sm items-center")}
                      iconClassName="text-gray-400"
                  />
              )}
            </div>

            {/* Two columns layout */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Row 1: Title  */}
              <div className="flex items-center justify-between gap-1">
                <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={14}/>
                <BookingFormatIcon format={booking.format} size={14}/>
                <ActivityStatus status={booking.status as any} dotClassName="h-4 w-4" showTitle={false} />
              </div>

              <div className="flex items-center justify-end gap-1">
                <div className="font-semibold text-xs text-neutral-700 whitespace-nowrap">
                  {formatNumber(booking.price)}
                </div>
                <RubleIcon size={24} bold={false} className=""/>
              </div>
            </div>
          </div>

          <div className="text-xs font-medium truncate flex-1 pr-1 mt-1">{booking.service.title}</div>
          <div className="text-xs font-normal truncate flex-1 pr-1 mt-1">{booking.specialist.name}</div>
        </div>
      </>)
    }

    if (booking.slots > 2) {
      return (<>
        <div
            className={cn(
                "relative rounded-sm transition-colors cursor-pointer bg-opacity-100 shadow-sm border-0 w-full p-1 pb-0.5",
                "pl-0 py-1 px-1 bg-white",
                "hover:shadow-sm",
                getBackgroundColor(booking.status)
            )}
            style={{ height: `${booking.slots * slotHeight}px` }}
            onClick={() => setIsModalOpen(true)}
        >
          <div className={cn("flex items-start w-full, hover:bg-opacity-100 gap-0.5")}>
            {/* Profile Image - spans all three rows */}
            <div className={cn("flex-shrink-0 flex items-center ")}>
              {!booking.specialist.avatar ? (
                  <IconPractice
                      width={42}
                      height={42}
                      className={cn("rounded-sm object-cover bg-none items-center")}
                  />
              ) : (
                  <PracticePlaceholder
                      width={42}
                      height={42}
                      className={cn("bg-colors-neutral-150 rounded-sm items-center")}
                      iconClassName="text-gray-400"
                  />
              )}
            </div>

            {/* Two columns layout */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Row 1: Title  */}
              <div className="flex items-center justify-between gap-1">
                <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={14}/>
                <BookingFormatIcon format={booking.format} size={14}/>
                <ActivityStatus status={booking.status as any} dotClassName="h-4 w-4" showTitle={false} />
              </div>

              <div className="flex items-center justify-end gap-1">
                <div className="font-semibold text-xs text-neutral-700 whitespace-nowrap">
                  {formatNumber(booking.price)}
                </div>
                <RubleIcon size={24} bold={false} className=""/>
              </div>
            </div>
          </div>

          <div className="text-xs font-medium truncate flex-1 pr-1 mt-1">{booking.service.title}</div>
          <div className="text-xs font-normal truncate flex-1 pr-1 mt-1">{booking.specialist.name}</div>

          <div
              className="text-xs text-gray-500 flex-1 pr-2 pt-1"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: (booking.slots*2 - 3 > 5) ? 5 : booking.slots*2 - 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
          >
            {booking.service.description}
          </div>
        </div>
      </>)
    }
  }

  if (booking.slots === 1) {
    return (
        <>
          <div
              className={cn(
                  "relative rounded-sm transition-colors cursor-pointer bg-opacity-100 shadow-sm border-0 w-full p-1 pb-0.5",
                  "pl-0 py-1 px-1 bg-white",
                  "hover:shadow-sm",
                  getBackgroundColor(booking.status)
              )}
              style={{ height: `${booking.slots * slotHeight}px` }}
              onClick={() => setIsModalOpen(true)}
          >
            <div className={cn("flex items-start w-full, hover:bg-opacity-100 gap-3")}>
              {/* Profile Image - spans all three rows */}
              <div className={cn("flex-shrink-0 flex items-center ")}>
                {!booking.specialist.avatar ? (
                    <IconPractice
                        width={isMobile ? 42 : 48}
                        height={isMobile ? 42 : 48}
                        className={cn("rounded-sm object-cover bg-none items-center")}
                    />
                ) : (
                    <PracticePlaceholder
                        width={isMobile ? 42 : 48}
                        height={isMobile ? 42 : 48}
                        className={cn("bg-colors-neutral-150 rounded-sm items-center")}
                        iconClassName="text-gray-400"
                    />
                )}
              </div>

              {/* Two columns layout */}
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Row 1: Title  */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className={cn("font-medium truncate flex-1 pr-1", isMobile ? "text-sm" : "text-base")}>{booking.service.title}</div>
                  <ActivityStatus status={booking.status as any} dotClassName={isMobile ? "h-5 w-5" : "h-6 w-6"} showTitle={false} />
                </div>

                {/* Row 2: Description (multi-line) and New Message Indicator */}
                <div className="flex items-start mb-1">
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    {/* Имя специалиста - занимает всё доступное пространство */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className={cn("text-neutral-700 leading-relaxed line-clamp-1 truncate", isMobile ? "text-sm" : "text-base")}>
                        {booking.specialist.name}
                      </div>
                    </div>

                    {/* Правая часть - цена и иконка повторения */}
                    <div className="flex-shrink-0 flex items-center gap-1 ml-2 mt-0.5">
                      <ChatButton
                          onClick={() => {}}
                          hasUpdates={false}
                          className="mb-0.5"
                      />
                      <BookingFormatIcon format={booking.format} size={18}/>
                      <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={18}/>
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
                "relative rounded-sm transition-colors cursor-pointer w-full bg-white",
                "px-1 py-1 hover:shadow-sm",
                getBackgroundColor(booking.status)
            )}
            style={{height: `${booking.slots * slotHeight}px`}}
            onClick={() => setIsModalOpen(true)}
        >
          <div className="flex h-full">
            {/* Левая колонка */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Заголовок услуги */}
              <div
                  className={cn("leading-relaxed line-clamp-2 font-medium", isMobile ? "text-sm" : "text-base")}
                  style={{height: `${slotHeight}px`}}
              >
                {booking.service.title}
              </div>

              {/* Аватар, имя и цена (выровнены по центру аватарки) */}
              <div
                  className="flex items-center flex-1"
                  style={{height: `${ slotHeight}px`}}
              >
                {/* Аватар */}
                <div className="flex-shrink-0 relative flex items-center">
                  {!booking.specialist.avatar ? (
                      <IconPractice width={isMobile ? 42 : 48} height={isMobile ? 42 : 48} className="rounded-sm"/>
                  ) : (
                      <PracticePlaceholder
                          width={isMobile ? 42 : 48}
                          height={isMobile ? 42 : 48}
                          className="rounded-sm bg-colors-neutral-150"
                          iconClassName="text-gray-400"
                      />
                  )}
                </div>

                {/* Имя и цена (центрированы относительно аватарки) */}
                <div className="flex items-center justify-between flex-1 min-w-0 ml-2 h-[45px]">
                  <div className={cn("text-neutral-700 truncate flex items-center", isMobile ? "text-sm" : "text-base")}>
                    {booking.specialist.name}
                  </div>
                  <div className={cn("font-semibold text-neutral-700 whitespace-nowrap flex", isMobile ? "text-sm" : "text-base")}>
                    {formatNumber(booking.price)}
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка */}
            <div className="flex flex-col items-end">
              {/* Статус */}
              <ActivityStatus
                  status={booking.status as any}
                  dotClassName={isMobile ? "h-5 w-5" : "h-6 w-6"}
                  showTitle={false}
              />

              {/* Формат и повторение */}
              <div className="flex items-center gap-1 mt-3">
                <BookingFormatIcon format={booking.format} size={isMobile ? 18 : 20}/>
                <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={isMobile ? 18 : 20}/>
              </div>

              {/* Рубль и повторение */}
              <div className="flex items-center gap-1 flex-1">
                <RubleIcon size={isMobile ? 22 : 24} bold={false} className="mb-1.5"/>
                <ChatButton
                    onClick={() => {}}
                    hasUpdates={false}
                    className="mb-0.5"
                />
                {/*<BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={18} className="mb-1.5"/>*/}
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div
          className={cn(
              "relative rounded-sm transition-colors cursor-pointer w-full bg-white",
              "px-1 py-1 hover:shadow-sm",
              getBackgroundColor(booking.status)
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
            <div className={cn("line-clamp-2 font-medium flex-1 pr-2", isMobile ? "text-sm" : "text-base")}>
              {booking.service.title}
            </div>
            <ActivityStatus
                status={booking.status as any}
                dotClassName={isMobile ? "h-5 w-5" : "h-6 w-6"}
                showTitle={false}
                className="ml-auto"
            />
          </div>

          {/* Строка 2 */}
          <div
              className="flex justify-between"
              style={{ height: `${slotHeight * (booking.slots-8)}px`, minHeight: `${slotHeight * (booking.slots-2)}px` }}
          >
            <div
                className={cn("text-gray-500 flex-1 pr-2", isMobile ? "text-sm" : "text-base")}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: (booking.slots*2 - 3 > 5) ? 5 : booking.slots*2 - 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
            >
              {booking.service.description}
            </div>
            <div className="flex gap-1">
              <BookingFormatIcon format={booking.format} size={isMobile ? 18 : 20}/>
              <BookingRepeatedIcon isRepeated={booking.isRepeat === true} size={isMobile ? 18 : 20}/>
            </div>
          </div>

          {/* Строка 3: Аватар, имя и цена (оставшееся пространство) */}
          <div className="flex items-center justify-between flex-1 mb-2">
            <div className="flex items-center">
              {/* Аватар */}
              <div className="flex-shrink-0 mr-2">
                {!booking.specialist.avatar ? (
                    <IconPractice width={isMobile ? 42 : 48} height={isMobile ? 42 : 48} className="rounded-sm" />
                ) : (
                    <PracticePlaceholder
                        width={isMobile ? 42 : 48}
                        height={isMobile ? 42 : 48}
                        className="bg-colors-neutral-150  rounded-sm"
                        iconClassName="text-gray-400"
                    />
                )}
              </div>
              {/* Имя специалиста */}
              <div className={cn("text-neutral-700 truncate", isMobile ? "text-sm" : "text-base")}>
                {booking.specialist.name}
              </div>
            </div>

            {/* Цена и иконки */}
            <div className="flex items-center">
              <div className={cn("font-semibold text-neutral-700 whitespace-nowrap mr-1", isMobile ? "text-sm" : "text-base")}>
                {formatNumber(booking.price)}
              </div>
              <RubleIcon size={isMobile ? 22 : 24} bold={false} className="mr-1"/>
              <ChatButton
                  onClick={()=> {}}
                  hasUpdates={false}
              />
            </div>
          </div>
        </div>
      </div>
  )
}
