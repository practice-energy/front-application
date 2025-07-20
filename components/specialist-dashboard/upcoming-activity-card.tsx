import { Repeat2, TimerReset, TvMinimalPlay, User, Users } from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {ActivityStatus} from "@/components/ui/activity-status";

interface UpcomingActivityCardProps {
    startTime: string
    endTime: string
    client: {
        name: string
        avatar?: string
    }
    service: {
        name: string
        price: number
        description: string
    }
    duration: string
    format: string
    isBackToBack?: boolean
    isRepeat?: boolean
    status?: "waiting" | "confirmed" | "request"
}

export function UpcomingActivityCard({
                                         startTime,
                                         endTime,
                                         client,
                                         service,
                                         duration,
                                         format,
                                         isBackToBack = false,
                                         isRepeat = false,
                                         status,
                                     }: UpcomingActivityCardProps) {
    return (
        <div className="flex items-start gap-3 p-2 rounded-sm border border-gray-100 hover:bg-violet-600 hover:bg-opacity-5">
            {/* Left column - times and avatar */}
            <div className="flex flex-col items-center min-w-[40px]">
                <div className={`text-sm font-medium ${isBackToBack ? "text-pink-500" : ""}`}>
                    {startTime}
                </div>
                <Image
                    src={client.avatar || "/practice-logo.svg"}
                    alt={client.name}
                    width={36}
                    height={36}
                    className="rounded-sm object-cover"
                />
                <div className="text-sm text-gray-500">{endTime}</div>
            </div>

            {/* Service and client info - расширенная секция */}
            <div className="flex-1 ml-3 min-w-0">
                <div className="pb-1">
                    <div className="text-sm font-medium leading-relaxed line-clamp-2 h-10">
                        {service.name}
                    </div>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed line-clamp-1">
                    {client.name} {service.description}
                </div>
            </div>

            {/* Duration and format tags */}
            <div className="flex flex-col gap-1 items-end mr-3 ml-auto">
                <div className="inline-flex w-24 shadow-sm items-center justify-center rounded-sm p-1.5 gap-1 bg-white">
                    <TimerReset size={16}/>{duration}
                </div>
                <div className="inline-flex w-24 shadow-sm items-center justify-center rounded-sm p-1.5 gap-1 bg-white">
                    {format === "online" ? (
                        <><TvMinimalPlay size={16}/>Видео</>
                    ) : (
                        <><Users size={16}/>Очно</>
                    )}
                </div>
            </div>

            {/* Right column - фиксированная ширина */}
            <div className="flex flex-col w-24 items-end gap-2">
                {/* Status line */}
                <ActivityStatus status={status}/>

                {/* Repeat/User icon line */}
                <div>
                    {isRepeat ? <Repeat2 size={18} /> : <User size={18}/>}
                </div>

                {/* Price line */}
                <div className="flex items-center text-base">
                    <span>{service.price}</span>
                    <RubleIcon size={18} bold={false} />
                </div>
            </div>
        </div>
    )
}