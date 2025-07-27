"use client"

import { ComponentType } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import type { User } from "@/types/user"
import type { Chat } from "@/types/chats"
import {PanelRightClose} from "lucide-react";

interface ChatHeaderProps {
    user: User
    currentChat: Chat
    toggleSidebar?: () => void
    toggleProfileMenu?: () => void
    isAuthenticated: boolean
}

export const ChatHeader = ({
                               user,
                               currentChat,
                               toggleSidebar = () => {},
                               toggleProfileMenu = () => {},
                               isAuthenticated
                           }: ChatHeaderProps) => {
    return (
        <header className="fixed top-0 left-0 right-0 h-24 bg-white opacity-70 z-50 px-4 flex items-center justify-between">
            {/* Левая часть - кнопка сайдбара */}
            <div className="flex-1 opacity-100">
                <button
                    onClick={toggleSidebar}
                    className="h-full px-3 flex items-center"
                    aria-label="Toggle sidebar"
                >
                    <PanelRightClose width={24} height={24} />
                </button>
            </div>

            {/* Центральная часть - название чата */}
            <div className="flex-1 text-center font-medium text-gray-900 truncate line-clamp-1 opacity-100">
                {currentChat?.description || currentChat?.title || "Чат"}
            </div>

            {/* Правая часть - иконка профиля */}
            <div className="flex-1 flex justify-end opacity-100">
                {isAuthenticated && (
                    <button
                        onClick={toggleProfileMenu}
                        className={cn(
                            "w-[50px] h-[50px] rounded-sm transition-all duration-200 z-10 mt-2",
                        )}
                        aria-label="Profile menu"
                    >
                        {user?.avatar ? (
                            <Image
                                width={36}
                                height={36}
                                src={user.avatar}
                                alt={user.name || "User avatar"}
                                className="overflow-hidden mr-[1px] rounded-sm"
                            />
                        ) : (
                            <PracticePlaceholder
                                width={50}
                                height={50}
                                className="bg-violet-50 dark:bg-gray-800 rounded-sm"
                            />
                        )}
                    </button>
                )}
            </div>
        </header>
    )
}
