import {MessagesSquareIcon, TvMinimalPlay, Users} from "lucide-react"
import {cn} from "@/src/lib/utils";
import {ChatsIcon} from "@phosphor-icons/react";

interface ChatButtonProps {
    onClick: () => void
    className?: string
    size?: number
    hasUpdates: boolean
}

export function ChatButton({ onClick, className = "", size = 18, hasUpdates = false }:ChatButtonProps) {
    return (
        <div className={cn(
            `h-5 w-5 shadow-sm items-center rounded-sm`,
            hasUpdates ? "bg-colors-custom-accent text-white" : "bg-white text-neutral-700",
            className,
        )}>
            <ChatsIcon size={size} className="font-normal ml-0.5 mt-0.5" />
        </div>
    )
}
