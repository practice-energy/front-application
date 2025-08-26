"use client"

import type { User } from "@/src/types/user"
import {SidebarToggleButton} from "@/src/components/open-sidebar";
import {ProfileIcon} from "@/src/components/profile-icon";
import {SettingsButton} from "@/src/components/calendar-settings-button";
import {CalendarButton} from "@/src/components/calendar-button";
import {usePathname} from "next/navigation";
import {ChevronDown} from "lucide-react";
import {IconButton} from "@/components/icon-button";
import {cn} from "@/lib/utils";

interface CalendarMobileHeaderProps {
    user: User | null
    toggleSidebar: () => void
    toggleProfileMenu?: () => void
    onSettings: () => void
    onCalendar: () => void
    isAuthenticated: boolean
    isSettingsOpen: boolean
    calendarCollapsed: boolean
    onToggleCalendar: () => void
    currentDate: Date
}

export const CalendarMobileHeader = ({
                                         user,
                                         toggleSidebar,
                                         toggleProfileMenu = () => {},
                                         onSettings= () => {},
                                         isAuthenticated,
                                         onCalendar,
                                         isSettingsOpen,
                                         calendarCollapsed,
                                         onToggleCalendar,
                                         currentDate,
                                     }: CalendarMobileHeaderProps) => {
    const pathname = usePathname()

    const monthNames = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
    ]

    const currentMonth = monthNames[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()

    return (
        <header className="top-0 left-0 right-0 h-16 flex-1 bg-white border-b border-gray-200 z-30 px-4 flex items-center justify-between shadow-active sticky">
            <div className="flex flex-row items-center gap-3">
                <div className="flex items-center text-base text-neutral-900 font-semibold">
                    {currentMonth} {currentYear}
                </div>
                <button onClick={onToggleCalendar}>
                    <ChevronDown
                        className={cn(
                            "text-colors-custom-accent",
                            "transition-transform duration-200",
                            calendarCollapsed ? "rotate-180" : "rotate-0"
                        )}
                        size={24}
                    />
                </button>
            </div>

            <div className="flex flex-row items-center gap-[18px]">
                {isSettingsOpen ? (
                    <CalendarButton onClick={onCalendar} pathname={pathname} className="flex h-[36px] w-[36px]"/>
                ) : (
                    <SettingsButton onClick={onSettings} className="flex h-[36px] w-[36px]"/>
                )}

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
