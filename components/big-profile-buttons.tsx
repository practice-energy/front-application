"use client"

import { useEffect, type ComponentType } from "react"
import Image from "next/image"
import type { User } from "@/types/user"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import useEmblaCarousel from "embla-carousel-react"
import { IconPractice } from "@/components/icons/icon-practice"

interface ButtonConfig {
  id: string
  Icon: ComponentType<{ className?: string; width?: number; height?: number }>
  topText?: string
  bottomText?: string
  singleText?: string
  variant: "two-lines" | "single-line" | "practice"
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
    onDashboard: () => void
  }
  icons: {
    calendar: ComponentType<{ className?: string }>
    chat: ComponentType<{ className?: string }>
    pentagram: ComponentType<{ className?: string }>
    switch: ComponentType<{ className?: string }>
    practice: ComponentType<{ className?: string; width: number; height: number }>
  }
  show: {
    calendar: boolean
    chat: boolean
    switchRole: boolean
    favorites: boolean
    becomeMaster: boolean
    initiatePractice: boolean
    dashboard: boolean
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
      topText: user?.hat === "master" ? "Инициант" : "Мастер",
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
    {
      id: "dash",
      Icon: IconPractice,
      singleText: "Панель Практис",
      variant: "practice" as const,
      onClick: actions.onDashboard,
      show: show.dashboard,
    },
  ]//.filter((button) => button.show)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: false,
    dragFree: true,
  })

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      const { selectedScrollSnap, scrollSnapList } = emblaApi
      const isAtEnd = selectedScrollSnap() === scrollSnapList().length - 1
      const isAtStart = selectedScrollSnap() === 0

      // Handle infinite scroll by jumping to opposite end
      if (isAtEnd) {
        emblaApi.scrollTo(0, false)
      } else if (isAtStart && emblaApi.previousScrollSnap() === scrollSnapList().length - 1) {
        emblaApi.scrollTo(scrollSnapList().length - 1, false)
      }
    }

    emblaApi.on("select", onSelect)
    return () => emblaApi.off("select", onSelect)
  }, [emblaApi])

  return (
    <div className="flex items-center justify-center w-screen pl-4 overflow-hidden">
      <div className="flex items-center w-full">
        {/* Аватарка */}
        <div className="flex-shrink-0 rounded-sm overflow-hidden aspect-square flex items-center justify-center w-20 h-20">
          {user?.avatar ? (
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            <PracticePlaceholder width={80} height={80} />
          )}
        </div>

        {/* Карусель кнопок */}
        <div className="flex-1 relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-x select-none">
              {buttons.map((button) => (
                <div
                  key={button.id}
                  className="flex-[0_0_auto] min-w-0 pl-2 pt-3 md:pl-4"
                  style={{ flex: "0 0 auto", minWidth: 0 }}
                >
                  <button
                    onClick={button.onClick}
                    className="flex-shrink-0 w-[74px] h-[74px] bg-white rounded-sm border border-gray-200 shadow-sm flex flex-col items-center justify-center p-1.5 active:scale-95 transition-transform"
                  >
                    <div className="w-9 h-9 mb-1 flex items-center justify-center">
                      {button.variant === "practice" ? (
                        <button.Icon className="w-full h-full text-gray-700" width={36} height={36} />
                      ) : (
                        <button.Icon className="w-full h-full text-gray-700" />
                      )}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
