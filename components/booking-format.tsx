import { TvMinimalPlay, Users } from "lucide-react"

interface BookingFormatIconProps {
    format: "in-person" | "video" // или другие возможные форматы
    className?: string
    size?: number
}

export function BookingFormatIcon({ format, className = "", size = 16 }:BookingFormatIconProps) {
    return (
        <div className={`h-5 w-5 items-center rounded-sm bg-none${className}`}>
            {format === "in-person" ? (
                <TvMinimalPlay size={size} className="font-normal ml-0.5 mt-0.5" />
            ) : (
                <Users size={size} className="font-normal ml-0.5 mt-0.5" />
            )}
        </div>
    )
}
