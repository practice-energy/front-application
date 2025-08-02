"use client"

import type { User } from "@/types/user"
import type { Chat } from "@/types/chats"
import {ProfileIcon} from "@/components/profile-icon";
import {SidebarToggleButton} from "@/components/open-sidebar";

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
        <header className="fixed top-0 left-0 right-0 h-16 bg-white opacity-70 z-50 px-4 flex items-center justify-between">
            <div className="w-min">
                <SidebarToggleButton
                    toggleSidebar={toggleSidebar}
                    className="mr-2 w-min"
                />
            </div>

            {/* Центральная часть - название чата */}
            <div className="flex-1 text-center font-medium text-gray-900 truncate line-clamp-1 opacity-100 w-full">
                {currentChat?.description || currentChat?.title || "Чат"}
            </div>

            <div className="ml-auto w-min">
                <ProfileIcon
                    isAuthenticated={isAuthenticated}
                    toggleProfileMenu={toggleProfileMenu}
                    user={user}
                    className="ml-4"
                    iconSize={50}
                />
            </div>
        </header>
    )
}
