import { PanelRightClose } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarToggleButtonProps {
    toggleSidebar: () => void
    className?: string
    iconClassName?: string
    iconSize?: number
    ariaLabel?: string
}

export function SidebarToggleButton({
                                        toggleSidebar,
                                        className = "",
                                        iconClassName = "",
                                        iconSize = 24,
                                        ariaLabel = "Toggle sidebar",
                                    }: SidebarToggleButtonProps) {
    return (
        <div className={cn("flex-1 opacity-100", className)}>
            <button
                onClick={toggleSidebar}
                className="h-full px-3 flex items-center focus:outline-none "
                aria-label={ariaLabel}
            >
                <PanelRightClose
                    width={iconSize}
                    height={iconSize}
                    className={iconClassName}
                />
            </button>
        </div>
    )
}