"use client"

import type { ComponentType } from "react"
import Image from "next/image"
import type { User } from "@/types/user"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

interface ButtonConfig {
  id: string
  Icon: ComponentType<{ className?: string }>
  topText?: string
  bottomText?: string
  singleText?: string
  variant: "two-lines" | "single-line"
  onClick: () => void
  show: boolean
}

interface BigProfileButtonsProps {
  user?: User
  actions: {
    onCalendar: () => void
    onChats: () => void
    onSwitchRole: () => void
    onFavorites: () => void
    onBecomeMaster: () => void
    onInitiatePractice: () => void
  }
  icons: {
    calendar: ComponentType<{ className?: string }>
    chat: ComponentType<{ className?: string }>
    pentagram: ComponentType<{ className?: string }>
    switch: ComponentType<{ className?: string }>
  }
  show: {
    calendar: boolean
    chat: boolean
    switchRole: boolean
    favorites: boolean
    becomeMaster: boolean
    initiatePractice: boolean
  }
}

export const BigProfileButtons = ({ user, actions, icons, show }: BigProfileButtonsProps) => {
  const buttons: ButtonConfig[] = [
    {
      id: "calendar",
      Icon: icons.calendar,
      topText: "Календарь",
      variant: "two-lines" as const,
      onClick: actions.onCalendar,
      show: show.calendar,
    },
    {
      id: "chats",
      Icon: icons.chat,
      topText: "Чаты",
      variant: "two-lines" as const,
      onClick: actions.onChats,
      show: show.chat,
    },
    {
      id: "switch-role",
      Icon: icons.switch,
      topText: "Инициант",
      variant: "two-lines" as const,
      onClick: actions.onSwitchRole,
      show: show.switchRole,
    },
    {
      id: "favorites",
      Icon: icons.pentagram,
      topText: "Избранные",
      variant: "two-lines" as const,
      onClick: actions.onFavorites,
      show: show.favorites,
    },
    {
      id: "become-master",
      Icon: icons.switch,
      singleText: "Стать Мастером",
      variant: "single-line" as const,
      onClick: actions.onBecomeMaster,
      show: show.becomeMaster,
    },
    {
      id: "initiate-practice",
      Icon: icons.switch,
      singleText: "Инициировать Практис",
      variant: "single-line" as const,
      onClick: actions.onInitiatePractice,
      show: show.initiatePractice,
    },
  ].filter((button) => button.show)

  return (
    <div className="flex items-center justify-center w-full pl-4">
      <div className="flex items-center gap-3 w-full max-w-md">
        {/* Аватарка */}
        <div className="flex-shrink-0 rounded-sm overflow-hidden w-20 h-20 flex items-center justify-center">
          {user?.avatar ? (
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt="Profile"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <PracticePlaceholder width={80} height={80} />
          )}
        </div>

        {/* Карусель кнопок */}
        <div className="flex-1 relative">
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 1,
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 basis-auto">
                <div className="w-2" />
              </CarouselItem>
              {buttons.map((button) => (
                <CarouselItem key={button.id} className="pl-2 md:pl-4 basis-auto">
                  <button
                    onClick={button.onClick}
                    className="flex-shrink-0 w-[74px] h-[74px] bg-white rounded-sm border border-gray-200 shadow-sm flex flex-col items-center justify-center p-1.5 active:scale-95 transition-transform"
                  >
                    <div className="w-9 h-9 mb-1 flex items-center justify-center">
                      <button.Icon className="w-full h-full text-gray-700" />
                    </div>

                    {button.variant === "two-lines" ? (
                      <>
                        <span className="text-xs text-center leading-tight text-neutral-900">{button.topText}</span>
                        {button.bottomText && (
                          <span className="text-sm text-center leading-tight text-gray-600">{button.bottomText}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-center leading-tight text-gray-800">{button.singleText}</span>
                    )}
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  )
}
