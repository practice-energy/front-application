"use client"

import { useRef, ComponentType, useState } from "react"
import Image from "next/image"
import type { User } from "@/types/user"
import { PracticePlaceholder } from "@/components/practice-placeholder"

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
    const carouselRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    // Обработчики для свайпа
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0))
        setScrollLeft(carouselRef.current?.scrollLeft || 0)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !carouselRef.current) return
        e.preventDefault()
        const x = e.pageX - (carouselRef.current.offsetLeft || 0)
        const walk = (x - startX) * 2
        carouselRef.current.scrollLeft = scrollLeft - walk
    }

    // Для тач-устройств
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true)
        setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0))
        setScrollLeft(carouselRef.current?.scrollLeft || 0)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !carouselRef.current) return
        const x = e.touches[0].pageX - (carouselRef.current.offsetLeft || 0)
        const walk = (x - startX) * 2
        carouselRef.current.scrollLeft = scrollLeft - walk
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
    }

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
        }
    ].filter(button => button.show)

    return (
        <div className="flex items-center justify-center w-full pl-4">
            <div className="flex items-center gap-3 w-full max-w-md">
                {/* Аватарка */}
                <div className="flex-shrink-0 rounded-sm overflow-hidden w-20 h-20 flex items-center justify-center">
                    {user?.avatar ? (
                        <Image
                            src={user.avatar}
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
                    <div
                        ref={carouselRef}
                        className="flex gap-3 overflow-x-auto scrollbar-hide py-2"
                        style={{ scrollSnapType: "x mandatory" }}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="w-2"/>
                        {buttons.map((button) => (
                            <button
                                key={button.id}
                                onClick={(e) => {
                                    if (!isDragging) {
                                        button.onClick()
                                    }
                                }}
                                className="flex-shrink-0 w-[74px] h-[74px] bg-white rounded-sm border border-gray-200 shadow-sm flex flex-col items-center justify-center p-1.5 active:scale-95 transition-transform"
                                style={{ scrollSnapAlign: "center" }}
                            >
                                <div className="w-9 h-9 mb-1 flex items-center justify-center">
                                    <button.Icon className="w-full h-full text-gray-700" />
                                </div>

                                {button.variant === "two-lines" ? (
                                    <>
                    <span className="text-xs text-center leading-tight text-neutral-900">
                      {button.topText}
                    </span>
                    {button.bottomText && (
                      <span className="text-sm text-center leading-tight text-gray-600">
                        {button.bottomText}
                      </span>
                    )}
                                    </>
                                ) : (
                                    <span className="text-xs text-center leading-tight text-gray-800">
                    {button.singleText}
                  </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
