import { cn } from "@/lib/utils"
import { ComponentType } from "react"

interface IconButtonProps {
    icon: ComponentType<{ className?: string }>
    onClick?: () => void
    disabled?: boolean
    className?: string
    iconClassName?: string
}

export function IconButton({
                               icon: Icon,
                               onClick,
                               disabled = false,
                               className = "",
                               iconClassName = ""
                           }: IconButtonProps) {
    return (
        <div className={cn(
            "hidden md:flex items-center justify-center",
            "aspect-square rounded-sm shadow-sm h-10 w-10 p-1 border-neutral-100",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            className
        )}>
            <button
                onClick={onClick}
                disabled={disabled}
                className="w-full h-full flex items-center justify-center"
            >
                <Icon className={cn(
                    "h-[30px] w-[30px]",
                    disabled ? "text-neutral-900 opacity-20" : "text-neutral-900",
                    iconClassName
                )} />
            </button>
        </div>
    )
}
