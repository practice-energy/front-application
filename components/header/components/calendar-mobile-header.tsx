"use client"

import type { User } from "@/types/user"
import {SidebarToggleButton} from "@/components/open-sidebar";
import {ProfileIcon} from "@/components/profile-icon";
import {SettingsButton} from "@/components/calendar-settings-button";
import {CalendarButton} from "@/components/calendar-button";
import {usePathname} from "next/navigation";

interface CalendarMobileHeaderProps {
    user: User | null
    toggleSidebar?: () => void
    toggleProfileMenu?: () => void
    onSettings: () => void
    onCalendar: () => void
    isAuthenticated: boolean
    isSettingsOpen: boolean
}

export const CalendarMobileHeader = ({
                                         user,
                                         toggleSidebar = () => {},
                                         toggleProfileMenu = () => {},
                                         onSettings= () => {},
                                         isAuthenticated,
                                         onCalendar,
                                         isSettingsOpen,
                                     }: CalendarMobileHeaderProps) => {
    const pathname = usePathname()

    return (
        <header className="top-0 left-0 right-0 h-24 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 px-4 flex items-center justify-between">
            <SidebarToggleButton
                toggleSidebar={toggleSidebar}
                className="mr-2"
            />

            <div className="gap-6 flex flex-row items-center justify-center">
                {isSettingsOpen ? (
                    <CalendarButton onClick={onCalendar} pathname={pathname} className="flex"/>
                ) : (
                    <SettingsButton onClick={onSettings} />
                )}

                <ProfileIcon
                    isAuthenticated={isAuthenticated}
                    toggleProfileMenu={toggleProfileMenu}
                    user={user}
                    iconSize={50}
                    className="mb-2"
                />
            </div>
        </header>
    )
}
