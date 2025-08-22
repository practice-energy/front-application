"use client"

import type { User } from "@/src/types/user"
import type { Chat } from "@/src/types/chats"
import {ProfileIcon} from "@/src/components/profile-icon";
import {SidebarToggleButton} from "@/src/components/open-sidebar";
import {useBecomeSpecialist} from "@/src/stores/chat-store";
import {usePathname} from "next/navigation";
import {cn} from "@/src/lib/utils";
import {PentagramIcon} from "@phosphor-icons/react";
import RomanStep from "@/src/components/roman-step";
import {IconPractice1} from "@/src/components/icons/practice-1-logo";
import {IconPractice2} from "@/src/components/icons/prractice-2-logo";
import {IconPractice} from "@/src/components/icons/icon-practice";

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
    const { state: becomeSpecialistState } = useBecomeSpecialist()
    const pathname = usePathname()

    const isBecomeSpecialist = pathname === `/search/${becomeSpecialistState.chatId}`

    if (isBecomeSpecialist) {
        return (<header className="fixed top-0 left-0 right-0 h-16 bg-white bg-opacity-70 z-50 px-4 flex items-center justify-between">
            {/* Background with opacity */}
            <div className={cn(
                "absolute inset-0 bg-background opacity-70 backdrop-blur-lg",
            )} />

            {/* Content without opacity */}
            <div className="relative z-10 flex flex-row items-center py-4 gap-3">
                <PentagramIcon
                    size={36}
                    className="text-white bg-colors-custom-accent rounded-sm p-1"
                />
                <div className="text-base font-semibold">
                    Инициация Мастера
                </div>
            </div>

            <div className="relative z-10 flex flex-row items-center gap-3 ml-auto">
                {becomeSpecialistState.step === 1 && (
                    <div className="gap-[18px] flex flex-row items-center">
                        <RomanStep step={1}/>
                        <IconPractice1
                            width={36}
                            height={36}
                        />
                    </div>
                )}
                {(becomeSpecialistState.step === 2 || becomeSpecialistState.step === 3) && (
                    <div className="gap-[18px] flex flex-row items-center">
                        <RomanStep step={2}/>
                        <IconPractice2
                            width={36}
                            height={36}
                        />
                    </div>
                )}
                {becomeSpecialistState.step === 4 && (
                    <div className="gap-[18px] flex flex-row items-center">
                        <RomanStep step={3}/>
                        <IconPractice
                            width={36}
                            height={36}
                        />
                    </div>
                )}
            </div>
        </header>)
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white bg-opacity-70 z-50 px-4 flex items-center justify-between">
            <div className="w-min">
                <SidebarToggleButton
                    toggleSidebar={toggleSidebar}
                    className="mr-2 w-min"
                />
            </div>

            {/* Центральная часть - название чата */}
            <div className="flex-1 text-center font-medium text-gray-900 truncate line-clamp-1 w-full">
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
