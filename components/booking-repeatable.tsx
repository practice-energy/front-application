import {Repeat2, User} from "lucide-react"

interface BookingRepeatedIconProps {
    isRepeated: boolean
    className?: string
    size?: number
}

export function BookingRepeatedIcon({ isRepeated, className = "", size =16 }:BookingRepeatedIconProps) {
    return (
        <div className={`h-5 w-5  items-center bg-none ${className}`}>
            {isRepeated ? (
                <Repeat2 size={size} className="font-normal ml-0.5 mt-0.5" />
            ) : (
                <User size={size} className="font-normal ml-0.5 mt-0.5" />
            )}
        </div>
    )
}
