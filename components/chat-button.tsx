import {MessagesSquareIcon, TvMinimalPlay, Users} from "lucide-react"
import {cn} from "@/lib/utils";

interface ChatButtonProps {
    onClick: () => void
    className?: string
    size?: number
    hasUpdates: boolean
}

export function ChatButton({ onClick, className = "", size = 16, hasUpdates = false }:ChatButtonProps) {
    return (
        <div className={cn(
            `h-5 w-5 shadow-sm items-center rounded-sm`,
            hasUpdates ? "bg-colors-custom-accent text-white" : "bg-white text-neutral-700",
            className,
        )}>
            <MessagesSquareIcon size={size} className="font-normal ml-0.5 mt-0.5" />
        </div>
    )
}
