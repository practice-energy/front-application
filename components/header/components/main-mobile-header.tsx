"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { PracticePlaceholder } from "@/components/practice-placeholder"
import type { User } from "@/types/user"
import {PanelRightClose} from "lucide-react";

interface MainMobileHeaderProps {
    user: User | null
    toggleSidebar?: () => void
    toggleProfileMenu?: () => void
    isAuthenticated: boolean
}

export const MainMobileHeader = ({
                               user,
                               toggleSidebar = () => {},
                               toggleProfileMenu = () => {},
                               isAuthenticated,
                           }: MainMobileHeaderProps) => {
    return (
        <header className="fixed top-0 left-0 right-0 h-24 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 px-4 flex items-center justify-between">
            {/* Левая часть - кнопка сайдбара */}
            <div className="flex-1">
                <button
                    onClick={toggleSidebar}
                    className="h-full px-3 flex items-center"
                    aria-label="Toggle sidebar"
                >
                    <PanelRightClose width={24} height={24} />
                </button>
            </div>

            {/* Правая часть - иконка профиля */}
            <div className="flex-1 flex justify-end">
                {user && isAuthenticated && (
                    <button
                        onClick={toggleProfileMenu}
                        className={cn(
                            "w-[50px] h-[50px] rounded-sm transition-all duration-200 z-10 mt-2",
                        )}
                        aria-label="Profile menu"
                    >
                        {user?.avatar ? (
                            <Image
                                width={50}
                                height={50}
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
