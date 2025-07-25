"use client"

import {Repeat2, TimerReset, User, Users, TvMinimalPlayIcon, MessageSquareText, MessagesSquare} from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import Image from "next/image"
import { ActivityStatus } from "@/components/ui/activity-status"
import { useRouter } from "next/navigation"
import {IconPractice} from "@/components/icons/icon-practice";
import {ActionButtonsRow, ActionButtonsRowConfirmed, ActionButtonsRowFinalize} from "@/components/action-button";

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
  duration: string
  format: string
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
                                     }: UpcomingActivityCardProps) {
  const router = useRouter()
  const now = new Date()
  const endDateTime = new Date(endTime)
  const isPastEvent = now > endDateTime

  const handleChatClick = () => {
    // Логика открытия чата
  }

  const handleConfirm = () => {
    // Логика подтверждения
  }

  const handleReject = () => {
    // Логика отклонения
  }

  const handleFinalize = () => {
    // Логика завершения
  }

  const handleCancel = () => {
    // Логика отмены
  }

  const handleComplete = () => {
    // Логика отметки как проведено
  }

  const handleNoShow = () => {
    // Логика отметки неявки
  }

  return (
      <div className="flex flex-col w-full gap-1.5">
        {/* Кнопки действий */}
        {isPastEvent ? (
            <ActionButtonsRowFinalize
                onPractice={() => {}}
                onBurn={() => {}}
            />
        ) : status === "request" ? (
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
        <div className={`flex items-start gap-3 p-2 rounded-sm border border-gray-100 hover:bg-violet-600 hover:bg-opacity-5 w-full ${
            isPastEvent ? "opacity-70" : ""
        }`}>
          {/* Левая колонка - время и аватар */}
          <div className="flex flex-col items-center">
            <div className={`text-sm font-medium ${isBackToBack ? "text-pink-500" : ""}`}>{startTime}</div>
            {client.avatar ? (
                <Image
                    src={client.avatar}
                    alt={client.name}
                    width={36}
                    height={36}
                    className="rounded-sm object-cover"
                />
            ) : (
                <IconPractice width={36} height={36}/>
            )}
            <div className="text-sm text-gray-500">{endTime}</div>
          </div>

          {/* Информация о сервисе и клиенте */}
          <div className="flex-1 ml-3 min-w-0 mr-4">
            <div className="pb-1">
              <div className="text-sm font-medium leading-relaxed line-clamp-2 h-10">{service.name}</div>
            </div>
            <div className="flex flex-row pt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 leading-relaxed line-clamp-1">
                  {client.name} {service.description}
                </div>
              </div>
              <button
                  onClick={handleChatClick}
                  className="bg-white rounded-sm transition-colors w-6 h-6 ml-auto items-center p-1 mr-4 text-gray-600 shadow-sm"
              >
                <MessagesSquare size={18} className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="flex flex-col w-24 items-end gap-2">
            <ActivityStatus status={status} />
            <div>{isRepeat ? <Repeat2 size={18} /> : <User size={18} />}</div>
            <div className="flex items-center text-base">
              <span>{service.price}</span>
              <RubleIcon size={18} bold={false} />
            </div>
          </div>
        </div>
      </div>
  )
}