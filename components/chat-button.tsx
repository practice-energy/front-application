import { TvMinimalPlay, Users } from "lucide-react"

interface ChatButtonProps {
    format: "in-person" | "video" // или другие возможные форматы
    className?: string
    size?: number
}

export function ChatButtonProps({ format, className = "", size = 16 }:ChatButtonProps) {
    return (
        <div className={`h-5 w-5 shadow-sm items-center rounded-sm bg-white ${className}`}>
            {format === "in-person" ? (
                <TvMinimalPlay size={size} className="font-normal ml-0.5 mt-0.5" />
            ) : (
                <Users size={size} className="font-normal ml-0.5 mt-0.5" />
            )}
        </div>
    )
}