"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {
    ChatBubbleLeftIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline"
import {Bell} from "lucide-react"
import {usePathname, useRouter} from "next/navigation"
import {cn} from "@/lib/utils"
import {mockNotifications} from "@/services/mock-notification";
import type {Notification} from "@/types/notification";
import {BellIcon} from "@heroicons/react/24/outline";
import {useSidebar} from "@/components/ui/sidebar";
import {useSidebarData} from "@/components/main-sidebar/hooks/use-sidebar-data";
import {Chat} from "@/types/chats";

interface EasyNotificationsProps {
    className?: string
    hat: "adept" | "master" | "superviser"
}

export function EasyNotifications({ className, hat}: EasyNotificationsProps) {
    const pathname = usePathname()
    const { allChats } = useSidebarData(pathname, hat)

    return (
            <div className={cn("relative", className)}>
                <div
                    className={cn(
                        "h-8 w-8 p-0 rounded-sm transition-all duration-200 relative mt-3",
                    )}
                >
                    <Bell className="h-6 w-7" />
                    {allChats.filter((chat: Chat)=> { return chat.hasNew}).length > 0 && (
                        <div
                            className={cn(
                                "absolute -top-1 right-1 w-3 h-3 p-0 text-xs bg-violet-600 hover:bg-violet-600 flex items-center justify-center rounded-sm",
                            )}
                        />
                    )}
                </div>
            </div>
    )
}
