import { cn } from "@/lib/utils"
import Image from "next/image"
import { PracticePlaceholder } from "./practice-placeholder"

interface ProfileIconProps {
    isAuthenticated: boolean
    toggleProfileMenu: () => void
    user?: {
        avatar?: string | null
        name?: string | null
    }
    className?: string
    iconSize?: number
}

export function ProfileIcon({
                                isAuthenticated,
                                toggleProfileMenu,
                                user,
                                className,
                                iconSize = 50,
                            }: ProfileIconProps) {
    if (!isAuthenticated) return null

    return (
        <div className={cn("flex-1 flex justify-end opacity-100", className)}>
            <button
                onClick={toggleProfileMenu}
                className={cn(
                    "w-[50px] h-[50px] rounded-sm transition-all duration-200 z-10",
                    "focus:outline-none"
                )}
                aria-label="Profile menu"
            >
                {user?.avatar ? (
                    <Image
                        width={iconSize}
                        height={iconSize}
                        src={user.avatar}
                        alt={user.name || "User avatar"}
                        className="overflow-hidden mr-[1px] rounded-sm object-cover"
                    />
                ) : (
                    <PracticePlaceholder
                        width={iconSize}
                        height={iconSize}
                        className="bg-violet-50 dark:bg-gray-800 rounded-sm"
                    />
                )}
            </button>
        </div>
    )
}
