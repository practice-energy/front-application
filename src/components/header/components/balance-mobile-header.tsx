"use client"

import type { User } from "@/src/types/user"
import {SidebarToggleButton} from "@/src/components/open-sidebar";
import {ProfileIcon} from "@/src/components/profile-icon";
import {SettingsButton} from "@/src/components/calendar-settings-button";
import {CalendarButton} from "@/src/components/calendar-button";
import {usePathname} from "next/navigation";
import {SlidersVerticalIcon} from "lucide-react";
import {IconButton} from "@/components/icon-button";
import {cn} from "@/lib/utils";

interface SettingsMobileHeaderProps {
    user: User | null
    toggleSidebar: () => void
    toggleProfileMenu?: () => void
    isAuthenticated: boolean
    title: string
}

export const SettingsMobileHeader = ({
                                         user,
                                         toggleSidebar,
                                         toggleProfileMenu,
                                         isAuthenticated,
                                         title,
                                     }: SettingsMobileHeaderProps) => {
    return (
        <header className="top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 px-4 flex items-center justify-between shadow-active sticky">
            <div className="flex flex-row items-center gap-3">
                <div className="aspect-square rounded-sm shadow-custom h-10 w-10 p-1 border border-neutral-100/70 bg-white">
                <SlidersVerticalIcon
                    className={cn(
                    "h-[30px] w-[30px]",
                    "text-neutral-900",
                    )}
                />
                </div>
                <div className="flex items-center text-2xl text-neutral-900 font-semibold">{title}</div>
            </div>

            <div className="flex flex-row items-center gap-[18px]">
                <ProfileIcon
                    isAuthenticated={isAuthenticated}
                    toggleProfileMenu={toggleProfileMenu}
                    user={user}
                    iconSize={36}
                />

                <SidebarToggleButton
                    toggleSidebar={toggleSidebar}
                    className={cn(
                        "rounded-sm hover:bg-none border border-gray-200 flex w-[30px] h-[30px] items-center justify-center  hover:none",
                    )}
                />
            </div>
        </header>
    )
}
